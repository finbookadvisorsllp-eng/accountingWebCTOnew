const express = require('express');
const router = express.Router();
const {
  createBusiness,
  getBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness,
  assignBusiness,
  getBusinessStats
} = require('../controllers/businessController');
const { protect, authorize, logAudit } = require('../middleware/auth');
const { validate, businessValidation } = require('../middleware/validation');

// Apply protection to all routes
router.use(protect);

// Business CRUD routes
router.post('/', validate(businessValidation.create), logAudit('BUSINESS_CREATE', 'BUSINESS'), createBusiness);
router.get('/', getBusinesses);
router.get('/stats', getBusinessStats);
router.get('/:id', getBusiness);
router.put('/:id', validate(businessValidation.update), logAudit('BUSINESS_UPDATE', 'BUSINESS'), updateBusiness);
router.delete('/:id', authorize('CA'), logAudit('BUSINESS_DELETE', 'BUSINESS'), deleteBusiness);

// Assignment routes
router.post('/:id/assign', assignBusiness);

module.exports = router;