const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  getUserStats,
  getUserBadges,
} = require("../controllers/userController");

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/stats", protect, getUserStats);
router.get("/badges", protect, getUserBadges);

module.exports = router;
