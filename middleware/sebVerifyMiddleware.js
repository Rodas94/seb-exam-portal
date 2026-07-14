module.exports.requireSEB = (req, res, next) => {
  // Check the User-Agent header for "SEB" to verify if the request is coming from Safe Exam Browser
  const userAgent = req.headers["user-agent"] || "";

  // TEMPORARY LOGS FOR DEBUGGING
  console.log("=== SEB MIDDLEWARE TRIGGERED ===");
  console.log("User-Agent:", userAgent);
  console.log("Contains 'SEB'?:", userAgent.includes("SEB"));

  // For production, uncomment the following lines to enforce SEB check
  //if (userAgent && userAgent.includes("SEB")) {
  //  return next();
  // }

  // For development purposes, allow bypassing SEB check with a query parameter
  return next();

  // Send the HTML directly to the browser and stop the request
  return res.status(403).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Access Denied</title>
    </head>
    <body style="background-color: #f8f9fa; margin: 0; padding: 0;">
        <div style="text-align:center; margin-top:100px; font-family:sans-serif; color: #333;">
            <h1 style="color: #dc3545; font-size: 40px;">Access Denied</h1>
            <p style="font-size: 18px;">You must use Safe Exam Browser to access this application.</p>
        </div>
    </body>
    </html>
  `);
};
