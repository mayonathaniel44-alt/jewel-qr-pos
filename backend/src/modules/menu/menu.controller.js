const menuService = require("./menu.service");

async function getCategories(req, res, next) {
  try {
    const categories = await menuService.getCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

async function getMenuItems(req, res, next) {
  try {
    const { categoryId, search } = req.query;

    const items = await menuService.getMenuItems({
      categoryId,
      search,
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
}

async function getMenuItemById(req, res, next) {
  try {
    const item = await menuService.getMenuItemById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCategories,
  getMenuItems,
  getMenuItemById,
};
