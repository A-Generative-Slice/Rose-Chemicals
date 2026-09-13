const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        index: true,
    },
    messages: [
        {
            role: {
                type: String,
                enum: ['user', 'assistant'],
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    language: { type: String, default: 'en-IN' },
    interactionState: { type: String, default: 'IDLE' }, // IDLE, AWAITING_LANGUAGE
    lastIntent: { type: String, default: 'general' }, // Track last detected intent
    totalInteractions: { type: Number, default: 0 }, // Track conversation count
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Chat', chatSchema);
