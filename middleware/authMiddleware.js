// Protects routes requiring admin login
exports.requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }

  // If it's an API route or explicitly asking for JSON, always return 401 JSON instead of redirecting
  if (
    req.originalUrl.startsWith("/admin/api/") ||
    req.xhr ||
    (req.headers.accept && req.headers.accept.includes("json"))
  ) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Please log in." });
  }

  res.redirect("/login.html");
};
