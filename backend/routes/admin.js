const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  updateInventory,
  exportOrders,
  exportProducts,
  getAllUsers,
  updateUserStatus,
  getAllOrders
} = require('../controllers/adminController');

// Validation middleware
const validateInventoryUpdate = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('stock')
    .notEmpty()
    .withMessage('Stock value is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('action')
    .notEmpty()
    .withMessage('Action is required')
    .isIn(['set', 'add', 'subtract'])
    .withMessage('Action must be set, add, or subtract')
];

const validateUserStatus = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage('Status must be active, inactive, or suspended')
];

// Apply admin protection to all routes
router.use(protect);
router.use(authorize('admin'));

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);

// Inventory management
router.patch('/inventory/update', validateInventoryUpdate, updateInventory);

// Export routes
router.get('/export/orders', exportOrders);
router.get('/export/products', exportProducts);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:userId/status', validateUserStatus, updateUserStatus);

// Order management
router.get('/orders', getAllOrders);

module.exports = router;
