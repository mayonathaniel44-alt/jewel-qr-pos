const menuService = require("./menu.service");

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateId(id) {
  if (!UUID_PATTERN.test(id)) {
    const error = new Error("Invalid menu item ID.");
    error.status = 400;
    throw error;
  }
}

function validateMenuInput(body) {
  const categoryId = String(body.categoryId || "").trim();
  const name = String(body.name || "").trim();
  const description = String(body.description || "").trim();
  const imageUrl = String(body.imageUrl || "").trim();
  const price = Number(body.price);
  const isAvailable = body.isAvailable === undefined
    ? true
    : body.isAvailable;

  if (!UUID_PATTERN.test(categoryId)) {
    const error = new Error("Select a valid menu category.");
    error.status = 400;
    throw error;
  }

  if (!name || name.length > 150) {
    const error = new Error("Item name is required and must be at most 150 characters.");
    error.status = 400;
    throw error;
  }

  if (description.length > 5000) {
    const error = new Error("Description must be at most 5000 characters.");
    error.status = 400;
    throw error;
  }

  if (!Number.isFinite(price) || price < 0 || price > 99999999.99) {
    const error = new Error("Enter a valid non-negative price.");
    error.status = 400;
    throw error;
  }

  if (imageUrl && imageUrl.length > 2000) {
    const error = new Error("Image URL is too long.");
    error.status = 400;
    throw error;
  }

  if (
    imageUrl &&
    !/^https?:\/\/\S+$/i.test(imageUrl)
  ) {
    const error = new Error("Image URL must begin with http:// or https://.");
    error.status = 400;
    throw error;
  }

  if (typeof isAvailable !== "boolean") {
    const error = new Error("Availability must be true or false.");
    error.status = 400;
    throw error;
  }

  return {
    categoryId,
    name,
    description: description || null,
    price: price.toFixed(2),
    imageUrl: imageUrl || null,
    isAvailable,
  };
}

async function getCategories(req, res, next) {
  try {
    const categories = await menuService.getCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
}

async function getMenuItems(req, res, next) {
  try {
    const { categoryId, search } = req.query;

    if (categoryId && !UUID_PATTERN.test(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
    }

    const items = await menuService.getMenuItems({
      categoryId,
      search: typeof search === "string" ? search.trim().slice(0, 100) : "",
      includeUnavailable: req.query.includeUnavailable === "true",
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
    validateId(req.params.id);
    const item = await menuService.getMenuItemById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found.",
      });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function createMenuItem(req, res, next) {
  try {
    const input = validateMenuInput(req.body);
    const item = await menuService.createMenuItem(input);

    res.status(201).json({
      success: true,
      message: "Menu item created successfully.",
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

async function updateMenuItem(req, res, next) {
  try {
    validateId(req.params.id);
    const input = validateMenuInput(req.body);
    const item = await menuService.updateMenuItem(req.params.id, input);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully.",
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

async function setAvailability(req, res, next) {
  try {
    validateId(req.params.id);

    if (typeof req.body.isAvailable !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isAvailable must be true or false.",
      });
    }

    const item = await menuService.setMenuItemAvailability(
      req.params.id,
      req.body.isAvailable
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item availability updated.",
      data: item,
    });
  } catch (error) {
    next(error);
  }
}


async function removeMenuItem(req, res, next) {
  try {
    validateId(req.params.id);
    const item = await menuService.removeMenuItem(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found or already removed.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${item.name} was removed from the menu.`,
      data: item,
    });
  } catch (error) {
    next(error);
  }
}


async function getArchivedMenuItems(req, res, next) {
  try {
    const items = await menuService.getArchivedMenuItems();

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
}

async function restoreMenuItem(req, res, next) {
  try {
    validateId(req.params.id);

    const item = await menuService.restoreMenuItem(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message:
          "Archived menu item not found, or its category is inactive.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${item.name} was restored successfully.`,
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
  createMenuItem,
  updateMenuItem,
  setAvailability,
  removeMenuItem,
  getArchivedMenuItems,
  restoreMenuItem,
};
