const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { generateOrderCSV, generateProductCSV } = require('../utils/csvGenerator');
const path = require('path');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get date ranges
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 7);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Count statistics
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      todayOrders,
      weeklyOrders,
      monthlyOrders,
      pendingOrders,
      lowStockProducts
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ orderStatus: 'pending' }),
      Product.countDocuments({ stock: { $lt: 10 } })
    ]);

    // Calculate revenue
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    const monthlyRevenue = await Order.aggregate([
      { 
        $match: { 
          paymentStatus: 'paid',
          createdAt: { $gte: startOfMonth }
        } 
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(10);

    const stats = {
      users: {
        total: totalUsers,
        newThisWeek: await User.countDocuments({ 
          role: 'user',
          createdAt: { $gte: startOfWeek } 
        })
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts
      },
      orders: {
        total: totalOrders,
        today: todayOrders,
        weekly: weeklyOrders,
        monthly: monthlyOrders,
        pending: pendingOrders
      },
      revenue: {
        total: revenueData[0]?.totalRevenue || 0,
        monthly: monthlyRevenue[0]?.monthlyRevenue || 0,
        avgOrderValue: revenueData[0]?.avgOrderValue || 0
      },
      topProducts,
      recentOrders
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// Update inventory
exports.updateInventory = async (req, res) => {
  try {
    const { productId, stock, action } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let newStock = product.stock;
    
    switch (action) {
      case 'set':
        newStock = stock;
        break;
      case 'add':
        newStock = product.stock + stock;
        break;
      case 'subtract':
        newStock = Math.max(0, product.stock - stock);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Use: set, add, or subtract'
        });
    }

    product.stock = newStock;
    await product.save();

    res.json({
      success: true,
      message: 'Inventory updated successfully',
      product: {
        _id: product._id,
        name: product.name,
        previousStock: action === 'set' ? stock : product.stock - newStock + product.stock,
        newStock: newStock
      }
    });
  } catch (error) {
    console.error('Inventory update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating inventory',
      error: error.message
    });
  }
};

// Export orders to CSV
exports.exportOrders = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const result = await generateOrderCSV(startDate, endDate);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'No orders found for the specified date range'
      });
    }

    res.json({
      success: true,
      message: 'Orders exported successfully',
      filename: result.filename,
      recordCount: result.recordCount,
      downloadUrl: `/exports/${result.filename}`
    });
  } catch (error) {
    console.error('Orders export error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting orders',
      error: error.message
    });
  }
};

// Export products to CSV
exports.exportProducts = async (req, res) => {
  try {
    const result = await generateProductCSV();

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'No products found'
      });
    }

    res.json({
      success: true,
      message: 'Products exported successfully',
      filename: result.filename,
      recordCount: result.recordCount,
      downloadUrl: `/exports/${result.filename}`
    });
  } catch (error) {
    console.error('Products export error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting products',
      error: error.message
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments({ role: 'user' });

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: page * limit < totalUsers,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Use: active, inactive, or suspended'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
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
      message: 'User status updated successfully',
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

// Get all orders with filters
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { status, paymentStatus, startDate, endDate } = req.query;
    
    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: page * limit < totalOrders,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};
