const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // Check if already connected
  if (isConnected && mongoose.connections[0].readyState === 1) {
    console.log('✅ MongoDB already connected');
    return;
  }

  try {
    const options = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority'
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.log('❌ MongoDB disconnected');
    });
    
    mongoose.connection.on('error', (error) => {
      isConnected = false;
      console.error('❌ MongoDB connection error:', error);
    });
    
    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      console.log('🔄 MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    isConnected = false;
    // Don't throw error in serverless - continue without DB
    console.log('⚠️ Continuing without database connection');
  }
};

module.exports = connectDB;
