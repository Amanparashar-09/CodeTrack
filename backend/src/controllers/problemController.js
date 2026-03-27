const { Problem, User, QuestionBank } = require("../models");
const {
  getPointsForDifficulty,
  getStreakAfterSolve,
  buildProgressStats,
} = require("../utils/progressCalculator");

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

const getProblemById = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    return res.status(200).json(problem);
  } catch (error) {
    next(error);
  }
};

const getPredefinedQuestions = async (req, res, next) => {
  try {
    const { difficulty, tag, platform, search, limit = 100 } = req.query;
    const filters = { isPredefined: true };

    if (difficulty) {
      filters.difficulty = difficulty;
    }

    if (platform) {
      filters.platform = platform;
    }

    if (tag) {
      filters.tags = { $in: [tag] };
    }

    if (search) {
      filters.title = { $regex: search, $options: "i" };
    }

    const safeLimit = Math.min(Number(limit) || 100, 500);

    const questions = await QuestionBank.find(filters)
      .sort({ title: 1 })
      .limit(safeLimit)
      .lean();

    return res.status(200).json({ questions, count: questions.length });
  } catch (error) {
    next(error);
  }
};

const getProblemStats = async (req, res, next) => {
  try {
    const problems = await Problem.find({ user: req.user._id }).lean();
    const progress = buildProgressStats(problems);

    const user = await User.findById(req.user._id)
      .select("currentStreak totalPoints")
      .lean();

    return res.status(200).json({
      ...progress,
      currentStreak: user?.currentStreak || 0,
      totalPoints: user?.totalPoints || 0,
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
  getProblemById,
  getPredefinedQuestions,
  getProblemStats,
  updateProblem,
  deleteProblem,
};
