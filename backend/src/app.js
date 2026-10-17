
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/jewel_qr_pos
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173

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

module.exports = app;
