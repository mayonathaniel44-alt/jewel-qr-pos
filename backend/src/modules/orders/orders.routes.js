const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Orders route is working",
    data: [],
  });
});

module.exports = router;
