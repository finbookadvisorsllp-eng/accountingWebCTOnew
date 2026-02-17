const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getHierarchy,
  getRecentActivities
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Dashboard routes
router.get('/', getDashboard);
router.get('/hierarchy', getHierarchy);
router.get('/activities', getRecentActivities);

module.exports = router;