const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getUserBadges } = require("../controllers/userController");

const router = express.Router();

router.get("/", protect, getUserBadges);

module.exports = router;
