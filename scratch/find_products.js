const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const Order = require('../backend/models/Order');
const Product = require('../backend/models/Product');
const Review = require('../backend/models/Review');
const Inquiry = require('../backend/models/Inquiry');

async function findUnknownProducts() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error('MONGO_URI not found in environment');
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const rawOrders = await Order.find();
    const productIdsToFind = new Set();
    
    rawOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.product) {
            productIdsToFind.add(item.product.toString());
        }
      });
    });

    const existingProducts = await Product.find({ _id: { $in: Array.from(productIdsToFind) } });
    const existingProductIds = new Set(existingProducts.map(p => p._id.toString()));

    const missingIds = Array.from(productIdsToFind).filter(id => !existingProductIds.has(id));

    if (missingIds.length === 0) {
        console.log('No missing products found in orders.');
        return;
    }

    console.log('Missing Product IDs:', missingIds);

    for (const id of missingIds) {
      console.log(`\n----------------------------------------`);
      console.log(`Searching for info on Product ID: ${id}`);
      
      // Search in Reviews
      const reviews = await Review.find({ product: id });
      if (reviews.length > 0) {
        console.log(`Found in Reviews!`);
        reviews.forEach(r => {
            console.log(` - Product Name: ${r.productName || 'N/A'}`);
            console.log(` - Review Body: ${r.comment}`);
        });
      }

      // Search in Inquiries
      const inquiries = await Inquiry.find({ product: id });
      if (inquiries.length > 0) {
        console.log(`Found in Inquiries!`);
        inquiries.forEach(i => {
            console.log(` - Subject: ${i.subject}`);
            console.log(` - Message: ${i.message}`);
        });
      }

      // Search in other orders? 
      // Maybe some old order wasn't populated and we can see something? No.
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

findUnknownProducts();
