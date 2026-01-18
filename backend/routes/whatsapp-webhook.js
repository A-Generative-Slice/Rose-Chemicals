const express = require('express');
const router = express.Router();
const { verifyWebhook, receiveMessage } = require('../controllers/whatsappWebhook');
const {
    getCategories,
    getFeaturedProducts,
    searchProducts,
    getProductsByCategory,
    getProductDetails
} = require('../controllers/whatsappBotController');

/**
 * @desc    Meta Webhook Verification
 * @route   GET /api/whatsapp/webhook
 * @access  Public
 */
// router.post('/webhook', receiveMessage); // Disabled: Handled by Railway Bot
router.get('/webhook', verifyWebhook);

/**
 * @desc    Get all product categories
 * @route   GET /api/whatsapp/categories
 * @access  Public
 */
router.get('/categories', getCategories);

/**
 * @desc    Get top featured products
 * @route   GET /api/whatsapp/products/featured
 * @access  Public
 */
router.get('/products/featured', getFeaturedProducts);

/**
 * @desc    Search products (Disabled: Bot uses local JSON)
 * @route   GET /api/whatsapp/products/search
 * @access  Public
 */
// router.get('/products/search', searchProducts);

/**
 * @desc    Get products by category name or slug
 * @route   GET /api/whatsapp/products/category/:categoryName
 * @access  Public
 */
router.get('/products/category/:categoryName', getProductsByCategory);

/**
 * @desc    Get single product details by id or slug
 * @route   GET /api/whatsapp/product/:slug
 * @access  Public
 */
router.get('/product/:slug', getProductDetails);

module.exports = router;
