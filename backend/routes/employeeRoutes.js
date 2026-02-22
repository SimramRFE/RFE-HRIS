const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  getVisaCountries
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Search route (should be before /:id route)
router.get('/search', searchEmployees);
router.get('/visa-countries', getVisaCountries);

// CRUD routes
router.route('/')
  .get(getAllEmployees)
  .post(authorize('admin', 'hr', 'manager'), createEmployee);

router.route('/:id')
  .get(getEmployee)
  .put(authorize('admin', 'hr', 'manager'), updateEmployee)
  .delete(authorize('admin', 'hr'), deleteEmployee);

module.exports = router;
