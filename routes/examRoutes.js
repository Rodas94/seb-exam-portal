const express = require("express");
const examCtrl = require("../controllers/examController");
const sebVerifyMiddleware = require("../middleware/sebVerifyMiddleware");

const router = express.Router();

// The main SEB selection route
router.get(
  "/api/exams/select/:examId",
  sebVerifyMiddleware.requireSEB,
  examCtrl.selectExam,
);
// The main portal page SEB hits
router.get("/", examCtrl.showPortal);

// API for frontend to load buttons
router.get("/api/exams/available", examCtrl.getAvailableExams);

// The selection route IT staff clicks
router.get("/api/exams/select/:examId", examCtrl.selectExam);

// The route SEB hits to load the exam
// This route is protected by the SEB verification middleware
router.get("/api/exams/reset", examCtrl.clearSession);

module.exports = router;
