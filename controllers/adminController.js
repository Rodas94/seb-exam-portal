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

// 1. Add 'async' here ⬇️
exports.updateExams = async (req, res, next) => {
  // Validate the request body using express-validator
  //e.g., check for required fields, valid URLs, etc.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // 2. Add 'await' here so the database/file finish writing completely ⬇️
    await ExamModel.save(req.body);

    res.json({
      success: true,
      message: "Parallel exam configurations updated successfully.",
    });
  } catch (err) {
    next(err);
  }
};
