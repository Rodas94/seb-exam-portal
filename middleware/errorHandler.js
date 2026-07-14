const errorHandler = (err, req, res, next) => {
  console.error("🚨 Global Error Logged:", err.stack || err.message);

  // If headers have already been sent to the client, delegate to the default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Determine status code (default to 500 Internal Server Error)
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected server error occurred.",
    // Only show the stack trace in development mode for security
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
