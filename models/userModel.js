const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const usersFile = path.join(__dirname, "..", "data", "users.json");

exports.findByUsername = (username) => {
  const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
  return users.find((u) => u.username === username);
};

exports.verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
