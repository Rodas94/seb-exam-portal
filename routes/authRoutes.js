const express = require("express");
const rateLimit = require("express-rate-limit");
const authCtrl = require("../controllers/authController");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Limit login attempts to prevent brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes",
  },
});

router.get("/login", authCtrl.showLogin);
router.post("/login", loginLimiter, authCtrl.handleLogin);
router.get("/logout", authCtrl.handleLogout);

module.exports = router;
