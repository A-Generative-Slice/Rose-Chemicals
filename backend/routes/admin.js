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
  bulkUpdateOrders,
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
router.get('/users', getEnhancedUsers);
router.patch('/users/:userId/status', validateUserStatus, updateUserStatus);
// Recent users (simple, non-paginated list for dashboard)
router.get('/users/recent', async (req, res) => {
  try {
    const User = require('../models/User');
    const limit = parseInt(req.query.limit) || 5;
    const users = await User.find({ role: { $ne: 'admin' } })
      .sort('-createdAt')
      .limit(limit)
      .select('name email createdAt isActive');
    res.json({ success: true, data: { users } });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error fetching recent users', error: e.message });
  }
});

// Order management
router.get('/orders', getEnhancedOrders);
// Recent orders (dashboard quick view) - MUST BE BEFORE /orders/:id
router.get('/orders/recent', async (req, res) => {
  try {
    const Order = require('../models/Order');
    const limit = parseInt(req.query.limit) || 5;
    const orders = await Order.find({})
      .sort('-createdAt')
      .limit(limit)
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .select('user totalAmount orderStatus createdAt items');
    res.json({ success: true, data: { orders } });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error fetching recent orders', error: e.message });
  }
});
router.get('/orders/enhanced', getEnhancedOrders);
router.post('/orders/bulk-update', bulkUpdateOrders);

// Generic ID routes
router.get('/orders/:id', getOrderDetails);
router.patch('/orders/:id', updateOrderDetails);
router.patch('/orders/:orderId/status', updateOrderStatus);


// ========== ENHANCED ADMIN ROUTES ==========

// Enhanced User Management
router.get('/users/enhanced', getEnhancedUsers);
router.get('/users/:userId', getUserDetails);
router.patch('/users/:userId/status', updateUserStatusEnhanced);
router.delete('/users/:userId', deleteUser);

// Enhanced Product Management
router.get('/products', getEnhancedProducts);
router.post('/products', protect, authorize('admin'), async (req, res) => {
  try {
    const { createProduct } = require('../controllers/productController');
    await createProduct(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.put('/products/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { updateProduct } = require('../controllers/productController');
    await updateProduct(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.delete('/products/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { deleteProduct } = require('../controllers/productController');
    await deleteProduct(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.patch('/products/:id/stock', updateProductStock);// Enhanced Order Management

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
