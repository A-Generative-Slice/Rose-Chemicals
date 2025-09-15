require('dotenv').config();
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

// Connect to database and seed if using in-memory
connectDB().then(async () => {
  // Check if using in-memory database and seed if empty
  if (process.env.NODE_ENV === 'development') {
    const Product = require('./models/Product');
    const productCount = await Product.countDocuments();
    
    if (productCount === 0) {
      console.log('🌱 No products found, seeding database...');
      const { seedDatabase } = require('./seed');
      await seedDatabase();
    }
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
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));

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
