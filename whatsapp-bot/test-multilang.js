// Quick test to verify multilanguage translation is working
require('dotenv').config();
const axios = require('axios');

const LANGUAGE_NAMES = {
    'en-IN': 'English',
    'ta-IN': 'Tamil',
    'hi-IN': 'Hindi',
    'ml-IN': 'Malayalam',
    'te-IN': 'Telugu',
    'kn-IN': 'Kannada'
};

const translateResponse = async (text, language = 'en-IN') => {
    if (!text || language === 'en-IN') {
        return text;
    }

    const languageName = LANGUAGE_NAMES[language] || 'English';

    try {
        console.log(`\n📤 Sending translation request to Sarvam API...`);
        console.log(`   Language: ${languageName} (${language})`);
        console.log(`   Text to translate: "${text.substring(0, 50)}..."\n`);

        const response = await axios.post('https://api.sarvam.ai/v1/chat/completions', {
            model: 'sarvam-m',
            messages: [
                {
                    role: 'system',
                    content: `Translate to ${languageName}. Preserve all phone numbers, prices, URLs, and emphasis. Return only the translation.`
                },
                {
                    role: 'user',
                    content: String(text).substring(0, 2000)
                }
            ],
            temperature: 0.2,
            max_tokens: 900
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(process.env.SARVAM_API_KEY || '').trim()}`
            },
            timeout: 15000
        });

        const translated = response.data?.choices?.[0]?.message?.content || text;
        console.log(`✅ Translation successful!`);
        console.log(`\n📝 Original:\n${text}\n`);
        console.log(`🌍 Translated to ${languageName}:\n${translated}\n`);
        return translated;
    } catch (error) {
        console.error('❌ Translation failed:', error.message);
        if (error.response?.data) {
            console.error('   API Response:', error.response.data);
        }
        return text;
    }
};

// Test the translation
const testTexts = {
    'ta-IN': "Hello! Welcome to Rose Chemicals. How can I help you today? You can ask about our DIY kits, prices, or franchise opportunities. Call us at +91 8610570490",
    'hi-IN': "We offer DIY manufacturing kits for fabric conditioner, liquid detergent, and dish wash. Each kit yields 10 liters. Contact us for pricing.",
    'te-IN': "Our products are available in bulk orders. We provide franchise opportunities across India with full training and support."
};

async function runTests() {
    console.log('🧪 MULTILANGUAGE TRANSLATION TEST SUITE\n');
    console.log(`API Key present: ${!!process.env.SARVAM_API_KEY ? '✅' : '❌'}\n`);

    for (const [lang, text] of Object.entries(testTexts)) {
        console.log(`${'='.repeat(80)}`);
        console.log(`Testing ${LANGUAGE_NAMES[lang]}...`);
        console.log(`${'='.repeat(80)}`);
        await translateResponse(text, lang);
        console.log('\n');
    }

    console.log('🎉 All tests completed!');
}

runTests().catch(console.error);
