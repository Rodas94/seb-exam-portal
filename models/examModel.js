const fs = require("fs");
const path = require("path");

// 1. Define the exact path you know works on your local PC
const localPath = path.join(__dirname, "..", "data", "exams.json");
let examsFile;

// 2. Check the local file first. If it exists, use it!
if (fs.existsSync(localPath)) {
  examsFile = localPath;
} else {
  // 3. Fallback to Kubernetes path if the local file isn't found
  examsFile = "/app/data/exams.json";
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
