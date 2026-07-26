const ExamModel = require("../models/examModel");
const { validationResult } = require("express-validator");

exports.getExams = (req, res, next) => {
  try {
    const exams = ExamModel.getAll();
    res.json({ success: true, data: exams });
  } catch (err) {
    next(err); // Passes error to global handler
  }
};

exports.updateExams = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // If ExamModel.save uses fs.writeFileSync or synchronous code,
    // wrapping it in a try/catch is perfect. Keep 'await' only if it returns a Promise.
    await ExamModel.save(req.body);

    return res.json({
      success: true,
      message: "Parallel exam configurations updated successfully.",
    });
  } catch (err) {
    console.error("Backend Error inside updateExams:", err);
    // FORCE a JSON response here instead of passing it to next(err)
    // so your frontend never gets a raw HTML crash page again!
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server database error.",
    });
  }
};
