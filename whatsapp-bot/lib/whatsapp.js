const axios = require('axios');

const getMessagesEndpoint = () => `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

const getAuthHeaders = () => ({
    'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
});

const sendMessage = async (to, text) => {
    try {
        const response = await axios.post(
            getMessagesEndpoint(),
            {
                messaging_product: 'whatsapp',
                to: to,
                text: { body: text },
            },
            {
                headers: getAuthHeaders(),
            }
        );
        return response.data;
    } catch (error) {
        console.error('WhatsApp Send Message Error:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const sendTemplateMessage = async ({ to, templateName, languageCode = 'en', components = [] }) => {
    try {
        const payload = {
            messaging_product: 'whatsapp',
            to,
            type: 'template',
            template: {
                name: templateName,
                language: { code: languageCode },
            },
        };

        if (Array.isArray(components) && components.length > 0) {
            payload.template.components = components;
        }

        const response = await axios.post(getMessagesEndpoint(), payload, {
            headers: getAuthHeaders(),
        });

        return response.data;
    } catch (error) {
        console.error('WhatsApp Send Template Error:', error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = { sendMessage, sendTemplateMessage };
