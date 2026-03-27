const express = require("express");
const {
	createProblem,
	getProblems,
	getProblemById,
	getPredefinedQuestions,
	getProblemStats,
	updateProblem,
	deleteProblem,
} = require("../controllers/problemController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", protect, getProblemStats);
router.get("/predefined", protect, getPredefinedQuestions);
router.get("/", protect, getProblems);
router.get("/:id", protect, getProblemById);
router.post("/", protect, createProblem);
router.put("/:id", protect, updateProblem);
router.delete("/:id", protect, deleteProblem);

module.exports = router;
