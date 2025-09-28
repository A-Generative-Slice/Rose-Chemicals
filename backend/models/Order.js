const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  paymentInfo: {
    id: String,
    status: String,
    method: String
  },
  totalAmount: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  orderNotes: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  cancelledAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
