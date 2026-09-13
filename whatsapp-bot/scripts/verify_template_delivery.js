/**
 * Verify template delivery by checking last received messages for each number.
 * Shows which template (if any) was actually delivered to each number.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../lib/db');
const Chat = require('../models/Chat');

const TEST_NUMBERS = process.env.VERIFY_NUMBERS_FILE || './test_numbers.txt';
const BATCH_LIMIT = Number(process.env.VERIFY_BATCH_LIMIT || 10);

const fs = require('fs');
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
    return [...new Set(tokens)].slice(0, BATCH_LIMIT);
};

async function run() {
    if (!process.env.MONGODB_URI) {
        throw new Error('Missing MONGODB_URI in environment variables.');
    }

    await connectDB();

    // lib/db.js is designed to continue when DB is unavailable for webhook uptime.
    // For verification scripts, we need a hard fail so results are trustworthy.
    if (mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB is not connected. Verification cannot run without database access.');
    }

    const numbers = readNumbers(TEST_NUMBERS);
    if (numbers.length === 0) {
        throw new Error('No valid phone numbers found.');
    }

    console.log(`\nVerifying template delivery for ${numbers.length} numbers...\n`);
    console.log('Phone Number | Last Message Preview | Message Time | Detected Template');
    console.log('-'.repeat(90));

    const results = [];

    for (const number of numbers) {
        try {
            // Find chat by exact number, and fallback to + prefixed variant.
            const candidates = [number, `+${number}`];
            const chat = await Chat.findOne({ phoneNumber: { $in: candidates } })
                .sort({ lastUpdated: -1 })
                .lean();

            if (!chat) {
                console.log(`+${number} | NO CHAT HISTORY | N/A | UNKNOWN`);
                results.push({ number, status: 'no_history', template: 'UNKNOWN' });
                continue;
            }

            // Chat schema stores conversation in chat.messages[].
            const assistantMessages = Array.isArray(chat.messages)
                ? chat.messages.filter(m => m && m.role === 'assistant' && typeof m.content === 'string')
                : [];

            const lastAssistant = assistantMessages.length > 0
                ? assistantMessages[assistantMessages.length - 1]
                : null;

            const msg = lastAssistant?.content || '';
            const timeSource = lastAssistant?.timestamp || chat.lastUpdated;
            const time = timeSource ? new Date(timeSource).toLocaleString() : 'N/A';
            
            // Try to detect which template based on message content
            const lowered = msg.toLowerCase();
            let detectedTemplate = 'UNKNOWN';

            if (!msg) {
                detectedTemplate = 'NO_ASSISTANT_MESSAGE';
            } else if (lowered.includes('phenyl') || lowered.includes('cleaning products')) {
                detectedTemplate = 'PHENYL (detected)';
            } else if (lowered.includes('visit website') && lowered.includes('youtube link')) {
                detectedTemplate = 'ROSECHEM (detected)';
            } else if (lowered.includes('hello') || lowered.includes('please select your language')) {
                detectedTemplate = 'RC/HELLO (detected)';
            }

            const preview = msg ? msg.substring(0, 40).replace(/\n/g, ' ') : '[no assistant msg]';
            console.log(`+${number} | ${preview}... | ${time} | ${detectedTemplate}`);
            results.push({ number, status: 'found', template: detectedTemplate, message: msg });
        } catch (error) {
            console.log(`+${number} | ERROR: ${error.message} | N/A | ERROR`);
            results.push({ number, status: 'error', template: 'ERROR', message: error.message });
        }
    }

    console.log('\n' + '-'.repeat(90));
    const byTemplate = {};
    results.forEach(r => {
        byTemplate[r.template] = (byTemplate[r.template] || 0) + 1;
    });

    console.log('\nSummary:');
    Object.entries(byTemplate).forEach(([tpl, count]) => {
        console.log(`  ${tpl}: ${count} numbers`);
    });
    
    console.log('\nFull results saved above. Check if phenyl messages are actually being delivered.');
}

run().catch((error) => {
    console.error('Verification error:', error.message);
    process.exit(1);
});
