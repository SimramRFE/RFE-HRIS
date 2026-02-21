const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  managerLogin,
  changePassword,
  resetOwnAdminPassword,
  firstLoginPasswordChange,
  getMe,
  getManagerMe,
  checkAdminExists,
  createManager,
  getManagers,
  updateManagerStatus,
  deleteManager,
  resetManagerPassword
} = require('../controllers/authController');
const { protect, protectManager, authorize } = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/manager-login', managerLogin);
router.get('/admin-exists', checkAdminExists);

// Protected routes
router.put('/first-login-password-change', protect, firstLoginPasswordChange);
router.put('/change-password', protect, changePassword);
router.put('/admin/reset-password', protect, authorize('admin'), resetOwnAdminPassword);
router.put('/reset-password', protect, authorize('admin'), resetOwnAdminPassword);
router.post('/reset-password', protect, authorize('admin'), resetOwnAdminPassword);
router.get('/me', protect, getMe);
router.get('/manager-me', protectManager, getManagerMe);
router.post('/create-manager', protect, authorize('admin', 'hr'), createManager);
router.get('/managers', protect, authorize('admin'), getManagers);
router.put('/managers/:id/status', protect, authorize('admin'), updateManagerStatus);
router.delete('/managers/:id', protect, authorize('admin'), deleteManager);
router.put('/managers/:id/reset-password', protect, authorize('admin'), resetManagerPassword);

module.exports = router;
