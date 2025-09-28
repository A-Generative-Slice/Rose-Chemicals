require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');

(async () => {
  console.log('--- DB DEBUG SCRIPT START ---');
  const maskUri = (uri) => {
    if (!uri) return 'NOT SET';
    // mask only password part after first colon following scheme
    return uri.replace(/(mongodb\+srv:\/\/[^:]+):[^@]+@/, '$1:<redacted>@');
  };
  console.log('MONGO_URI:', maskUri(process.env.MONGO_URI));

  mongoose.set('debug', true);

  const start = Date.now();
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log('Connected in', Date.now() - start, 'ms');
    const admin = await mongoose.connection.db.admin().ping();
    console.log('Ping result:', admin);
    console.log('Host info:', await mongoose.connection.db.admin().serverStatus().then(s => ({ version: s.version, process: s.process, uptime: s.uptime })));
  } catch (e) {
    console.error('Connection failure:', e.message);
    if (e.reason && e.reason.code) console.error('Reason code:', e.reason.code);
    if (e.reason && e.reason.message) console.error('Reason detail:', e.reason.message);
  } finally {
    await mongoose.disconnect().catch(()=>{});
    console.log('--- DB DEBUG SCRIPT END ---');
  }
})();
