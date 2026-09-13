const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { searchProducts, formatProductList } = require('./productSearch');
const { detectIntent } = require('./intentDetection');

// Load local training data for Q&A and tutorials
let trainingData = [];
let tutorialsData = [];
try {
    trainingData = JSON.parse(fs.readFileSync(path.join(__dirname, '../training_data.json'), 'utf8'));
    tutorialsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../tutorials.json'), 'utf8'));
} catch (error) {
    console.error('Error loading knowledge data:', error);
}

const LANGUAGE_NAMES = {
    'en-IN': 'English',
    'ta-IN': 'Tamil',
    'hi-IN': 'Hindi',
    'ml-IN': 'Malayalam',
    'te-IN': 'Telugu',
    'kn-IN': 'Kannada'
};

// Map internal language codes to Sarvam API language codes
const LANGUAGE_CODE_MAP = {
    'en-IN': 'en',
    'ta-IN': 'ta',
    'hi-IN': 'hi',
    'ml-IN': 'ml',
    'te-IN': 'te',
    'kn-IN': 'kn'
};

const STOP_WORDS = new Set([
    'what', 'which', 'who', 'whom', 'where', 'when', 'why', 'how', 'is', 'are', 'was', 'were',
    'do', 'does', 'did', 'can', 'could', 'would', 'should', 'the', 'a', 'an', 'to', 'of', 'for',
    'and', 'or', 'in', 'on', 'at', 'with', 'me', 'you', 'your', 'my', 'our', 'please', 'tell',
    'about', 'give', 'show', 'need', 'want', 'get', 'from'
]);

const normalizeForMatch = (text) => String(text || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (text) => normalizeForMatch(text)
    .split(' ')
    .map(term => term.trim())
    .filter(term => term && term.length > 1 && !STOP_WORDS.has(term));

const findBestTrainingMatch = (message) => {
    if (!trainingData.length) {
        return null;
    }

    const normalizedMessage = normalizeForMatch(message);
    const messageTokens = new Set(tokenize(message));
    let bestMatch = null;
    let bestScore = 0;

    for (const item of trainingData) {
        const question = String(item.q || '');
        const normalizedQuestion = normalizeForMatch(question);
        const questionTokens = tokenize(question);

        if (!normalizedQuestion) {
            continue;
        }

        let score = 0;

        if (normalizedMessage === normalizedQuestion) score += 120;
        if (normalizedMessage.includes(normalizedQuestion)) score += 80;
        if (normalizedQuestion.includes(normalizedMessage) && normalizedMessage.length > 3) score += 60;

        let sharedTokens = 0;
        for (const token of questionTokens) {
            if (messageTokens.has(token)) {
                sharedTokens += 1;
            }
        }

        const coverage = sharedTokens / Math.max(questionTokens.length, 1);
        score += sharedTokens * 14;
        score += coverage * 30;

        if (normalizedMessage.includes('price') && normalizedQuestion.includes('price')) score += 12;
        if (normalizedMessage.includes('franchise') && normalizedQuestion.includes('franchise')) score += 12;
        if (normalizedMessage.includes('kit') && normalizedQuestion.includes('kit')) score += 10;
        if (normalizedMessage.includes('address') && normalizedQuestion.includes('located')) score += 8;
        if (normalizedMessage.includes('hours') && normalizedQuestion.includes('working hours')) score += 8;

        if (score > bestScore) {
            bestScore = score;
            bestMatch = item;
        }
    }

    return bestScore >= 30 ? bestMatch : null;
};

const translateResponse = async (text, language = 'en-IN') => {
    if (!text || language === 'en-IN') {
        return text;
    }

    const languageName = LANGUAGE_NAMES[language] || 'English';

    try {
        console.log(`📝 Translating to ${languageName}...`);
        const response = await axios.post('https://api.sarvam.ai/v1/chat/completions', {
            model: 'sarvam-m',
            messages: [
                {
                    role: 'system',
                    content: `You are a professional translator. Translate the following text to ${languageName} ONLY. Preserve all phone numbers, prices, URLs, product names, bullet points, and emphasis. Return ONLY the translated text, nothing else.`
                },
                {
                    role: 'user',
                    content: String(text).substring(0, 2000)
                }
            ],
            temperature: 0.1,
            max_tokens: 1200
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(process.env.SARVAM_API_KEY || '').trim()}`
            },
            timeout: 15000
        });

        const translated = response.data?.choices?.[0]?.message?.content || text;
        console.log(`✅ Translation to ${languageName} complete`);
        return translated;
    } catch (error) {
        console.error('❌ Translation error:', error.message);
        return text;
    }
};

const findRelevantTutorials = (message) => {
    const msg = message.toLowerCase();
    const searchTerms = msg.split(/[\s,]+/).filter(word => word.length > 2);

    let filtered = tutorialsData.filter(t => {
        const title = t.title.toLowerCase();
        return searchTerms.some(term => title.includes(term));
    });

    // GENEROUS FALLBACK for official Rose Chemicals content
    if (filtered.length === 0 && (msg.includes('tutorial') || msg.includes('video') || msg.includes('youtube') || msg.includes('yputube') || msg.includes('link'))) {
        // Return 8 random/diverse videos FROM THE OFFICIAL LIST
        return tutorialsData.sort(() => 0.5 - Math.random()).slice(0, 8);
    }

    return filtered.slice(0, 5);
};

const generateResponse = async (message, language = 'en-IN', chatHistory = [], userPhoneNumber = '') => {
    try {
        console.log(`🌍 Language Setting: ${language} (${LANGUAGE_NAMES[language] || 'Unknown'})`);
        console.log(`📤 Sarvam API Language Code: ${LANGUAGE_CODE_MAP[language] || 'en'}`);
        
        const intent = detectIntent(message);
        const relevantProducts = await searchProducts(message, intent, 10);
        const relevantTutorials = findRelevantTutorials(message);

        const productIntents = new Set([
            'broom_inquiry',
            'brush_inquiry',
            'mop_inquiry',
            'wiper_inquiry',
            'cleaning_tools_inquiry',
            'price_inquiry'
        ]);

        const hasProductKeyword = /(broom|brooms|brush|brushes|mop|mops|wiper|wipers|toilet|sink|cleaning tools)/i.test(message);
        if ((productIntents.has(intent) || hasProductKeyword) && relevantProducts.length > 0) {
            const productList = formatProductList(relevantProducts.slice(0, 6), intent, language);
            return language === 'en-IN' ? productList : await translateResponse(productList, language);
        }

        const qanda = findBestTrainingMatch(message);
        if (qanda?.a) {
            return language === 'en-IN' ? qanda.a : await translateResponse(qanda.a, language);
        }

        let productContext = formatProductList(relevantProducts, intent, language);
        let tutorialContext = relevantTutorials.length > 0
            ? "\n\nOFFICIAL TUTORIAL VIDEOS (CRITICAL: ONLY use these links!):\n" + relevantTutorials.map(t => `- ${t.title}: ${t.link}`).join('\n')
            : "";

        const systemPrompt = `
You are "Rose", a professional and helpful customer support representative for "Rose Chemicals". 🌸
Your goal is to CLOSE SALES and provide EXPERT chemical manufacturing advice.

PERSONALITY: Warm, professional, energetic. 

RESPONSE LANGUAGE: **ALWAYS respond in ${LANGUAGE_NAMES[language] || 'English'}**. Do NOT use English unless specifically instructed.

STRICT GUARDRAILS (ZERO TOLERANCE):
1. ❌ NEVER USE MARKDOWN LINKS like [text](url). WhatsApp DOES NOT support them.
2. ❌ ALWAYS provide URLs as RAW PLAIN TEXT (e.g., "Link: https://youtube.com/...").
3. ❌ NEVER WRAP LINKS IN BRACKETS like [url] or (url). ONLY raw text.
4. ❌ NEVER REPEAT the product link if it is already provided in the list.
5. ❌ ONLY suggest products and prices listed in "AVAILABLE PRODUCTS".
6. ❌ ONLY provide a YouTube link if it is explicitly listed in "OFFICIAL TUTORIAL VIDEOS".

${qanda ? `CRITICAL KNOWLEDGE BASE:\nUser is asking about: ` + qanda.q + `\nExpert Answer to provide: ` + qanda.a + `\n\n` : ''}

AVAILABLE PRODUCTS:
${productContext}

${tutorialContext}

COMPANY INFO:
- Address: No.179, First Street, Tagore Nagar, Tiruppalai, Madurai – 625014
- Contact: +91 8610570490
- YouTube Channel: https://www.youtube.com/@rosechemicals126

INSTRUCTIONS:
1. USE THE "AVAILABLE PRODUCTS" LIST EXACTLY AS FORMATTED. ❌ DO NOT add your own brackets or repeat links.
2. If the user asks for "video", "youtube", or "tutorial", list AT LEAST 5 official tutorial links from the context below.
3. Mention our YouTube Channel: https://www.youtube.com/@rosechemicals126 for all tutorials.
`;


        // STRICT: Format history ensuring alternating roles (user/assistant)
        let historyMessages = [];
        let lastRole = 'assistant'; // We want the first history message to be 'user'

        if (chatHistory && Array.isArray(chatHistory)) {
            const rawHistory = chatHistory
                .filter(m => m && m.content && m.content !== message)
                .slice(-6);

            for (const m of rawHistory) {
                const currentRole = m.role === 'assistant' ? 'assistant' : 'user';
                if (currentRole !== lastRole) {
                    historyMessages.push({
                        role: currentRole,
                        content: String(m.content || "").substring(0, 500)
                    });
                    lastRole = currentRole;
                }
            }
        }

        const messages = [
            { role: "system", content: systemPrompt.trim() }
        ];

        // Add history
        messages.push(...historyMessages);

        // Final safety: If last message in history is 'user', remove it to avoid back-to-back users
        if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
            messages.pop();
        }

        // Add current user message
        messages.push({ role: "user", content: String(message).substring(0, 1000) });

        let response;
        try {
            response = await axios.post('https://api.sarvam.ai/v1/chat/completions', {
                model: "sarvam-m",
                messages: messages,
                temperature: 0.5,
                max_tokens: 800
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(process.env.SARVAM_API_KEY || '').trim()}`
                },
                timeout: 15000
            });
        } catch (initialError) {
            // If we get a 400 error, try again with a much simpler prompt
            if (initialError.response?.status === 400) {
                console.log(`⚠️ Got 400 error, retrying with simplified prompt...`);
                const simpleMessages = [
                    { role: "system", content: `You are Rose Chemicals customer support. Answer the customer's question helpfully.` },
                    { role: "user", content: String(message).substring(0, 1000) }
                ];
                
                try {
                    response = await axios.post('https://api.sarvam.ai/v1/chat/completions', {
                        model: "sarvam-m",
                        messages: simpleMessages,
                        temperature: 0.5,
                        max_tokens: 800
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${(process.env.SARVAM_API_KEY || '').trim()}`
                        },
                        timeout: 15000
                    });
                    console.log(`✅ Retry successful with simple prompt`);
                } catch (retryError) {
                    throw retryError; // If retry still fails, throw to catch block below
                }
            } else {
                throw initialError; // Re-throw non-400 errors
            }
        }

        let rawContent = response.data?.choices?.[0]?.message?.content || "I'm sorry, I'm feeling a bit shy right now! 🌸 Please call us at +91 8610570490 and we'll help you immediately!";
        const cleanedContent = rawContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        
        console.log(`\n📊 RESPONSE GENERATION DETAILS:`);
        console.log(`   Language: ${language} (${LANGUAGE_NAMES[language]})`);
        console.log(`   Response length: ${cleanedContent.length} chars`);
        console.log(`   First 100 chars: "${cleanedContent.substring(0, 100)}..."`);
        
        console.log(`\n✅ Returning generated response\n`);
        return cleanedContent;

    } catch (error) {
        const errorData = error.response?.data;
        const statusCode = error.response?.status || "ERR";
        const detailedMsg = typeof errorData === 'object' ? JSON.stringify(errorData) : String(errorData || error.message);

        console.error('❌ Sarvam API Error:', { status: statusCode, data: errorData, language });
        
        // Pre-translated error messages for common languages
        const errorMessages = {
            'en-IN': `🌸 I'm having a quick tea break! (Code: ${statusCode}). Please contact our team at +91 8610570490 for any assistance. ✨`,
            'ta-IN': `🌸 ஒரு சிறிய தேநீர் உற்ற வேளை! (Code: ${statusCode}). உதவிக்கு +91 8610570490 ல் தொடர்பு கொள்ளுங்கள். ✨`,
            'hi-IN': `🌸 मैं एक छोटा चाय ब्रेक ले रहा हूँ! (Code: ${statusCode}). सहायता के लिए +91 8610570490 पर संपर्क करें। ✨`,
            'ml-IN': `🌸 ഒരു ചെറിയ ചായ ഇടവേള! (Code: ${statusCode}). സഹായത്തിനായി +91 8610570490 ൽ ബന്ധപ്പെടുക। ✨`,
            'te-IN': `🌸 నేను ఒక చిన్న టీ బ్రేక్ తీసుకుంటున్నాను! (Code: ${statusCode}). సహాయం కోసం +91 8610570490 ను సంప్రదించండి। ✨`,
            'kn-IN': `🌸 ನಾನು ಸಣ್ಣ ಚಾ ವಿರಾಮ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ! (Code: ${statusCode}). ಸಹಾಯಕ್ಕಾಗಿ +91 8610570490 ಅನ್ನು ಸಂಪರ್ಕಿಸಿ। ✨`
        };
        
        const errorMsg = errorMessages[language] || errorMessages['en-IN'];
        console.log(`✅ Returning error message in ${LANGUAGE_NAMES[language]}`);
        return errorMsg;
    }
};

module.exports = { generateResponse };
