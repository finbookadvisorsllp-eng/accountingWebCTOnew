const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { protect, authorize } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

// Get audit logs (CA only)
router.get('/', authorize('CA'), async (req, res) => {
  try {
    const { page = 1, limit = 50, action, entityType, userId, startDate, endDate } = req.query;
    
    let query = {};
    
    if (action) query.action = action;
    if (entityType) query.entityType = entityType;
    if (userId) query.userId = userId;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const auditLogs = await AuditLog.find(query)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        auditLogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (err) {
    console.error('Get audit logs error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit logs',
      error: err.message
    });
  }
});

// Get audit summary
router.get('/summary', authorize('CA'), async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const summary = await AuditLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            action: '$action',
            status: '$status'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get user activity stats
    const userActivity = await AuditLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          action: 'LOGIN'
        }
      },
      {
        $group: {
          _id: '$userId',
          loginCount: { $sum: 1 },
          lastLogin: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          userName: '$user.name',
          userEmail: '$user.email',
          userRole: '$user.role',
          loginCount: 1,
          lastLogin: 1
        }
      },
      {
        $sort: { loginCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: {
        summary,
        userActivity,
        totalLogs: await AuditLog.countDocuments({ createdAt: { $gte: startDate } })
      }
    });
  } catch (err) {
    console.error('Get audit summary error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit summary',
      error: err.message
    });
  }
});

module.exports = router;