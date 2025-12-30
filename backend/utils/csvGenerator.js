const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const Order = require('../models/Order');

// Ensure exports directory exists
const exportsDir = path.join(__dirname, '../exports');
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

// Generate Orders CSV
exports.generateOrderCSV = async (startDate = null, endDate = null) => {
  try {
    // Build date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      dateFilter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      dateFilter.createdAt = { $lte: new Date(endDate) };
    }

    // Fetch orders
    const orders = await Order.find(dateFilter)
      .populate('user', 'name email phone')
      .populate('items.product', 'name category')
      .sort('-createdAt');

    if (orders.length === 0) {
      return null;
    }

    // Prepare CSV data
    const csvData = [];
    orders.forEach(order => {
      order.items.forEach(item => {
        csvData.push({
          orderId: order._id.toString(),
          orderDate: order.createdAt.toISOString().split('T')[0],
          customerName: order.user.name,
          customerEmail: order.user.email,
          customerPhone: order.user.phone || 'N/A',
          productName: item.product.name,
          productCategory: item.product.category,
          quantity: item.quantity,
          price: item.price,
          totalAmount: item.price * item.quantity,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          shippingCity: order.shippingAddress.city,
          shippingState: order.shippingAddress.state,
          shippingCountry: order.shippingAddress.country
        });
      });
    });

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `orders-export-${timestamp}.csv`;
    const filepath = path.join(exportsDir, filename);

    // Create CSV writer
    const csvWriter = createCsvWriter({
      path: filepath,
      header: [
        { id: 'orderId', title: 'Order ID' },
        { id: 'orderDate', title: 'Order Date' },
        { id: 'customerName', title: 'Customer Name' },
        { id: 'customerEmail', title: 'Customer Email' },
        { id: 'customerPhone', title: 'Customer Phone' },
        { id: 'productName', title: 'Product Name' },
        { id: 'productCategory', title: 'Product Category' },
        { id: 'quantity', title: 'Quantity' },
        { id: 'price', title: 'Unit Price' },
        { id: 'totalAmount', title: 'Total Amount' },
        { id: 'orderStatus', title: 'Order Status' },
        { id: 'paymentStatus', title: 'Payment Status' },
        { id: 'shippingCity', title: 'Shipping City' },
        { id: 'shippingState', title: 'Shipping State' },
        { id: 'shippingCountry', title: 'Shipping Country' }
      ]
    });

    // Write CSV
    await csvWriter.writeRecords(csvData);

    return {
      filename,
      filepath,
      recordCount: csvData.length
    };
  } catch (error) {
    console.error('CSV Generation Error:', error);
    throw error;
  }
};

// Generate Products CSV
exports.generateProductCSV = async () => {
  try {
    const Product = require('../models/Product');
    
    const products = await Product.find()
      .populate('createdBy', 'name')
      .sort('-createdAt');

    if (products.length === 0) {
      return null;
    }

    const csvData = products.map(product => ({
      productId: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      createdBy: product.createdBy ? product.createdBy.name : 'N/A',
      createdAt: product.createdAt.toISOString().split('T')[0],
      updatedAt: product.updatedAt.toISOString().split('T')[0]
    }));

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `products-export-${timestamp}.csv`;
    const filepath = path.join(exportsDir, filename);

    const csvWriter = createCsvWriter({
      path: filepath,
      header: [
        { id: 'productId', title: 'Product ID' },
        { id: 'name', title: 'Product Name' },
        { id: 'description', title: 'Description' },
        { id: 'price', title: 'Price' },
        { id: 'category', title: 'Category' },
        { id: 'stock', title: 'Stock' },
        { id: 'createdBy', title: 'Created By' },
        { id: 'createdAt', title: 'Created Date' },
        { id: 'updatedAt', title: 'Updated Date' }
      ]
    });

    await csvWriter.writeRecords(csvData);

    return {
      filename,
      filepath,
      recordCount: csvData.length
    };
  } catch (error) {
    console.error('Product CSV Generation Error:', error);
    throw error;
  }
};

// Auto-generate CSV scheduler
exports.startCSVScheduler = () => {
  // Schedule to run every 2 hours
  cron.schedule('0 */2 * * *', async () => {
    try {
      console.log('Starting scheduled CSV generation...');
      
      // Generate orders CSV for the last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const result = await exports.generateOrderCSV(yesterday.toISOString());
      
      if (result) {
        console.log(`CSV generated successfully: ${result.filename} with ${result.recordCount} records`);
      } else {
        console.log('No orders found for CSV generation');
      }
    } catch (error) {
      console.error('Scheduled CSV generation failed:', error);
    }
  });

  console.log('CSV scheduler started - running every 2 hours');
};

// Clean old CSV files (older than 30 days)
exports.cleanOldCSVFiles = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const files = fs.readdirSync(exportsDir);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      files.forEach(file => {
        const filePath = path.join(exportsDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < thirtyDaysAgo && file.endsWith('.csv')) {
          fs.unlinkSync(filePath);
          console.log(`Deleted old CSV file: ${file}`);
        }
      });
    } catch (error) {
      console.error('Error cleaning old CSV files:', error);
    }
  });

  console.log('CSV cleanup scheduler started - running daily');
};
