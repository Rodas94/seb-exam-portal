const fs = require("fs");
const path = require("path");
const examsFile = path.join(__dirname, "..", "data", "exams.json");

exports.getAll = () => {
  // Read the exams data from the JSON file
  const data = fs.readFileSync(examsFile, "utf8");
  return JSON.parse(data);
};

exports.save = (examsData) => {
  const tempFile = examsFile + ".tmp";
  // Write to temp file first
  fs.writeFileSync(tempFile, JSON.stringify(examsData, null, 2), "utf8");
  // Atomically replace the old file with the new one
  fs.renameSync(tempFile, examsFile);
};
