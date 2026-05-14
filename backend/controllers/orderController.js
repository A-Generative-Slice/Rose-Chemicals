const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate stock for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }
    }

    // Calculate Pricing Breakdown
    let subtotal = 0;
    let taxAmount = 0;

    const orderItems = cart.items.map(item => {
      const itemTotal = item.product.price * item.quantity;
      const itemTax = (itemTotal * (item.product.gstPercentage || 0)) / 100;

      subtotal += itemTotal;
      taxAmount += itemTax;

      return {
        product: item.product._id,
        productName: item.product.name,
        productImage: item.product.images?.[0]?.url,
        productSku: item.product.sku,
        quantity: item.quantity,
        price: item.product.price,
        itemTax: itemTax
      };
    });

    // Calculate Packing & Delivery Charge (Shipping)
    let shippingCost = 0;
    if (subtotal <= 1000) {
      shippingCost = 100;
    } else if (subtotal <= 2000) {
      shippingCost = 150;
    } else if (subtotal <= 3000) {
      shippingCost = 200;
    } else if (subtotal <= 4000) {
      shippingCost = 250;
    } else {
      shippingCost = 300;
    }

    // Final Total
    const totalAmount = subtotal + taxAmount + shippingCost;

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress: req.body.shippingAddress,
      subtotal,
      taxAmount,
      shippingCost,
      totalAmount,
      orderNotes: req.body.orderNotes
    });

    // Automatically update user profile with shipping info if available
    try {
      // Automatically update user profile with shipping info if available
      try {
        const User = require('../models/User');
        const user = await User.findById(req.user.id);
        let userUpdated = false;

        // Update phone if not present
        if (!user.phone && req.body.shippingAddress?.phone) {
          user.phone = req.body.shippingAddress.phone;
          userUpdated = true;
        }

        // Update address (always update default address with latest used shipping address)
        if (req.body.shippingAddress) {
          const addrData = {
            street: req.body.shippingAddress.street,
            city: req.body.shippingAddress.city,
            state: req.body.shippingAddress.state,
            postalCode: req.body.shippingAddress.postalCode,
            country: req.body.shippingAddress.country || 'India',
            isDefault: true
          };

          if (!user.addresses) user.addresses = [];

          if (user.addresses.length > 0) {
            user.addresses[0] = { ...user.addresses[0].toObject(), ...addrData };
          } else {
            user.addresses.push(addrData);
          }
          userUpdated = true;
        }

        if (userUpdated) {
          await user.save();
        }
      } catch (err) {
        console.error('Error auto-updating profile from order:', err);
        // Continue without failing the order
      }
    } catch (err) {
      console.error('Error auto-updating profile from order:', err);
      // Continue without failing the order
    }

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart (Now handled on frontend upon payment success or COD confirmation)
    // cart.items = [];
    // await cart.save();

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name images');

    res.status(201).json({
      success: true,
      order: populatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Get user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name images')
      .sort('-createdAt');

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized to view this order
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = req.body.status;
    await order.save();

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// Cancel order (user can cancel their own orders)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['pending', 'confirmed', 'processing'];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.orderStatus}`
      });
    }

    // Update order status to cancelled
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();

    // If payment was made, initiate refund process
    if (order.paymentStatus === 'completed') {
      // Here you would integrate with your payment gateway to initiate refund
      console.log(`Refund initiated for order ${order._id}`);
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};

// Send Delivery OTP (Admin only)
exports.sendDeliveryOTP = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    order.deliveryOTP = otp;
    order.deliveryOTPExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await order.save();

    const emailService = require('../services/emailService');
    await emailService.sendDeliveryOTP(order.user, order, otp);

    res.json({
      success: true,
      message: 'Delivery OTP sent to customer email'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending OTP', error: error.message });
  }
};

// Verify Delivery OTP
exports.verifyDeliveryOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.deliveryOTP !== otp || (order.deliveryOTPExpires && order.deliveryOTPExpires < Date.now())) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    order.orderStatus = 'delivered';
    order.deliveryOTP = undefined;
    order.deliveryOTPExpires = undefined;
    await order.save();

    res.json({
      success: true,
      message: 'Order verified and marked as delivered',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying OTP', error: error.message });
  }
};
