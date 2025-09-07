const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

const connectDB = async () => {
  try {
    // Try connecting to local MongoDB first
    if (process.env.MONGO_URI && process.env.MONGO_URI.includes('localhost')) {
      try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000, // 5 second timeout
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (localError) {
        console.log('⚠️ Local MongoDB not available, starting in-memory database...');
        
        // Start in-memory MongoDB server
        mongod = await MongoMemoryServer.create();
        const mongoUri = mongod.getUri();
        
        const conn = await mongoose.connect(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        
        console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
        console.log('📝 Note: Data will not persist after server restart');
        return;
      }
    }
    
    // Try external MongoDB URI
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
};

module.exports = { connectDB, disconnectDB };
