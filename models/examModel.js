const fs = require("fs");
const path = require("path");

const fs = require("fs");
const path = require("path");

// ✅ FIX: Use path.resolve combined with process.cwd() or __dirname
// This ensures Node finds the file no matter where the container starts execution
const localPath = path.join(__dirname, "..", "data", "exams.json");
const k8sPath = path.resolve(process.cwd(), "data", "exams.json");

// If process.cwd() is /app, this looks for /app/data/exams.json dynamically
let examsFile = fs.existsSync(localPath) ? localPath : k8sPath;

// Double check if it still fails and print a clean diagnostic log
if (!fs.existsSync(examsFile)) {
  console.error(
    `🚨 PATH RESOLUTION MISMATCH: Looked for exams.json at: ${examsFile}`,
  );
  // Fall back to the absolute directory container path safely
  examsFile = path.join("/", "app", "data", "exams.json");
}

console.log("Selected Database Path Location:", examsFile);

exports.getAll = () => {
  // 3. Automatically create the file if it is missing
  if (!fs.existsSync(examsFile)) {
    const defaultStructure = {
      exams: {},
      auto_redirect: { enabled: false, url: "", delay: 5 },
    };

    // Create the data folder locally if it's missing, then write the file
    fs.mkdirSync(path.dirname(examsFile), { recursive: true });
    fs.writeFileSync(
      examsFile,
      JSON.stringify(defaultStructure, null, 2),
      "utf8",
    );

    return defaultStructure;
  }

  // 4. Read it safely when it exists
  const data = fs.readFileSync(examsFile, "utf8");
  return JSON.parse(data);
};

exports.save = (examsData) => {
  const tempFile = examsFile + ".tmp";
  fs.writeFileSync(tempFile, JSON.stringify(examsData, null, 2), "utf8");
  fs.renameSync(tempFile, examsFile);
};
