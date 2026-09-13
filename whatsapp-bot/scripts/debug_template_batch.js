/**
 * DEBUG version: Send template with detailed per-number logging to identify delivery issues.
 * Runs slower (one per 3 seconds) and logs API response details for each number.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const TEST_NUMBERS_FILE = process.env.DEBUG_BATCH_FILE || './test_numbers.txt';
const TEMPLATE_NAME = process.env.DEBUG_TEMPLATE_NAME || 'rosechem';
const TEMPLATE_LANGUAGE = process.env.DEBUG_TEMPLATE_LANG || 'en';
const BATCH_LIMIT = Number(process.env.DEBUG_BATCH_LIMIT || 10);
const SEND_DELAY_MS = Number(process.env.DEBUG_BATCH_DELAY_MS || 3000); // Slower for debug
const TEMPLATE_HEADER_IMAGE_URL = process.env.DEBUG_TEMPLATE_HEADER_IMAGE_URL || '';
const TEMPLATE_HEADER_IMAGE_ID = process.env.DEBUG_TEMPLATE_HEADER_IMAGE_ID || '';
const USE_HEADER_IMAGE = /^https?:\/\//i.test(TEMPLATE_HEADER_IMAGE_URL);

const normalizeNumber = (value) => String(value || '').replace(/\D/g, '').trim();

const readNumbers = (filePath) => {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Numbers file not found: ${filePath}`);
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const tokens = raw
        .split(/[\n,]/)
        .map(item => item.trim())
        .filter(Boolean)
        .map(normalizeNumber)
        .filter(Boolean);
    return [...new Set(tokens)];
};

const getMessagesEndpoint = () => `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

const getAuthHeaders = () => ({
    'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function sendTemplateMessage({ to, templateName, languageCode = 'en', components = [] }) {
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

    return axios.post(getMessagesEndpoint(), payload, {
        headers: getAuthHeaders(),
    });
}

async function run() {
    if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
        throw new Error('Missing WhatsApp credentials in environment variables.');
    }

    const numbers = readNumbers(TEST_NUMBERS_FILE).slice(0, BATCH_LIMIT);

    if (numbers.length === 0) {
        throw new Error('No valid phone numbers found in test numbers file.');
    }

    console.log(`\n════════════════════════════════════════════════════════════`);
    console.log(`🔍 DEBUG MODE: Template Batch Send`);
    console.log(`════════════════════════════════════════════════════════════`);
    console.log(`Numbers: ${numbers.length}`);
    console.log(`Template: ${TEMPLATE_NAME} (${TEMPLATE_LANGUAGE})`);
    console.log(`Delay per send: ${SEND_DELAY_MS}ms`);
    console.log(`Using header image: ${USE_HEADER_IMAGE ? 'YES - ' + TEMPLATE_HEADER_IMAGE_URL : 'NO'}`);
    console.log(`════════════════════════════════════════════════════════════\n`);

    const results = [];
    const components = [];

    if (USE_HEADER_IMAGE) {
        components.push({
            type: 'header',
            parameters: [
                {
                    type: 'image',
                    image: {
                        link: TEMPLATE_HEADER_IMAGE_URL,
                    },
                },
            ],
        });
    } else if (TEMPLATE_HEADER_IMAGE_ID) {
        components.push({
            type: 'header',
            parameters: [
                {
                    type: 'image',
                    image: {
                        id: TEMPLATE_HEADER_IMAGE_ID,
                    },
                },
            ],
        });
    }

    for (let idx = 0; idx < numbers.length; idx++) {
        const number = numbers[idx];
        const seqNum = idx + 1;

        process.stdout.write(`[${seqNum}/${numbers.length}] +${number} ... `);

        try {
            const response = await sendTemplateMessage({
                to: number,
                templateName: TEMPLATE_NAME,
                languageCode: TEMPLATE_LANGUAGE,
                components,
            });

            const messageId = response?.data?.messages?.[0]?.id || 'n/a';
            console.log(`✅ SUCCESS`);
            console.log(`    └─ Message ID: ${messageId}`);
            console.log(`    └─ HTTP Status: ${response.status}`);
            results.push({ number, status: 'success', messageId });
        } catch (error) {
            const apiError = error?.response?.data?.error;
            const message = apiError?.message || error.message;
            const code = apiError?.code || 'n/a';
            const httpStatus = error?.response?.status || 'n/a';
            
            console.log(`❌ FAILED`);
            console.log(`    └─ Code: ${code}`);
            console.log(`    └─ HTTP: ${httpStatus}`);
            console.log(`    └─ Message: ${message}`);
            if (error?.response?.data) {
                console.log(`    └─ Full response:`, JSON.stringify(error.response.data, null, 2));
            }
            results.push({ number, status: 'failed', code, message });
        }

        if (idx < numbers.length - 1) {
            process.stdout.write(`   ⏳ Waiting ${SEND_DELAY_MS}ms before next send...\n`);
            await delay(SEND_DELAY_MS);
        }
    }

    console.log(`\n════════════════════════════════════════════════════════════`);
    const success = results.filter(item => item.status === 'success').length;
    const failed = results.length - success;
    console.log(`📊 RESULTS: Success=${success} | Failed=${failed}`);
    console.log(`════════════════════════════════════════════════════════════\n`);

    if (failed > 0) {
        console.log(`⚠️  ${failed} numbers had delivery issues. Check logs above.`);
        process.exitCode = 1;
    } else {
        console.log(`✅ All numbers sent successfully. Check WhatsApp to verify delivery.`);
    }
}

run().catch((error) => {
    console.error('Debug batch error:', error.message);
    process.exit(1);
});
