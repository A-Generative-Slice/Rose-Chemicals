const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updateWishlist,
  updateWishlistItem,
  checkWishlistStatus,
  getPublicWishlist,
  moveToCart
} = require('../controllers/wishlistController');

// Validation middleware
const validateWishlistUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Wishlist name must be between 1 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
];

const validateWishlistItem = [
  body('notifyOnSale')
    .optional()
    .isBoolean()
    .withMessage('notifyOnSale must be a boolean'),
  body('notifyOnStock')
    .optional()
    .isBoolean()
    .withMessage('notifyOnStock must be a boolean')
];

const validateMoveToCart = [
  body('productIds')
    .isArray({ min: 1 })
    .withMessage('productIds must be a non-empty array'),
  body('productIds.*')
    .isMongoId()
    .withMessage('Each product ID must be valid')
];

// Public routes
router.get('/public/:userId', getPublicWishlist);

// Protected routes
router.use(protect);

router.get('/', getWishlist);
router.post('/add/:productId', validateWishlistItem, addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);
router.patch('/', validateWishlistUpdate, updateWishlist);
router.patch('/item/:productId', validateWishlistItem, updateWishlistItem);
router.get('/check/:productId', checkWishlistStatus);
router.post('/move-to-cart', validateMoveToCart, moveToCart);

module.exports = router;
