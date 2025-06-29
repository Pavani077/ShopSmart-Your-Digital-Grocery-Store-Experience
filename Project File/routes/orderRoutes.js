const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect, admin, moderator } = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', [
  protect,
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.firstName').trim().notEmpty().withMessage('First name is required'),
  body('shippingAddress.lastName').trim().notEmpty().withMessage('Last name is required'),
  body('shippingAddress.phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
  body('paymentMethod.type').isIn(['credit_card', 'paypal', 'stripe', 'cash_on_delivery']).withMessage('Invalid payment method'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id })
    .populate('items.product', 'name price images stock availability');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty'
    });
  }

  // Validate stock availability
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${item.product.name}`
      });
    }
  }

  // Create order items
  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.price,
    variant: item.variant,
    image: item.product.images[0]?.url || ''
  }));

  // Create order
  const order = new Order({
    user: req.user._id,
    items: orderItems,
    subtotal: cart.subtotal,
    shippingCost: cart.shippingCost,
    discount: cart.discountAmount,
    coupon: cart.coupon,
    total: cart.total,
    shippingAddress: req.body.shippingAddress,
    billingAddress: req.body.billingAddress || req.body.shippingAddress,
    shippingMethod: cart.shippingMethod,
    paymentMethod: req.body.paymentMethod,
    notes: req.body.notes,
    source: 'web',
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  await order.save();

  // Update product stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity }
    });
  }

  // Clear cart
  await cart.clearCart();

  // Populate order details
  await order.populate('items.product', 'name images');

  res.status(201).json({
    success: true,
    data: order
  });
}));

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  let query = { user: req.user._id };
  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const orders = await Order.find(query)
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    data: {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total,
        hasNextPage: skip + orders.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    }
  });
}));

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'name images rating')
    .populate('user', 'firstName lastName email');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if user owns the order or is admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this order'
    });
  }

  res.json({
    success: true,
    data: order
  });
}));

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', [
  protect,
  body('reason').optional().trim().isLength({ max: 200 }).withMessage('Reason must be less than 200 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const order = await Order.findById(req.params.id)
    .populate('items.product');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if user owns the order or is admin
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to cancel this order'
    });
  }

  try {
    await order.cancelOrder(req.body.reason);

    // Restore product stock if order was cancelled
    if (order.status === 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: item.quantity }
        });
      }
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}));

// @desc    Get order tracking
// @route   GET /api/orders/:id/tracking
// @access  Private
router.get('/:id/tracking', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if user owns the order or is admin
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this order'
    });
  }

  res.json({
    success: true,
    data: {
      orderNumber: order.orderNumber,
      status: order.status,
      statusHistory: order.statusHistory,
      shippingMethod: order.shippingMethod,
      estimatedDelivery: order.estimatedDelivery,
      actualDelivery: order.actualDelivery
    }
  });
}));

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private
router.get('/stats', protect, asyncHandler(async (req, res) => {
  const stats = await Order.getStats(req.user._id);

  res.json({
    success: true,
    data: stats
  });
}));

// @desc    Get recent orders
// @route   GET /api/orders/recent
// @access  Private
router.get('/recent', protect, asyncHandler(async (req, res) => {
  const orders = await Order.getRecentOrders(req.user._id, 5);

  res.json({
    success: true,
    data: orders
  });
}));

// ========== ADMIN ROUTES ==========

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, admin, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, user, dateFrom, dateTo } = req.query;

  let query = {};
  if (status) query.status = status;
  if (user) query.user = user;
  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
    if (dateTo) query.createdAt.$lte = new Date(dateTo);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const orders = await Order.find(query)
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    data: {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total,
        hasNextPage: skip + orders.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    }
  });
}));

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', [
  protect,
  admin,
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned']).withMessage('Invalid status'),
  body('note').optional().trim().isLength({ max: 200 }).withMessage('Note must be less than 200 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  await order.updateStatus(req.body.status, req.body.note, req.user._id);

  res.json({
    success: true,
    data: order
  });
}));

// @desc    Add tracking information (admin)
// @route   PUT /api/orders/:id/tracking
// @access  Private/Admin
router.put('/:id/tracking', [
  protect,
  admin,
  body('trackingNumber').trim().notEmpty().withMessage('Tracking number is required'),
  body('carrier').trim().notEmpty().withMessage('Carrier is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  await order.addTracking(req.body.trackingNumber, req.body.carrier);

  res.json({
    success: true,
    data: order
  });
}));

// @desc    Mark order as delivered (admin)
// @route   PUT /api/orders/:id/delivered
// @access  Private/Admin
router.put('/:id/delivered', protect, admin, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  await order.markAsDelivered();

  res.json({
    success: true,
    data: order
  });
}));

// @desc    Process refund (admin)
// @route   PUT /api/orders/:id/refund
// @access  Private/Admin
router.put('/:id/refund', [
  protect,
  admin,
  body('amount').isFloat({ min: 0 }).withMessage('Refund amount must be positive'),
  body('reason').trim().notEmpty().withMessage('Refund reason is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  await order.processRefund(req.body.amount, req.body.reason);

  res.json({
    success: true,
    data: order
  });
}));

// @desc    Get order statistics (admin)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
router.get('/admin/stats', protect, admin, asyncHandler(async (req, res) => {
  const { period = '30' } = req.query;
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - parseInt(period));

  const stats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: daysAgo }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        processingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
        },
        shippedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] }
        },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        }
      }
    }
  ]);

  const dailyStats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: daysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        orders: { $sum: 1 },
        revenue: { $sum: '$total' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || {},
      dailyStats
    }
  });
}));

module.exports = router; 