const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const {
	validateRegisterInput,
	validateLoginInput,
} = require("../middleware/validateInput");

const router = express.Router();

router.post("/register", validateRegisterInput, registerUser);
router.post("/login", validateLoginInput, loginUser);

module.exports = router;
