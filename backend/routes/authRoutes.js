/* global require, module */
const express = require("express");
const router = express.Router();
const { register, login, getMe, updateProfile, updatePassword, googleLogin, githubLogin } = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");


router.post("/register", register);

router.post("/login", login);

router.post("/google", googleLogin);

router.post("/github", githubLogin);

router.get("/me", protect, getMe);

router.put("/update", protect, updateProfile);

router.put("/update-password", protect, updatePassword);

module.exports = router;