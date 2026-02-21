const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TeamManager = require('../models/TeamManager');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists or is inactive'
      });
    }

    const isFirstLoginPasswordChangeRoute =
      req.baseUrl === '/api/auth' && req.path === '/first-login-password-change';

    if (
      req.user.role === 'manager' &&
      req.user.isFirstLogin &&
      !isFirstLoginPasswordChangeRoute
    ) {
      return res.status(403).json({
        success: false,
        message: 'Password change required before accessing this resource'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      error: error.message
    });
  }
};

// Protect manager routes - verify JWT token for managers
exports.protectManager = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get manager from token
    req.user = await TeamManager.findById(decoded.id).select('-password');

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Manager no longer exists or is inactive'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      error: error.message
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    const allowedRoles = roles
      .filter((role) => typeof role === 'string')
      .map((role) => role.trim().toLowerCase());

    const currentRole = typeof req.user?.role === 'string'
      ? req.user.role.trim().toLowerCase()
      : '';

    if (!allowedRoles.includes(currentRole)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};
