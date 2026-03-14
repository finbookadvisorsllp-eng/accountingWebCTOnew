const Feedback = require("../models/Feedback");

/**
 * @desc    Submit new feedback
 * @route   POST /api/feedback
 * @access  Public
 */
exports.submitFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.create(req.body);

    res.status(201).json({
      success: true,
      data: feedback,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    next(error);
  }
};
