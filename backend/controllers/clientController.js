const User = require('../models/User');
const ClientProfile = require('../models/ClientProfile');
const Business = require('../models/Business');
const Assignment = require('../models/Assignment');

// @desc    Create client (CA creates client profile)
// @route   POST /api/clients
// @access  Private (CA only)
exports.createClient = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone,
      address,
      contactPerson,
      companyDetails,
      complianceDetails,
      assignedTo,
      notes 
    } = req.body;

    // Only CA can create clients
    if (req.user.role !== 'CA') {
      return res.status(403).json({
        success: false,
        message: 'Only CA can create clients'
      });
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);

    // Create user first
    const user = await User.create({
      name,
      email,
      password: tempPassword,
      role: 'CLIENT',
      phone,
      address,
      parentId: req.user._id,
      status: 'INACTIVE', // Client is inactive initially
      mustChangePassword: true,
      createdBy: req.user._id
    });

    // Create client profile
    const clientProfile = await ClientProfile.create({
      userId: user._id,
      contactPerson: {
        name: contactPerson.name,
        designation: contactPerson.designation,
        email: contactPerson.email || email,
        phone: contactPerson.phone || phone
      },
      companyDetails: {
        registrationNumber: companyDetails?.registrationNumber,
        incorporationDate: companyDetails?.incorporationDate,
        companyType: companyDetails?.companyType,
        industryType: companyDetails?.industryType,
        financialYearStart: companyDetails?.financialYearStart || 'APRIL'
      },
      complianceDetails: {
        gstRegistered: complianceDetails?.gstRegistered || false,
        panNumber: complianceDetails?.panNumber,
        tanNumber: complianceDetails?.tanNumber,
        cinNumber: complianceDetails?.cinNumber
      },
      assignedTo,
      assignedBy: assignedTo ? req.user._id : null,
      assignmentDate: assignedTo ? new Date() : null,
      createdBy: req.user._id,
      notes
    });

    // If assigned to accountant, create assignment record
    if (assignedTo) {
      await Assignment.create({
        assignerId: req.user._id,
        assigneeId: assignedTo,
        assignmentType: 'CLIENT_TO_ACCOUNTANT',
        entityType: 'CLIENT',
        entityId: clientProfile._id
      });
    }

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          status: user.status
        },
        clientProfile: {
          id: clientProfile._id,
          contactPerson: clientProfile.contactPerson,
          companyDetails: clientProfile.companyDetails,
          complianceDetails: clientProfile.complianceDetails,
          assignedTo: clientProfile.assignedTo
        },
        temporaryPassword: tempPassword
      }
    });
  } catch (err) {
    console.error('Create client error:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating client',
      error: err.message
    });
  }
};

// @desc    Get all clients based on hierarchy
// @route   GET /api/clients
// @access  Private
exports.getClients = async (req, res) => {
  try {
    const { status, assignedTo, page = 1, limit = 10, search } = req.query;
    const currentUser = req.user;

    // Build query based on user role
    let query = {};
    
    // Get client IDs based on hierarchy
    let clientIds = await getAccessibleClientIds(currentUser);
    query.userId = { $in: clientIds };

    if (status) {
      // Join with User to filter by status
      const usersWithStatus = await User.find({ 
        _id: { $in: clientIds },
        status 
      }).select('_id');
      
      query.userId = { $in: usersWithStatus.map(u => u._id) };
    }

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    // Search
    if (search) {
      const matchingUserIds = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      query.userId = { 
        $in: matchingUserIds.map(u => u._id) 
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const clientProfiles = await ClientProfile.find(query)
      .populate('userId', 'name email phone status createdAt')
      .populate('assignedTo', 'name email employeeId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ClientProfile.countDocuments(query);

    // Get business counts for each client
    const clientsWithBusinessCount = await Promise.all(
      clientProfiles.map(async (client) => {
        const businessCount = await Business.countDocuments({ clientId: client._id });
        const obj = client.toObject();
        obj.businessCount = businessCount;
        return obj;
      })
    );

    res.json({
      success: true,
      data: {
        clients: clientsWithBusinessCount,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (err) {
    console.error('Get clients error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching clients',
      error: err.message
    });
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
exports.getClient = async (req, res) => {
  try {
    const client = await ClientProfile.findById(req.params.id)
      .populate('userId', 'name email phone address status createdAt')
      .populate('assignedTo', 'name email employeeId')
      .populate('createdBy', 'name email');

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Check access permission
    const hasAccess = await checkClientAccess(req.user, client);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get businesses for this client
    const businesses = await Business.find({ clientId: client._id })
      .populate('assignedTo', 'name email employeeId');

    res.json({
      success: true,
      data: {
        client,
        businesses
      }
    });
  } catch (err) {
    console.error('Get client error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching client',
      error: err.message
    });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
exports.updateClient = async (req, res) => {
  try {
    const { 
      contactPerson, 
      companyDetails, 
      complianceDetails,
      status,
      notes 
    } = req.body;

    const client = await ClientProfile.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Check access permission
    const hasAccess = await checkClientAccess(req.user, client, 'UPDATE');
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Store old values
    const oldValues = {
      contactPerson: client.contactPerson,
      companyDetails: client.companyDetails,
      complianceDetails: client.complianceDetails,
      status: client.status,
      notes: client.notes
    };

    // Update fields
    if (contactPerson) {
      client.contactPerson = { ...client.contactPerson.toObject(), ...contactPerson };
    }
    if (companyDetails) {
      client.companyDetails = { ...client.companyDetails.toObject(), ...companyDetails };
    }
    if (complianceDetails) {
      client.complianceDetails = { ...client.complianceDetails.toObject(), ...complianceDetails };
    }
    if (notes !== undefined) {
      client.notes = notes;
    }
    if (status) {
      client.status = status;
    }

    await client.save();

    // Update user status if needed
    if (status && client.userId) {
      await User.findByIdAndUpdate(client.userId, { status });
    }

    res.json({
      success: true,
      message: 'Client updated successfully',
      data: { client }
    });
  } catch (err) {
    console.error('Update client error:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating client',
      error: err.message
    });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private (CA only)
exports.deleteClient = async (req, res) => {
  try {
    if (req.user.role !== 'CA') {
      return res.status(403).json({
        success: false,
        message: 'Only CA can delete clients'
      });
    }

    const client = await ClientProfile.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Check if client has businesses
    const hasBusinesses = await Business.exists({ clientId: client._id });
    if (hasBusinesses) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete client with existing businesses'
      });
    }

    // Delete client user
    await User.findByIdAndDelete(client.userId);
    await ClientProfile.findByIdAndDelete(req.params.id);

    // Remove assignments
    await Assignment.deleteMany({ 
      entityType: 'CLIENT', 
      entityId: client._id 
    });

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (err) {
    console.error('Delete client error:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting client',
      error: err.message
    });
  }
};

// @desc    Assign client to accountant
// @route   POST /api/clients/:id/assign
// @access  Private
exports.assignClient = async (req, res) => {
  try {
    const { assignedTo, notes } = req.body;

    const client = await ClientProfile.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'CA') {
      // Accountants can only assign their own clients
      if (client.assignedTo?.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only assign your own clients'
        });
      }
    }

    // Verify accountant exists
    const accountant = await User.findById(assignedTo);
    if (!accountant || accountant.role !== 'ACCOUNTANT') {
      return res.status(404).json({
        success: false,
        message: 'Accountant not found'
      });
    }

    // Store old assignee
    const oldAssignedTo = client.assignedTo;

    // Update client
    client.assignedTo = assignedTo;
    client.assignedBy = req.user._id;
    client.assignmentDate = new Date();
    await client.save();

    // Create assignment record
    await Assignment.create({
      assignerId: req.user._id,
      assigneeId: assignedTo,
      assignmentType: 'CLIENT_TO_ACCOUNTANT',
      entityType: 'CLIENT',
      entityId: client._id,
      notes,
      previousAssignmentId: oldAssignedTo ? (
        await Assignment.findOne({ 
          entityType: 'CLIENT', 
          entityId: client._id, 
          status: 'ACTIVE' 
        }).select('_id')
      )?._id : null
    });

    // Revoke old assignments
    if (oldAssignedTo) {
      await Assignment.updateMany(
        { entityType: 'CLIENT', entityId: client._id, status: 'ACTIVE', assigneeId: oldAssignedTo },
        { status: 'REVOKED' }
      );
    }

    res.json({
      success: true,
      message: 'Client assigned successfully',
      data: {
        clientId: client._id,
        assignedTo: {
          id: accountant._id,
          name: accountant.name,
          email: accountant.email
        }
      }
    });
  } catch (err) {
    console.error('Assign client error:', err);
    res.status(500).json({
      success: false,
      message: 'Error assigning client',
      error: err.message
    });
  }
};

// @desc    Get client dashboard stats
// @route   GET /api/clients/stats
// @access  Private
exports.getClientStats = async (req, res) => {
  try {
    const currentUser = req.user;

    let stats = {};

    if (currentUser.role === 'CA') {
      // CA sees all stats
      stats = {
        totalClients: await User.countDocuments({ role: 'CLIENT' }),
        activeClients: await User.countDocuments({ role: 'CLIENT', status: 'ACTIVE' }),
        inactiveClients: await User.countDocuments({ role: 'CLIENT', status: { $ne: 'ACTIVE' } }),
        totalAccountants: await User.countDocuments({ role: 'ACCOUNTANT' })
      };
    } else if (currentUser.role === 'ACCOUNTANT') {
      // Accountants see their assigned clients
      const assignedClients = await ClientProfile.find({ assignedTo: currentUser._id });
      const clientIds = assignedClients.map(c => c._id);

      stats = {
        totalClients: clientIds.length,
        activeClients: assignedClients.filter(c => c.status === 'ACTIVE').length,
        totalBusinesses: await Business.countDocuments({ clientId: { $in: clientIds } }),
        mySubordinates: await User.countDocuments({ parentId: currentUser._id })
      };
    } else {
      // Client sees their own stats
      const clientProfile = await ClientProfile.findOne({ userId: currentUser._id });
      
      stats = {
        myBusinesses: await Business.countDocuments({ clientId: clientProfile?._id }),
        assignedAccountant: clientProfile?.assignedTo
      };
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('Get client stats error:', err);
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
    // CA can see all clients
    return await User.find({ role: 'CLIENT' }).select('_id');
  } else if (currentUser.role === 'ACCOUNTANT') {
    // Get clients directly assigned to this accountant
    const assignedClients = await ClientProfile.find({ 
      assignedTo: currentUser._id 
    }).select('userId');

    // Get subordinates
    const subordinates = await getAllSubordinates(currentUser._id);
    
    // Get clients assigned to subordinates
    const subordinateClients = await ClientProfile.find({
      assignedTo: { $in: subordinates }
    }).select('userId');

    return [
      ...assignedClients.map(c => c.userId),
      ...subordinateClients.map(c => c.userId)
    ];
  } else {
    // Client can only see themselves
    return [currentUser._id];
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

const checkClientAccess = async (currentUser, client, action = 'READ') => {
  // CA has access to everything
  if (currentUser.role === 'CA') return true;

  // Check if client is assigned to current user
  if (client.assignedTo?.toString() === currentUser._id.toString()) return true;

  // Check if client is assigned to subordinate
  const subordinates = await getAllSubordinates(currentUser._id);
  return client.assignedTo && subordinates.some(
    s => s.toString() === client.assignedTo.toString()
  );
};