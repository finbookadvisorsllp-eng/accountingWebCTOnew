const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

// Generate JWT Token
exports.generateToken = (id, role, level) => {
  return jwt.sign(
    { id, role, level },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user account is active
    if (req.user.status === 'INACTIVE') {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact administrator."
      });
    }

    // Check if user needs to change password
    if (req.user.mustChangePassword && req.path !== '/change-password') {
      req.user.needsPasswordChange = true;
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

// Check if user has access to a specific entity based on hierarchy
exports.checkHierarchyAccess = async (req, res, next) => {
  const { targetId, targetType } = req.body;
  
  if (!targetId || !targetType) {
    return res.status(400).json({
      success: false,
      message: "Target ID and type are required"
    });
  }

  try {
    const currentUser = req.user;
    let hasAccess = false;

    // CA (Level 0) has access to everything
    if (currentUser.role === 'CA') {
      hasAccess = true;
    } else if (currentUser.role === 'ACCOUNTANT') {
      // Accountants can access their subordinates and assigned clients/businesses
      if (targetType === 'USER') {
        const targetUser = await User.findById(targetId);
        if (targetUser) {
          // Check if target is a subordinate
          hasAccess = await isSubordinate(currentUser._id, targetUser._id);
          // Or if target is assigned to current user
          if (!hasAccess && targetUser.parentId?.toString() === currentUser._id.toString()) {
            hasAccess = true;
          }
        }
      } else if (targetType === 'CLIENT') {
        const ClientProfile = require('../models/ClientProfile');
        const client = await ClientProfile.findOne({ userId: targetId });
        if (client && client.assignedTo) {
          hasAccess = client.assignedTo.toString() === currentUser._id.toString() || 
                     await isSubordinate(currentUser._id, client.assignedTo);
        }
      } else if (targetType === 'BUSINESS') {
        const Business = require('../models/Business');
        const business = await Business.findById(targetId);
        if (business && business.assignedTo) {
          hasAccess = business.assignedTo.toString() === currentUser._id.toString() ||
                     await isSubordinate(currentUser._id, business.assignedTo);
        }
      }
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to access this resource"
      });
    }

    next();
  } catch (err) {
    console.error('Hierarchy access check error:', err);
    return res.status(500).json({
      success: false,
      message: "Error checking access permissions"
    });
  }
};

// Helper function to check if a user is a subordinate
const isSubordinate = async (parentId, childId) => {
  let currentUser = await User.findById(childId);
  while (currentUser && currentUser.parentId) {
    if (currentUser.parentId.toString() === parentId.toString()) {
      return true;
    }
    currentUser = await User.findById(currentUser.parentId);
  }
  return false;
};

// Middleware to get all subordinates (recursive)
exports.getAllSubordinates = async (userId) => {
  const subordinates = [];
  
  const getSubordinates = async (parentId) => {
    const directSubordinates = await User.find({ parentId: parentId });
    for (const user of directSubordinates) {
      subordinates.push(user._id);
      await getSubordinates(user._id);
    }
  };
  
  await getSubordinates(userId);
  return subordinates;
};

// Middleware to log audit events
exports.logAudit = (action, entityType) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);
    
    res.json = function(data) {
      // Log to audit after response
      const logData = {
        userId: req.user?._id || req.body.userId,
        action,
        entityType,
        entityId: req.body.targetId || req.params.id,
        description: `${action} performed on ${entityType}`,
        oldValue: req.body.oldValue,
        newValue: req.body.newValue,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        status: data.success ? 'SUCCESS' : 'FAILED',
        errorMessage: data.message
      };
      
      // Create audit log (non-blocking)
      AuditLog.create(logData).catch(err => console.error('Audit log error:', err));
      
      return originalJson(data);
    };
    
    next();
  };
};
