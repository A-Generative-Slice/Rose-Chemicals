const WhatsAppChat = require('../models/WhatsAppChat');
const axios = require('axios');

// @desc    Verify Webhook
// @route   GET /api/whatsapp/webhook
// @access  Public (Meta)
exports.verifyWebhook = (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.status(403).json({ success: false, message: 'Verification failed' });
        }
    } else {
        res.status(400).json({ success: false, message: 'Missing parameters' });
    }
};

// @desc    Receive Message
// @route   POST /api/whatsapp/webhook
// @access  Public (Meta)
exports.receiveMessage = async (req, res) => {
    const body = req.body;

    console.log('Incoming Webhook:', JSON.stringify(body, null, 2));

    try {
        if (body.object) {
            if (
                body.entry &&
                body.entry[0].changes &&
                body.entry[0].changes[0] &&
                body.entry[0].changes[0].value.messages &&
                body.entry[0].changes[0].value.messages[0]
            ) {
                const phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
                const from = body.entry[0].changes[0].value.messages[0].from; // sender phone number
                const msg_body = body.entry[0].changes[0].value.messages[0].text ? body.entry[0].changes[0].value.messages[0].text.body : '';
                const msg_type = body.entry[0].changes[0].value.messages[0].type;
                const msg_id = body.entry[0].changes[0].value.messages[0].id;

                // Store in DB
                await WhatsAppChat.create({
                    phoneNumber: from,
                    message: msg_body,
                    type: 'received',
                    messageId: msg_id,
                    metadata: body.entry[0].changes[0].value.messages[0]
                });

                // Auto-reply logic (Simple Echo or Greeting for now)
                // You can expand this to use OpenAI or simple switch cases
                // await sendMessage(from, "Hello! We received: " + msg_body);

            }
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.sendStatus(500);
    }
};

// Helper function to send message (can be used later)
const sendMessage = async (to, text) => {
    try {
        await axios({
            method: 'POST',
            url: `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: {
                messaging_product: 'whatsapp',
                to: to,
                text: { body: text }
            }
        });
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
};
