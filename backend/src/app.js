const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Jewel QR POS API is running",
  });
});

// API routes
app.use("/api/menu", require("./modules/menu/menu.routes"));
app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/orders", require("./modules/orders/orders.routes"));
app.use("/api/payments", require("./modules/payments/payments.routes"));
app.use("/api/qr", require("./modules/qr/qr.routes"));
app.use("/api/tables", require("./modules/tables/tables.routes"));
app.use("/api/users", require("./modules/users/users.routes"));

// Centralized error handler
app.use(require("./middleware/errorHandler"));

module.exports = app;
