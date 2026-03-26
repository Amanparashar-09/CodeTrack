const express = require("express");
const {
	createProblem,
	getProblems,
	updateProblem,
	deleteProblem,
} = require("../controllers/problemController");

const router = express.Router();

router.get("/", getProblems);
router.post("/", createProblem);
router.put("/:id", updateProblem);
router.delete("/:id", deleteProblem);

module.exports = router;
