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
            'per litre', 'pricing', 'charges', 'amount', 'rupees', '₹'
        ],
        'product_details': [
            'details', 'information', 'about', 'tell me', 'specification', 'yield',
            'what is', 'describe', 'explain', 'features', 'benefits'
        ],
        'franchise': [
            'franchise', 'business', 'dealership', 'investment', 'partner', 'distributorship',
            'business opportunity', 'dealership', 'tie up', 'collaboration'
        ],
        'technical_support': [
            'how to', 'guidance', 'help', 'support', 'training', 'video', 'pdf',
            'tutorial', 'instruction', 'process', 'method', 'procedure'
        ],
        'samples': [
            'sample', 'trial', 'test', 'demo', 'try', 'testing', 'check quality'
        ],
        'fragrance': [
            'fragrance', 'perfume', 'scent', 'smell', 'aroma', 'fragrance options',
            'perfume options', 'flavour', 'variants'
        ],
        'ordering': [
            'order', 'buy', 'purchase', 'delivery', 'shipping', 'payment', 'book',
            'place order', 'want to buy', 'need to order'
        ],
        'contact': [
            'contact', 'phone', 'address', 'location', 'visit', 'call', 'reach',
            'office', 'where are you', 'contact details'
        ],
        'working_hours': [
            'working hours', 'office hours', 'timing', 'when open', 'available when',
            'office time', 'business hours'
        ],
        'greeting': [
            'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 
            'namaste', 'vanakkam', 'namaskar', 'adaab'
        ],
        'ready_products': [
            'ready to use', 'ready made', 'finished product', 'direct use',
            'pre-made', 'ready product', 'completed product'
        ],
        'raw_materials': [
            'raw material', 'chemical', 'ingredient', 'acetic acid', 'tsp', 'edta',
            'stpp', 'glycerine', 'oleic acid', 'labsa', 'sles', 'capb'
        ],
        'cleaning_tools': [
            'broom', 'brush', 'mop', 'cloth', 'sponge', 'scrubber', 'jhadu',
            'wiper', 'duster', 'cleaning tool', 'cleaning equipment', 'sweeper',
            'toilet brush', 'floor brush', 'cleaning brush', 'microfiber cloth',
            'cleaning cloth', 'cleaning accessories', 'cleaning supplies'
        ],
        'website_products': [
            'website', 'online catalog', 'full range', 'all products', 'complete list',
            'browse products', 'product catalog', 'website products', 'online products',
            'full catalog', 'complete range', 'what do you have on website'
        ],
        'product_categories': [
            'categories', 'types', 'what do you have', 'what products', 'product types',
            'available products', 'product range', 'what categories', 'show categories'
        ]
    };
    
    // Calculate intent scores
    };
    
    // Calculate intent scores
    let intentScores = {};
    
    for (const [intent, keywords] of Object.entries(intents)) {
        let score = 0;
        keywords.forEach(keyword => {
            if (msg.includes(keyword)) {
                // Give higher score for exact matches
                if (msg === keyword) {
                    score += 10;
                } else if (msg.split(' ').includes(keyword)) {
                    score += 5;
                } else {
                    score += 2;
                }
            }
        });
        intentScores[intent] = score;
    }
    
    // Find intent with highest score
    const topIntent = Object.keys(intentScores).reduce((a, b) => 
        intentScores[a] > intentScores[b] ? a : b
    );
    
    return intentScores[topIntent] > 0 ? topIntent : 'general';
};

const getContextualResponse = (intent, products = []) => {
    const responses = {
        'diy_kit_inquiry': {
            prefix: "🌸 Our DIY Kits are perfect for starting your cleaning product business! Here's what we offer:",
            suffix: "\n\n✨ Each kit includes complete formulation, ingredients, and step-by-step video guidance!\n📞 Call +91 8610570490 for technical support"
        },
        'price_inquiry': {
            prefix: "💰 Here are our current prices:",
            suffix: "\n\n📞 For bulk orders or franchise pricing, call +91 8610570490\n💡 All DIY kits include yield information and cost per liter"
        },
        'fragrance': {
            prefix: "🌺 We offer beautiful fragrances for our products:",
            suffix: "\n\n✨ All fragrances are long-lasting and premium quality!\n🎯 Available for: Fabric Conditioner, Liquid Detergent, Floor Cleaner, and more"
        },
        'franchise': {
            prefix: "🏢 Rose Chemicals Franchise Opportunities:",
            suffix: "\n\n🔥 Benefits: Complete formulations, training, marketing support, regional exclusivity\n📞 Contact: +91 8610570490 for detailed discussion"
        },
        'technical_support': {
            prefix: "🛠️ Technical Support Available:",
            suffix: "\n\n📚 We provide: PDF guides, video tutorials, phone support\n📞 Technical Team: +91 8610570490 (Mon-Sat, 10AM-6PM)"
        },
        'samples': {
            prefix: "🧪 Sample Products Available:",
            suffix: "\n\n✅ We provide ready-to-use samples for testing\n📞 Request samples: +91 8610570490"
        }
    };
    
    return responses[intent] || { prefix: "", suffix: "" };
};

const getQuickReplies = (intent) => {
    const quickReplies = {
        'diy_kit_inquiry': [
            'Show DIY Kit Prices', 'Popular Kits', 'Kit Contents', 'Fragrances Available'
        ],
        'franchise': [
            'Investment Required', 'Support Provided', 'Apply for Franchise', 'Success Stories'
        ],
        'technical_support': [
            'Training Videos', 'PDF Guides', 'Personal Assistance', 'Safety Guidelines'
        ],
        'price_inquiry': [
            'DIY Kit Prices', 'Raw Material Prices', 'Bulk Pricing', 'Compare Products'
        ],
        'product_details': [
            'Product Features', 'How to Use', 'Ingredients', 'Shelf Life'
        ],
        'general': [
            'View Products', 'DIY Kits', 'Franchise Info', 'Contact Support'
        ]
    };
    
    return quickReplies[intent] || quickReplies['general'];
};

// Training dataset integration
const getTrainingResponse = (intent, message) => {
    const trainingResponses = {
        'diy_kit_inquiry': {
            'fabric_conditioner': {
                price: "₹1100",
                yield: "20 litres",
                cost_per_liter: "₹55",
                fragrances: ["Moments", "Blossom", "Comfort", "Magic"]
            },
            'liquid_detergent_ultra': {
                price: "₹1600", 
                yield: "25 litres",
                cost_per_liter: "₹64",
                fragrances: ["Ariel", "Surf Excel", "Aqua", "Zesty Fresh"]
            },
            'liquid_detergent_smart': {
                price: "₹2000",
                yield: "55 litres", 
                cost_per_liter: "₹36"
            },
            'dish_wash_ultra': {
                price: "₹1200",
                yield: "20 litres",
                cost_per_liter: "₹60"
            },
            'dish_wash_smart': {
                price: "₹2000",
                yield: "55 litres",
                cost_per_liter: "₹36"
            }
        }
    };
    
    return trainingResponses[intent] || null;
};

module.exports = { 
    detectIntent, 
    getContextualResponse, 
    getQuickReplies,
    getTrainingResponse 
};