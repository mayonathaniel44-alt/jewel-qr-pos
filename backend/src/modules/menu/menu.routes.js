const express = require("express");
const menuController = require("./menu.controller");

const router = express.Router();

router.get("/categories", menuController.getCategories);
router.get("/items", menuController.getMenuItems);
router.get("/items/:id", menuController.getMenuItemById);

module.exports = router;
