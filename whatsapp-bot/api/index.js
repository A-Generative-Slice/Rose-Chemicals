require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('../lib/db');
const { sendMessage } = require('../lib/whatsapp');
const { generateResponse } = require('../lib/sarvam');
const { detectIntent } = require('../lib/intentDetection');
const { logInteraction, getAnalyticsSummary, logError } = require('../lib/analytics');
const Chat = require('../models/Chat');

// In-memory fallback session state used when DB is unavailable.
const ephemeralSessions = new Map();

const LANGUAGE_CHOICES = {
    '1': { code: 'en-IN', name: 'English' },
    '2': { code: 'ta-IN', name: 'Tamil' },
    '3': { code: 'hi-IN', name: 'Hindi' },
    '4': { code: 'ml-IN', name: 'Malayalam' },
    '5': { code: 'te-IN', name: 'Telugu' },
    '6': { code: 'kn-IN', name: 'Kannada' }
};

const LANGUAGE_ALIASES = {
    english: '1',
    en: '1',
    tamil: '2',
    hindi: '3',
    malayalam: '4',
    telugu: '5',
    kannada: '6'
};

const normalizeInput = (value) => String(value || '').trim().toLowerCase();

const getLanguageSelection = (input) => {
    const normalized = normalizeInput(input);
    const numericChoice = LANGUAGE_CHOICES[normalized];

    if (numericChoice) {
        return numericChoice;
    }

    const aliasChoice = LANGUAGE_ALIASES[normalized];
    return aliasChoice ? LANGUAGE_CHOICES[aliasChoice] : null;
};

const hasRecentLanguageMenu = (chat) => {
    if (!chat?.messages?.length) {
        return false;
    }

    return chat.messages.slice(-4).some(message => {
        if (message.role !== 'assistant' || !message.content) {
            return false;
        }

        const content = message.content.toLowerCase();
        return content.includes('please select your language') || content.includes('reply with number (1-6)');
    });
};

const app = express();
const cors = require('cors');

// Enable CORS for the website
app.use(cors({
    origin: ['https://rosechemicals.in', 'http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    credentials: true
}));

app.use(bodyParser.json());

// Middleware to protect admin routes
const protectAdmin = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    const secret = process.env.ADMIN_API_KEY || 'RoseAdminSecret2025';

    if (apiKey === secret) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized: Invalid Admin API Key 🚫' });
};

// Connect to Database
// Connect to Database
// connectDB() moved to handlers for serverless support

// Health check endpoint with detailed status
app.get('/', (req, res) => {
    res.json({
        message: 'Rose Chemicals WhatsApp Bot is running!',
        timestamp: new Date(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        status: 'healthy',
        env_check: {
            verify_token: !!process.env.WHATSAPP_VERIFY_TOKEN,
            access_token: !!process.env.WHATSAPP_ACCESS_TOKEN,
            mongodb_uri: !!process.env.MONGODB_URI
        }
    });
});

// Keep-alive endpoint to prevent cold starts
app.get('/ping', (req, res) => {
    res.json({
        status: 'alive',
        timestamp: new Date(),
        uptime: process.uptime(),
        memory: process.memoryUsage().heapUsed / 1024 / 1024, // MB
        version: '1.0.0'
    });
});

// Webhook Verification (GET)
app.get('/webhook', (req, res) => {
    try {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        console.log('Webhook verification attempt:');
        console.log('Mode:', mode);
        console.log('Token received:', token);
        console.log('Expected token:', process.env.WHATSAPP_VERIFY_TOKEN);
        console.log('Challenge:', challenge);

        if (mode && token && challenge) {
            if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
                console.log('✅ Webhook verified successfully');
                return res.status(200).send(challenge);
            } else {
                console.log('❌ Token mismatch or wrong mode');
                return res.sendStatus(403);
            }
        } else {
            console.log('❌ Missing required parameters');
            return res.sendStatus(400);
        }
    } catch (error) {
        console.error('Webhook verification error:', error.message);
        return res.status(500).json({ error: 'Webhook verification failed' });
    }
});

// Webhook Event Handling (POST)
app.post('/webhook', async (req, res) => {
    // Send 200 immediately to WhatsApp to prevent retries
    res.sendStatus(200);

    try {
        console.log('📨 POST webhook called at:', new Date().toISOString());

        // Connect to DB with timeout
        const dbTimeout = setTimeout(() => {
            console.log('⚠️ DB connection timeout, continuing without DB');
        }, 3000);

        try {
            await connectDB();
            clearTimeout(dbTimeout);
            console.log('✅ Database connected successfully');
        } catch (dbError) {
            clearTimeout(dbTimeout);
            console.error('❌ Database connection failed:', dbError);
            // Continue processing without DB
        }

        const body = req.body;
        console.log('🔍 Webhook Body:', JSON.stringify(body, null, 2));

        if (body.object && body.entry && body.entry[0].changes) {
            console.log('✅ Body structure valid');
            const messageObject = body.entry[0].changes[0]?.value?.messages?.[0];
            console.log('🔍 Message Object:', JSON.stringify(messageObject, null, 2));

            if (!messageObject) {
                console.log('⚠️ No message object found');
                return;
            }

            const from = messageObject.from;
            const text = messageObject.text?.body;
            console.log(`🔍 From: ${from}, Text: ${text}`);

            if (!text) {
                console.log('⚠️ No text content found');
                return;
            }

            console.log(`📨 Processing message from ${from}: "${text.substring(0, 50)}..."`);

            // Process message with timeout
            const processTimeout = setTimeout(() => {
                console.log('⚠️ Message processing timeout for:', from);
            }, 25000);

            try {
                await processUserMessage(from, text);
                clearTimeout(processTimeout);
                console.log('✅ Message processed successfully for:', from);
            } catch (processError) {
                clearTimeout(processTimeout);
                console.error('❌ Message processing error:', processError);

                // Send fallback response
                try {
                    await sendMessage(from, "⚠️ I'm experiencing technical difficulties. Please try again in a few minutes or call us at +91 8610570490.");
                } catch (fallbackError) {
                    console.error('❌ Fallback message failed:', fallbackError);
                }
            }
        }

    } catch (error) {
        console.error('❌ Webhook Error:', error.message);
        // Don't throw error - just log it
    }
});

// Separate message processing function
async function processUserMessage(from, text) {

    // Find or create chat session
    let chat;
    try {
        chat = await Chat.findOne({ phoneNumber: from });
        if (!chat) {
            chat = new Chat({ phoneNumber: from, messages: [], language: 'en-IN', interactionState: 'IDLE' });
        }
    } catch (chatError) {
        console.error('❌ Chat session error:', chatError);
        // Create minimal chat object for processing
        chat = {
            phoneNumber: from,
            messages: [],
            language: 'en-IN',
            interactionState: 'IDLE',
            save: async () => console.log('Chat save skipped due to DB error')
        };
    }

    const input = text.trim();
    const languageSelection = getLanguageSelection(input);

    // Rehydrate state from memory if DB state is missing/unavailable.
    const fallbackState = ephemeralSessions.get(from);
    if (fallbackState) {
        if (chat.interactionState === 'IDLE' && fallbackState.interactionState) {
            chat.interactionState = fallbackState.interactionState;
        }
        // ✅ Always use fallback language if DB language is still default
        if ((chat.language === 'en-IN' || !chat.language) && fallbackState.language) {
            chat.language = fallbackState.language;
            console.log(`🔄 Restored language from fallback: ${fallbackState.language}`);
        }
    }

    // Enhanced menu/reset commands
    if (input.toLowerCase().match(/^(hello|hi|hey|menu|start|restart|reset)$/)) {
        const menuMsg = `🙏 *Welcome to Rose Chemicals!*
                        
🏭 India's leading cleaning product manufacturer & franchise provider.

🌍 *Please select your language:*
1️⃣ English
2️⃣ Tamil (தமிழ்)  
3️⃣ Hindi (हिंदी)
4️⃣ Malayalam (മലയാളം)
5️⃣ Telugu (తెలుగు)
6️⃣ Kannada (ಕನ್ನಡ)

*Reply with number (1-6)*
💡 *Note: You can say 'hi' at any time to return to this menu.*`;

        // Send message FIRST
        await sendMessage(from, menuMsg);

        // Update DB with history and state
        try {
            chat.messages.push({ role: 'user', content: text });
            chat.messages.push({ role: 'assistant', content: menuMsg });
            chat.interactionState = 'AWAITING_LANGUAGE';
            await chat.save();
        } catch (err) {
            console.error('Based DB update failed, but message sent:', err.message);
        }

        ephemeralSessions.set(from, {
            interactionState: 'AWAITING_LANGUAGE',
            language: chat.language || 'en-IN'
        });
        return; // Exit early
    }

    // Enhanced language selection with better welcome messages
    const awaitingLanguage = chat.interactionState === 'AWAITING_LANGUAGE' || fallbackState?.interactionState === 'AWAITING_LANGUAGE' || hasRecentLanguageMenu(chat);
    if (languageSelection && awaitingLanguage) {
        const selectedKey = LANGUAGE_ALIASES[normalizeInput(input)] || input;
        const langMap = {
            '1': {
                code: 'en-IN',
                name: 'English',
                msg: `✨ *Welcome to Rose Chemicals!*

🏭 *What we offer:*
• DIY Product Manufacturing Kits (Complete formulations)
• Raw Chemical Materials Supply
• Ready-to-use Cleaning Products
• Franchise Opportunities with Full Support

💡 *You can ask me about:*
• Product prices & details
• DIY kit information (yields & costs)
• Franchise opportunities  
• Technical support & training
• Sample products

🔥 *Try asking:*
"Tell me about fabric conditioner kit"
"What DIY kits do you have?"
"Franchise information please"

📞 *Contact:* +91 8610570490
🌐 *Website:* www.rosechemicals.in`
            },
            '2': {
                code: 'ta-IN',
                name: 'Tamil',
                msg: `✨ *ரோஸ் கெமிக்கல்ஸிற்கு வரவேற்கிறோம்!*

🏭 *எங்கள் சேவைகள்:*
• DIY தயாரிப்பு உற்பத்தி கிட்கள்
• மூலப்பொருள் இரசாயனங்கள்
• உடனடி பயன்பாட்டு தயாரிப்புகள்
• உரிமை வணிக வாய்ப்புகள்

💡 *என்னிடம் கேளுங்கள்:*
• தயாரிப்பு விலைகள்
• DIY கிட் தகவல்கள்
• உரிமைத் தொழில் வாய்ப்புகள்

📞 *தொடர்பு:* +91 8610570490
🌐 *வலைதளம்:* www.rosechemicals.in`
            },
            '3': {
                code: 'hi-IN',
                name: 'Hindi',
                msg: `✨ *रोज़ केमिकल्स में आपका स्वागत है!*

🏭 *हमारी सेवाएं:*
• DIY उत्पाद निर्माण किट
• कच्चे रसायन सामग्री
• तैयार सफाई उत्पाद
• फ्रैंचाइज़ी के अवसर

💡 *मुझसे पूछें:*
• उत्पाद की कीमतें
• DIY किट की जानकारी
• फ्रैंचाइज़ी जानकारी

📞 *संपर्क:* +91 8610570490
🌐 *वेबसाइट:* www.rosechemicals.in`
            },
            '4': {
                code: 'ml-IN',
                name: 'Malayalam',
                msg: `✨ *റോസ് കെമിക്കൽസിലേക്ക് സ്വാഗതം!*

🏭 *ഞങ്ങളുടെ സേവനങ്ങൾ:*
• DIY ഉൽപ്പാദന കിറ്റുകൾ
• അസംസ്കൃത രാസവസ്തുക്കൾ
• പ്രയോജനകരമായ ഉൽപ്പന്നങ്ങൾ
• ഫ്രാഞ്ചൈസി അവസരങ്ങൾ

📞 *ബന്ധപ്പെടുക:* +91 8610570490
🌐 *വെബ്സൈറ്റ്:* www.rosechemicals.in`
            },
            '5': {
                code: 'te-IN',
                name: 'Telugu',
                msg: `✨ *రోజ్ కెమికల్స్ కి స్వాగతం!*

🏭 *మా సేవలు:*
• DIY ఉత్పత్తి తయారీ కిట్లు
• ముడి రసాయన పదార్థాలు
• సిద్ధమైన క్లీనింగ్ ఉత్పత్తులు
• ఫ్రాంచైజీ అవకాశాలు

📞 *సంప్రదించండి:* +91 8610570490
🌐 *వెబ్‌సైట్:* www.rosechemicals.in`
            },
            '6': {
                code: 'kn-IN',
                name: 'Kannada',
                msg: `✨ *ರೋಸ್ ಕೆಮಿಕಲ್ಸ್‌ಗೆ ಸ್ವಾಗತ!*

🏭 *ನಮ್ಮ ಸೇವೆಗಳು:*
• DIY ಉತ್ಪಾದನಾ ಕಿಟ್‌ಗಳು
• ಕಚ್ಚಾ ರಾಸಾಯನಿಕ ವಸ್ತುಗಳು
• ಸಿದ್ಧ ಉತ್ಪನ್ನಗಳು
• ಫ್ರಾಂಚೈಸಿ ಅವಕಾಶಗಳು

📞 *ಸಂಪರ್ಕ:* +91 8610570490
🌐 *ವೆಬ್‌ಸೈಟ್:* www.rosechemicals.in`
            }
        };

        if (langMap[selectedKey]) {
            const welcomeMsg = langMap[selectedKey].msg;
            const selectedLangCode = langMap[selectedKey].code;
            console.log(`✅ Language selected: ${langMap[selectedKey].name} (${selectedLangCode})`);
            
            // Send message FIRST
            await sendMessage(from, welcomeMsg);

            // Update DB with history and language
            try {
                chat.messages.push({ role: 'user', content: text });
                chat.messages.push({ role: 'assistant', content: welcomeMsg });
                chat.language = selectedLangCode;
                chat.interactionState = 'IDLE';
                await chat.save();
                console.log(`📝 Saved to DB: language = ${chat.language}`);
            } catch (err) {
                console.error('Language DB update failed, but message sent:', err.message);
            }

            ephemeralSessions.set(from, {
                interactionState: 'IDLE',
                language: selectedLangCode
            });
            console.log(`💾 Saved to ephemeralSessions: language = ${selectedLangCode}`);
        } else {
            const retryMsg = `Please reply with a number from 1 to 6.

1️⃣ English
2️⃣ Tamil (தமிழ்)
3️⃣ Hindi (हिंदी)
4️⃣ Malayalam (മലയാളം)
5️⃣ Telugu (తెలుగు)
6️⃣ Kannada (ಕನ್ನಡ)`;
            await sendMessage(from, retryMsg);

            try {
                chat.messages.push({ role: 'user', content: text });
                chat.messages.push({ role: 'assistant', content: retryMsg });
                await chat.save();
            } catch (err) {
                console.error('Language retry DB update failed:', err.message);
            }

            ephemeralSessions.set(from, {
                interactionState: 'AWAITING_LANGUAGE',
                language: chat.language || 'en-IN'
            });
        }
        return; // Exit after language selection
    }

    // Enhanced AI chat with intent detection and context
    const startTime = Date.now();

    // Detect user intent for better processing
    const userIntent = detectIntent(text);
    console.log(`🔍 Intent detected: ${userIntent} for message from ${from}: "${text}"`);
    console.log(`🌍 Current Language Setting: ${chat.language} (${chat.language === 'en-IN' ? 'English' : 'Non-English'})`);

    // Save user message
    chat.messages.push({ role: 'user', content: text });

    // Generate enhanced AI response with full context
    console.log(`📤 Calling generateResponse with language: ${chat.language}`);
    const aiResponse = await generateResponse(
        text,
        chat.language,
        chat.messages.slice(-5), // Last 5 messages for context
        from
    );

    // Send response back to user
    await sendMessage(from, aiResponse);

    // Save AI response and update chat
    chat.messages.push({ role: 'assistant', content: aiResponse });
    chat.lastUpdated = new Date();
    chat.lastIntent = userIntent; // Track user intent
    chat.totalInteractions += 1; // Increment interaction count
    await chat.save();

    ephemeralSessions.set(from, {
        interactionState: chat.interactionState || 'IDLE',
        language: chat.language || 'en-IN'
    });

    const responseTime = Date.now() - startTime;
    console.log(`Response sent to ${from} in ${responseTime}ms for intent: ${userIntent}`);

    // Log analytics for this interaction
    await logInteraction(
        from,
        text,
        aiResponse,
        chat.language,
        userIntent,
        responseTime,
        0, // productsFound - can be enhanced later
        chat.messages.length
    );
}

// Admin API to fetch chats with pagination
app.get('/api/chats', protectAdmin, async (req, res) => {
    const { page = 1, limit = 20, phoneNumber, flat } = req.query;
    console.log(`👤 Admin fetching chats: Page ${page}${phoneNumber ? ` for ${phoneNumber}` : ''}`);
    try {
        await connectDB();
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const query = phoneNumber ? { phoneNumber } : {};

        const chats = await Chat.find(query)
            .sort({ lastUpdated: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Chat.countDocuments(query);
        console.log(`📊 Found ${chats.length} active chats out of ${total} total.`);

        // COMPATIBILITY: return structure that works with most frontends
        if (flat === 'true') {
            return res.status(200).json(chats);
        }

        res.status(200).json({
            success: true,
            chats,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                count: chats.length
            }
        });
    } catch (error) {
        console.error('❌ Error fetching chats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Analytics API
app.get('/api/analytics', protectAdmin, async (req, res) => {
    try {
        await connectDB();
        const days = parseInt(req.query.days) || 7;
        const summary = await getAnalyticsSummary(days);

        if (!summary) {
            return res.json({
                message: 'No analytics data available for the specified period',
                days
            });
        }

        res.json({
            period: `${days} days`,
            summary,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
// Force deployment - Mon 12 Jan 2026 01:58:50 AM IST
