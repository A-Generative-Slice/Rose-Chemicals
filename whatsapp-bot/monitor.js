// Simple monitoring script to keep the bot alive
const https = require('https');

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://chatbot-wheat-chi-94.vercel.app/ping';

function pingWebhook() {
    const startTime = Date.now();
    
    https.get(WEBHOOK_URL, (res) => {
        const responseTime = Date.now() - startTime;
        console.log(`✅ Ping successful: ${res.statusCode} - ${responseTime}ms at ${new Date().toISOString()}`);
        
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                console.log(`📊 Bot Status: ${response.status} | Uptime: ${Math.round(response.uptime)}s | Memory: ${Math.round(response.memory)}MB`);
            } catch (e) {
                console.log(`📄 Response: ${data.substring(0, 100)}...`);
            }
        });
    }).on('error', (err) => {
        console.error(`❌ Ping failed: ${err.message} at ${new Date().toISOString()}`);
    });
}

function healthCheck() {
    console.log('🔄 Starting bot health monitoring...');
    console.log(`🎯 Target URL: ${WEBHOOK_URL}`);
    
    // Initial ping
    pingWebhook();
    
    // Ping every 5 minutes to prevent cold starts
    setInterval(pingWebhook, 5 * 60 * 1000);
}

// Start monitoring if this script is run directly
if (require.main === module) {
    healthCheck();
}

module.exports = { pingWebhook, healthCheck };