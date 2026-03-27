const User = require("../models/User");
const Problem = require("../models/Problem");
const Badge = require("../models/Badge");
const { buildProgressStats } = require("../utils/progressCalculator");
const { getEarnedBadgeKeys } = require("../utils/badgeService");

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name || "",
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { returnDocument: "after", runValidators: true }
    ).select("name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name || "",
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

const getUserStats = async (req, res, next) => {
  try {
    const [problems, user] = await Promise.all([
      Problem.find({ user: req.user._id }).select("status difficulty").lean(),
      User.findById(req.user._id).select("currentStreak totalPoints").lean(),
    ]);

    const stats = {
      ...buildProgressStats(problems),
      currentStreak: user?.currentStreak || 0,
      totalPoints: user?.totalPoints || 0,
    };

    return res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

const getUserBadges = async (req, res, next) => {
  try {
    const [problems, user, allBadges] = await Promise.all([
      Problem.find({ user: req.user._id }).select("status difficulty").lean(),
      User.findById(req.user._id).select("currentStreak totalPoints").lean(),
      Badge.find({}).lean(),
    ]);

    const progress = buildProgressStats(problems);
    const earnedKeys = new Set(
      getEarnedBadgeKeys({
        totalSolved: progress.totalSolved,
        streak: user?.currentStreak || 0,
        totalPoints: user?.totalPoints || 0,
      })
    );

    const badges = allBadges.map((badge) => ({
      ...badge,
      earned: earnedKeys.has(badge.key),
    }));

    return res.status(200).json(badges);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserStats,
  getUserBadges,
};
