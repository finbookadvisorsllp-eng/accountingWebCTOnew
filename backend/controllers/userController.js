const User = require("../models/User");

// @desc    Get all accountants (users with role 'advisor')
// @route   GET /api/users/accountants
// @access  Private/Admin
exports.getAccountants = async (req, res) => {
  try {
    const accountants = await User.find({
      role: "advisor",
      isActive: true,
    }).select("name email employeeId role");

    res.status(200).json({
      success: true,
      count: accountants.length,
      data: accountants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users (with optional filters)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
