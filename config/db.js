const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

// Define paths for data directory and JSON files
const dataDir = path.join(__dirname, "..", "data");
// Ensure the data directory exists
const examsFile = path.join(dataDir, "exams.json");
const usersFile = path.join(dataDir, "users.json");

const defaultUsers = [
  {
    id: "1",
    username: "astu_admin",
    password: bcrypt.hashSync("admin123", 10),
  },
  {
    id: "2",
    username: "examadmin",
    password: bcrypt.hashSync("password456", 10),
  },
];

function ensureFile(filePath, defaultData) {
  try {
    if (
      // Check if the file doesn't exist or is empty
      !fs.existsSync(filePath) ||
      fs.readFileSync(filePath, "utf8").trim() === ""
    ) {
      // If the file doesn't exist or is empty, write the default data to it
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), "utf8");
    }
  } catch (err) {
    // rethrow so caller can handle/log if needed
    throw err;
  }
}

function initialize() {
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    // Create the data directory if it doesn't exist
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Ensure default files exist and are populated
  ensureFile(usersFile, defaultUsers);
  console.log("Database (JSON files) initialized.");
}

module.exports = { initialize };
