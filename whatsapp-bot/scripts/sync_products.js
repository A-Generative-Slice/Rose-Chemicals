const fs = require('fs');
const path = require('path');
const websiteAPI = require('../lib/websiteAPI');

const PRODUCTS_FILE = path.join(__dirname, '../products.json');

async function sync() {
    console.log('🔄 Starting Product Sync...');

    try {
        // 1. Fetch Categories
        const catRes = await websiteAPI.getCategories();
        const categories = catRes.categories || [];
        console.log(`✅ Fetched ${categories.length} categories.`);

        // 2. Fetch All Products (Loop through pages)
        let allWebsiteProducts = [];
        let page = 1;
        while (true) {
            console.log(`📑 Fetching page ${page}...`);
            const prodRes = await websiteAPI.searchProducts('', page);
            const products = prodRes.products || [];
            if (products.length === 0) break;
            allWebsiteProducts.push(...products);
            page++;
            if (page > 10) break; // Safety break
        }
        console.log(`✅ Fetched ${allWebsiteProducts.length} products from website.`);

        // 3. Map Products
        const mappedProducts = allWebsiteProducts.map(p => {
            const productId = p._id || p.id;
            return {
                id: productId,
                name: p.name || p.title,
                mrp: p.price || p.mrp || 0,
                category: (p.category && typeof p.category === 'object') ? p.category.name : (p.category || 'Cleaning Products'),
                categoryKey: (p.category && typeof p.category === 'object') ? (p.category.slug || p.category._id) : (p.categoryKey || 'website'),
                link: `https://rosechemicals.in/products/${productId}`,
                description: p.description || p.short_description || `${p.name} - Professional cleaning solution`,
                source: 'website'
            };
        });

        // 4. Load Existing Data (to keep training_dataset items)
        let existingData = { products: [], categories: [] };
        if (fs.existsSync(PRODUCTS_FILE)) {
            existingData = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
        }

        const manualItems = (existingData.products || []).filter(p => p.source === 'manual_list');
        const trainingItems = (existingData.products || []).filter(p => p.source === 'training_dataset');
        console.log(`📦 Preserving ${manualItems.length} manual and ${trainingItems.length} training items.`);

        // 5. Merge and Save (PRIORITIZE manualItems and trainingItems over mappedProducts)
        const allMerged = [...manualItems, ...trainingItems, ...mappedProducts];
        const uniqueProducts = [];
        const seenIds = new Set();

        for (const p of allMerged) {
            if (!seenIds.has(p.id)) {
                uniqueProducts.push(p);
                seenIds.add(p.id);
            }
        }

        const finalData = {
            lastUpdated: new Date().toISOString(),
            productCount: uniqueProducts.length,
            categories: categories.map(c => ({ _id: c._id, name: c.name, slug: c.slug })),
            products: uniqueProducts
        };

        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(finalData, null, 2));
        console.log(`🚀 Sync Complete! Total Products: ${finalData.productCount}`);

    } catch (error) {
        console.error('❌ Sync Failed:', error.message);
        process.exit(1);
    }
}

sync();
