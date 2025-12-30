const express = require('express');
const router = express.Router();
const WhatsAppChat = require('../models/WhatsAppChat');
const { protect, authorize } = require('../middleware/auth');

/**
 * @desc    Get all unique conversations (last message per user)
 * @route   GET /api/admin/whatsapp/conversations
 * @access  Private/Admin
 */
router.get('/conversations', protect, authorize('admin'), async (req, res) => {
    try {
        const conversations = await WhatsAppChat.aggregate([
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: '$phoneNumber',
                    lastMessage: { $first: '$message' },
                    lastTimestamp: { $first: '$timestamp' },
                    type: { $first: '$type' }
                }
            },
            { $sort: { lastTimestamp: -1 } }
        ]);

        res.json({
            success: true,
            count: conversations.length,
            data: conversations
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
});

/**
 * @desc    Get chat history for a specific phone number
 * @route   GET /api/admin/whatsapp/history/:phoneNumber
 * @access  Private/Admin
 */
router.get('/history/:phoneNumber', protect, authorize('admin'), async (req, res) => {
    try {
        const history = await WhatsAppChat.find({ phoneNumber: req.params.phoneNumber })
            .sort({ timestamp: 1 });

        res.json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
});

module.exports = router;
