const express = require('express');
const router = express.Router();
const { verifyWebhook, receiveMessage } = require('../controllers/whatsappWebhook');

/**
 * @desc    Meta Webhook Verification
 * @route   GET /api/whatsapp/webhook
 * @access  Public
 */
router.get('/webhook', verifyWebhook);

/**
 * @desc    Receive WhatsApp Message
 * @route   POST /api/whatsapp/webhook
 * @access  Public
 */
router.post('/webhook', receiveMessage);

module.exports = router;
