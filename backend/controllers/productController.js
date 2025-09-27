const Product = require('../models/Product');
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
    const pageSize = Number(req.query.limit) || (req.query.page ? 12 : 0); // If no pagination requested, return all
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword ? {
      $or: [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ]
    } : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const count = await Product.countDocuments({ ...keyword, ...category });
    
    let query = Product.find({ ...keyword, ...category })
      .populate('category', 'name slug')
      .sort(req.query.sort || '-createdAt');
    
    // Only apply pagination if pageSize > 0
    if (pageSize > 0) {
      query = query.limit(pageSize).skip(pageSize * (page - 1));
    }
    
    const products = await query;

    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(count / pageSize),
      count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
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
      category: mongoose.Types.ObjectId.isValid(categoryId) 
        ? new mongoose.Types.ObjectId(categoryId) 
        : categoryId,
      stock: req.body.stock || req.body.quantity || 10,
      sku: req.body.sku || `SKU-${Date.now()}`,
      images: req.body.images || [],
      isActive: req.body.isActive !== false,
      features: req.body.features || [],
      specifications: req.body.specifications || [],
      usage: req.body.usage || '',
      weight: req.body.weight || '',
      isFeatured: req.body.isFeatured || false
    };

    // Only add createdBy if user exists
    if (req.user?.id) {
      productData.createdBy = new mongoose.Types.ObjectId(req.user.id);
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
