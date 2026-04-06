const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const {
	validateRegisterInput,
	validateLoginInput,
} = require("../middleware/validateInput");
const { loginLimiter, registerLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/register", registerLimiter, validateRegisterInput, registerUser);
router.post("/login", loginLimiter, validateLoginInput, loginUser);

module.exports = router;
