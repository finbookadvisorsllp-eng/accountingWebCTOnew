// const User = require("../models/User");
// const Candidate = require("../models/Candidate");
// const generateToken = require("../utils/generateToken");
// const bcrypt = require("bcryptjs");

// // @desc    Register a new user (Admin only can create users)
// // @route   POST /api/auth/register
// // @access  Private/Admin
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role, employeeId } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required fields",
//       });
//     }

//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       role: role || "employee",
//       employeeId,
//     });

//     res.status(201).json({
//       success: true,
//       data: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         employeeId: user.employeeId,
//         token: generateToken(user._id, user.role),
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// exports.login = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide email and password",
//       });
//     }

//     const user = await User.findOne({ email }).select("+password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     if (role && user.role !== role) {
//       return res.status(401).json({
//         success: false,
//         message: `Invalid credentials for ${role} role`,
//       });
//     }

//     const isMatch = await user.matchPassword(password);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     if (!user.isActive) {
//       return res.status(401).json({
//         success: false,
//         message: "Your account is inactive. Please contact admin.",
//       });
//     }

//     res.json({
//       success: true,
//       data: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         employeeId: user.employeeId,
//         token: generateToken(user._id, user.role),
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // @desc    Login employee (using employeeId and password)
// // @route   POST /api/auth/employee-login
// // @access  Public
// exports.employeeLogin = async (req, res) => {
//   try {
//     const { employeeId, password } = req.body;

//     if (!employeeId || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide employee ID and password",
//       });
//     }

//     const candidate = await Candidate.findOne({
//       "adminInfo.employeeId": employeeId,
//     });

//     if (!candidate) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     if (!candidate.adminInfo.password) {
//       return res.status(401).json({
//         success: false,
//         message: "Account not fully activated",
//       });
//     }

//     const isMatch = await bcrypt.compare(
//       password,
//       candidate.adminInfo.password,
//     );

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     // Generate token for employee
//     const token = generateToken(candidate._id, "employee");

//     res.json({
//       success: true,
//       data: {
//         _id: candidate._id,
//         employeeId: candidate.adminInfo.employeeId,
//         name: `${candidate.personalInfo.firstName} ${candidate.personalInfo.lastName}`,
//         email: candidate.contactInfo.email,
//         status: candidate.status,
//         profilePercentage: candidate.profilePercentage,
//         role: "employee", // 👈 ADD THIS LINE
//         token,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // @desc    Get current logged in user
// // @route   GET /api/auth/me
// // @access  Private
// exports.getMe = async (req, res) => {
//   try {
//     const user = req.user;

//     res.json({
//       success: true,
//       data: user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


const User = require("../models/User");
const Candidate = require("../models/Candidate");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");


// =======================================
// @desc    Register User (Admin / Client)
// @route   POST /api/auth/register
// @access  Private/Admin
// =======================================

exports.register = async (req, res) => {

  try {

    const { name, email, password, role, employeeId, clientId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
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
      role: role || "employee",
      employeeId,
      clientId
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        clientId: user.clientId,
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


// =======================================
// @desc    Login (Admin OR Client)
// @route   POST /api/auth/login
// @access  Public
// =======================================

exports.login = async (req, res) => {

  try {

    const { email, clientId, password, role } = req.body;

    let user;

    // ---------- ADMIN LOGIN ----------
    if (role === "admin") {

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide email and password",
        });
      }

      user = await User.findOne({ email }).select("+password");

    }

    // ---------- CLIENT LOGIN ----------
    if (role === "client") {
      const Client = require("../models/Client");

      if (!clientId || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide clientId and password",
        });
      }

      const client = await Client.findOne({ clientId });

      if (!client) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Verify password manually (Client uses passwordHash)
      const isMatch = await bcrypt.compare(password, client.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      if (client.status !== "active") {
        return res.status(401).json({
          success: false,
          message: "Account is inactive. Contact admin.",
        });
      }

      return res.json({
        success: true,
        data: {
          _id: client._id,
          name: client.contactName || client.entityName,
          email: client.contactEmail,
          clientId: client.clientId,
          role: "client",
          token: generateToken(client._id, "client"),
        },
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: `Invalid credentials for ${role}`,
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
        message: "Account is inactive. Contact admin.",
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        clientId: user.clientId,
        role: user.role,
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


// =======================================
// @desc    Employee Login
// @route   POST /api/auth/employee-login
// @access  Public
// =======================================

exports.employeeLogin = async (req, res) => {

  try {

    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide employeeId and password",
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
        message: "Account not activated",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      candidate.adminInfo.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(candidate._id, "employee");

    res.json({
      success: true,
      data: {
        _id: candidate._id,
        employeeId: candidate.adminInfo.employeeId,
        name: `${candidate.personalInfo.firstName} ${candidate.personalInfo.lastName}`,
        email: candidate.contactInfo?.email || candidate.personalInfo?.email,
        designation: candidate.adminInfo.designation || "Accountant",
        status: candidate.status,
        profilePercentage: candidate.profilePercentage,
        contractAccepted: candidate.employeeContractAcceptance?.allTermsAccepted || false,
        role: "employee",
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


// =======================================
// @desc    Get Current User
// @route   GET /api/auth/me
// @access  Private
// =======================================

exports.getMe = async (req, res) => {

  try {

    res.json({
      success: true,
      data: req.user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};