require('dotenv').config();

const connectDB = require('../lib/db');
const { sendTemplateMessage } = require('../lib/whatsapp');
const Chat = require('../models/Chat');

const TEMPLATE_NAME = process.env.TEST_TEMPLATE_NAME || 'floor_cleaner';
const TEMPLATE_LANGUAGE = process.env.TEST_TEMPLATE_LANG || 'en';
const BATCH_LIMIT = Number(process.env.TEST_BATCH_LIMIT || 100);
const SEND_DELAY_MS = Number(process.env.TEST_BATCH_DELAY_MS || 1200);
const ONLY_LAST_DAYS = Number(process.env.TEST_RECENT_DAYS || 0);
const TEMPLATE_HEADER_IMAGE_URL = process.env.TEST_TEMPLATE_HEADER_IMAGE_URL || '';
const TEMPLATE_HEADER_IMAGE_ID = process.env.TEST_TEMPLATE_HEADER_IMAGE_ID || '';
const USE_HEADER_IMAGE = /^https?:\/\//i.test(TEMPLATE_HEADER_IMAGE_URL);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const normalizeNumber = (value) => String(value || '').replace(/\D/g, '').trim();

async function getRecipients() {
    const query = {};

    if (ONLY_LAST_DAYS > 0) {
        const since = new Date();
        since.setDate(since.getDate() - ONLY_LAST_DAYS);
        query.lastUpdated = { $gte: since };
    }

    const chats = await Chat.find(query).select('phoneNumber lastUpdated').sort({ lastUpdated: -1 });

    const uniqueNumbers = [];
    const seen = new Set();

    for (const chat of chats) {
        const number = normalizeNumber(chat.phoneNumber);
        if (!number || seen.has(number)) {
            continue;
        }

        seen.add(number);
        uniqueNumbers.push(number);
        if (uniqueNumbers.length >= BATCH_LIMIT) {
            break;
        }
    }

    return uniqueNumbers;
}

async function run() {
    if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
        throw new Error('Missing WhatsApp credentials in environment variables.');
    }

    if (!process.env.MONGODB_URI) {
        throw new Error('Missing MONGODB_URI in environment variables.');
    }

    await connectDB();

    const numbers = await getRecipients();

    if (numbers.length === 0) {
        throw new Error('No previous phone numbers found in the Chat collection.');
    }

    console.log(`Starting template send to previous numbers: ${numbers.length} recipients`);
    console.log(`Template: ${TEMPLATE_NAME} (${TEMPLATE_LANGUAGE})`);
    if (ONLY_LAST_DAYS > 0) {
        console.log(`Filter: last ${ONLY_LAST_DAYS} days`);
    }
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