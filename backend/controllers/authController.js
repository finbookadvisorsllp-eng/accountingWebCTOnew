const User = require("../models/User");
const Candidate = require("../models/Candidate");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// @desc    Register a new user (Admin only can create users)
// @route   POST /api/auth/register
// @access  Private/Admin
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, employeeId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "advisor",
      employeeId,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (role && user.role !== role) {
      return res.status(401).json({
        success: false,
        message: `Invalid credentials for ${role} role`,
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account is inactive. Please contact admin.",
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login employee (using employeeId and password)
// @route   POST /api/auth/employee-login
// @access  Public
exports.employeeLogin = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide employee ID and password",
      });
    }

    const candidate = await Candidate.findOne({
      "adminInfo.employeeId": employeeId,
    });

    if (!candidate) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!candidate.adminInfo.password) {
      return res.status(401).json({
        success: false,
        message: "Account not fully activated",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      candidate.adminInfo.password,
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token for employee
    const token = generateToken(candidate._id, "employee");

    res.json({
      success: true,
      data: {
        _id: candidate._id,
        employeeId: candidate.adminInfo.employeeId,
        name: `${candidate.personalInfo.firstName} ${candidate.personalInfo.lastName}`,
        email: candidate.contactInfo.email,
        status: candidate.status,
        profilePercentage: candidate.profilePercentage,
        role: "employee", // 👈 ADD THIS LINE
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
