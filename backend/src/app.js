const express = require("express");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
