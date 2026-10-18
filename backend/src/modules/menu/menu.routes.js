const express = require("express");
const menuController = require("./menu.controller");

const router = express.Router();

router.get("/categories", menuController.getCategories);
router.get("/items", menuController.getMenuItems);
router.get("/items/archived", menuController.getArchivedMenuItems);
router.patch("/items/:id/restore", menuController.restoreMenuItem);
router.get("/items/:id", menuController.getMenuItemById);
router.post("/items", menuController.createMenuItem);
router.put("/items/:id", menuController.updateMenuItem);
router.patch("/items/:id/availability", menuController.setAvailability);
router.delete("/items/:id", menuController.removeMenuItem);

module.exports = router;
