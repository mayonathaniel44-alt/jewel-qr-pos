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

async function getMenuItems({ categoryId, search, includeUnavailable } = {}) {
  const conditions = ["mc.is_active = TRUE", "mi.is_deleted = FALSE"];
  const values = [];

  if (!includeUnavailable) {
    conditions.push("mi.is_available = TRUE");
  }

  if (categoryId) {
    values.push(categoryId);
    conditions.push(`mi.category_id = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(mi.name ILIKE $${values.length} OR COALESCE(mi.description, '') ILIKE $${values.length})`
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
        mi.is_available,
        mi.created_at,
        mi.updated_at
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
        mi.is_available,
        mi.created_at,
        mi.updated_at
      FROM menu_items mi
      JOIN menu_categories mc ON mc.id = mi.category_id
      WHERE mi.id = $1
        AND mc.is_active = TRUE
        AND mi.is_deleted = FALSE
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function createMenuItem({
  categoryId,
  name,
  description,
  price,
  imageUrl,
  isAvailable,
}) {
  const result = await pool.query(
    `
      INSERT INTO menu_items
        (category_id, name, description, price, image_url, is_available)
      SELECT $1, $2, $3, $4, $5, $6
      WHERE EXISTS (
        SELECT 1 FROM menu_categories
        WHERE id = $1 AND is_active = TRUE
      )
      RETURNING id, category_id, name, description, price,
                image_url, is_available, created_at, updated_at
    `,
    [categoryId, name, description, price, imageUrl, isAvailable]
  );

  if (!result.rows[0]) {
    const error = new Error("The selected category does not exist or is inactive.");
    error.status = 400;
    throw error;
  }

  return result.rows[0];
}

async function updateMenuItem(id, {
  categoryId,
  name,
  description,
  price,
  imageUrl,
  isAvailable,
}) {
  const result = await pool.query(
    `
      UPDATE menu_items AS mi
      SET category_id = $2,
          name = $3,
          description = $4,
          price = $5,
          image_url = $6,
          is_available = $7,
          updated_at = NOW()
      WHERE mi.id = $1
        AND mi.is_deleted = FALSE
        AND EXISTS (
          SELECT 1 FROM menu_categories
          WHERE id = $2 AND is_active = TRUE
        )
      RETURNING mi.id, mi.category_id, mi.name, mi.description,
                mi.price, mi.image_url, mi.is_available,
                mi.created_at, mi.updated_at
    `,
    [id, categoryId, name, description, price, imageUrl, isAvailable]
  );

  if (result.rows[0]) {
    return result.rows[0];
  }

  const existing = await pool.query(
    "SELECT id FROM menu_items WHERE id = $1",
    [id]
  );

  if (!existing.rows[0]) {
    return null;
  }

  const error = new Error("The selected category does not exist or is inactive.");
  error.status = 400;
  throw error;
}

async function setMenuItemAvailability(id, isAvailable) {
  const result = await pool.query(
    `
      UPDATE menu_items
      SET is_available = $2, updated_at = NOW()
      WHERE id = $1
        AND is_deleted = FALSE
      RETURNING id, category_id, name, description, price,
                image_url, is_available, created_at, updated_at
    `,
    [id, isAvailable]
  );

  return result.rows[0] || null;
}


async function removeMenuItem(id) {
  const result = await pool.query(
    `UPDATE menu_items
     SET is_deleted = TRUE, updated_at = NOW()
     WHERE id = $1 AND is_deleted = FALSE
     RETURNING id, name`,
    [id]
  );
  return result.rows[0] || null;
}

async function getArchivedMenuItems() {
  const result = await pool.query(`
    SELECT
      mi.id,
      mi.category_id,
      mc.name AS category_name,
      mi.name,
      mi.description,
      mi.price,
      mi.image_url,
      mi.is_available,
      mi.created_at,
      mi.updated_at
    FROM menu_items mi
    LEFT JOIN menu_categories mc ON mc.id = mi.category_id
    WHERE mi.is_deleted = TRUE
    ORDER BY mi.updated_at DESC, mi.name ASC
  `);

  return result.rows;
}

async function restoreMenuItem(id) {
  const result = await pool.query(`
    UPDATE menu_items AS mi
    SET is_deleted = FALSE,
        updated_at = NOW()
    WHERE mi.id = $1
      AND mi.is_deleted = TRUE
      AND EXISTS (
        SELECT 1
        FROM menu_categories mc
        WHERE mc.id = mi.category_id
          AND mc.is_active = TRUE
      )
    RETURNING
      mi.id,
      mi.category_id,
      mi.name,
      mi.description,
      mi.price,
      mi.image_url,
      mi.is_available,
      mi.created_at,
      mi.updated_at
  `, [id]);

  return result.rows[0] || null;
}

module.exports = {
  getCategories,
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  setMenuItemAvailability,
  removeMenuItem,
  getArchivedMenuItems,
  restoreMenuItem,
};
