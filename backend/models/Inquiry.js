const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['quote', 'contact'],
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Please enter your phone number']
    },
    company: {
        type: String,
        trim: true
    },
    industry: {
        type: String
    },
    subject: {
        type: String
    },
    message: {
        type: String,
        required: [true, 'Please enter your message']
    },
    productCategories: [{
        type: String
    }],
    quantity: {
        type: String
    },
    budget: {
        type: String
    },
    timeline: {
        type: String
    },
    additionalServices: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['new', 'in-progress', 'resolved', 'closed'],
        default: 'new'
    },
    adminNotes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
