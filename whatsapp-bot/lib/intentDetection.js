const detectIntent = (message) => {
    const msg = message.toLowerCase();

    const intents = {
        'diy_kit_inquiry': [
            'kit', 'diy', 'make', 'manufacture', 'how to make', 'fabric conditioner kit',
            'liquid detergent kit', 'dish wash kit', 'floor cleaner kit', 'soap oil kit',
            'glass cleaner kit', 'toilet bowl cleaner', 'room freshener kit', 'phenyl kit',
            'manufacturing kit', 'production kit', 'formula kit'
        ],
        'price_inquiry': [
            'price', 'cost', 'rate', 'mrp', 'how much', 'kitna', 'cost per liter',
            'per litre', 'pricing', 'charges', 'amount', 'rupees', 'rupee'
        ],
        'product_details': [
            'details', 'information', 'about', 'tell me', 'specification', 'yield',
            'what is', 'describe', 'explain', 'features', 'benefits'
        ],
        'franchise': [
            'franchise', 'business', 'dealership', 'investment', 'partner', 'distributorship',
            'business opportunity', 'tie up', 'collaboration'
        ],
        'broom_inquiry': [
            'broom', 'cleaning broom', 'sweep', 'sweeper', 'sweeping broom',
            'house broom', 'floor broom', 'துடைப்பம்', 'விளக்கமாறு'
        ],
        'brush_inquiry': [
            'brush', 'toilet brush', 'scrub brush', 'cleaning brush', 'sink brush',
            'பிரஷ்', 'விளக்கமாறு பிரஷ்'
        ],
        'mop_inquiry': [
            'mop', 'mopping', 'floor mop', 'wet mop', 'dry mop', 'துடைப்பான்', 'மாப்'
        ],
        'wiper_inquiry': [
            'wiper', 'squeegee', 'window wiper', 'glass wiper', 'floor wiper'
        ],
        'cleaning_tools_inquiry': [
            'cleaning tools', 'cleaning equipment', 'household tools', 'சுத்தம் செய்யும் கருவிகள்'
        ],
        'tutorial_inquiry': [
            'tutorial', 'video', 'how to make', 'manufacturing video', 'making video',
            'process video', 'guide', 'youtube', 'yt', 'how to prepare', 'செய்முறை', 'வீடியோ'
        ],
        'ordering': [
            'order', 'buy', 'purchase', 'delivery', 'shipping', 'payment', 'book'
        ],
        'contact': [
            'contact', 'phone', 'address', 'location', 'visit', 'call', 'reach'
        ],
        'working_hours': [
            'working hours', 'office hours', 'timing', 'when open'
        ],
        'greeting': [
            'hi', 'hello', 'hey', 'namaste', 'vanakkam'
        ],
        'general': ['help', 'info', 'thanks', 'okay', 'ok', 'yes', 'no']
    };

    let intentScores = {};

    for (const [intent, keywords] of Object.entries(intents)) {
        let score = 0;
        keywords.forEach(keyword => {
            if (msg.includes(keyword)) {
                if (msg === keyword) score += 10;
                else if (msg.split(' ').includes(keyword)) score += 5;
                else score += 2;
            }
        });
        intentScores[intent] = score;
    }

    const topIntent = Object.keys(intentScores).reduce((a, b) =>
        intentScores[a] > intentScores[b] ? a : b
    );

    return intentScores[topIntent] > 0 ? topIntent : 'general';
};

module.exports = {
    detectIntent
};