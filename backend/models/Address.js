const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\+?[\d\s\-\(\)]{10,}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v);
      },
      message: 'Please enter a valid 6-digit postal code'
    }
  },
  country: {
    type: String,
    required: true,
    default: 'India',
    trim: true
  },
  type: {
    type: String,
    enum: ['home', 'office', 'other'],
    default: 'home'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
addressSchema.index({ user: 1 });
addressSchema.index({ user: 1, isDefault: 1 });

// Middleware to ensure only one default address per user
addressSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    // Remove default flag from other addresses of the same user
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// Static method to get user's default address
addressSchema.statics.getDefaultAddress = function(userId) {
  return this.findOne({ user: userId, isDefault: true });
};

// Static method to set default address
addressSchema.statics.setDefaultAddress = async function(userId, addressId) {
  // Remove default from all addresses
  await this.updateMany(
    { user: userId },
    { $set: { isDefault: false } }
  );
  
  // Set the specified address as default
  return this.findByIdAndUpdate(
    addressId,
    { $set: { isDefault: true } },
    { new: true }
  );
};

// Instance method to format address for display
addressSchema.methods.getFormattedAddress = function() {
  return {
    line1: this.street,
    line2: `${this.city}, ${this.state} ${this.postalCode}`,
    line3: this.country,
    full: `${this.street}, ${this.city}, ${this.state} ${this.postalCode}, ${this.country}`
  };
};

// Virtual for full address
addressSchema.virtual('fullAddress').get(function() {
  return `${this.street}, ${this.city}, ${this.state} ${this.postalCode}, ${this.country}`;
});

// Ensure virtual fields are serialized
addressSchema.set('toJSON', { virtuals: true });
addressSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Address', addressSchema);
