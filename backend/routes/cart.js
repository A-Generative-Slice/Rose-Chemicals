const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  validateCart,
  mergeTempCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const { check } = require('express-validator');

// Validation middleware
const validateCartItem = [
  check('productId', 'Product ID is required').not().isEmpty(),
  check('quantity', 'Quantity must be at least 1').isInt({ min: 1 })
];

router.use(protect); // All cart routes are protected

router.get('/', getCart);
router.post('/add', validateCartItem, addToCart);
router.patch('/update', validateCartItem, updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/validate', validateCart);
router.post('/merge-temp', mergeTempCart);

module.exports = router;
