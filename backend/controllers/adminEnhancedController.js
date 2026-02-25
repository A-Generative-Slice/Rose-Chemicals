const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Category = require('../models/Category');
const Settings = require('../models/Settings');
const mongoose = require('mongoose');

// ============ ENHANCED ADMIN FUNCTIONS ============

// General Analytics Dashboard
exports.getAnalytics = async (req, res) => {
  try {
    // Get all key metrics in parallel
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      lowStockProducts,
      totalReviews,
      averageRating
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.countDocuments({ orderStatus: 'pending' }),
      Product.countDocuments({ stock: { $lt: 10 } }),
      Review.countDocuments({ status: 'approved' }),
      Review.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, avg: { $avg: '$rating' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders,
        lowStockProducts,
        totalReviews,
        averageRating: averageRating[0]?.avg || 0
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data',
      error: error.message
    });
  }
};

// Enhanced User Management
exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user statistics
    const [totalOrders, totalSpent, addresses] = await Promise.all([
      Order.countDocuments({ user: userId }),
      Order.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId), paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      User.findById(userId).select('addresses')
    ]);

    const userWithStats = {
      ...user.toObject(),
      totalOrders,
      totalSpent: totalSpent[0]?.total || 0,
      addresses: addresses?.addresses || []
    };

    res.json({
      success: true,
      user: userWithStats
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user details',
      error: error.message
    });
  }
};

exports.updateUserStatusEnhanced = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists and is not an admin
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

exports.getEnhancedUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { role, status, sort, search } = req.query;

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (role && role !== 'all') filter.role = role;
    if (status && status !== 'all') filter.isActive = status === 'active';

    // Build sort
    let sortQuery = { createdAt: -1 };
    switch (sort) {
      case 'oldest':
        sortQuery = { createdAt: 1 };
        break;
      case 'name-asc':
        sortQuery = { name: 1 };
        break;
      case 'name-desc':
        sortQuery = { name: -1 };
        break;
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter)
    ]);

    // Get user statistics
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [totalOrders, totalSpent] = await Promise.all([
          Order.countDocuments({ user: user._id }),
          Order.aggregate([
            { $match: { user: user._id, paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
          ])
        ]);

        return {
          ...user.toObject(),
          totalOrders,
          totalSpent: totalSpent[0]?.total || 0
        };
      })
    );

    res.json({
      success: true,
      users: usersWithStats,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get enhanced users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Enhanced Product Management
exports.getEnhancedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { category, status, stock, sort, search } = req.query;

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }
    if (category && category !== 'all') {
      // If category is provided, try to find it by name first
      if (mongoose.Types.ObjectId.isValid(category)) {
        // If it's already an ObjectId, use it directly
        filter.category = category;
      } else {
        // If it's a name, find the category ObjectId
        const categoryDoc = await Category.findOne({ name: category });
        if (categoryDoc) {
          filter.category = categoryDoc._id;
        } else {
          // If category name not found, return empty results
          return res.json({
            success: true,
            products: [],
            total: 0,
            page,
            pages: 0
          });
        }
      }
    }

    // Status Filter - Improved logic
    if (status && status !== 'all') {
      if (status === 'active') {
        filter.isActive = true;
      } else if (status === 'inactive') {
        filter.isActive = false;
      } else if (status === 'low-stock') {
        filter.stock = { $gt: 0, $lt: 10 };
      } else if (status === 'out-of-stock') {
        filter.stock = { $lte: 0 };
      }
    }

    // Separate stock filter if provided directly
    if (stock && stock !== 'all') {
      switch (stock) {
        case 'low':
          filter.stock = { $gt: 0, $lt: 10 };
          break;
        case 'out':
          filter.stock = { $lte: 0 };
          break;
        case 'in':
          filter.stock = { $gt: 0 };
          break;
      }
    }

    // Build sort
    let sortQuery = { createdAt: -1 };
    switch (sort) {
      case 'oldest':
        sortQuery = { createdAt: 1 };
        break;
      case 'name-asc':
        sortQuery = { name: 1 };
        break;
      case 'name-desc':
        sortQuery = { name: -1 };
        break;
      case 'price-high':
        sortQuery = { price: -1 };
        break;
      case 'price-low':
        sortQuery = { price: 1 };
        break;
      case 'stock-high':
        sortQuery = { stock: -1 };
        break;
      case 'stock-low':
        sortQuery = { stock: 1 };
        break;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name')
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter)
    ]);

    res.json({
      success: true,
      products,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get enhanced products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

exports.updateProductStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock } = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      { stock },
      { new: true }
    ).populate('category', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product stock updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product stock',
      error: error.message
    });
  }
};

// Enhanced Order Management
exports.getEnhancedOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, paymentStatus, sort, startDate, endDate, search } = req.query;

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { _id: mongoose.Types.ObjectId.isValid(search) ? search : undefined },
        { 'shippingAddress.name': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
        { 'shippingAddress.email': { $regex: search, $options: 'i' } }
      ].filter(item => item._id !== undefined || !item._id);
    }
    if (status && status !== 'all') filter.orderStatus = status;
    if (paymentStatus && paymentStatus !== 'all') filter.paymentStatus = paymentStatus;
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Build sort
    let sortQuery = { createdAt: -1 };
    switch (sort) {
      case 'oldest':
        sortQuery = { createdAt: 1 };
        break;
      case 'amount-high':
        sortQuery = { totalAmount: -1 };
        break;
      case 'amount-low':
        sortQuery = { totalAmount: 1 };
        break;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .populate('items.product', 'name images')
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter)
    ]);

    res.json({
      success: true,
      orders,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get enhanced orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    ).populate('user', 'name email')
      .populate('items.product', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

exports.bulkUpdateOrders = async (req, res) => {
  try {
    const { orderIds, status, paymentStatus } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order IDs provided'
      });
    }

    const updateData = {};
    if (status) updateData.orderStatus = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No update data provided'
      });
    }

    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: updateData }
    );

    res.json({
      success: true,
      message: `Successfully updated ${result.nModified || result.modifiedCount} orders`,
      count: result.nModified || result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk update orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing bulk update',
      error: error.message
    });
  }
};

// Review Management
exports.getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, rating, sort, search } = req.query;

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { comment: { $regex: search, $options: 'i' } }
      ];
    }
    if (status && status !== 'all') {
      if (status === 'reported') {
        filter.isReported = true;
      } else {
        filter.status = status;
      }
    }
    if (rating && rating !== 'all') filter.rating = parseInt(rating);

    // Build sort
    let sortQuery = { createdAt: -1 };
    switch (sort) {
      case 'oldest':
        sortQuery = { createdAt: 1 };
        break;
      case 'rating-high':
        sortQuery = { rating: -1 };
        break;
      case 'rating-low':
        sortQuery = { rating: 1 };
        break;
      case 'reported':
        sortQuery = { reportCount: -1 };
        break;
    }

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate('user', 'name email')
        .populate('product', 'name imageUrl')
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),
      Review.countDocuments(filter)
    ]);

    res.json({
      success: true,
      reviews,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

exports.updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status },
      { new: true }
    ).populate('user', 'name email')
      .populate('product', 'name imageUrl');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review status updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review status',
      error: error.message
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

exports.getReviewStats = async (req, res) => {
  try {
    const [stats] = await Promise.all([
      Review.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
            rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
            reported: { $sum: { $cond: ['$isReported', 1, 0] } },
            averageRating: { $avg: '$rating' }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        reported: 0,
        averageRating: 0
      }
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review statistics',
      error: error.message
    });
  }
};

// Analytics
exports.getSalesAnalytics = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $project: {
          date: '$_id',
          sales: 1,
          orders: 1,
          revenue: 1,
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json({
      success: true,
      data: salesData
    });
  } catch (error) {
    console.error('Get sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sales analytics',
      error: error.message
    });
  }
};

exports.getProductAnalytics = async (req, res) => {
  try {
    const products = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          salesCount: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: '$product._id',
          name: '$product.name',
          category: '$product.category',
          salesCount: 1,
          revenue: 1,
          viewCount: '$product.viewCount',
          averageRating: '$product.averageRating',
          stock: '$product.stock'
        }
      },
      { $sort: { salesCount: -1 } }
    ]);

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Get product analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product analytics',
      error: error.message
    });
  }
};

exports.getUserAnalytics = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const startOfMonth = new Date();
    startOfMonth.setDate(startOfMonth.getDate() - 30);

    const [totalUsers, newUsers, activeUsers, userGrowth, topLocations] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', createdAt: { $gte: startOfWeek } }),
      User.countDocuments({ role: 'user', isActive: true }),
      User.aggregate([
        {
          $match: { role: 'user' }
        },
        {
          $group: {
            _id: {
              $cond: [
                { $gte: ['$createdAt', startOfMonth] },
                'new',
                'old'
              ]
            },
            count: { $sum: 1 }
          }
        }
      ]),
      User.aggregate([
        {
          $match: { role: 'user', 'addresses.0': { $exists: true } }
        },
        { $unwind: '$addresses' },
        {
          $group: {
            _id: { $concat: ['$addresses.city', ', ', '$addresses.state'] },
            users: { $sum: 1 }
          }
        },
        { $sort: { users: -1 } },
        { $limit: 5 },
        {
          $project: {
            location: '$_id',
            users: 1,
            _id: 0
          }
        }
      ])
    ]);

    const newUserCount = userGrowth.find(g => g._id === 'new')?.count || 0;
    const oldUserCount = userGrowth.find(g => g._id === 'old')?.count || 0;
    const growthPercentage = oldUserCount > 0 ? ((newUserCount / oldUserCount) * 100) : 0;

    res.json({
      success: true,
      analytics: {
        totalUsers,
        newUsers,
        activeUsers,
        userGrowth: growthPercentage,
        topLocations
      }
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user analytics',
      error: error.message
    });
  }
};

exports.getRevenueAnalytics = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const prevStartDate = new Date();
    prevStartDate.setDate(prevStartDate.getDate() - (days * 2));
    const prevEndDate = new Date();
    prevEndDate.setDate(prevEndDate.getDate() - days);

    const [currentRevenue, previousRevenue, avgOrderValue, revenueByCategory] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            paymentStatus: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            monthlyRevenue: { $sum: '$totalAmount' }
          }
        }
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: prevStartDate, $lt: prevEndDate },
            paymentStatus: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' }
          }
        }
      ]),
      Order.aggregate([
        {
          $match: { paymentStatus: 'completed' }
        },
        {
          $group: {
            _id: null,
            avgOrderValue: { $avg: '$totalAmount' }
          }
        }
      ]),
      Order.aggregate([
        {
          $match: {
            paymentStatus: 'completed',
            createdAt: { $gte: startDate }
          }
        },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $lookup: {
            from: 'categories',
            localField: 'product.category',
            foreignField: '_id',
            as: 'category'
          }
        },
        { $unwind: '$category' },
        {
          $group: {
            _id: '$category.name',
            revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
          }
        },
        {
          $project: {
            category: '$_id',
            revenue: 1,
            _id: 0
          }
        },
        { $sort: { revenue: -1 } }
      ])
    ]);

    const current = currentRevenue[0] || { totalRevenue: 0, monthlyRevenue: 0 };
    const previous = previousRevenue[0] || { totalRevenue: 0 };
    const revenueGrowth = previous.totalRevenue > 0
      ? ((current.totalRevenue - previous.totalRevenue) / previous.totalRevenue) * 100
      : 0;

    // Calculate percentages for categories
    const totalCategoryRevenue = revenueByCategory.reduce((sum, cat) => sum + cat.revenue, 0);
    const categoriesWithPercentage = revenueByCategory.map(cat => ({
      ...cat,
      percentage: totalCategoryRevenue > 0 ? (cat.revenue / totalCategoryRevenue) * 100 : 0
    }));

    res.json({
      success: true,
      analytics: {
        totalRevenue: current.totalRevenue,
        monthlyRevenue: current.monthlyRevenue,
        revenueGrowth,
        avgOrderValue: avgOrderValue[0]?.avgOrderValue || 0,
        revenueByCategory: categoriesWithPercentage
      }
    });
  } catch (error) {
    console.error('Get revenue analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue analytics',
      error: error.message
    });
  }
};

// Settings Management
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        general: {
          siteName: 'Rose Chemicals',
          siteDescription: 'Premium chemical solutions for all your needs',
          siteUrl: 'https://rosechemicals.com',
          contactEmail: 'info@rosechemicals.com',
          contactPhone: '+91 98765 43210',
          address: '123 Chemical Street, Industrial Area, Mumbai, Maharashtra 400001',
          socialMedia: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: ''
          }
        },
        email: {
          smtpHost: 'smtp.gmail.com',
          smtpPort: '587',
          smtpUser: '',
          fromEmail: 'noreply@rosechemicals.com',
          fromName: 'Rose Chemicals',
          emailTemplates: {
            welcomeEmail: true,
            orderConfirmation: true,
            orderStatusUpdate: true,
            passwordReset: true,
            promotional: false
          }
        },
        payment: {
          razorpayEnabled: true,
          razorpayKeyId: '',
          codEnabled: true,
          minOrderForCod: 500,
          maxOrderForCod: 50000,
          processingFee: 0
        },
        shipping: {
          freeShippingThreshold: 2000,
          standardShippingRate: 100,
          expressShippingRate: 200,
          estimatedDeliveryDays: {
            standard: 7,
            express: 3
          }
        }
      });
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updatedSettings = req.body;

    let settings = await Settings.findOne();
    if (settings) {
      settings = await Settings.findByIdAndUpdate(settings._id, updatedSettings, {
        new: true,
        runValidators: true
      });
    } else {
      settings = await Settings.create(updatedSettings);
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
};

// Public Settings
exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();

    // Return only public information
    const publicSettings = settings ? {
      siteName: settings.general?.siteName,
      siteDescription: settings.general?.siteDescription,
      siteUrl: settings.general?.siteUrl,
      contactEmail: settings.general?.contactEmail,
      contactPhone: settings.general?.contactPhone,
      address: settings.general?.address,
      socialMedia: settings.general?.socialMedia,
      logo: settings.general?.logo,
      favicon: settings.general?.favicon,
    } : {};

    res.json({
      success: true,
      settings: publicSettings
    });
  } catch (error) {
    console.error('Get public settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};