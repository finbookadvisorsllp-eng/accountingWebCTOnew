const { body, validationResult } = require("express-validator");

const feedbackValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("phone").optional({ checkFalsy: true }).trim(),
  body("greetingRating")
    .isIn(["Very Good", "Good", "Poor"])
    .withMessage("Invalid greeting rating"),
  body("discoverySource")
    .isIn(["Friends", "Neighbours", "By Ads/Others"])
    .withMessage("Invalid discovery source"),
  body("pricingRating")
    .isIn(["Very Good", "Good", "Poor"])
    .withMessage("Invalid pricing rating"),
  body("timelineRating")
    .isIn(["2-3 Weeks", "Less than 2 weeks", "Longer than 3 weeks"])
    .withMessage("Invalid timeline rating"),
  body("message").optional({ checkFalsy: true }).trim(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({
    success: false,
    errors: errors.array().map((err) => err.msg),
  });
};

module.exports = {
  feedbackValidation,
  validate,
};
