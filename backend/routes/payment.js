const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus
} = require('../controllers/paymentController');

// Validation middleware
const validatePaymentOrder = [
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Invalid order ID')
];

const validatePaymentVerification = [
  body('razorpay_order_id')
    .notEmpty()
    .withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id')
    .notEmpty()
    .withMessage('Razorpay payment ID is required'),
  body('razorpay_signature')
    .notEmpty()
    .withMessage('Razorpay signature is required'),
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Invalid order ID')
];

// Routes
router.post('/create-order', protect, validatePaymentOrder, createPaymentOrder);
router.post('/verify', protect, validatePaymentVerification, verifyPayment);
router.get('/status/:orderId', protect, getPaymentStatus);

module.exports = router;
