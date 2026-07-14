// Protects routes requiring admin login
exports.requireAuth = (req, res, next) => {
  // Check if the user is authenticated by verifying the session
  //e.g., if the session contains a valid user object
  if (req.session && req.session.user) {
    return next();
  }
  // If API request, send 401. If browser, redirect to login.
  if (req.xhr || req.headers.accept.indexOf("json") > -1) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Please log in." });
  }
  res.redirect("/login.html");
};
