const express = require("express");
const {
	createProblem,
	getProblems,
	getProblemStats,
	updateProblem,
	deleteProblem,
} = require("../controllers/problemController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", protect, getProblemStats);
router.get("/", protect, getProblems);
router.post("/", protect, createProblem);
router.put("/:id", protect, updateProblem);
router.delete("/:id", protect, deleteProblem);

module.exports = router;
