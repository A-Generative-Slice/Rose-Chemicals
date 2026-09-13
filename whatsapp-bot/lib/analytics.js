const mongoose = require('mongoose');

// Analytics Schema for tracking interactions
const AnalyticsSchema = new mongoose.Schema({
    phoneNumber: String,
    phoneNumberHash: String, // For privacy
    timestamp: { type: Date, default: Date.now },
    intent: String,
    userMessage: String,
    aiResponse: String,
    language: String,
    responseTime: Number,
    productsFound: Number,
    conversationLength: Number,
    sessionId: String
});

const Analytics = mongoose.model('Analytics', AnalyticsSchema);

// Helper function to hash phone number for privacy
const hashPhoneNumber = (phoneNumber) => {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(phoneNumber).digest('hex').substring(0, 8);
};

// Log user interaction
const logInteraction = async (phoneNumber, userMessage, aiResponse, language, intent, responseTime, productsFound = 0, conversationLength = 1) => {
    try {
        const analytics = new Analytics({
            phoneNumber: phoneNumber.slice(-4), // Only last 4 digits
            phoneNumberHash: hashPhoneNumber(phoneNumber),
            intent,
            userMessage: userMessage.substring(0, 200), // Limit message length for storage
            aiResponse: aiResponse.substring(0, 200),
            language,
            responseTime,
            productsFound,
            conversationLength,
            sessionId: `${hashPhoneNumber(phoneNumber)}_${Date.now()}`
        });

        await analytics.save();
        console.log(`Analytics logged: ${intent} | ${language} | ${responseTime}ms`);
    } catch (error) {
        console.error('Analytics logging error:', error);
    }
};

// Get analytics summary
const getAnalyticsSummary = async (days = 7) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const summary = await Analytics.aggregate([
            { $match: { timestamp: { $gte: startDate } } },
            {
                $group: {
                    _id: null,
                    totalInteractions: { $sum: 1 },
                    avgResponseTime: { $avg: '$responseTime' },
                    uniqueUsers: { $addToSet: '$phoneNumberHash' },
                    topIntents: { 
                        $push: '$intent' 
                    },
                    topLanguages: {
                        $push: '$language'
                    }
                }
            }
        ]);

        if (summary.length === 0) return null;

        const result = summary[0];
        
        // Count intent frequencies
        const intentCounts = {};
        result.topIntents.forEach(intent => {
            intentCounts[intent] = (intentCounts[intent] || 0) + 1;
        });

        // Count language frequencies  
        const languageCounts = {};
        result.topLanguages.forEach(lang => {
            languageCounts[lang] = (languageCounts[lang] || 0) + 1;
        });

        return {
            totalInteractions: result.totalInteractions,
            uniqueUsers: result.uniqueUsers.length,
            avgResponseTime: Math.round(result.avgResponseTime),
            topIntents: Object.entries(intentCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5),
            topLanguages: Object.entries(languageCounts)
                .sort(([,a], [,b]) => b - a)
        };
    } catch (error) {
        console.error('Analytics summary error:', error);
        return null;
    }
};

// Get daily stats
const getDailyStats = async (days = 30) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const dailyStats = await Analytics.aggregate([
            { $match: { timestamp: { $gte: startDate } } },
            {
                $group: {
                    _id: { 
                        year: { $year: '$timestamp' },
                        month: { $month: '$timestamp' },
                        day: { $dayOfMonth: '$timestamp' }
                    },
                    interactions: { $sum: 1 },
                    uniqueUsers: { $addToSet: '$phoneNumberHash' },
                    avgResponseTime: { $avg: '$responseTime' }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } }
        ]);

        return dailyStats.map(day => ({
            date: `${day._id.year}-${day._id.month.toString().padStart(2, '0')}-${day._id.day.toString().padStart(2, '0')}`,
            interactions: day.interactions,
            uniqueUsers: day.uniqueUsers.length,
            avgResponseTime: Math.round(day.avgResponseTime)
        }));
    } catch (error) {
        console.error('Daily stats error:', error);
        return [];
    }
};

// Performance monitoring
const logPerformance = async (action, duration, metadata = {}) => {
    try {
        console.log(`Performance: ${action} took ${duration}ms`, metadata);
        
        // You can extend this to log to external monitoring services
        // like Datadog, New Relic, etc.
    } catch (error) {
        console.error('Performance logging error:', error);
    }
};

// Error tracking
const logError = async (error, context = {}) => {
    try {
        console.error('Bot Error:', {
            message: error.message,
            stack: error.stack,
            context,
            timestamp: new Date()
        });
        
        // You can extend this to send to error tracking services
        // like Sentry, Rollbar, etc.
    } catch (err) {
        console.error('Error logging failed:', err);
    }
};

module.exports = { 
    logInteraction,
    getAnalyticsSummary,
    getDailyStats,
    logPerformance,
    logError
};