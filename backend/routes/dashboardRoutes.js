const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Dashboard stats route
router.get('/stats', getDashboardStats);

module.exports = router;
