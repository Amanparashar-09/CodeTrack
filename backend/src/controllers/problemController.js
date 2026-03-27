const Problem = require("../models/Problem");
const User = require("../models/User");
const { getPointsForDifficulty, getStreakAfterSolve } = require("../utils/progressCalculator");

const createProblem = async (req, res, next) => {
  try {
    const { title, platform, difficulty, status, tags, notes, solutionLink } = req.body;

    const problem = await Problem.create({
      user: req.user._id,
      title,
      platform,
      difficulty,
      status,
      tags,
      notes,
      solutionLink,
    });

    if (problem.status === "Solved") {
      const user = await User.findById(req.user._id).select("currentStreak lastActive");
      if (user) {
        const points = getPointsForDifficulty(problem.difficulty);
        const { streak, shouldUpdateLastActive } = getStreakAfterSolve(
          user.lastActive,
          user.currentStreak
        );

        const updates = {
          $inc: { totalPoints: points },
          $set: { currentStreak: streak },
        };

        if (shouldUpdateLastActive) {
          updates.$set.lastActive = new Date();
        }

        await User.findByIdAndUpdate(req.user._id, updates);
      }
    }

    return res.status(201).json(problem);
  } catch (error) {
    next(error);
  }
};

const getProblems = async (req, res, next) => {
  try {
    const problems = await Problem.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ problems });
  } catch (error) {
    next(error);
  }
};

const getProblemStats = async (req, res, next) => {
  try {
    const problems = await Problem.find({ user: req.user._id }).lean();

    const byDifficulty = { easy: 0, medium: 0, hard: 0 };
    const byTag = {};

    let totalAttempted = 0;
    let totalSolved = 0;

    for (const problem of problems) {
      const status = problem.status || "Unsolved";
      const difficulty = problem.difficulty || "Easy";

      if (status !== "Unsolved") {
        totalAttempted += 1;
      }

      if (status === "Solved") {
        totalSolved += 1;

        if (difficulty === "Easy") byDifficulty.easy += 1;
        if (difficulty === "Medium") byDifficulty.medium += 1;
        if (difficulty === "Hard") byDifficulty.hard += 1;
      }

      for (const tag of problem.tags || []) {
        byTag[tag] = (byTag[tag] || 0) + 1;
      }
    }

    const accuracy = totalAttempted > 0
      ? Math.round((totalSolved / totalAttempted) * 100)
      : 0;

    const user = await User.findById(req.user._id)
      .select("currentStreak totalPoints")
      .lean();

    return res.status(200).json({
      easy: byDifficulty.easy,
      medium: byDifficulty.medium,
      hard: byDifficulty.hard,
      byDifficulty,
      byTag,
      totalAttempted,
      totalSolved,
      currentStreak: user?.currentStreak || 0,
      totalPoints: user?.totalPoints || 0,
      accuracy,
    });
  } catch (error) {
    next(error);
  }
};

const updateProblem = async (req, res, next) => {
  try {
    const existingProblem = await Problem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!existingProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const wasSolved = existingProblem.status === "Solved";

    Object.assign(existingProblem, req.body);
    const problem = await existingProblem.save();

    const isSolved = problem.status === "Solved";
    if (!wasSolved && isSolved) {
      const points = getPointsForDifficulty(problem.difficulty);
      const user = await User.findById(req.user._id).select("currentStreak lastActive");
      if (user) {
        const { streak, shouldUpdateLastActive } = getStreakAfterSolve(
          user.lastActive,
          user.currentStreak
        );

        const updates = {
          $inc: { totalPoints: points },
          $set: { currentStreak: streak },
        };

        if (shouldUpdateLastActive) {
          updates.$set.lastActive = new Date();
        }

        await User.findByIdAndUpdate(req.user._id, updates);
      }
    }

    return res.status(200).json(problem);
  } catch (error) {
    next(error);
  }
};

const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    return res.status(200).json({ message: "Problem deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProblem,
  getProblems,
  getProblemStats,
  updateProblem,
  deleteProblem,
};
