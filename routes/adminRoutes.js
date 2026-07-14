const express = require("express");
const rateLimit = require("express-rate-limit");
const adminCtrl = require("../controllers/adminController");
const { requireAuth } = require("../middleware/authMiddleware");
const {
  validateExamData,
  logAction,
} = require("../middleware/validationMiddleware");
const auditLogger = require("../middleware/auditLogger");

// Protect all admin routes
//e.g., require authentication for any route under /api/exams
const router = express.Router();

// Apply authentication middleware to all routes in this router
//e.g., if the user is not authenticated, redirect to login or return 401
router.use(requireAuth);

// Rate limiting for admin API routes to prevent abuse
//e.g., limit to 30 requests per minute per IP
const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });

router.get("/api/exams", apiLimiter, adminCtrl.getExams);
router.post(
  "/api/exams",
  apiLimiter,
  auditLogger.logAction("UPDATE_EXAMS"), // Added here
  validateExamData,
  adminCtrl.updateExams,
);

module.exports = router;
