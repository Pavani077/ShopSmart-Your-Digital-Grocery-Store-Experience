const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, optionalAuth, admin, moderator } = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 12, 
    category, 
    brand, 
    minPrice, 
    maxPrice, 
    rating, 
    sort = 'newest',
    featured,
    trending,
    bestSeller,
    q
  } = req.query;

  let query = { status: 'active' };

  // Text search
  if (q) {
    query.$text = { $search: q };
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Brand filter
  if (brand) {
    query.brand = { $regex: brand, $options: 'i' };
  }

  // Price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Rating filter
  if (rating) {
    query.rating = { $gte: parseFloat(rating) };
  }

  // Special filters
  if (featured === 'true') query.featured = true;
  if (trending === 'true') query.trending = true;
  if (bestSeller === 'true') query.bestSeller = true;

  // Sort options
  let sortOption = {};
  switch (sort) {
    case 'price_asc':
      sortOption = { price: 1 };
      break;
    case 'price_desc':
      sortOption = { price: -1 };
      break;
    case 'rating':
      sortOption = { rating: -1 };
      break;
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'popular':
      sortOption = { reviewCount: -1 };
      break;
    case 'name_asc':
      sortOption = { name: 1 };
      break;
    case 'name_desc':
      sortOption = { name: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const products = await Product.find(query)
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

  const total = await Product.countDocuments(query);

  // Add to recently viewed if user is authenticated
  if (req.user && req.query.viewed) {
    await req.user.addToRecentlyViewed(req.query.viewed);
  }

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNextPage: skip + products.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    }
  });
}));

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'firstName lastName avatar'
      }
    })
    .select('-__v');

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Add to recently viewed if user is authenticated
  if (req.user) {
    await req.user.addToRecentlyViewed(req.params.id);
  }

  res.json({
    success: true,
    data: product
  });
}));

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
router.get('/slug/:slug', optionalAuth, asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'firstName lastName avatar'
      }
    })
    .select('-__v');

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Add to recently viewed if user is authenticated
  if (req.user) {
    await req.user.addToRecentlyViewed(product._id);
  }

  res.json({
    success: true,
    data: product
  });
}));

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', [
  protect,
  admin,
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Product description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
}));

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', [
  protect,
  admin,
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Product description cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().isMongoId().withMessage('Valid category ID is required'),
  body('brand').optional().trim().notEmpty().withMessage('Brand cannot be empty'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.json({
    success: true,
    data: product
  });
}));

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  await product.remove();

  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
}));

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', [
  protect,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Review title must be between 3 and 100 characters'),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Review comment must be between 10 and 1000 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Check if user already reviewed this product
  const alreadyReviewed = product.reviews.find(
    review => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return res.status(400).json({
      success: false,
      message: 'Product already reviewed'
    });
  }

  const review = {
    user: req.user._id,
    rating: req.body.rating,
    title: req.body.title,
    comment: req.body.comment,
    verified: true // Assuming user has purchased the product
  };

  product.reviews.push(review);
  await product.updateRating();
  await product.save();

  // Populate user info for response
  const populatedProduct = await Product.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'firstName lastName avatar'
      }
    });

  res.status(201).json({
    success: true,
    data: populatedProduct.reviews[populatedProduct.reviews.length - 1]
  });
}));

// @desc    Update product review
// @route   PUT /api/products/:id/reviews/:reviewId
// @access  Private
router.put('/:id/reviews/:reviewId', [
  protect,
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Review title must be between 3 and 100 characters'),
  body('comment').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Review comment must be between 10 and 1000 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const review = product.reviews.id(req.params.reviewId);
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  // Check if user owns the review or is admin
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this review'
    });
  }

  // Update review fields
  if (req.body.rating) review.rating = req.body.rating;
  if (req.body.title) review.title = req.body.title;
  if (req.body.comment) review.comment = req.body.comment;

  await product.updateRating();
  await product.save();

  // Populate user info for response
  const populatedProduct = await Product.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'firstName lastName avatar'
      }
    });

  const updatedReview = populatedProduct.reviews.id(req.params.reviewId);

  res.json({
    success: true,
    data: updatedReview
  });
}));

// @desc    Delete product review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
router.delete('/:id/reviews/:reviewId', protect, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const review = product.reviews.id(req.params.reviewId);
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  // Check if user owns the review or is admin
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this review'
    });
  }

  review.remove();
  await product.updateRating();
  await product.save();

  res.json({
    success: true,
    message: 'Review deleted successfully'
  });
}));

// @desc    Mark review as helpful
// @route   POST /api/products/:id/reviews/:reviewId/helpful
// @access  Private
router.post('/:id/reviews/:reviewId/helpful', protect, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const review = product.reviews.id(req.params.reviewId);
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  const helpfulIndex = review.helpful.indexOf(req.user._id);
  if (helpfulIndex > -1) {
    // Remove helpful vote
    review.helpful.splice(helpfulIndex, 1);
  } else {
    // Add helpful vote
    review.helpful.push(req.user._id);
  }

  await product.save();

  res.json({
    success: true,
    data: {
      helpful: review.helpful.length,
      isHelpful: helpfulIndex === -1
    }
  });
}));

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
router.get('/:id/related', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const relatedProducts = await Product.find({
    _id: { $ne: req.params.id },
    status: 'active',
    $or: [
      { category: product.category },
      { brand: product.brand },
      { tags: { $in: product.tags } }
    ]
  })
    .populate('category', 'name slug')
    .limit(8)
    .select('name price images rating discount brand');

  res.json({
    success: true,
    data: relatedProducts
  });
}));

// @desc    Get product statistics
// @route   GET /api/products/stats
// @access  Private/Admin
router.get('/stats', protect, admin, asyncHandler(async (req, res) => {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        averagePrice: { $avg: '$price' },
        totalValue: { $sum: '$price' },
        lowStock: {
          $sum: {
            $cond: [{ $lte: ['$stock', 10] }, 1, 0]
          }
        }
      }
    }
  ]);

  const categoryStats = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        averagePrice: { $avg: '$price' }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'categoryInfo'
      }
    },
    {
      $unwind: '$categoryInfo'
    },
    {
      $project: {
        categoryName: '$categoryInfo.name',
        count: 1,
        averagePrice: 1
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || {},
      byCategory: categoryStats
    }
  });
}));

module.exports = router; 