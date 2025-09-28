require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const { connectDB } = require('./config/database-enhanced');
const { startCSVScheduler, cleanOldCSVFiles } = require('./utils/csvGenerator');

// Initialize express
const app = express();

// Connect to database (seeding temporarily disabled for testing)
connectDB().then(async () => {
  console.log('✅ Database connected, admin functionality ready');
  
  // Create admin user if it doesn't exist
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  
  const adminExists = await User.findOne({ email: 'admin@rosechemicals.com' });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    await User.create({
      name: 'Admin',
      email: 'admin@rosechemicals.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });
    console.log('✅ Admin user created: admin@rosechemicals.com / Admin@123');
  }
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/exports', express.static(path.join(__dirname, 'exports')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
// app.use('/api/payment', require('./routes/payment')); // Temporarily disabled due to Razorpay config
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/upload', require('./routes/upload-local'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Start CSV schedulers
startCSVScheduler();
cleanOldCSVFiles();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
