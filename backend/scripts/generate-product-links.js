const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Define temporary models locally to avoid path issues with main models
const categorySchema = new mongoose.Schema({
    name: String,
    slug: String,
    isActive: Boolean
});

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    mrp: Number,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    sku: String,
    tags: [String],
    isActive: Boolean
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function generateLinks() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI not found in environment variables');
        }

        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        const categories = await Category.find({ isActive: true });
        const products = await Product.find({ isActive: true }).populate('category');

        const chatbotData = {
            categories: {}
        };

        // Initialize categories
        categories.forEach(cat => {
            const slug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
            chatbotData.categories[slug] = {
                name: cat.name,
                products: []
            };
        });

        console.log(`📦 Processing ${products.length} products...`);

        products.forEach(prod => {
            if (!prod.category) return;

            const catSlug = prod.category.slug || prod.category.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

            if (!chatbotData.categories[catSlug]) {
                chatbotData.categories[catSlug] = {
                    name: prod.category.name,
                    products: []
                };
            }

            chatbotData.categories[catSlug].products.push({
                id: prod._id.toString(),
                name: prod.name,
                price: prod.price,
                mrp: prod.mrp,
                description: prod.description,
                sku: prod.sku,
                link: `https://rosechemicals.in/products/${prod._id.toString()}`,
                keywords: [
                    prod.name.toLowerCase(),
                    ...(prod.tags || []),
                    prod.category.name.toLowerCase()
                ]
            });
        });

        // Write JSON file for chatbot
        const jsonOutputPath = path.join(__dirname, '../products-with-links.json');
        fs.writeFileSync(jsonOutputPath, JSON.stringify(chatbotData, null, 2));
        console.log(`✅ Generated JSON for chatbot: ${jsonOutputPath}`);

        // Generate Text list for the user
        let textList = "Product Name | Hex ID | Direct Link\n";
        textList += "--------------------------------------------------------\n";

        products.forEach(prod => {
            textList += `${prod.name.padEnd(30)} | ${prod._id} | https://rosechemicals.in/products/${prod._id}\n`;
        });

        const txtOutputPath = path.join(__dirname, '../product-links-list.txt');
        fs.writeFileSync(txtOutputPath, textList);
        console.log(`✅ Generated text list: ${txtOutputPath}`);

        // Output stats
        console.log('\n--- SYNC SUMMARY ---');
        console.log(`Total Categories: ${categories.length}`);
        console.log(`Total Products Linked: ${products.length}`);
        console.log('--------------------\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Sync Error:', err.message);
        process.exit(1);
    }
}

generateLinks();
