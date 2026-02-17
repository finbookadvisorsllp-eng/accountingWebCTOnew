const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  changePassword,
  activateClient,
  resetUserPassword,
  logout
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const { validate, userValidation } = require('../middleware/validation');

// Public routes
router.post('/login', validate(userValidation.login), login);

// Protected routes
router.use(protect);

// Auth routes
router.get('/me', getMe);
router.post('/logout', logout);
router.post('/change-password', validate(userValidation.changePassword), changePassword);

// CA-only routes
router.post('/register', authorize('CA', 'ACCOUNTANT'), validate(userValidation.register), register);
router.post('/activate-client', authorize('CA'), activateClient);
router.post('/reset-password', authorize('CA'), resetUserPassword);

module.exports = router;
