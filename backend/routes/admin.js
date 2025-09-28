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
  getAllOrders,
  getOrderDetails,
  updateOrderDetails
} = require('../controllers/adminController');

// Enhanced admin functions
const {
  getAnalytics,
  getUserDetails,
  updateUserStatusEnhanced,
  deleteUser,
  getEnhancedUsers,
  getEnhancedProducts,
  updateProductStock,
  getEnhancedOrders,
  updateOrderStatus,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
  getReviewStats,
  getSalesAnalytics,
  getProductAnalytics,
  getUserAnalytics,
  getRevenueAnalytics,
  getSettings,
  updateSettings
} = require('../controllers/adminEnhancedController');

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
router.get('/orders/:id', getOrderDetails);
router.patch('/orders/:id', updateOrderDetails);

// ========== ENHANCED ADMIN ROUTES ==========

// Enhanced User Management
router.get('/users/enhanced', getEnhancedUsers);
router.get('/users/:userId', getUserDetails);
router.patch('/users/:userId/status', updateUserStatusEnhanced);
router.delete('/users/:userId', deleteUser);

// Enhanced Product Management  
router.get('/products', getEnhancedProducts);
router.patch('/products/:productId/stock', updateProductStock);

// Enhanced Order Management
router.get('/orders/enhanced', getEnhancedOrders);
router.patch('/orders/:orderId/status', updateOrderStatus);

// Review Management
router.get('/reviews', getAllReviews);
router.get('/reviews/stats', getReviewStats);
router.patch('/reviews/:reviewId/status', updateReviewStatus);
router.delete('/reviews/:reviewId', deleteReview);

// Analytics
router.get('/analytics', getAnalytics); // General analytics dashboard
router.get('/analytics/sales', getSalesAnalytics);
router.get('/analytics/products', getProductAnalytics);
router.get('/analytics/users', getUserAnalytics);
router.get('/analytics/revenue', getRevenueAnalytics);

// Settings Management
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
