const express = require("express");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
