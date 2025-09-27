const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { check } = require('express-validator');

// Validation middleware
const validateProduct = [
  check('name', 'Name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('price', 'Price must be a positive number').isFloat({ min: 0 }),
  check('category', 'Category is required').isIn(['brooms', 'brushes', 'dusters', 'cleaning_agents', 'floor_cleaners', 'disinfectants', 'detergents', 'sanitizers', 'mops', 'scrubbers', 'wipes', 'other']),
  check('stock', 'Stock must be a non-negative number').isInt({ min: 0 })
];

// Get categories (public route) - MUST be before /:id route
router.get('/categories', async (req, res) => {
  console.log('Categories endpoint hit');
  try {
    // Try to get categories from Category model first
    const Category = require('../models/Category');
    let categories = await Category.find({ isActive: true }).select('_id name slug');
    
    // If no categories in Category model, get unique categories from products
    if (!categories || categories.length === 0) {
      const Product = require('../models/Product');
      const uniqueCategories = await Product.distinct('category');
      categories = uniqueCategories.map(cat => ({
        _id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, ' '),
        slug: cat
      }));
    }
    
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Categories endpoint error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes (temporarily disabled auth for development)
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.patch('/:id', updateProduct);  // Add PATCH method
router.delete('/:id', deleteProduct);

// Development only - clear all products and get categories
if (process.env.NODE_ENV === 'development') {
  router.delete('/dev/clear-all', async (req, res) => {
    try {
      const Product = require('../models/Product');
      await Product.deleteMany({});
      res.json({ success: true, message: 'All products cleared' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.get('/dev/categories', async (req, res) => {
    try {
      const Category = require('../models/Category');
      const categories = await Category.find({});
      res.json({ success: true, categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}

module.exports = router;
