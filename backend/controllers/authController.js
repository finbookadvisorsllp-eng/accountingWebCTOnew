const User = require('../models/User');
const ClientProfile = require('../models/ClientProfile');
const AuditLog = require('../models/AuditLog');
const { validation } = require('../middleware/validation');
const { generateToken } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// @desc    Register new user (CA or Accountant creates user)
// @route   POST /api/auth/register
// @access  Private (CA and Accountants)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, parentId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Validate parent relationship for Accountants
    if (role === 'ACCOUNTANT' && !req.user.role === 'CA') {
      // Only CA can create direct accountants
      if (req.user.role !== 'CA') {
        return res.status(403).json({
          success: false,
          message: 'Only CA can create accountant accounts'
        });
      }
    }

    // Determine parent ID
    let finalParentId = parentId;
    if (!finalParentId && req.user.role === 'CA') {
      finalParentId = req.user._id;
    }

    // Generate employee ID for accountants
    let employeeId = null;
    if (role === 'ACCOUNTANT') {
      const count = await User.countDocuments({ role: 'ACCOUNTANT' });
      employeeId = `ACC${String(count + 1).padStart(4, '0')}`;
    }

    // Determine initial status
    let status = 'PENDING_ACTIVATION';
    if (role === 'CLIENT') {
      status = 'INACTIVE'; // Client accounts are inactive until CA activates them
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      address,
      parentId: finalParentId,
      employeeId,
      status,
      mustChangePassword: role !== 'CLIENT',
      createdBy: req.user._id
    });

    // If client, create client profile
    if (role === 'CLIENT') {
      await ClientProfile.create({
        userId: user._id,
        createdBy: req.user._id
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role, user.level);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          level: user.level,
          status: user.status,
          mustChangePassword: user.mustChangePassword,
          employeeId: user.employeeId
        },
        token
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: err.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Log failed login attempt
      await AuditLog.create({
        userId: user._id,
        action: 'LOGIN',
        entityType: 'SYSTEM',
        description: 'Failed login attempt - Invalid password',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'FAILED',
        errorMessage: 'Invalid password'
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (user.status === 'INACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administrator.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log successful login
    await AuditLog.create({
      userId: user._id,
      action: 'LOGIN',
      entityType: 'SYSTEM',
      description: 'User logged in successfully',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'SUCCESS'
    });

    // Generate token
    const token = generateToken(user._id, user.role, user.level);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          level: user.level,
          status: user.status,
          mustChangePassword: user.mustChangePassword,
          employeeId: user.employeeId,
          parentId: user.parentId
        },
        token
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: err.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Get additional profile data for clients
    let profileData = null;
    if (user.role === 'CLIENT') {
      profileData = await ClientProfile.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          level: user.level,
          phone: user.phone,
          address: user.address,
          status: user.status,
          mustChangePassword: user.mustChangePassword,
          employeeId: user.employeeId,
          parentId: user.parentId,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        },
        profile: profileData
      }
    });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: err.message
    });
  }
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    // Log password change
    await AuditLog.create({
      userId: user._id,
      action: 'PASSWORD_CHANGE',
      entityType: 'USER',
      entityId: user._id,
      description: 'User changed their password',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'SUCCESS'
    });

    // Generate new token
    const token = generateToken(user._id, user.role, user.level);

    res.json({
      success: true,
      message: 'Password changed successfully',
      data: { token }
    });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: err.message
    });
  }
};

// @desc    Activate client account (CA generates credentials)
// @route   POST /api/auth/activate-client
// @access  Private (CA only)
exports.activateClient = async (req, res) => {
  try {
    const { clientId, sendCredentials } = req.body;

    // Find client user
    const client = await User.findById(clientId);
    if (!client || client.role !== 'CLIENT') {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Generate temporary password if not provided
    const tempPassword = Math.random().toString(36).slice(-8);

    // Update client status and set password
    client.status = 'ACTIVE';
    client.password = tempPassword;
    client.mustChangePassword = true;
    await client.save();

    // Log activation
    await AuditLog.create({
      userId: req.user._id,
      action: 'STATUS_CHANGE',
      entityType: 'USER',
      entityId: client._id,
      description: 'Client account activated',
      newValue: { status: 'ACTIVE', mustChangePassword: true },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'SUCCESS'
    });

    res.json({
      success: true,
      message: 'Client account activated successfully',
      data: {
        clientId: client._id,
        email: client.email,
        temporaryPassword: tempPassword,
        mustChangePassword: true
      }
    });
  } catch (err) {
    console.error('Activate client error:', err);
    res.status(500).json({
      success: false,
      message: 'Error activating client account',
      error: err.message
    });
  }
};

// @desc    Forgot password (admin initiated)
// @route   POST /api/auth/forgot-password
// @access  Private (CA only)
exports.resetUserPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    // Only CA can reset passwords
    if (req.user.role !== 'CA') {
      return res.status(403).json({
        success: false,
        message: 'Only CA can reset user passwords'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password
    user.password = newPassword;
    user.mustChangePassword = true;
    await user.save();

    // Log password reset
    await AuditLog.create({
      userId: req.user._id,
      action: 'PASSWORD_CHANGE',
      entityType: 'USER',
      entityId: user._id,
      description: 'CA reset user password',
      oldValue: { mustChangePassword: user.mustChangePassword },
      newValue: { mustChangePassword: true },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'SUCCESS'
    });

    res.json({
      success: true,
      message: 'Password reset successfully',
      data: {
        userId: user._id,
        mustChangePassword: true
      }
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: err.message
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Log logout
    await AuditLog.create({
      userId: req.user._id,
      action: 'LOGOUT',
      entityType: 'SYSTEM',
      description: 'User logged out',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'SUCCESS'
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: err.message
    });
  }
};