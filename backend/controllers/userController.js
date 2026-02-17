const User = require('../models/User');
const ClientProfile = require('../models/ClientProfile');
const { objectId } = require('../middleware/validation');

// @desc    Get all users based on hierarchy access
// @route   GET /api/users
// @access  Private
exports.getUsers = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 10, search } = req.query;
    const currentUser = req.user;

    // Build query based on user role and hierarchy
    let query = {};

    if (currentUser.role === 'CA') {
      // CA can see all users
      // No additional filter needed
    } else if (currentUser.role === 'ACCOUNTANT') {
      // Accountant can see subordinates and clients
      const subordinates = await getAllSubordinates(currentUser._id);
      query._id = { $in: [...subordinates, currentUser._id] };
    } else if (currentUser.role === 'CLIENT') {
      // Clients can only see themselves
      query._id = currentUser._id;
    }

    // Apply role filter if specified
    if (role) {
      query.role = role;
    }

    // Apply status filter if specified
    if (status) {
      query.status = status;
    }

    // Apply search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    // Add additional info for subordinates
    const usersWithInfo = await Promise.all(users.map(async (user) => {
      const userObj = user.toObject();
      
      // Get client profile for clients
      if (user.role === 'CLIENT') {
        const clientProfile = await ClientProfile.findOne({ userId: user._id });
        userObj.clientProfile = clientProfile;
      }

      // Check if current user can manage this user
      userObj.canManage = currentUser.role === 'CA' || 
        (currentUser.role === 'ACCOUNTANT' && await isSubordinate(currentUser._id, user._id));

      return userObj;
    }));

    res.json({
      success: true,
      data: {
        users: usersWithInfo,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: err.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check access permission
    const hasAccess = await checkUserAccess(req.user, user._id);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get client profile if client
    let clientProfile = null;
    if (user.role === 'CLIENT') {
      clientProfile = await ClientProfile.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      data: {
        user,
        clientProfile
      }
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: err.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
  try {
    const { name, phone, address, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check access permission
    const hasAccess = await checkUserAccess(req.user, user._id, 'UPDATE');
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Store old values for audit
    const oldValues = {
      name: user.name,
      phone: user.phone,
      address: user.address,
      status: user.status
    };

    // Update allowed fields
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    
    // Only CA can change status
    if (status !== undefined && req.user.role === 'CA') {
      user.status = status;
    }

    await user.save();

    // Log update
    await logUserActivity(req.user._id, 'USER_UPDATE', user._id, 'USER', oldValues, {
      name: user.name,
      phone: user.phone,
      address: user.address,
      status: user.status
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: err.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (CA only)
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'CA') {
      return res.status(403).json({
        success: false,
        message: 'Only CA can delete users'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Cannot delete CA
    if (user.role === 'CA') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete CA account'
      });
    }

    // Check if user has subordinates
    const hasSubordinates = await User.exists({ parentId: user._id });
    if (hasSubordinates) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with subordinates'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    // Log deletion
    await logUserActivity(req.user._id, 'USER_DELETE', user._id, 'USER', user.toObject(), null);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: err.message
    });
  }
};

// @desc    Assign subordinate
// @route   POST /api/users/:id/assign
// @access  Private
exports.assignSubordinate = async (req, res) => {
  try {
    const { subordinateId, role } = req.body;

    const parentUser = await User.findById(req.params.id);
    if (!parentUser) {
      return res.status(404).json({
        success: false,
        message: 'Parent user not found'
      });
    }

    const subordinate = await User.findById(subordinateId);
    if (!subordinate) {
      return res.status(404).json({
        success: false,
        message: 'Subordinate not found'
      });
    }

    // Check permissions
    const hasAccess = await checkUserAccess(req.user, parentUser._id, 'ASSIGN');
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Validate hierarchy rules
    if (req.user.role === 'CA') {
      // CA can assign to anyone
      if (parentUser._id.toString() !== req.user._id.toString() && parentUser.role !== 'ACCOUNTANT') {
        return res.status(400).json({
          success: false,
          message: 'CA can only assign direct subordinates'
        });
      }
    } else if (req.user.role === 'ACCOUNTANT') {
      // Accountants can only assign their direct subordinates
      if (parentUser._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Can only assign your own subordinates'
        });
      }
    }

    // Update subordinate
    subordinate.parentId = parentUser._id;
    subordinate.level = parentUser.level + 1;
    await subordinate.save();

    res.json({
      success: true,
      message: 'Subordinate assigned successfully',
      data: { subordinate }
    });
  } catch (err) {
    console.error('Assign subordinate error:', err);
    res.status(500).json({
      success: false,
      message: 'Error assigning subordinate',
      error: err.message
    });
  }
};

// @desc    Remove subordinate assignment
// @route   DELETE /api/users/:id/subordinates/:subordinateId
// @access  Private
exports.removeSubordinate = async (req, res) => {
  try {
    const { subordinateId } = req.params;

    const subordinate = await User.findById(subordinateId);
    if (!subordinate) {
      return res.status(404).json({
        success: false,
        message: 'Subordinate not found'
      });
    }

    // Check permissions
    const hasAccess = await checkUserAccess(req.user, subordinate.parentId, 'REMOVE_SUBORDINATE');
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Remove parent assignment
    subordinate.parentId = null;
    subordinate.level = subordinate.role === 'ACCOUNTANT' ? 1 : 2;
    await subordinate.save();

    res.json({
      success: true,
      message: 'Subordinate removed successfully'
    });
  } catch (err) {
    console.error('Remove subordinate error:', err);
    res.status(500).json({
      success: false,
      message: 'Error removing subordinate',
      error: err.message
    });
  }
};

// @desc    Get hierarchy tree
// @route   GET /api/users/hierarchy
// @access  Private
exports.getHierarchy = async (req, res) => {
  try {
    const currentUser = req.user;
    let rootUsers = [];

    if (currentUser.role === 'CA') {
      // CA can see the entire hierarchy starting from CA level
      rootUsers = await User.find({ role: 'CA', parentId: null });
    } else if (currentUser.role === 'ACCOUNTANT') {
      // Accountants can see their subtree
      rootUsers = [currentUser];
    } else {
      // Clients can only see themselves
      rootUsers = [currentUser];
    }

    const hierarchy = [];
    for (const rootUser of rootUsers) {
      const userTree = await buildUserTree(rootUser._id);
      hierarchy.push(userTree);
    }

    res.json({
      success: true,
      data: hierarchy
    });
  } catch (err) {
    console.error('Get hierarchy error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching hierarchy',
      error: err.message
    });
  }
};

// Helper functions
const getAllSubordinates = async (userId) => {
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

const checkUserAccess = async (currentUser, targetUserId, action = 'READ') => {
  // CA has access to everything
  if (currentUser.role === 'CA') return true;

  // Users can access themselves
  if (currentUser._id.toString() === targetUserId.toString()) return true;

  // Check hierarchical access for subordinates
  return await isSubordinate(currentUser._id, targetUserId);
};

const buildUserTree = async (userId) => {
  const user = await User.findById(userId).select('-password');
  
  const children = await User.find({ parentId: userId }).select('-password');
  
  const childTrees = await Promise.all(
    children.map(child => buildUserTree(child._id))
  );

  return {
    ...user.toObject(),
    children: childTrees
  };
};

const logUserActivity = async (userId, action, entityId, entityType, oldValue, newValue) => {
  const AuditLog = require('../models/AuditLog');
  
  await AuditLog.create({
    userId,
    action,
    entityType,
    entityId,
    description: `${action} performed on ${entityType}`,
    oldValue,
    newValue,
    status: 'SUCCESS'
  });
};