const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.showLogin = (req, res) => {
  res.sendFile("login.html", { root: "public" });
};

exports.handleLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = UserModel.findByUsername(username);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const isMatch = await UserModel.verifyPassword(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    // Regenerate session to prevent fixation attacks
    req.session.regenerate(() => {
      req.session.user = { id: user.id, username: user.username };
      res.json({ success: true, message: "Logged in successfully" });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.handleLogout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/login.html");
  });
};
