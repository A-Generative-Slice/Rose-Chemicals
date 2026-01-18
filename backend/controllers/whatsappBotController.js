const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// Helper to format product for WhatsApp bot
const formatProduct = (product) => {
    if (!product) return null;

    const p = product.toObject ? product.toObject() : product;

    // Get primary image or first image
    let imageUrl = '';
    if (p.images && p.images.length > 0) {
        const primaryImage = p.images.find(img => img.isPrimary);
        imageUrl = primaryImage ? primaryImage.url : p.images[0].url;
    }

    // Ensure image URL is absolute
    if (imageUrl && !imageUrl.startsWith('http')) {
        const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://rosechemicals.in';
        imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }

    return {
        id: p._id,
        slug: p.slug || p._id.toString(),
        name: p.name,
        price: `₹${p.price}`,
        mrp: p.mrp ? `₹${p.mrp}` : `₹${p.price}`,
        description: p.description,
        short_description: p.description.substring(0, 100) + (p.description.length > 100 ? '...' : ''),
        category: p.category && (p.category.name || p.category),
        image: imageUrl,
        tags: p.tags || [],
        featured: p.isFeatured || false,
        features: p.features || [],
        specifications: p.specifications ? p.specifications.reduce((acc, spec) => {
            acc[spec.name] = spec.value;
            return acc;
        }, {}) : {}
    };
};

/**
 * @desc    Get all product categories
 * @route   GET /api/whatsapp/categories
 * @access  Public
 */
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).select('name slug description image');
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

/**
 * @desc    Get top featured products
 * @route   GET /api/whatsapp/products/featured
 * @access  Public
 */
exports.getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ isFeatured: true, isActive: true })
            .populate('category', 'name slug')
            .limit(10)
            .sort({ createdAt: -1 });

        const formattedProducts = products.map(formatProduct);

        res.status(200).json({
            success: true,
            count: formattedProducts.length,
            data: formattedProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching featured products',
            error: error.message
        });
    }
};

/**
 * @desc    Get products by category name or slug
 * @route   GET /api/whatsapp/products/category/:categoryName
 * @access  Public
 */
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryName } = req.params;

        // Find the category first
        const category = await Category.findOne({
            $or: [
                { slug: categoryName },
                { name: { $regex: new RegExp(`^${categoryName}$`, 'i') } }
            ]
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        const products = await Product.find({ category: category._id, isActive: true })
            .populate('category', 'name slug')
            .limit(20);

        const formattedProducts = products.map(formatProduct);

        res.status(200).json({
            success: true,
            count: formattedProducts.length,
            data: formattedProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products by category',
            error: error.message
        });
    }
};

/**
 * @desc    Get single product details by id or slug
 * @route   GET /api/whatsapp/product/:slug
 * @access  Public
 */
exports.getProductDetails = async (req, res) => {
    try {
        const { slug } = req.params;

        let query = { isActive: true };
        if (mongoose.Types.ObjectId.isValid(slug)) {
            query._id = slug;
        } else {
            query.slug = slug;
        }

        const product = await Product.findOne(query).populate('category', 'name slug');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: formatProduct(product)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product details',
            error: error.message
        });
    }
};
