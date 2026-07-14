const { body } = require("express-validator");

exports.validateExamData = [
  // Validate the auto_redirect object
  //e.g., check if it's an object, has required fields, and valid values
  body("auto_redirect")
    .isObject()
    .withMessage("Auto-redirect must be an object"),
  // Validate the fields within auto_redirect
  // e.g
  body("auto_redirect.enabled")
    .isBoolean()
    .withMessage("Enabled must be true/false"),
  body("auto_redirect.url")
    .if(body("auto_redirect.enabled").equals("true"))
    .isURL({ require_protocol: true })
    .withMessage("Must provide a valid URL when auto-redirect is enabled"),
  body("auto_redirect.delay")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Delay must be a number"),

  // Validate the exams object
  body("exams").isObject().withMessage("Exams must be a JSON object"),
  body("exams.*").isObject().withMessage("Each exam must be an object"),
  body("exams.*.name")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("Exam name is required"),
  body("exams.*.url")
    .isURL({ require_protocol: true })
    .withMessage("Must be a valid URL (include http or https)"),
  body("exams.*.color")
    .optional()
    .isHexColor()
    .withMessage("Must be a valid hex color"),
];
