require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { sendTemplateMessage } = require('../lib/whatsapp');

const TEST_NUMBERS_FILE = process.env.TEST_BATCH_FILE || path.join(__dirname, '../test_numbers.txt');
const TEMPLATE_NAME = process.env.TEST_TEMPLATE_NAME || 'floor_cleaner';
const TEMPLATE_LANGUAGE = process.env.TEST_TEMPLATE_LANG || 'en';
const BATCH_LIMIT = Number(process.env.TEST_BATCH_LIMIT || 10);
const SEND_DELAY_MS = Number(process.env.TEST_BATCH_DELAY_MS || 1200);
const TEMPLATE_HEADER_IMAGE_URL = process.env.TEST_TEMPLATE_HEADER_IMAGE_URL || '';
const TEMPLATE_HEADER_IMAGE_ID = process.env.TEST_TEMPLATE_HEADER_IMAGE_ID || '';
const USE_HEADER_IMAGE = /^https?:\/\//i.test(TEMPLATE_HEADER_IMAGE_URL);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

async function run() {
    if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
        throw new Error('Missing WhatsApp credentials in environment variables.');
    }

    const numbers = readNumbers(TEST_NUMBERS_FILE).slice(0, BATCH_LIMIT);

    if (numbers.length === 0) {
        throw new Error('No valid phone numbers found in test numbers file.');
    }

    console.log(`Starting template batch send: ${numbers.length} numbers`);
    console.log(`Template: ${TEMPLATE_NAME} (${TEMPLATE_LANGUAGE})`);
    if (TEMPLATE_HEADER_IMAGE_URL && !USE_HEADER_IMAGE) {
        console.log('Ignoring TEST_TEMPLATE_HEADER_IMAGE_URL because it is not a public http/https URL.');
    }
    if (TEMPLATE_HEADER_IMAGE_ID && TEMPLATE_HEADER_IMAGE_URL) {
        console.log('Using TEST_TEMPLATE_HEADER_IMAGE_URL and ignoring TEST_TEMPLATE_HEADER_IMAGE_ID.');
    }

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

    for (const number of numbers) {
        try {
            const response = await sendTemplateMessage({
                to: number,
                templateName: TEMPLATE_NAME,
                languageCode: TEMPLATE_LANGUAGE,
                components,
            });

            const messageId = response?.messages?.[0]?.id || 'n/a';
            console.log(`SUCCESS ${number} -> ${messageId}`);
            results.push({ number, status: 'success', messageId });
        } catch (error) {
            const apiError = error?.response?.data?.error;
            const message = apiError?.message || error.message;
            const code = apiError?.code || 'n/a';
            console.log(`FAILED ${number} -> code=${code} message=${message}`);
            results.push({ number, status: 'failed', code, message });
        }

        await delay(SEND_DELAY_MS);
    }

    const success = results.filter(item => item.status === 'success').length;
    const failed = results.length - success;

    console.log('Batch completed.');
    console.log(`Success: ${success}`);
    console.log(`Failed: ${failed}`);

    if (failed > 0) {
        process.exitCode = 1;
    }
}

run().catch((error) => {
    console.error('Batch sender error:', error.message);
    process.exit(1);
});
