const Product = require('../models/Product');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
}).array('images', 5);

// Get all products with filtering, sorting and pagination
exports.getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || (req.query.page ? 12 : 0);
    const page = Number(req.query.page) || 1;
    
    // Build search query
    let searchQuery = {};
    
    // Text search
    if (req.query.search || req.query.keyword) {
      const searchTerm = req.query.search || req.query.keyword;
      searchQuery.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ];
    }
    
    // Category filter
    if (req.query.category) {
      searchQuery.category = req.query.category;
    }
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      searchQuery.price = {};
      if (req.query.minPrice) searchQuery.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) searchQuery.price.$lte = Number(req.query.maxPrice);
    }
    
    // Rating filter
    if (req.query.minRating) {
      searchQuery.averageRating = { $gte: Number(req.query.minRating) };
    }
    
    // Stock filter
    if (req.query.inStock === 'true') {
      searchQuery.stock = { $gt: 0 };
    } else if (req.query.inStock === 'false') {
      searchQuery.stock = { $lte: 0 };
    }
    
    // Featured products
    if (req.query.featured === 'true') {
      searchQuery.isFeatured = true;
    }
    
    // Active products only (default)
    if (req.query.includeInactive !== 'true') {
      searchQuery.isActive = true;
    }
    
    // Build sort query
    let sortQuery = {};
    switch (req.query.sort) {
      case 'price_asc':
        sortQuery = { price: 1 };
        break;
      case 'price_desc':
        sortQuery = { price: -1 };
        break;
      case 'name_asc':
        sortQuery = { name: 1 };
        break;
      case 'name_desc':
        sortQuery = { name: -1 };
        break;
      case 'rating':
        sortQuery = { averageRating: -1, totalReviews: -1 };
        break;
      case 'popular':
        sortQuery = { salesCount: -1, viewCount: -1 };
        break;
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      case 'oldest':
        sortQuery = { createdAt: 1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }
    
    const count = await Product.countDocuments(searchQuery);
    
    let query = Product.find(searchQuery)
      .populate('category', 'name slug')
      .sort(sortQuery);
    
    // Apply pagination if pageSize > 0
    if (pageSize > 0) {
      query = query.limit(pageSize).skip(pageSize * (page - 1));
    }
    
    const products = await query;
    
    // Get filter options for frontend
    const categories = await Product.distinct('category', { isActive: true });
    const priceRange = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page,
        pages: Math.ceil(count / (pageSize || count)),
        total: count,
        hasNext: pageSize > 0 && page * pageSize < count,
        hasPrev: page > 1
      },
      filters: {
        categories,
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('relatedProducts', 'name price images averageRating');
      
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Increment view count
    await Product.findByIdAndUpdate(req.params.id, {
      $inc: { viewCount: 1 }
    });
    
    // Get related products if not set
    let relatedProducts = product.relatedProducts;
    if (!relatedProducts || relatedProducts.length === 0) {
      relatedProducts = await Product.find({
        _id: { $ne: product._id },
        category: product.category,
        isActive: true
      })
      .select('name price images averageRating')
      .limit(4)
      .sort({ averageRating: -1, salesCount: -1 });
    }
    
    res.json({
      success: true,
      product: {
        ...product.toObject(),
        relatedProducts
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    const mongoose = require('mongoose');
    
    // For development, allow creation without file uploads
    let categoryId = req.body.category;
    
    // If category is a string, find the matching category by name or slug
    if (typeof categoryId === 'string' && !mongoose.Types.ObjectId.isValid(categoryId)) {
      const Category = require('../models/Category');
      const category = await Category.findOne({
        $or: [
          { slug: categoryId },
          { name: { $regex: new RegExp(categoryId, 'i') } }
        ]
      });
      categoryId = category ? category._id : categoryId;
    }
    
    const productData = {
      name: req.body.name,
      description: req.body.description,
      detailedDescription: req.body.detailedDescription || req.body.description,
      price: req.body.price,
      mrp: req.body.mrp || req.body.price,
      category: categoryId,
      stock: req.body.stock || req.body.quantity || 10,
      sku: req.body.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      images: req.body.images || [],
      isActive: req.body.isActive !== false,
      features: req.body.features || [],
      specifications: req.body.specifications || [],
      usage: req.body.usage || '',
      weight: req.body.weight || '',
      isFeatured: req.body.isFeatured || false
    };

    // Only add createdBy if user exists and id is valid
    if (req.user?.id && mongoose.Types.ObjectId.isValid(req.user.id)) {
      productData.createdBy = req.user.id;
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    console.log('Updating product with data:', req.body);
    const mongoose = require('mongoose');
    
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle category conversion if needed
    let updateData = { ...req.body };
    
    // If category is a string, find the matching category by name or slug
    if (updateData.category && typeof updateData.category === 'string' && !mongoose.Types.ObjectId.isValid(updateData.category)) {
      const Category = require('../models/Category');
      const category = await Category.findOne({
        $or: [
          { slug: updateData.category },
          { name: { $regex: new RegExp(updateData.category, 'i') } }
        ]
      });
      updateData.category = category ? category._id : updateData.category;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('category', 'name slug');

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.remove();
    res.json({
      success: true,
      message: 'Product removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Search products with advanced filters
exports.searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, minRating, sort, page = 1, limit = 12 } = req.query;
    
    let searchQuery = { isActive: true };
    
    // Text search
    if (q) {
      searchQuery.$text = { $search: q };
    }
    
    // Apply filters
    if (category) searchQuery.category = category;
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }
    if (minRating) searchQuery.averageRating = { $gte: Number(minRating) };
    
    // Sort options
    let sortQuery = {};
    switch (sort) {
      case 'relevance':
        sortQuery = q ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
        break;
      case 'price_low':
        sortQuery = { price: 1 };
        break;
      case 'price_high':
        sortQuery = { price: -1 };
        break;
      case 'rating':
        sortQuery = { averageRating: -1 };
        break;
      case 'popular':
        sortQuery = { salesCount: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }
    
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(searchQuery);
    
    const products = await Product.find(searchQuery)
      .populate('category', 'name slug')
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit));
    
    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    
    const products = await Product.find({ 
      isFeatured: true, 
      isActive: true 
    })
    .populate('category', 'name slug')
    .sort({ averageRating: -1, salesCount: -1 })
    .limit(limit);
    
    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;
    
    const skip = (page - 1) * limit;
    
    const searchQuery = {
      category: categoryId,
      isActive: true
    };
    
    const total = await Product.countDocuments(searchQuery);
    const products = await Product.find(searchQuery)
      .populate('category', 'name slug')
      .sort({ [sort]: order })
      .skip(skip)
      .limit(limit);
    
    res.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
};

// Get product suggestions/autocomplete
exports.getProductSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    const limit = Number(req.query.limit) || 5;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }
    
    const suggestions = await Product.find({
      name: { $regex: q, $options: 'i' },
      isActive: true
    })
    .select('name price images averageRating')
    .limit(limit);
    
    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Get product suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product suggestions',
      error: error.message
    });
  }
};
