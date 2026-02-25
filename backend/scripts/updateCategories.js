const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { connectDB } = require('../config/database-enhanced');
const Category = require('../models/Category');
const Product = require('../models/Product');

const newCategories = [
    { name: 'Raw materials', slug: 'raw-materials' },
    { name: 'Products kit', slug: 'products-kit' },
    { name: 'Monthly packs', slug: 'monthly-packs' },
    { name: 'Cleaning Liquids', slug: 'cleaning-liquids' },
    { name: 'Brooms', slug: 'brooms' },
    { name: 'Carpet Brushes', slug: 'carpet-brushes' },
    { name: 'Toilet Brushes', slug: 'toilet-brushes' },
    { name: 'Long Brushes', slug: 'long-brushes' },
    { name: 'Sink Brushes', slug: 'sink-brushes' },
    { name: 'Cobweb Cleaners', slug: 'cobweb-cleaners' },
    { name: 'Kitchen Towels', slug: 'kitchen-towels' },
    { name: 'Wipers', slug: 'wipers' },
    { name: 'Others', slug: 'others' }
];

const updateCategories = async () => {
    try {
        console.log('Connecting to database...');
        await connectDB();

        console.log('Fetching existing categories...');
        const oldCategories = await Category.find({});
        console.log(`Found ${oldCategories.length} existing categories.`);

        // 1. Create or update new categories
        console.log('Upserting new categories...');
        const categoryMap = {}; // name -> _id
        for (const cat of newCategories) {
            const updatedCat = await Category.findOneAndUpdate(
                { slug: cat.slug },
                {
                    name: cat.name,
                    description: `${cat.name} cleaning solutions and accessories.`,
                    isActive: true
                },
                { upsert: true, new: true }
            );
            categoryMap[cat.name] = updatedCat._id;
            categoryMap[cat.slug] = updatedCat._id; // Store slug too for mapping
            console.log(`- ${cat.name} (${updatedCat._id})`);
        }

        // 2. Map old categories to new ones
        console.log('Mapping existing products...');
        const products = await Product.find({}).populate('category');
        console.log(`Found ${products.length} products to process.`);

        for (const product of products) {
            const oldCategoryName = product.category ? (product.category.name || product.category.toString()) : 'Other';
            let newCategoryName = 'Others';

            // Mapping Logic
            if (['Brooms', 'Toilet Brushes', 'Carpet Brushes', 'Long Brushes', 'Sink Brushes', 'Cobweb Cleaners'].includes(oldCategoryName)) {
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
