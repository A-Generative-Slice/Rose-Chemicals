const fs = require('fs');
const path = require('path');

let productsData = { products: [], categories: [] };
try {
    productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../products.json'), 'utf8'));
} catch (error) {
    console.error('Error loading products.json:', error);
}

const allProducts = productsData.products || [];

/**
 * Searches for products in the local dataset.
 * 100% Offline/Local - Zero hitting the live website VPS.
 */
const searchProducts = async (query, intent = 'general', limit = 6) => {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
    const intentLower = (intent || 'general').toLowerCase();

    console.log(`🔍 Local Search: "${query}" (Intent: ${intent})`);

    // 1. Mutual Exclusion & Category Mapping
    const isBroomQuery = searchTerms.includes('broom') || searchTerms.includes('brush');
    const isMopQuery = searchTerms.includes('mop');
    const isToiletQuery = searchTerms.includes('toilet') || searchTerms.includes('latrine') || searchTerms.includes('bathroom');
    const isFloorQuery = searchTerms.includes('floor') || searchTerms.includes('tile');

    // 2. Initial Filtering & Scoring
    let scored = allProducts.map(p => {
        let score = 0;
        const pName = p.name.toLowerCase();
        const pDesc = p.description.toLowerCase();
        const pCat = (p.category || "").toLowerCase();
        const pCatKey = (p.categoryKey || "").toLowerCase();

        // High priority: Name matches
        for (const term of searchTerms) {
            if (pName === term) score += 100;
            else if (pName.startsWith(term)) score += 60;
            else if (pName.includes(term)) score += 30;

            if (pCat.includes(term)) score += 40;
            if (pDesc.includes(term)) score += 10;
        }

        // Category-specific boosts
        if (isToiletQuery && pCat.includes('bathroom')) score += 80;
        if (isFloorQuery && pCat.includes('floor')) score += 80;
        if (isBroomQuery && pCatKey === 'brooms') score += 50;
        if (isMopQuery && pCatKey === 'floor-cleaners') score += 50;
        if (intentLower === 'diy_kit_inquiry' && pCatKey === 'diy_kits') score += 90;

        // Variety Penalty (avoid showing too many similar items if different categories match)
        // (Handled by slicing results later, but let's boost "cleaners" over "brushes" if both match toilet)
        if (isToiletQuery && pName.includes('cleaner') && pName.includes('toilet')) score += 30;

        // Mutual Exclusion (Hard Filter)
        if (isMopQuery && pName.includes('broom')) score = -1;
        if (isBroomQuery && pName.includes('mop')) score = -1;

        return { ...p, relevanceScore: score };
    });

    // 3. Sort and Filter
    let results = scored
        .filter(p => p.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Ensure variety: If we have multiple categories matching, try to pick from different ones
    const finalResults = [];
    const seenCategories = new Set();

    for (const p of results) {
        if (finalResults.length >= limit) break;

        // Allow up to 3 items from the same category to maintain variety
        const catCount = [...seenCategories].filter(c => c === p.categoryKey).length;
        if (catCount < 3) {
            finalResults.push(p);
            seenCategories.add(p.categoryKey);
        }
    }

    // 4. Smart Alternative Suggestions
    if (finalResults.length === 0 && searchTerms.length > 0) {
        console.log("💡 Suggesting alternatives...");
        const alternatives = allProducts
            .filter(p => {
                const pCat = p.category.toLowerCase();
                return pCat.includes(searchTerms[0]) || (intentLower !== 'general' && p.categoryKey === intentLower.split('_')[0]);
            })
            .slice(0, limit)
            .map(p => ({ ...p, isAlternative: true }));
        return alternatives;
    }

    return finalResults;
};

const formatProductList = (products, intent, language = 'en-IN') => {
    if (products.length === 0) {
        return "I'm sorry, I couldn't find exactly what you were looking for. 🌸\n\nBut we have amazing DIY Kits and Cleaning Tools! Would you like to see our best-sellers? ✨";
    }

    let response = "";
    const isAlternative = products.some(p => p.isAlternative);

    if (isAlternative) {
        response += "🌸 *I couldn't find the exact match, but you'll love these:* \n\n";
    } else if (intent === 'diy_kit_inquiry') {
        response += "✨ *Our Professional DIY Kits:* \n\n";
    } else if (intent === 'broom_inquiry') {
        response += "🧹 *Our Premium Brooms & Brushes:* \n\n";
    } else {
        response += "✨ *Here are the best products for you:* \n\n";
    }

    products.forEach((p, i) => {
        response += `${i + 1}. *${p.name}*\n`;
        response += `   - Price: *₹${p.mrp}*\n`;
        if (p.yield) response += `   - Makes: ${p.yield}\n`;
        response += `   - Link: ${p.link}\n\n`;
    });

    response += "_Need more details? I'm here to help!_ 🌸";
    return response;
};

const getProductById = (productId) => {
    return allProducts.find(p => p.id === productId || p._id === productId);
};

const getCategoryProducts = (categoryKey, limit = 10) => {
    return allProducts
        .filter(p => p.categoryKey === categoryKey || p.categorySlug === categoryKey)
        .slice(0, limit);
};

const getAllCategories = async () => productsData.categories || [];

module.exports = {
    searchProducts,
    formatProductList,
    getProductById,
    getCategoryProducts,
    getAllCategories
};