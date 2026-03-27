const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  getUserStats,
  getUserBadges,
  getReminderPreference,
  updateReminderPreference,
} = require("../controllers/userController");

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/stats", protect, getUserStats);
router.get("/badges", protect, getUserBadges);
router.get("/reminder-pref", protect, getReminderPreference);
router.patch("/reminder-pref", protect, updateReminderPreference);

module.exports = router;
