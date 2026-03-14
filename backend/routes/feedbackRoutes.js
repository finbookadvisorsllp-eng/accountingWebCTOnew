const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { submitFeedback } = require("../controllers/feedbackController");
const { feedbackValidation, validate } = require("../utils/validation");

// Rate limiter for feedback - strict to prevent spam
const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 feedback submissions per windowMs
  message: {
    success: false,
    message: "Too many feedback submissions. Please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", feedbackLimiter, feedbackValidation, validate, submitFeedback);

module.exports = router;
