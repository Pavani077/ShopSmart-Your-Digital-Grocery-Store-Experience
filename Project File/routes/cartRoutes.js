const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { v4: uuidv4 } = require('uuid');

// @desc    Get cart
// @route   GET /api/cart
// @access  Private
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  let cart;

  if (req.user) {
    // User cart
    cart = await Cart.findOrCreateForUser(req.user._id);
  } else {
    // Guest cart
    const guestId = req.headers['guest-id'] || req.cookies?.guestId;
    if (!guestId) {
      return res.json({
        success: true,
        data: {
          items: [],
          subtotal: 0,
          shippingCost: 0,
          discountAmount: 0,
          total: 0,
          itemCount: 0
        }
      });
    }
    cart = await Cart.findOrCreateForGuest(guestId);
  }

  // Populate product details
  await cart.populate('items.product', 'name price images rating discount brand stock availability');

  res.json({
    success: true,
    data: {
      _id: cart._id,
      items: cart.items,
      subtotal: cart.subtotal,
      shippingCost: cart.shippingCost,
      discountAmount: cart.discountAmount,
      total: cart.total,
      itemCount: cart.itemCount,
      coupon: cart.coupon,
      shippingAddress: cart.shippingAddress,
      shippingMethod: cart.shippingMethod,
      paymentMethod: cart.paymentMethod,
      notes: cart.notes
    }
  });
}));

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
router.post('/items', [
  optionalAuth,
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('variant').optional().isObject().withMessage('Variant must be an object')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { productId, quantity, variant } = req.body;

  // Check if product exists and is available
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  if (product.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: 'Product is not available'
    });
  }

  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient stock'
    });
  }

  let cart;

  if (req.user) {
    // User cart
    cart = await Cart.findOrCreateForUser(req.user._id);
  } else {
    // Guest cart
    let guestId = req.headers['guest-id'] || req.cookies?.guestId;
    if (!guestId) {
      guestId = uuidv4();
      res.cookie('guestId', guestId, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
    }
    cart = await Cart.findOrCreateForGuest(guestId);
  }

  // Add item to cart
  await cart.addItem(productId, quantity, variant);

  // Populate product details
  await cart.populate('items.product', 'name price images rating discount brand stock availability');

  res.json({
    success: true,
    data: {
      _id: cart._id,
      items: cart.items,
      subtotal: cart.subtotal,
      shippingCost: cart.shippingCost,
      discountAmount: cart.discountAmount,
      total: cart.total,
      itemCount: cart.itemCount
    }
  });
}));

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private
router.put('/items/:itemId', [
  optionalAuth,
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be non-negative')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { quantity } = req.body;

  let cart;

  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id });
  } else {
    const guestId = req.headers['guest-id'] || req.cookies?.guestId;
    if (!guestId) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    cart = await Cart.findOne({ guestId });
  }

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  // Update item quantity
  await cart.updateItemQuantity(req.params.itemId, quantity);

  // Populate product details
  await cart.populate('items.product', 'name price images rating discount brand stock availability');

  res.json({
    success: true,
    data: {
      _id: cart._id,
      items: cart.items,
      subtotal: cart.subtotal,
      shippingCost: cart.shippingCost,
      discountAmount: cart.discountAmount,
      total: cart.total,
      itemCount: cart.itemCount
    }
  });
}));

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
router.delete('/items/:itemId', optionalAuth, asyncHandler(async (req, res) => {
  let cart;

  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id });
  } else {
    const guestId = req.headers['guest-id'] || req.cookies?.guestId;
    if (!guestId) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    cart = await Cart.findOne({ guestId });
  }

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  // Remove item from cart
  await cart.removeItem(req.params.itemId);

  // Populate product details
  await cart.populate('items.product', 'name price images rating discount brand stock availability');

  res.json({
    success: true,
    data: {
      _id: cart._id,
      items: cart.items,
      subtotal: cart.subtotal,
      shippingCost: cart.shippingCost,
      discountAmount: cart.discountAmount,
      total: cart.total,
      itemCount: cart.itemCount
    }
  });
}));

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', optionalAuth, asyncHandler(async (req, res) => {
  let cart;

  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id });
  } else {
    const guestId = req.headers['guest-id'] || req.cookies?.guestId;
    if (!guestId) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    cart = await Cart.findOne({ guestId });
  }

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  // Clear cart
  await cart.clearCart();

  res.json({
    success: true,
    message: 'Cart cleared successfully'
  });
}));

// @desc    Apply coupon
// @route   POST /api/cart/coupon
// @access  Private
router.post('/coupon', [
  optionalAuth,
  body('code').trim().notEmpty().withMessage('Coupon code is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { code } = req.body;

  let cart;

  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id });
  } else {
    const guestId = req.headers['guest-id'] || req.cookies?.guestId;
    if (!guestId) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    cart = await Cart.findOne({ guestId });
  }

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  if (cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty'
    });
  }

  // Apply coupon
  await cart.applyCoupon(code);

  // Populate product details
  await cart.populate('items.product', 'name price images rating discount brand stock availability');

  res.json({
    success: true,
    data: {
      _id: cart._id,
      items: cart.items,
      subtotal: cart.subtotal,
      shippingCost: cart.shippingCost,
      discountAmount: cart.discountAmount,
      total: cart.total,
      itemCount: cart.itemCount,
      coupon: cart.coupon
    }
  });
}));

// @desc    Remove coupon
// @route   DELETE /api/cart/coupon
// @access  Private
router.delete('/coupon', optionalAuth, asyncHandler(async (req, res) => {
  let cart;

  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id });
  } else {
    const guestId = req.headers['guest-id'] || req.cookies?.guestId;
    if (!guestId) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    cart = await Cart.findOne({ guestId });
  }

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  // Remove coupon
  await cart.removeCoupon();

  // Populate product details
  await cart.populate('items.product', 'name price images rating discount brand stock availability');

  res.json({
    success: true,
    data: {
      _id: cart._id,
      items: cart.items,
      subtotal: cart.subtotal,
      shippingCost: cart.shippingCost,
      discountAmount: cart.discountAmount,
      total: cart.total,
      itemCount: cart.itemCount,
      coupon: cart.coupon
    }
  });
}));

// @desc    Update shipping address
// @route   PUT /api/cart/shipping-address
// @access  Private
router.put('/shipping-address', [
  optionalAuth,
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

  let cart;

  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id });
  } else {
    const guestId = req.headers['guest-id'] || req.cookies?.guestId;
    if (!guestId) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    cart = await Cart.findOne({ guestId });
  }

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  // Update shipping address
  cart.shippingAddress = req.body;
  await cart.save();

  res.json({
    success: true,
    data: {
      shippingAddress: cart.shippingAddress
    }
  });
}));

// @desc    Update shipping method
// @route   PUT /api/cart/shipping-method
// @access  Private
router.put('/shipping-method', [
  optionalAuth,
  body('name').trim().notEmpty().withMessage('Shipping method name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Shipping price must be non-negative'),
  body('estimatedDays').trim().notEmpty().withMessage('Estimated delivery days is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  let cart;

  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id });
  } else {
    const guestId = req.headers['guest-id'] || req.cookies?.guestId;
    if (!guestId) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    cart = await Cart.findOne({ guestId });
  }

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  // Update shipping method
  cart.shippingMethod = req.body;
  await cart.save();

  res.json({
    success: true,
    data: {
      shippingMethod: cart.shippingMethod,
      total: cart.total
    }
  });
}));

// @desc    Update payment method
// @route   PUT /api/cart/payment-method
// @access  Private
router.put('/payment-method', [
  optionalAuth,
  body('method').isIn(['credit_card', 'paypal', 'stripe', 'cash_on_delivery']).withMessage('Invalid payment method')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  let cart;

  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id });
  } else {
    const guestId = req.headers['guest-id'] || req.cookies?.guestId;
    if (!guestId) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    cart = await Cart.findOne({ guestId });
  }

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  // Update payment method
  cart.paymentMethod = req.body.method;
  await cart.save();

  res.json({
    success: true,
    data: {
      paymentMethod: cart.paymentMethod
    }
  });
}));

// @desc    Update cart notes
// @route   PUT /api/cart/notes
// @access  Private
router.put('/notes', [
  optionalAuth,
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  let cart;

  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id });
  } else {
    const guestId = req.headers['guest-id'] || req.cookies?.guestId;
    if (!guestId) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    cart = await Cart.findOne({ guestId });
  }

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  // Update notes
  cart.notes = req.body.notes;
  await cart.save();

  res.json({
    success: true,
    data: {
      notes: cart.notes
    }
  });
}));

// @desc    Merge guest cart with user cart
// @route   POST /api/cart/merge
// @access  Private
router.post('/merge', protect, asyncHandler(async (req, res) => {
  const guestId = req.headers['guest-id'] || req.cookies?.guestId;
  
  if (!guestId) {
    return res.json({
      success: true,
      message: 'No guest cart to merge'
    });
  }

  const guestCart = await Cart.findOne({ guestId });
  const userCart = await Cart.findOrCreateForUser(req.user._id);

  if (guestCart && guestCart.items.length > 0) {
    // Merge items from guest cart to user cart
    for (const item of guestCart.items) {
      await userCart.addItem(item.product, item.quantity, item.variant);
    }

    // Delete guest cart
    await guestCart.remove();

    // Clear guest cookie
    res.clearCookie('guestId');
  }

  // Populate product details
  await userCart.populate('items.product', 'name price images rating discount brand stock availability');

  res.json({
    success: true,
    data: {
      _id: userCart._id,
      items: userCart.items,
      subtotal: userCart.subtotal,
      shippingCost: userCart.shippingCost,
      discountAmount: userCart.discountAmount,
      total: userCart.total,
      itemCount: userCart.itemCount
    }
  });
}));

module.exports = router; 