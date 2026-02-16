const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Check if admin exists
// @route   GET /api/auth/admin-exists
// @access  Public
exports.checkAdminExists = async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    res.status(200).json({
      success: true,
      data: {
        exists: !!adminExists
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking admin existence'
    });
  }
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    // Check if an admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(403).json({
        success: false,
        message: 'Admin account already exists. Only one admin is allowed.'
      });
    }

    // Check if user already exists by username or email
    const userExists = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this username or email'
      });
    }

    // Create user with admin role (signup is only for admin)
    const user = await User.create({
      username,
      name,
      email,
      password,
      role: 'admin',
      isFirstLogin: true
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        isFirstLogin: user.isFirstLogin,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Check if user exists (include password and isFirstLogin for comparison)
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        isFirstLogin: user.isFirstLogin,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// @desc    First time password change
// @route   PUT /api/auth/first-login-password-change
// @access  Private
exports.firstLoginPasswordChange = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match'
      });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check old password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect'
      });
    }

    // Update password and set isFirstLogin to false
    user.password = newPassword;
    user.isFirstLogin = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      data: {
        isFirstLogin: false
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};

// @desc    Manager login
// @route   POST /api/auth/manager-login
// @access  Public
exports.managerLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const TeamManager = require('../models/TeamManager');

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Check if manager exists
    const manager = await TeamManager.findOne({ username: username.toLowerCase() })
      .populate('employee', 'name employeeCode department personalEmail')
      .select('+password');

    if (!manager) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if manager is active
    if (!manager.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator'
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token with manager ID
    const token = generateToken(manager._id);

    res.status(200).json({
      success: true,
      message: 'Manager login successful',
      data: {
        id: manager._id,
        username: manager.username,
        teamName: manager.teamName,
        employeeName: manager.employee?.name,
        employeeCode: manager.employee?.employeeCode,
        department: manager.employee?.department,
        budgetAllocated: manager.budgetAllocated,
        role: 'manager',
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
};

// @desc    Get current manager
// @route   GET /api/auth/manager-me
// @access  Private (Manager)
exports.getManagerMe = async (req, res) => {
  try {
    const TeamManager = require('../models/TeamManager');
    const manager = await TeamManager.findById(req.user.id).populate('employee', 'name employeeCode');

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: 'Manager not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: manager._id,
        username: manager.username,
        teamName: manager.teamName,
        employeeName: manager.employee?.name,
        employeeCode: manager.employee?.employeeCode,
        department: manager.department,
        budgetAllocated: manager.budgetAllocated,
        budgetSpent: manager.budgetSpent,
        role: manager.role,
        isActive: manager.isActive
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching manager data',
      error: error.message
    });
  }
};
