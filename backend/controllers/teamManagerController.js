const TeamManager = require('../models/TeamManager');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');

// @desc    Get all team managers
// @route   GET /api/team-managers
// @access  Private
exports.getAllTeamManagers = async (req, res) => {
  try {
    const teamManagers = await TeamManager.find({ isActive: true })
      .populate('employee', 'name employeeCode email mobileNo department')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teamManagers.length,
      data: teamManagers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching team managers',
      error: error.message
    });
  }
};

// @desc    Get single team manager
// @route   GET /api/team-managers/:id
// @access  Private
exports.getTeamManager = async (req, res) => {
  try {
    const teamManager = await TeamManager.findById(req.params.id)
      .populate('employee', 'name employeeCode email mobileNo department')
      .populate('createdBy', 'username');

    if (!teamManager || !teamManager.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Team manager not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teamManager
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching team manager',
      error: error.message
    });
  }
};

// @desc    Create new team manager
// @route   POST /api/team-managers
// @access  Private (Admin/HR)
exports.createTeamManager = async (req, res) => {
  try {
    // Add created by user
    req.body.createdBy = req.user.id;

    // Check if employee exists and is active
    const employee = await Employee.findById(req.body.employee);
    if (!employee || !employee.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found or inactive'
      });
    }

    // Hash password before saving
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const teamManager = await TeamManager.create(req.body);

    // Populate employee details before sending response
    await teamManager.populate('employee', 'name employeeCode email mobileNo department');

    res.status(201).json({
      success: true,
      message: 'Team manager created successfully',
      data: teamManager
    });
  } catch (error) {
    console.error('Error creating team manager:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `This ${field} is already in use`
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating team manager',
      error: error.message
    });
  }
};

// @desc    Update team manager
// @route   PUT /api/team-managers/:id
// @access  Private (Admin/HR)
exports.updateTeamManager = async (req, res) => {
  try {
    let teamManager = await TeamManager.findById(req.params.id);

    if (!teamManager || !teamManager.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Team manager not found'
      });
    }

    // If updating employee, check if new employee exists
    if (req.body.employee) {
      const employee = await Employee.findById(req.body.employee);
      if (!employee || !employee.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found or inactive'
        });
      }
    }

    // Hash password if being updated
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    teamManager = await TeamManager.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('employee', 'name employeeCode email mobileNo department');

    res.status(200).json({
      success: true,
      message: 'Team manager updated successfully',
      data: teamManager
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating team manager',
      error: error.message
    });
  }
};

// @desc    Delete team manager
// @route   DELETE /api/team-managers/:id
// @access  Private (Admin/HR)
exports.deleteTeamManager = async (req, res) => {
  try {
    const teamManager = await TeamManager.findById(req.params.id);

    if (!teamManager) {
      return res.status(404).json({
        success: false,
        message: 'Team manager not found'
      });
    }

    // Hard delete - permanently remove from database
    await TeamManager.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Team manager deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting team manager',
      error: error.message
    });
  }
};
