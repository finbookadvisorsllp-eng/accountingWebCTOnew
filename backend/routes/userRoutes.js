const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  assignSubordinate,
  removeSubordinate,
  getHierarchy
} = require('../controllers/userController');
const { protect, authorize, logAudit } = require('../middleware/auth');
const { validate, userValidation } = require('../middleware/validation');

// Apply protection to all routes
router.use(protect);

// User CRUD routes
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', validate(userValidation.updateProfile), logAudit('USER_UPDATE', 'USER'), updateUser);
router.delete('/:id', authorize('CA'), logAudit('USER_DELETE', 'USER'), deleteUser);

// Assignment routes
router.post('/:id/assign', validate(userValidation.assignSubordinate), assignSubordinate);
router.delete('/:id/subordinates/:subordinateId', removeSubordinate);

// Hierarchy routes
router.get('/hierarchy/tree', getHierarchy);

module.exports = router;