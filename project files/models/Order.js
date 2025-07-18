const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  variant: {
    name: String,
    value: String
  },
  image: String
});

const orderStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
      'returned'
    ],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  coupon: {
    code: String,
    discount: Number,
    type: String
  },
  total: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
      'returned'
    ],
    default: 'pending'
  },
  statusHistory: [orderStatusSchema],
  shippingAddress: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    apartment: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'United States'
    }
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    apartment: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  shippingMethod: {
    name: String,
    price: Number,
    estimatedDays: String,
    trackingNumber: String,
    carrier: String
  },
  paymentMethod: {
    type: {
      type: String,
      enum: ['credit_card', 'paypal', 'stripe', 'cash_on_delivery'],
      required: true
    },
    details: {
      last4: String,
      brand: String,
      expMonth: String,
      expYear: String
    },
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    }
  },
  notes: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  returnPolicy: {
    type: String,
    default: '30 days'
  },
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: String,
  source: {
    type: String,
    enum: ['web', 'mobile', 'admin'],
    default: 'web'
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'paymentMethod.transactionId': 1 });

// Virtual for formatted order number
orderSchema.virtual('formattedOrderNumber').get(function() {
  return `#${this.orderNumber}`;
});

// Virtual for order status color
orderSchema.virtual('statusColor').get(function() {
  const statusColors = {
    pending: '#FFA500',
    confirmed: '#007BFF',
    processing: '#17A2B8',
    shipped: '#28A745',
    delivered: '#28A745',
    cancelled: '#DC3545',
    refunded: '#6C757D',
    returned: '#FFC107'
  };
  return statusColors[this.status] || '#6C757D';
});

// Virtual for isDelivered
orderSchema.virtual('isDelivered').get(function() {
  return this.status === 'delivered';
});

// Virtual for isCancelled
orderSchema.virtual('isCancelled').get(function() {
  return this.status === 'cancelled';
});

// Virtual for canCancel
orderSchema.virtual('canCancel').get(function() {
  return ['pending', 'confirmed', 'processing'].includes(this.status);
});

// Virtual for canReturn
orderSchema.virtual('canReturn').get(function() {
  if (this.status !== 'delivered') return false;
  const deliveryDate = this.actualDelivery || this.updatedAt;
  const daysSinceDelivery = (Date.now() - deliveryDate) / (1000 * 60 * 60 * 24);
  return daysSinceDelivery <= 30; // 30 days return policy
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get count of orders for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    });
    
    const sequence = (count + 1).toString().padStart(4, '0');
    this.orderNumber = `${year}${month}${day}${sequence}`;
    
    // Add initial status to history
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  
  // Update status history if status changed
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy
  });
  return this.save();
};

// Method to add tracking information
orderSchema.methods.addTracking = function(trackingNumber, carrier) {
  this.shippingMethod.trackingNumber = trackingNumber;
  this.shippingMethod.carrier = carrier;
  this.status = 'shipped';
  this.statusHistory.push({
    status: 'shipped',
    timestamp: new Date(),
    note: `Tracking number: ${trackingNumber}`
  });
  return this.save();
};

// Method to mark as delivered
orderSchema.methods.markAsDelivered = function() {
  this.status = 'delivered';
  this.actualDelivery = new Date();
  this.statusHistory.push({
    status: 'delivered',
    timestamp: new Date(),
    note: 'Order delivered successfully'
  });
  return this.save();
};

// Method to cancel order
orderSchema.methods.cancelOrder = function(reason = '') {
  if (!this.canCancel) {
    throw new Error('Order cannot be cancelled in its current status');
  }
  
  this.status = 'cancelled';
  this.statusHistory.push({
    status: 'cancelled',
    timestamp: new Date(),
    note: reason || 'Order cancelled by customer'
  });
  return this.save();
};

// Method to process refund
orderSchema.methods.processRefund = function(amount, reason = '') {
  this.status = 'refunded';
  this.statusHistory.push({
    status: 'refunded',
    timestamp: new Date(),
    note: `Refund processed: $${amount} - ${reason}`
  });
  return this.save();
};

// Static method to get order statistics
orderSchema.statics.getStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' }
      }
    }
  ]);
  
  return stats[0] || { totalOrders: 0, totalSpent: 0, averageOrderValue: 0 };
};

// Static method to get recent orders
orderSchema.statics.getRecentOrders = function(userId, limit = 5) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('items.product', 'name images');
};

module.exports = mongoose.model('Order', orderSchema);