const ExamModel = require("../models/examModel");

// Show the portal menu (or auto-redirect if configured in session)
exports.showPortal = (req, res) => {
  // If the user has already selected an exam, redirect them to that exam's URL
  if (req.session.current_exam_url) {
    return res.redirect(req.session.current_exam_url);
  }
  // If no exam is selected, show the portal menu
  res.sendFile("index.html", { root: "public" });
};

// IT Staff clicks an exam button
exports.selectExam = (req, res) => {
  const examId = req.params.examId;
  const config = ExamModel.getAll();
  const exams = config.exams || {};

  // Handle the auto-redirect selection
  if (
    examId === "auto_redirect" &&
    config.auto_redirect &&
    config.auto_redirect.enabled
  ) {
    req.session.current_exam_url = config.auto_redirect.url;
    return res.redirect(config.auto_redirect.url);
  }

  // Handle normal exam selection
  if (exams[examId]) {
    req.session.current_exam_url = exams[examId].url;
    res.redirect(exams[examId].url);
  } else {
    res.status(404).send("Exam not found");
  }
};

// API route to fetch available exams for the frontend script
exports.getAvailableExams = (req, res) => {
  const config = ExamModel.getAll();
  res.json({ success: true, data: config }); // Send the whole config object
};

// Clear session for IT staff
exports.clearSession = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
