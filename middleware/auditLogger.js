const fs = require("fs");
const path = require("path");
const logDir = path.join(__dirname, "..", "data");
const logFile = path.join(logDir, "audit.log");

module.exports.logAction = (action) => {
  return (req, res, next) => {
    console.log("➡️ Audit Logger Triggered for action:", action);

    // 1. Ensure directory exists automatically
    if (!fs.existsSync(logDir)) {
      console.log("📁 Data directory missing, creating it now...");
      fs.mkdirSync(logDir, { recursive: true });
    }
    // 2. Log the action with timestamp, user, and IP
    const user = req.session?.user ? req.session.user.username : "Anonymous";
    const timestamp = new Date().toLocaleString("sv-SE", {
      timeZone: "Africa/Addis_Ababa",
      hour12: false,
    });
    const logEntry = `[${timestamp}] USER: ${user} | ACTION: ${action} | IP: ${req.ip}\n`;

    // 3. Append the log entry to the audit.log file
    fs.appendFile(logFile, logEntry, (err) => {
      if (err) {
        console.error("❌ Failed to write audit log. Error details:", err);
      } else {
        console.log("✅ Successfully logged to audit.log!");
      }
    });

    next();
  };
};
