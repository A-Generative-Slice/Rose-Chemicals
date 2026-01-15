const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to make payment for this order'
      });
    }

    // Create Razorpay order
    const options = {
      amount: order.totalAmount * 100, // amount in paise
      currency: 'INR',
      receipt: `order_${orderId}`,
      notes: {
        orderId: orderId.toString(),
        userId: req.user.id
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      razorpayOrder,
      order: {
        _id: order._id,
        totalAmount: order.totalAmount
      }
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment order',
      error: error.message
    });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Create signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Verify signature
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update order payment status
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'completed',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paidAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      order
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view payment status'
      });
    }

    res.json({
      success: true,
      paymentStatus: order.paymentStatus,
      paidAt: order.paidAt,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment status',
      error: error.message
    });
  }
};

// Handle Razorpay webhooks
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return res.status(500).json({ success: false, message: 'Webhook not configured' });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const event = req.body;

    console.log('Webhook received:', event.event);

    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity);
        break;
      case 'refund.processed':
        await handleRefundProcessed(event.payload.refund.entity, event.payload.payment.entity);
        break;
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing error' });
  }
};

// Handle payment captured
const handlePaymentCaptured = async (paymentEntity) => {
  try {
    const orderId = paymentEntity.notes?.orderId;
    if (!orderId) return;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'completed',
      razorpayPaymentId: paymentEntity.id,
      paidAt: new Date(paymentEntity.created_at * 1000)
    });

    console.log(`Payment captured for order: ${orderId}`);
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
};

// Handle payment failed
const handlePaymentFailed = async (paymentEntity) => {
  try {
    const orderId = paymentEntity.notes?.orderId;
    if (!orderId) return;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'failed',
      razorpayPaymentId: paymentEntity.id
    });

    console.log(`Payment failed for order: ${orderId}`);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
};

// Handle order paid
const handleOrderPaid = async (orderEntity) => {
  try {
    // Find order by razorpay order ID
    const order = await Order.findOne({ razorpayOrderId: orderEntity.id });
    if (!order) return;

    await Order.findByIdAndUpdate(order._id, {
      paymentStatus: 'completed',
      paidAt: new Date()
    });

    console.log(`Order paid: ${order._id}`);
  } catch (error) {
    console.error('Error handling order paid:', error);
  }
};

// Handle refund processed
const handleRefundProcessed = async (refundEntity, paymentEntity) => {
  try {
    // Find order by razorpay payment ID (refunds are linked to payments)
    const order = await Order.findOne({ razorpayPaymentId: paymentEntity.id });
    if (!order) {
      console.log(`Order not found for payment ID: ${paymentEntity.id}`);
      return;
    }

    await Order.findByIdAndUpdate(order._id, {
      paymentStatus: 'refunded',
      orderStatus: 'cancelled' // Automatically cancel order on refund
    });

    console.log(`Order refunded and cancelled: ${order._id}`);
  } catch (error) {
    console.error('Error handling refund processed:', error);
  }
};

// Retry failed payment
exports.retryPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to retry payment for this order'
      });
    }

    // Check if payment can be retried
    if (order.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed'
      });
    }

    // Create new Razorpay order
    const options = {
      amount: order.totalAmount * 100,
      currency: 'INR',
      receipt: `retry_${orderId}_${Date.now()}`,
      notes: {
        orderId: orderId.toString(),
        userId: req.user.id,
        isRetry: 'true'
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Update order with new razorpay order ID
    await Order.findByIdAndUpdate(orderId, {
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'pending'
    });

    res.json({
      success: true,
      razorpayOrder,
      order: {
        _id: order._id,
        totalAmount: order.totalAmount
      }
    });
  } catch (error) {
    console.error('Retry payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrying payment',
      error: error.message
    });
  }
};
