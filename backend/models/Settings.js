const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    general: {
        siteName: { type: String, default: 'Rose Chemicals' },
        siteDescription: { type: String, default: 'Premium chemical solutions for all your needs' },
        siteUrl: { type: String, default: 'https://rosechemicals.com' },
        logo: String,
        favicon: String,
        contactEmail: { type: String, default: 'info@rosechemicals.com' },
        contactPhone: { type: String, default: '+91 98765 43210' },
        address: { type: String, default: '123 Chemical Street, Industrial Area, Mumbai, Maharashtra 400001' },
        socialMedia: {
            facebook: String,
            twitter: String,
            instagram: String,
            linkedin: String
        }
    },
    email: {
        smtpHost: { type: String, default: 'smtp.gmail.com' },
        smtpPort: { type: String, default: '587' },
        smtpUser: String,
        smtpPassword: { type: String, select: false },
        fromEmail: { type: String, default: 'noreply@rosechemicals.com' },
        fromName: { type: String, default: 'Rose Chemicals' },
        emailTemplates: {
            welcomeEmail: { type: Boolean, default: true },
            orderConfirmation: { type: Boolean, default: true },
            orderStatusUpdate: { type: Boolean, default: true },
            passwordReset: { type: Boolean, default: true },
            promotional: { type: Boolean, default: false }
        }
    },
    payment: {
        razorpayEnabled: { type: Boolean, default: true },
        razorpayKeyId: String,
        razorpayKeySecret: { type: String, select: false },
        codEnabled: { type: Boolean, default: true },
        minOrderForCod: { type: Number, default: 500 },
        maxOrderForCod: { type: Number, default: 50000 },
        processingFee: { type: Number, default: 0 }
    },
    shipping: {
        freeShippingThreshold: { type: Number, default: 2000 },
        standardShippingRate: { type: Number, default: 100 },
        expressShippingRate: { type: Number, default: 200 },
        internationalShipping: { type: Boolean, default: false },
        estimatedDeliveryDays: {
            standard: { type: Number, default: 7 },
            express: { type: Number, default: 3 }
        },
        shippingZones: [
            {
                name: String,
                rate: Number,
                deliveryDays: Number
            }
        ]
    },
    security: {
        twoFactorAuth: { type: Boolean, default: false },
        sessionTimeout: { type: Number, default: 30 },
        maxLoginAttempts: { type: Number, default: 5 },
        passwordPolicy: {
            minLength: { type: Number, default: 8 },
            requireUppercase: { type: Boolean, default: true },
            requireNumbers: { type: Boolean, default: true },
            requireSpecialChars: { type: Boolean, default: true }
        },
        apiRateLimit: { type: Number, default: 100 }
    }
}, {
    timestamps: true,
    capped: { size: 100000, max: 1 } // Only keep ONE configuration document
});

module.exports = mongoose.model('Settings', settingsSchema);
