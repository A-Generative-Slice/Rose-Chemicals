require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const { connectDB } = require('./config/database-enhanced');
// CSV utilities (can be temporarily disabled during diagnostics)
const { startCSVScheduler, cleanOldCSVFiles } = require('./utils/csvGenerator');

// Initialize express
const app = express();

// Global diagnostics for silent crashes
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

// Connect to database (seeding temporarily disabled for testing)
const dbReady = connectDB()
  .then(async () => {
    console.log('✅ Database connected, admin functionality ready');
    try {
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
    } catch (userErr) {
      console.error('Admin user bootstrap error:', userErr);
    }
  })
  .catch(err => {
    console.error('DB connection chain error:', err);
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

const PORT = process.env.PORT || 5000; // .env sets 5001

// Start CSV schedulers (temporarily disabled for diagnostics)
if (process.env.ENABLE_CSV_JOBS === 'true') {
  try { startCSVScheduler(); } catch (e) { console.error('Scheduler start error:', e); }
  try { cleanOldCSVFiles(); } catch (e) { console.error('CSV cleanup start error:', e); }
} else {
  console.log('⏸ CSV schedulers disabled (set ENABLE_CSV_JOBS=true to enable)');
}

// Ensure we only start listening after DB attempt (even if it failed we still expose errors)
Promise.resolve(dbReady).finally(() => {
  const server = app.listen(PORT, '0.0.0.0', () => {
    const addr = server.address();
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log('Listening address info:', addr);
  });
  server.on('error', (err) => {
    console.error('HTTP server error:', err);
  });
});
