const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Search route (should be before /:id route)
router.get('/search', searchEmployees);

// CRUD routes
router.route('/')
  .get(getAllEmployees)
  .post(authorize('admin', 'hr'), createEmployee);

router.route('/:id')
  .get(getEmployee)
  .put(authorize('admin', 'hr'), updateEmployee)
  .delete(authorize('admin', 'hr'), deleteEmployee);

module.exports = router;
