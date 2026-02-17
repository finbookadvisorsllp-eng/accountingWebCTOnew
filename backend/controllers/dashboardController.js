const User = require('../models/User');
const ClientProfile = require('../models/ClientProfile');
const Business = require('../models/Business');
const Assignment = require('../models/Assignment');
const AuditLog = require('../models/AuditLog');

// @desc    Get dashboard data based on user role
// @route   GET /api/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {
  try {
    const currentUser = req.user;
    let dashboardData = {};

    switch (currentUser.role) {
      case 'CA':
        dashboardData = await getCADashboard(currentUser);
        break;
      case 'ACCOUNTANT':
        dashboardData = await getAccountantDashboard(currentUser);
        break;
      case 'CLIENT':
        dashboardData = await getClientDashboard(currentUser);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid user role'
        });
    }

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (err) {
    console.error('Get dashboard error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: err.message
    });
  }
};

// @desc    Get hierarchy tree
// @route   GET /api/dashboard/hierarchy
// @access  Private
exports.getHierarchy = async (req, res) => {
  try {
    const currentUser = req.user;
    let hierarchy = [];

    if (currentUser.role === 'CA') {
      // Get full hierarchy starting from CA
      const caUsers = await User.find({ role: 'CA' });
      for (const ca of caUsers) {
        const tree = await buildHierarchyTree(ca._id);
        hierarchy.push(tree);
      }
    } else if (currentUser.role === 'ACCOUNTANT') {
      // Get subtree starting from current user
      const tree = await buildHierarchyTree(currentUser._id);
      hierarchy = [tree];
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

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
exports.getRecentActivities = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const currentUser = req.user;

    // Get accessible user IDs based on hierarchy
    let userIds = await getAccessibleUserIds(currentUser);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const activities = await AuditLog.find({ userId: { $in: userIds } })
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments({ userId: { $in: userIds } });

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (err) {
    console.error('Get activities error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities',
      error: err.message
    });
  }
};

// Helper functions for CA Dashboard
const getCADashboard = async (caUser) => {
  // Get all accountants
  const accountants = await User.find({ role: 'ACCOUNTANT' })
    .select('name email employeeId status createdAt');

  // Get accountant details with client counts
  const accountantsWithCounts = await Promise.all(
    accountants.map(async (accountant) => {
      const clientCount = await ClientProfile.countDocuments({ assignedTo: accountant._id });
      const subordinateCount = await User.countDocuments({ parentId: accountant._id });
      return {
        ...accountant.toObject(),
        clientCount,
        subordinateCount
      };
    })
  );

  // Get all clients
  const totalClients = await User.countDocuments({ role: 'CLIENT' });
  const activeClients = await User.countDocuments({ role: 'CLIENT', status: 'ACTIVE' });
  const inactiveClients = await User.countDocuments({ role: 'CLIENT', status: 'INACTIVE' });

  // Get all businesses
  const totalBusinesses = await Business.countDocuments();
  const activeBusinesses = await Business.countDocuments({ status: 'ACTIVE' });

  // Get businesses by type
  const businessesByType = await Business.aggregate([
    { $group: { _id: '$businessType', count: { $sum: 1 } } }
  ]);

  // Get compliance overview
  const complianceOverview = {
    gstFiled: await Business.countDocuments({ 'complianceStatus.gstReturn.status': 'FILED' }),
    gstPending: await Business.countDocuments({ 'complianceStatus.gstReturn.status': 'PENDING' }),
    gstOverdue: await Business.countDocuments({ 'complianceStatus.gstReturn.status': 'OVERDUE' }),
    itFiled: await Business.countDocuments({ 'complianceStatus.incomeTax.status': 'FILED' }),
    itPending: await Business.countDocuments({ 'complianceStatus.incomeTax.status': 'PENDING' }),
    itOverdue: await Business.countDocuments({ 'complianceStatus.incomeTax.status': 'OVERDUE' })
  };

  // Get recent registrations
  const recentClients = await User.find({ role: 'CLIENT' })
    .select('name email status createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    role: 'CA',
    summary: {
      totalClients,
      activeClients,
      inactiveClients,
      totalBusinesses,
      activeBusinesses,
      totalAccountants: accountants.length,
      activeAccountants: accountants.filter(a => a.status === 'ACTIVE').length
    },
    accountants: accountantsWithCounts,
    businessesByType,
    complianceOverview,
    recentClients,
    quickActions: [
      { label: 'Create Accountant', action: '/accountants/create', icon: 'user-plus' },
      { label: 'Create Client', action: '/clients/create', icon: 'building' },
      { label: 'Assign Work', action: '/assignments', icon: 'clipboard' },
      { label: 'View Hierarchy', action: '/hierarchy', icon: 'network' }
    ]
  };
};

// Helper functions for Accountant Dashboard
const getAccountantDashboard = async (accountantUser) => {
  // Get subordinates
  const subordinates = await User.find({ parentId: accountantUser._id })
    .select('name email role status employeeId');

  // Get all subordinates recursively
  const allSubordinates = await getAllSubordinates(accountantUser._id);
  const allSubordinateIds = [accountantUser._id, ...allSubordinates.map(s => s._id)];

  // Get assigned clients
  const assignedClients = await ClientProfile.find({ assignedTo: accountantUser._id })
    .populate('userId', 'name email status');

  const clientCount = assignedClients.length;
  const activeClientCount = assignedClients.filter(c => c.status === 'ACTIVE').length;

  // Get businesses assigned to this accountant or their subordinates
  const assignedBusinesses = await Business.find({
    assignedTo: { $in: allSubordinateIds }
  }).populate('clientId', 'businessName');

  const businessCount = assignedBusinesses.length;
  const activeBusinessCount = assignedBusinesses.filter(b => b.status === 'ACTIVE').length;

  // Get pending tasks (businesses with pending compliance)
  const pendingCompliance = assignedBusinesses.filter(b => 
    b.complianceStatus.gstReturn.status === 'PENDING' ||
    b.complianceStatus.gstReturn.status === 'OVERDUE' ||
    b.complianceStatus.incomeTax.status === 'PENDING' ||
    b.complianceStatus.incomeTax.status === 'OVERDUE'
  );

  // Get recent activities for this accountant
  const recentActivities = await AuditLog.find({ userId: accountantUser._id })
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    role: 'ACCOUNTANT',
    summary: {
      totalClients: clientCount,
      activeClients: activeClientCount,
      totalBusinesses: businessCount,
      activeBusinesses: activeBusinessCount,
      subordinatesCount: subordinates.length,
      pendingComplianceCount: pendingCompliance.length
    },
    subordinates,
    assignedClients: assignedClients.slice(0, 10),
    assignedBusinesses: assignedBusinesses.slice(0, 10),
    pendingCompliance: pendingCompliance.slice(0, 5),
    recentActivities,
    quickActions: [
      { label: 'View My Clients', action: '/clients', icon: 'users' },
      { label: 'View My Businesses', action: '/businesses', icon: 'building' },
      { label: 'View My Team', action: '/team', icon: 'users' },
      { label: 'Add Business', action: '/businesses/create', icon: 'plus-circle' }
    ]
  };
};

// Helper functions for Client Dashboard
const getClientDashboard = async (clientUser) => {
  // Get client profile
  const clientProfile = await ClientProfile.findOne({ userId: clientUser._id })
    .populate('assignedTo', 'name email phone employeeId');

  if (!clientProfile) {
    return { role: 'CLIENT', error: 'Client profile not found' };
  }

  // Get all businesses for this client
  const businesses = await Business.find({ clientId: clientProfile._id })
    .sort({ createdAt: -1 });

  const businessCount = businesses.length;
  const activeBusinessCount = businesses.filter(b => b.status === 'ACTIVE').length;

  // Get compliance status summary
  const complianceSummary = {
    gst: {
      filed: businesses.filter(b => b.complianceStatus.gstReturn.status === 'FILED').length,
      pending: businesses.filter(b => b.complianceStatus.gstReturn.status === 'PENDING').length,
      overdue: businesses.filter(b => b.complianceStatus.gstReturn.status === 'OVERDUE').length
    },
    incomeTax: {
      filed: businesses.filter(b => b.complianceStatus.incomeTax.status === 'FILED').length,
      pending: businesses.filter(b => b.complianceStatus.incomeTax.status === 'PENDING').length,
      overdue: businesses.filter(b => b.complianceStatus.incomeTax.status === 'OVERDUE').length
    }
  };

  // Get assigned accountant details
  const assignedAccountant = clientProfile.assignedTo;

  return {
    role: 'CLIENT',
    summary: {
      totalBusinesses: businessCount,
      activeBusinesses: activeBusinessCount,
      complianceSummary
    },
    clientProfile: {
      contactPerson: clientProfile.contactPerson,
      companyDetails: clientProfile.companyDetails,
      complianceDetails: clientProfile.complianceDetails
    },
    assignedAccountant,
    businesses,
    quickActions: [
      { label: 'View My Businesses', action: '/businesses', icon: 'building' },
      { label: 'Update Profile', action: '/profile', icon: 'user' },
      { label: 'Contact Accountant', action: `/accountants/${assignedAccountant?._id}`, icon: 'mail' }
    ]
  };
};

// Build hierarchy tree
const buildHierarchyTree = async (userId) => {
  const user = await User.findById(userId).select('-password');
  
  const children = await User.find({ parentId: userId }).select('-password');
  
  const childTrees = await Promise.all(
    children.map(child => buildHierarchyTree(child._id))
  );

  // Add client count for accountants
  let clientCount = 0;
  let businessCount = 0;
  if (user.role === 'ACCOUNTANT') {
    clientCount = await ClientProfile.countDocuments({ assignedTo: userId });
    businessCount = await Business.countDocuments({ assignedTo: userId });
  }

  return {
    ...user.toObject(),
    children: childTrees,
    stats: {
      clientCount,
      businessCount
    }
  };
};

// Get all subordinates recursively
const getAllSubordinates = async (userId) => {
  const subordinates = [];
  
  const getSubordinates = async (parentId) => {
    const directSubordinates = await User.find({ parentId: parentId });
    for (const user of directSubordinates) {
      subordinates.push(user);
      await getSubordinates(user._id);
    }
  };
  
  await getSubordinates(userId);
  return subordinates;
};

// Get accessible user IDs based on hierarchy
const getAccessibleUserIds = async (currentUser) => {
  if (currentUser.role === 'CA') {
    return await User.find().select('_id');
  } else if (currentUser.role === 'ACCOUNTANT') {
    const subordinates = await getAllSubordinates(currentUser._id);
    return [currentUser._id, ...subordinates.map(s => s._id)];
  } else {
    return [currentUser._id];
  }
};