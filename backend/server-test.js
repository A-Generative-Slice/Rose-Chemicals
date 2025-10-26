const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Simple admin credentials
const ADMIN_EMAIL = 'admin@rosechemicals.com';
const ADMIN_PASSWORD = 'Admin@123';

// Simple token check
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    req.user = { email: ADMIN_EMAIL, role: 'admin' };
    next();
  } else {
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Login attempt:', { email });
  
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = 'admin-token-12345';
    console.log('✅ Login successful!');
    
    res.json({
      success: true,
      token,
      user: {
        _id: 'admin001',
        name: 'Admin',
        email: ADMIN_EMAIL,
        role: 'admin',
        isActive: true
      }
    });
  } else {
    console.log('❌ Invalid credentials');
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Admin routes
app.get('/api/admin/analytics', protect, (req, res) => {
  console.log('📊 Analytics requested');
  res.json({
    success: true,
    data: {
      totalUsers: 1,
      totalProducts: 25,
      totalOrders: 12,
      totalRevenue: 15750,
      pendingOrders: 3,
      lowStockProducts: 2,
      totalReviews: 8,
      averageRating: 4.2
    }
  });
});

app.get('/api/admin/users/enhanced', protect, (req, res) => {
  console.log('👥 Enhanced users requested');
  res.json({
    success: true,
    users: [{
      _id: 'admin001',
      name: 'Admin',
      email: ADMIN_EMAIL,
      role: 'admin',
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date('2024-01-01')
    }],
    total: 1,
    page: 1,
    pages: 1
  });
});

app.get('/api/admin/orders/enhanced', protect, (req, res) => {
  console.log('📦 Enhanced orders requested');
  res.json({
    success: true,
    orders: [],
    total: 0,
    page: 1,
    pages: 0
  });
});

app.get('/api/admin/products', protect, (req, res) => {
  console.log('🛍️ Products requested');
  res.json({
    success: true,
    products: [],
    total: 0,
    page: 1,
    pages: 0
  });
});

app.get('/api/admin/reviews/enhanced', protect, (req, res) => {
  console.log('⭐ Enhanced reviews requested');
  res.json({
    success: true,
    reviews: [],
    total: 0,
    page: 1,
    pages: 0
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Simple Rose Chemicals Backend Server'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error'
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log('🚀 Simple Rose Chemicals Backend Server Started!');
  console.log(`📍 Server running on port ${PORT}`);
  console.log('🔐 Admin Login Credentials:');
  console.log('   Email: admin@rosechemicals.com');
  console.log('   Password: Admin@123');
  console.log('🌐 Frontend URL: http://localhost:3000');
  console.log('💡 Health Check: http://localhost:' + PORT + '/health');
});