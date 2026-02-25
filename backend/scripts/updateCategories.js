const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { connectDB } = require('../config/database-enhanced');
const Category = require('../models/Category');
const Product = require('../models/Product');

const newCategories = [
    { name: 'Raw materials', slug: 'raw-materials', order: 1 },
    { name: 'Products kit', slug: 'products-kit', order: 2 },
    { name: 'Monthly packs', slug: 'monthly-packs', order: 3 },
    { name: 'Cleaning Liquids', slug: 'cleaning-liquids', order: 4 },
    { name: 'Brooms', slug: 'brooms', order: 5 },
    { name: 'Carpet Brushes', slug: 'carpet-brushes', order: 6 },
    { name: 'Toilet Brushes', slug: 'toilet-brushes', order: 7 },
    { name: 'Long Brushes', slug: 'long-brushes', order: 8 },
    { name: 'Sink Brushes', slug: 'sink-brushes', order: 9 },
    { name: 'Cobweb Cleaners', slug: 'cobweb-cleaners', order: 10 },
    { name: 'Kitchen Towels', slug: 'kitchen-towels', order: 11 },
    { name: 'Wipers', slug: 'wipers', order: 12 },
    { name: 'Others', slug: 'others', order: 13 }
];

const updateCategories = async () => {
    try {
        console.log('Connecting to database...');
        await connectDB();

        console.log('Fetching existing categories...');
        const oldCategories = await Category.find({});
        console.log(`Found ${oldCategories.length} existing categories.`);

        // 1. Create or update new categories
        console.log('Upserting new categories with order...');
        const categoryMap = {}; // name -> _id
        for (const cat of newCategories) {
            const updatedCat = await Category.findOneAndUpdate(
                { slug: cat.slug },
                {
                    name: cat.name,
                    description: `${cat.name} cleaning solutions and accessories.`,
                    isActive: true,
                    order: cat.order
                },
                { upsert: true, new: true }
            );
            categoryMap[cat.name] = updatedCat._id;
            categoryMap[cat.slug] = updatedCat._id; // Store slug too for mapping
            console.log(`- ${cat.name} (${updatedCat._id}) - Order: ${cat.order}`);
        }

        // 2. Map old categories to new ones
        console.log('Mapping existing products...');
        const products = await Product.find({}).populate('category');
        console.log(`Found ${products.length} products to process.`);

        for (const product of products) {
            const oldCategoryName = product.category ? (product.category.name || product.category.toString()) : 'Other';
            let newCategoryName = 'Others';

            // Mapping Logic (same as before, but ensuring consistency)
            const exactMatch = newCategories.find(c => c.name === oldCategoryName);
            if (exactMatch) {
                newCategoryName = oldCategoryName;
            } else if (['Bathroom Cleaners', 'Kitchen Cleaners', 'Floor Cleaners', 'Glass Cleaners', 'Disinfectants', 'Industrial Cleaners'].includes(oldCategoryName)) {
                newCategoryName = 'Cleaning Liquids';
            }

            const newCategoryId = categoryMap[newCategoryName];

            if (newCategoryId && (!product.category || product.category._id.toString() !== newCategoryId.toString())) {
                await Product.findByIdAndUpdate(product._id, { category: newCategoryId });
                console.log(`- Updated ${product.name}: ${oldCategoryName} -> ${newCategoryName}`);
            }
        }

        // 3. Deactivate old categories that aren't in the new list
        const newSlugs = newCategories.map(c => c.slug);
        const deactivationResult = await Category.updateMany(
            { slug: { $nin: newSlugs } },
            { isActive: false }
        );
        console.log(`Deactivated ${deactivationResult.nModified || deactivationResult.modifiedCount || 0} old categories.`);

        console.log('Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

updateCategories();
