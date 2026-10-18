const pool = require("../../config/database");

async function getCategories() {
  const result = await pool.query(`
    SELECT id, name, description, display_order
    FROM menu_categories
    WHERE is_active = TRUE
    ORDER BY display_order ASC, name ASC
  `);

  return result.rows;
}

async function getMenuItems({ categoryId, search } = {}) {
  const conditions = ["mi.is_available = TRUE", "mc.is_active = TRUE"];
  const values = [];

  if (categoryId) {
    values.push(categoryId);
    conditions.push(`mi.category_id = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(mi.name ILIKE $${values.length} OR mi.description ILIKE $${values.length})`
    );
  }

  const result = await pool.query(
    `
      SELECT
        mi.id,
        mi.category_id,
        mc.name AS category_name,
        mi.name,
        mi.description,
        mi.price,
        mi.image_url,
        mi.is_available
      FROM menu_items mi
      JOIN menu_categories mc ON mc.id = mi.category_id
      WHERE ${conditions.join(" AND ")}
      ORDER BY mc.display_order ASC, mi.name ASC
    `,
    values
  );

  return result.rows;
}

async function getMenuItemById(id) {
  const result = await pool.query(
    `
      SELECT
        mi.id,
        mi.category_id,
        mc.name AS category_name,
        mi.name,
        mi.description,
        mi.price,
        mi.image_url,
        mi.is_available
      FROM menu_items mi
      JOIN menu_categories mc ON mc.id = mi.category_id
      WHERE mi.id = $1
        AND mi.is_available = TRUE
        AND mc.is_active = TRUE
    `,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  getCategories,
  getMenuItems,
  getMenuItemById,
};
