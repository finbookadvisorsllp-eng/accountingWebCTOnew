const express = require('express');
const router = express.Router();
const {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
  assignClient,
  getClientStats
} = require('../controllers/clientController');
const { protect, authorize, logAudit } = require('../middleware/auth');
const { validate, clientValidation } = require('../middleware/validation');

// Apply protection to all routes
router.use(protect);

// Client CRUD routes
router.post('/', authorize('CA'), validate(clientValidation.create), logAudit('CLIENT_CREATE', 'CLIENT'), createClient);
router.get('/', getClients);
router.get('/stats', getClientStats);
router.get('/:id', getClient);
router.put('/:id', validate(clientValidation.update), logAudit('CLIENT_UPDATE', 'CLIENT'), updateClient);
router.delete('/:id', authorize('CA'), logAudit('CLIENT_DELETE', 'CLIENT'), deleteClient);

// Assignment routes
router.post('/:id/assign', validate(clientValidation.assign), assignClient);

module.exports = router;