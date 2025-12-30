const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  sendDeliveryOTP,
  verifyDeliveryOTP
} = require('../controllers/orderController');

// Validation middleware
const validateOrder = [
  body('shippingAddress')
    .notEmpty()
    .withMessage('Shipping address is required')
    .isObject()
    .withMessage('Shipping address must be an object'),
  body('shippingAddress.street')
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.postalCode')
    .notEmpty()
    .withMessage('Postal code is required'),
  body('shippingAddress.country')
    .notEmpty()
    .withMessage('Country is required'),
  body('orderNotes')
    .optional()
    .isString()
    .withMessage('Order notes must be a string')
];

const validateOrderStatus = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
];

// Routes
router.post('/', protect, validateOrder, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, authorize('admin'), validateOrderStatus, updateOrderStatus);
router.patch('/:id/cancel', protect, cancelOrder);
router.post('/:id/send-otp', protect, authorize('admin'), sendDeliveryOTP);
router.post('/:id/verify-otp', protect, verifyDeliveryOTP);

module.exports = router;
