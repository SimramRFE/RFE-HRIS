const express = require('express');
const router = express.Router();
const {
  getAllTeamManagers,
  getTeamManager,
  createTeamManager,
  updateTeamManager,
  deleteTeamManager
} = require('../controllers/teamManagerController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// CRUD routes
router.route('/')
  .get(getAllTeamManagers)
  .post(authorize('admin', 'hr'), createTeamManager);

router.route('/:id')
  .get(getTeamManager)
  .put(authorize('admin', 'hr'), updateTeamManager)
  .delete(authorize('admin', 'hr'), deleteTeamManager);

module.exports = router;
