const ExamModel = require("../models/examModel");
const { validationResult } = require("express-validator");

exports.getExams = (req, res, next) => {
  try {
    const exams = ExamModel.getAll();

    // 1. Validate the database data structure before sending it
    if (!exams) {
      console.warn("Warning: ExamModel.getAll() returned empty or null data.");
      return res.json({
        success: true,
        data: {
          exams: {},
          auto_redirect: { enabled: false, url: "", delay: 5 },
        },
      });
    }
    //console.log("Successfully retrieved exams data:", exams);

    // 2. Guarantee it always returns a clean JSON payload
    return res.json({ success: true, data: exams });
  } catch (err) {
    // 3. Log the actual database failure in your terminal console
    console.error("CRITICAL Backend Error inside getExams:", err);

    // 4. FORCE a JSON error response instead of passing it to next(err)
    // This stops the frontend from receiving an HTML webpage crash
    return res.status(500).json({
      success: false,
      error: "Failed to read database.",
      details: err.message,
    });
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
