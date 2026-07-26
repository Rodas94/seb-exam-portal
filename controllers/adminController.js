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
  // DEBUGGER: Log incoming payload to check what GitOps/Production is actually sending
  console.log(
    "[DEBUG] updateExams incoming body:",
    JSON.stringify(req.body, null, 2),
  );

  // Validate the request body using express-validator
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // DEBUGGER: Log validation errors if the request gets rejected with 400
    console.warn("[DEBUG] Validation failed:", errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // DEBUGGER: Log right before saving to data source/file
    console.log("[DEBUG] Validation passed. Saving exam config...");

    await ExamModel.save(req.body);

    console.log("[DEBUG] Exam config saved successfully.");
    res.json({
      success: true,
      message: "Parallel exam configurations updated successfully.",
    });
  } catch (err) {
    // DEBUGGER: Log unexpected server/database/file write errors
    console.error("[DEBUG] Error saving exam config:", err);
    next(err);
  }
};
