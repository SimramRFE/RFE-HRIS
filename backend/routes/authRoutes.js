const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  managerLogin,
  changePassword,
  firstLoginPasswordChange,
  getMe,
  getManagerMe,
  checkAdminExists
} = require('../controllers/authController');
const { protect, protectManager } = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/manager-login', managerLogin);
router.get('/admin-exists', checkAdminExists);

// Protected routes
router.put('/first-login-password-change', protect, firstLoginPasswordChange);
router.put('/change-password', protect, changePassword);
router.get('/me', protect, getMe);
router.get('/manager-me', protectManager, getManagerMe);

module.exports = router;
