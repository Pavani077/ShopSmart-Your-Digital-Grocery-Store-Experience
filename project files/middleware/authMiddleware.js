const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

// Protect routes - require authentication
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (!req.user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Optional authentication - doesn't require token but sets user if available
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token is invalid, but we don't throw an error
      console.log('Optional auth token invalid:', error.message);
    }
  }

  next();
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
};

// Moderator middleware
const moderator = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'moderator')) {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as moderator' });
  }
};

// Check if user owns resource or is admin
const authorize = (resourceUserId) => {
  return (req, res, next) => {
    if (req.user.role === 'admin') {
      return next();
    }
    
    if (req.user._id.toString() === resourceUserId.toString()) {
      return next();
    }
    
    return res.status(403).json({ message: 'Not authorized to access this resource' });
  };
};

// Rate limiting for login attempts
const loginAttempts = {};

const checkLoginAttempts = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes

  if (!loginAttempts[ip]) {
    loginAttempts[ip] = { count: 0, resetTime: now + windowMs };
  }

  if (now > loginAttempts[ip].resetTime) {
    loginAttempts[ip] = { count: 0, resetTime: now + windowMs };
  }

  if (loginAttempts[ip].count >= 5) {
    return res.status(429).json({ 
      message: 'Too many login attempts. Please try again later.' 
    });
  }

  next();
};

const incrementLoginAttempts = (req, res, next) => {
  const ip = req.ip;
  if (loginAttempts[ip]) {
    loginAttempts[ip].count++;
  }
  next();
};

const resetLoginAttempts = (req, res, next) => {
  const ip = req.ip;
  if (loginAttempts[ip]) {
    loginAttempts[ip].count = 0;
  }
  next();
};

module.exports = {
  generateToken,
  protect,
  optionalAuth,
  admin,
  moderator,
  authorize,
  checkLoginAttempts,
  incrementLoginAttempts,
  resetLoginAttempts
};