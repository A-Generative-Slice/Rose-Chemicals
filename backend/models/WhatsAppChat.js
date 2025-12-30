const mongoose = require('mongoose');

const WhatsAppChatSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['received', 'sent'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    messageId: {
        type: String,
        unique: true,
        sparse: true
    },
    metadata: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('WhatsAppChat', WhatsAppChatSchema);
