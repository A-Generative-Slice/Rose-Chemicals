const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    notifyOnSale: {
      type: Boolean,
      default: false
    },
    notifyOnStock: {
      type: Boolean,
      default: false
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: 'My Wishlist',
    maxlength: 50
  },
  description: {
    type: String,
    maxlength: 200
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one wishlist per user
wishlistSchema.index({ user: 1 }, { unique: true });

// Update the updatedAt field before saving
wishlistSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance method to add item to wishlist
wishlistSchema.methods.addItem = function(productId, options = {}) {
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (!existingItem) {
    this.items.push({
      product: productId,
      notifyOnSale: options.notifyOnSale || false,
      notifyOnStock: options.notifyOnStock || false
    });
  }
  
  return this.save();
};

// Instance method to remove item from wishlist
wishlistSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => 
    item.product.toString() !== productId.toString()
  );
  
  return this.save();
};

// Instance method to check if product is in wishlist
wishlistSchema.methods.hasProduct = function(productId) {
  return this.items.some(item => 
    item.product.toString() === productId.toString()
  );
};

// Static method to get or create wishlist for user
wishlistSchema.statics.getOrCreate = async function(userId) {
  let wishlist = await this.findOne({ user: userId }).populate('items.product');
  
  if (!wishlist) {
    wishlist = await this.create({ user: userId });
    await wishlist.populate('items.product');
  }
  
  return wishlist;
};

module.exports = mongoose.model('Wishlist', wishlistSchema);
