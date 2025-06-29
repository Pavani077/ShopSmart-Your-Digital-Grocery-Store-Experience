const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  variant: {
    name: String,
    value: String,
    price: Number
  },
  price: {
    type: Number,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  guestId: {
    type: String,
    unique: true,
    sparse: true
  },
  items: [cartItemSchema],
  coupon: {
    code: String,
    discount: Number,
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    }
  },
  shippingAddress: {
    firstName: String,
    lastName: String,
    phone: String,
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
    estimatedDays: String
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'stripe', 'cash_on_delivery'],
    default: 'credit_card'
  },
  notes: String,
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }
  }
}, {
  timestamps: true
});

// Virtual for subtotal
cartSchema.virtual('subtotal').get(function() {
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});

// Virtual for shipping cost
cartSchema.virtual('shippingCost').get(function() {
  return this.shippingMethod ? this.shippingMethod.price : 0;
});

// Virtual for discount amount
cartSchema.virtual('discountAmount').get(function() {
  if (!this.coupon) return 0;
  
  const subtotal = this.subtotal;
  if (this.coupon.type === 'percentage') {
    return (subtotal * this.coupon.discount) / 100;
  } else {
    return Math.min(this.coupon.discount, subtotal);
  }
});

// Virtual for total
cartSchema.virtual('total').get(function() {
  const subtotal = this.subtotal;
  const shippingCost = this.shippingCost;
  const discountAmount = this.discountAmount;
  
  return subtotal + shippingCost - discountAmount;
});

// Virtual for item count
cartSchema.virtual('itemCount').get(function() {
  return this.items.reduce((count, item) => count + item.quantity, 0);
});

// Indexes
cartSchema.index({ user: 1 });
cartSchema.index({ guestId: 1 });
cartSchema.index({ expiresAt: 1 });

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity = 1, variant = null) {
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString() &&
    (!variant || (item.variant && 
     item.variant.name === variant.name && 
     item.variant.value === variant.value))
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      product: productId,
      quantity,
      variant,
      price: variant ? variant.price : 0 // Will be populated when saving
    });
  }
  
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(itemId, quantity) {
  const item = this.items.id(itemId);
  if (item) {
    if (quantity <= 0) {
      this.items.pull(itemId);
    } else {
      item.quantity = quantity;
    }
  }
  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(itemId) {
  this.items.pull(itemId);
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.coupon = null;
  return this.save();
};

// Method to apply coupon
cartSchema.methods.applyCoupon = function(couponCode) {
  // This would typically validate the coupon against a Coupon model
  // For now, we'll use a simple example
  if (couponCode === 'SAVE10') {
    this.coupon = {
      code: couponCode,
      discount: 10,
      type: 'percentage'
    };
  } else if (couponCode === 'SAVE5') {
    this.coupon = {
      code: couponCode,
      discount: 5,
      type: 'fixed'
    };
  }
  return this.save();
};

// Method to remove coupon
cartSchema.methods.removeCoupon = function() {
  this.coupon = null;
  return this.save();
};

// Static method to find or create cart for user
cartSchema.statics.findOrCreateForUser = async function(userId) {
  let cart = await this.findOne({ user: userId });
  
  if (!cart) {
    cart = new this({ user: userId });
    await cart.save();
  }
  
  return cart;
};

// Static method to find or create cart for guest
cartSchema.statics.findOrCreateForGuest = async function(guestId) {
  let cart = await this.findOne({ guestId });
  
  if (!cart) {
    cart = new this({ guestId });
    await cart.save();
  }
  
  return cart;
};

// Pre-save middleware to populate product prices
cartSchema.pre('save', async function(next) {
  if (this.isModified('items')) {
    const Product = mongoose.model('Product');
    
    for (let item of this.items) {
      if (!item.price) {
        try {
          const product = await Product.findById(item.product);
          if (product) {
            item.price = item.variant ? item.variant.price : product.discountedPrice || product.price;
          }
        } catch (error) {
          console.error('Error populating product price:', error);
        }
      }
    }
  }
  next();
});

module.exports = mongoose.model('Cart', cartSchema);