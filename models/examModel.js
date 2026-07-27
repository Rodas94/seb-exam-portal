const fs = require("fs");
const path = require("path");
const examsFile = path.join(__dirname, "..", "data", "exams.json");

exports.getAll = () => {
  // 1. Check if the file is missing (e.g., hidden by a Kubernetes volume mount)
  if (!fs.existsSync(examsFile)) {
    const defaultStructure = {
      exams: {},
      auto_redirect: { enabled: false, url: "", delay: 5 },
    };

    // Create the directory if it doesn't exist, then write a clean starter file
    fs.mkdirSync(path.dirname(examsFile), { recursive: true });
    fs.writeFileSync(
      examsFile,
      JSON.stringify(defaultStructure, null, 2),
      "utf8",
    );

    return defaultStructure;
  }

  // 2. If it exists, read it safely as usual
  const data = fs.readFileSync(examsFile, "utf8");
  return JSON.parse(data);
};

exports.save = (examsData) => {
  const tempFile = examsFile + ".tmp";
  fs.writeFileSync(tempFile, JSON.stringify(examsData, null, 2), "utf8");
  fs.renameSync(tempFile, examsFile);
};
