const Business = require('../models/Business');
const ClientProfile = require('../models/ClientProfile');
const Assignment = require('../models/Assignment');
const User = require('../models/User');

// @desc    Create business
// @route   POST /api/businesses
// @access  Private
exports.createBusiness = async (req, res) => {
  try {
    const { 
      clientId,
      businessName,
      businessType,
      registrationDetails,
      taxDetails,
      address,
      bankDetails,
      financialDetails,
      assignedTo,
      status,
      notes,
      tags
    } = req.body;

    // Verify client exists
    const client = await ClientProfile.findById(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Check access to create business
    const hasAccess = await checkBusinessAccess(req.user, client, 'CREATE');
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check for duplicate GST number
    if (taxDetails?.gstNumber) {
      const existingBusiness = await Business.findOne({ 
        'taxDetails.gstNumber': taxDetails.gstNumber.toUpperCase() 
      });
      if (existingBusiness) {
        return res.status(400).json({
          success: false,
          message: 'Business with this GST number already exists'
        });
      }
    }

    // Check for duplicate PAN number
    if (taxDetails?.panNumber) {
      const existingBusiness = await Business.findOne({ 
        'taxDetails.panNumber': taxDetails.panNumber.toUpperCase() 
      });
      if (existingBusiness) {
        return res.status(400).json({
          success: false,
          message: 'Business with this PAN number already exists'
        });
      }
    }

    // Create business
    const business = await Business.create({
      clientId,
      businessName,
      businessType,
      registrationDetails: {
        registrationNumber: registrationDetails?.registrationNumber,
        incorporationDate: registrationDetails?.incorporationDate,
        registrationAuthority: registrationDetails?.registrationAuthority
      },
      taxDetails: {
        panNumber: taxDetails?.panNumber?.toUpperCase(),
        tanNumber: taxDetails?.tanNumber,
        gstNumber: taxDetails?.gstNumber?.toUpperCase(),
        cinNumber: taxDetails?.cinNumber
      },
      address: {
        registered: address?.registered,
        operational: address?.operational
      },
      bankDetails,
      financialDetails: {
        turnover: financialDetails?.turnover,
        employeesCount: financialDetails?.employeesCount,
        financialYear: financialDetails?.financialYear || '2024-2025',
        booksMaintained: financialDetails?.booksMaintained || 'ACCURAL'
      },
      assignedTo,
      assignedBy: assignedTo ? req.user._id : null,
      assignmentDate: assignedTo ? new Date() : null,
      status: status || 'ACTIVE',
      notes,
      tags,
      createdBy: req.user._id
    });

    // Create assignment if assigned
    if (assignedTo) {
      await Assignment.create({
        assignerId: req.user._id,
        assigneeId: assignedTo,
        assignmentType: 'BUSINESS_TO_ACCOUNTANT',
        entityType: 'BUSINESS',
        entityId: business._id
      });
    }

    res.status(201).json({
      success: true,
      message: 'Business created successfully',
      data: { business }
    });
  } catch (err) {
    console.error('Create business error:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating business',
      error: err.message
    });
  }
};

// @desc    Get all businesses
// @route   GET /api/businesses
// @access  Private
exports.getBusinesses = async (req, res) => {
  try {
    const { 
      clientId, 
      assignedTo, 
      status, 
      businessType,
      page = 1, 
      limit = 10, 
      search 
    } = req.query;
    const currentUser = req.user;

    // Build query based on hierarchy
    let query = {};

    // Get accessible client IDs
    const accessibleClientIds = await getAccessibleClientIds(currentUser);
    
    if (currentUser.role === 'CA') {
      // CA can see all businesses
    } else if (currentUser.role === 'ACCOUNTANT') {
      // Get businesses assigned to current user or their subordinates
      const assignedBusinesses = await Business.find({ 
        assignedTo: { $in: [currentUser._id, ...await getAllSubordinates(currentUser._id)] }
      }).select('_id');
      
      const assignedBusinessIds = assignedBusinesses.map(b => b._id);
      
      query.$or = [
        { clientId: { $in: accessibleClientIds } },
        { _id: { $in: assignedBusinessIds } }
      ];
    } else {
      // Clients can only see their own businesses
      query.clientId = { $in: accessibleClientIds };
    }

    // Apply filters
    if (clientId) {
      query.clientId = clientId;
    }

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (status) {
      query.status = status;
    }

    if (businessType) {
      query.businessType = businessType;
    }

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const businesses = await Business.find(query)
      .populate('clientId', 'contactPerson companyDetails')
      .populate('assignedTo', 'name email employeeId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Business.countDocuments(query);

    res.json({
      success: true,
      data: {
        businesses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (err) {
    console.error('Get businesses error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching businesses',
      error: err.message
    });
  }
};

// @desc    Get single business
// @route   GET /api/businesses/:id
// @access  Private
exports.getBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('clientId')
      .populate('assignedTo', 'name email employeeId')
      .populate('createdBy', 'name email');

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Check access
    const hasAccess = await checkBusinessAccess(req.user, business.clientId, 'READ');
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { business }
    });
  } catch (err) {
    console.error('Get business error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching business',
      error: err.message
    });
  }
};

// @desc    Update business
// @route   PUT /api/businesses/:id
// @access  Private
exports.updateBusiness = async (req, res) => {
  try {
    const { 
      businessName,
      businessType,
      registrationDetails,
      taxDetails,
      address,
      bankDetails,
      financialDetails,
      complianceStatus,
      assignedTo,
      status,
      notes,
      tags
    } = req.body;

    let business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Get client for access check
    const client = await ClientProfile.findById(business.clientId);
    
    // Check access
    const hasAccess = await checkBusinessAccess(req.user, client, 'UPDATE');
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check for duplicate GST number if being updated
    if (taxDetails?.gstNumber) {
      const existingBusiness = await Business.findOne({ 
        'taxDetails.gstNumber': taxDetails.gstNumber.toUpperCase(),
        _id: { $ne: business._id }
      });
      if (existingBusiness) {
        return res.status(400).json({
          success: false,
          message: 'Business with this GST number already exists'
        });
      }
    }

    // Check for duplicate PAN number if being updated
    if (taxDetails?.panNumber) {
      const existingBusiness = await Business.findOne({ 
        'taxDetails.panNumber': taxDetails.panNumber.toUpperCase(),
        _id: { $ne: business._id }
      });
      if (existingBusiness) {
        return res.status(400).json({
          success: false,
          message: 'Business with this PAN number already exists'
        });
      }
    }

    // Update fields
    if (businessName !== undefined) business.businessName = businessName;
    if (businessType !== undefined) business.businessType = businessType;
    if (registrationDetails !== undefined) business.registrationDetails = registrationDetails;
    if (taxDetails !== undefined) business.taxDetails = {
      ...business.taxDetails.toObject(),
      ...taxDetails,
      panNumber: taxDetails.panNumber?.toUpperCase() || business.taxDetails.panNumber,
      gstNumber: taxDetails.gstNumber?.toUpperCase() || business.taxDetails.gstNumber
    };
    if (address !== undefined) business.address = address;
    if (bankDetails !== undefined) business.bankDetails = bankDetails;
    if (financialDetails !== undefined) business.financialDetails = financialDetails;
    if (complianceStatus !== undefined) business.complianceStatus = complianceStatus;
    if (status !== undefined) business.status = status;
    if (notes !== undefined) business.notes = notes;
    if (tags !== undefined) business.tags = tags;

    // Handle assignment change
    if (assignedTo !== undefined && assignedTo !== business.assignedTo?.toString()) {
      business.assignedTo = assignedTo;
      business.assignedBy = assignedTo ? req.user._id : null;
      business.assignmentDate = assignedTo ? new Date() : null;

      // Create new assignment
      if (assignedTo) {
        await Assignment.create({
          assignerId: req.user._id,
          assigneeId: assignedTo,
          assignmentType: 'BUSINESS_TO_ACCOUNTANT',
          entityType: 'BUSINESS',
          entityId: business._id
        });

        // Revoke old assignments
        await Assignment.updateMany(
          { entityType: 'BUSINESS', entityId: business._id, status: 'ACTIVE' },
          { status: 'REVOKED' }
        );
      }
    }

    await business.save();

    res.json({
      success: true,
      message: 'Business updated successfully',
      data: { business }
    });
  } catch (err) {
    console.error('Update business error:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating business',
      error: err.message
    });
  }
};

// @desc    Delete business
// @route   DELETE /api/businesses/:id
// @access  Private (CA only)
exports.deleteBusiness = async (req, res) => {
  try {
    if (req.user.role !== 'CA') {
      return res.status(403).json({
        success: false,
        message: 'Only CA can delete businesses'
      });
    }

    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    await Business.findByIdAndDelete(req.params.id);

    // Remove assignments
    await Assignment.deleteMany({ 
      entityType: 'BUSINESS', 
      entityId: business._id 
    });

    res.json({
      success: true,
      message: 'Business deleted successfully'
    });
  } catch (err) {
    console.error('Delete business error:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting business',
      error: err.message
    });
  }
};

// @desc    Assign business to accountant
// @route   POST /api/businesses/:id/assign
// @access  Private
exports.assignBusiness = async (req, res) => {
  try {
    const { assignedTo, notes } = req.body;

    let business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Get client for access check
    const client = await ClientProfile.findById(business.clientId);
    const hasAccess = await checkBusinessAccess(req.user, client, 'ASSIGN');
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Verify accountant exists
    const accountant = await User.findById(assignedTo);
    if (!accountant || accountant.role !== 'ACCOUNTANT') {
      return res.status(404).json({
        success: false,
        message: 'Accountant not found'
      });
    }

    // Update business
    business.assignedTo = assignedTo;
    business.assignedBy = req.user._id;
    business.assignmentDate = new Date();
    await business.save();

    // Create assignment record
    await Assignment.create({
      assignerId: req.user._id,
      assigneeId: assignedTo,
      assignmentType: 'BUSINESS_TO_ACCOUNTANT',
      entityType: 'BUSINESS',
      entityId: business._id,
      notes
    });

    res.json({
      success: true,
      message: 'Business assigned successfully',
      data: {
        businessId: business._id,
        assignedTo: {
          id: accountant._id,
          name: accountant.name,
          email: accountant.email
        }
      }
    });
  } catch (err) {
    console.error('Assign business error:', err);
    res.status(500).json({
      success: false,
      message: 'Error assigning business',
      error: err.message
    });
  }
};

// @desc    Get business dashboard stats
// @route   GET /api/businesses/stats
// @access  Private
exports.getBusinessStats = async (req, res) => {
  try {
    const currentUser = req.user;
    let stats = {};

    if (currentUser.role === 'CA') {
      stats = {
        totalBusinesses: await Business.countDocuments(),
        activeBusinesses: await Business.countDocuments({ status: 'ACTIVE' }),
        inactiveBusinesses: await Business.countDocuments({ status: { $ne: 'ACTIVE' } }),
        businessesByType: await Business.aggregate([
          { $group: { _id: '$businessType', count: { $sum: 1 } } }
        ]),
        gstRegistered: await Business.countDocuments({ 'taxDetails.gstNumber': { $exists: true, $ne: null } })
      };
    } else if (currentUser.role === 'ACCOUNTANT') {
      const subordinates = await getAllSubordinates(currentUser._id);
      const accessibleIds = [currentUser._id, ...subordinates];

      stats = {
        totalBusinesses: await Business.countDocuments({ 
          assignedTo: { $in: accessibleIds } 
        }),
        activeBusinesses: await Business.countDocuments({ 
          assignedTo: { $in: accessibleIds },
          status: 'ACTIVE' 
        })
      };
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('Get business stats error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: err.message
    });
  }
};

// Helper functions
const getAccessibleClientIds = async (currentUser) => {
  if (currentUser.role === 'CA') {
    const clients = await ClientProfile.find().select('userId');
    return clients.map(c => c.userId);
  } else if (currentUser.role === 'ACCOUNTANT') {
    const assignedClients = await ClientProfile.find({ 
      assignedTo: currentUser._id 
    }).select('userId');
    
    const subordinates = await getAllSubordinates(currentUser._id);
    const subordinateClients = await ClientProfile.find({
      assignedTo: { $in: subordinates }
    }).select('userId');

    return [
      ...assignedClients.map(c => c.userId),
      ...subordinateClients.map(c => c.userId)
    ];
  } else {
    const clientProfile = await ClientProfile.findOne({ userId: currentUser._id });
    return clientProfile ? [clientProfile.userId] : [];
  }
};

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

const checkBusinessAccess = async (currentUser, client, action = 'READ') => {
  if (currentUser.role === 'CA') return true;

  // Check if assigned to current user
  if (client.assignedTo?.toString() === currentUser._id.toString()) return true;

  // Check if assigned to subordinate
  const subordinates = await getAllSubordinates(currentUser._id);
  return client.assignedTo && subordinates.some(
    s => s.toString() === client.assignedTo.toString()
  );
};