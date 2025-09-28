const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

// Attach once to avoid duplicates if hot reloaded
let listenersAttached = false;

const attachDiagnostics = (conn) => {
  if (listenersAttached || !conn) return;
  listenersAttached = true;
  conn.on('connected', () => console.log('[Mongoose] event: connected'));
  conn.on('open', () => console.log('[Mongoose] event: open'));
  conn.on('disconnected', () => console.log('[Mongoose] event: disconnected'));
  conn.on('reconnected', () => console.log('[Mongoose] event: reconnected'));
  conn.on('close', () => console.log('[Mongoose] event: close'));
  conn.on('error', (err) => console.error('[Mongoose] connection error event:', err.message));
};

const connectDB = async () => {
  if (process.env.MONGOOSE_DEBUG === 'true') {
    mongoose.set('debug', (collection, method, query, doc) => {
      console.log(`[Mongoose:debug] ${collection}.${method}`, JSON.stringify(query), doc ? ('docKeys=' + Object.keys(doc).join(',')) : '');
    });
  }
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
        attachDiagnostics(mongoose.connection);
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
        attachDiagnostics(mongoose.connection);
        return;
      }
    }
    
    // Try external MongoDB URI
    const masked = process.env.MONGO_URI ? process.env.MONGO_URI.replace(/(mongodb\+srv:\/\/[^:]+):[^@]+@/, '$1:<redacted>@') : 'NOT SET';
    console.log('Attempting MongoDB Atlas connection to:', masked);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    attachDiagnostics(mongoose.connection);
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    if (process.env.FALLBACK_INMEMORY_ON_FAIL === 'true') {
      try {
        console.log('⚠️ Falling back to in-memory MongoDB due to connection failure...');
        mongod = await MongoMemoryServer.create();
        const mongoUri = mongod.getUri();
        const conn = await mongoose.connect(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log(`✅ In-Memory MongoDB Connected (fallback): ${conn.connection.host}`);
        console.log('📝 Note: Data will not persist after server restart');
        attachDiagnostics(mongoose.connection);
        return;
      } catch (memErr) {
        console.error('❌ In-memory fallback also failed:', memErr);
      }
    }
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
