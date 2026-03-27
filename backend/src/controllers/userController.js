const User = require("../models/User");
const Problem = require("../models/Problem");

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
      easy: 0,
      medium: 0,
      hard: 0,
      totalAttempted: 0,
      totalSolved: 0,
      currentStreak: user?.currentStreak || 0,
      totalPoints: user?.totalPoints || 0,
      accuracy: 0,
    };

    for (const problem of problems) {
      if (problem.status !== "Unsolved") {
        stats.totalAttempted += 1;
      }

      if (problem.status === "Solved") {
        stats.totalSolved += 1;
        if (problem.difficulty === "Easy") stats.easy += 1;
        if (problem.difficulty === "Medium") stats.medium += 1;
        if (problem.difficulty === "Hard") stats.hard += 1;
      }
    }

    stats.accuracy =
      stats.totalAttempted > 0
        ? Math.round((stats.totalSolved / stats.totalAttempted) * 100)
        : 0;

    return res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserStats,
};
