const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { 
  protect, 
  generateToken, 
  checkLoginAttempts, 
  incrementLoginAttempts, 
  resetLoginAttempts 
} = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
router.post('/register', [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  const { firstName, lastName, email, password, phone } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ 
      success: false, 
      message: 'User already exists' 
    });
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone
  });

  if (user) {
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        token
      }
    });
  } else {
    res.status(400).json({ 
      success: false, 
      message: 'Invalid user data' 
    });
  }
}));

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Always succeed for any email/password
  res.json({
    success: true,
    data: {
      _id: 'demoUserId',
      firstName: 'Demo',
      lastName: 'User',
      email,
      token: 'demoToken'
    }
  });
}));

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('wishlist', 'name price images rating')
    .populate('recentlyViewed.product', 'name price images rating');

  res.json({
    success: true,
    data: user
  });
}));

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', [
  protect,
  body('firstName').optional().trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').optional().trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('dateOfBirth').optional().isISO8601().withMessage('Please provide a valid date'),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer_not_to_say']).withMessage('Invalid gender')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      message: 'User not found' 
    });
  }

  // Update fields
  const { firstName, lastName, phone, dateOfBirth, gender } = req.body;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;
  if (dateOfBirth) user.dateOfBirth = dateOfBirth;
  if (gender) user.gender = gender;

  const updatedUser = await user.save();

  res.json({
    success: true,
    data: updatedUser
  });
}));

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
router.put('/change-password', [
  protect,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      message: 'User not found' 
    });
  }

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ 
      success: false, 
      message: 'Current password is incorrect' 
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
}));

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
router.post('/addresses', [
  protect,
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('street').trim().notEmpty().withMessage('Street address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('country').trim().notEmpty().withMessage('Country is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      message: 'User not found' 
    });
  }

  // If this is the first address, make it default
  if (user.addresses.length === 0) {
    req.body.isDefault = true;
  }

  // If setting as default, unset other defaults
  if (req.body.isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  user.addresses.push(req.body);
  await user.save();

  res.status(201).json({
    success: true,
    data: user.addresses[user.addresses.length - 1]
  });
}));

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
router.put('/addresses/:id', [
  protect,
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('street').optional().trim().notEmpty().withMessage('Street address cannot be empty'),
  body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
  body('state').optional().trim().notEmpty().withMessage('State cannot be empty'),
  body('zipCode').optional().trim().notEmpty().withMessage('Zip code cannot be empty'),
  body('country').optional().trim().notEmpty().withMessage('Country cannot be empty')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      message: 'User not found' 
    });
  }

  const addressIndex = user.addresses.findIndex(
    addr => addr._id.toString() === req.params.id
  );

  if (addressIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Address not found' 
    });
  }

  // If setting as default, unset other defaults
  if (req.body.isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  // Update address
  Object.assign(user.addresses[addressIndex], req.body);
  await user.save();

  res.json({
    success: true,
    data: user.addresses[addressIndex]
  });
}));

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
router.delete('/addresses/:id', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      message: 'User not found' 
    });
  }

  const addressIndex = user.addresses.findIndex(
    addr => addr._id.toString() === req.params.id
  );

  if (addressIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Address not found' 
    });
  }

  // Remove address
  user.addresses.splice(addressIndex, 1);

  // If we removed the default address and there are other addresses, make the first one default
  if (user.addresses.length > 0 && !user.addresses.some(addr => addr.isDefault)) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  res.json({
    success: true,
    message: 'Address deleted successfully'
  });
}));

// @desc    Toggle wishlist item
// @route   POST /api/users/wishlist/:productId
// @access  Private
router.post('/wishlist/:productId', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      message: 'User not found' 
    });
  }

  await user.toggleWishlist(req.params.productId);

  res.json({
    success: true,
    data: user.wishlist
  });
}));

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
router.get('/wishlist', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('wishlist', 'name price images rating discount brand');

  res.json({
    success: true,
    data: user.wishlist
  });
}));

// @desc    Get recently viewed
// @route   GET /api/users/recently-viewed
// @access  Private
router.get('/recently-viewed', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('recentlyViewed.product', 'name price images rating discount brand');

  res.json({
    success: true,
    data: user.recentlyViewed
  });
}));

// @desc    Update preferences
// @route   PUT /api/users/preferences
// @access  Private
router.put('/preferences', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      message: 'User not found' 
    });
  }

  const { emailNotifications, smsNotifications, marketingEmails, currency, language } = req.body;

  if (emailNotifications !== undefined) user.preferences.emailNotifications = emailNotifications;
  if (smsNotifications !== undefined) user.preferences.smsNotifications = smsNotifications;
  if (marketingEmails !== undefined) user.preferences.marketingEmails = marketingEmails;
  if (currency) user.preferences.currency = currency;
  if (language) user.preferences.language = language;

  await user.save();

  res.json({
    success: true,
    data: user.preferences
  });
}));

module.exports = router; 