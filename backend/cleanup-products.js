require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGO_URI is not defined in environment variables');
        await mongoose.connect(uri);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

const cleanupProducts = async () => {
    await connectDB();

    try {
        // 1. Find products with no images (empty array or null)
        const noImageProducts = await Product.find({
            $or: [
                { images: { $size: 0 } },
                { images: { $exists: false } },
                { images: null }
            ]
        });

        console.log(`Found ${noImageProducts.length} products with no images.`);

        // 2. Find products where name looks like an image filename or metadata
        // Matches names starting with "IMG" (case insensitive) or containing "WA" (WhatsApp pattern)
        // or ending with common image extensions
        const imageExtensions = /\.(jpg|jpeg|png|webp|gif|bmp|tiff|svg)$/i;
        const namePatterns = /^(IMG|img)|WA\d+\[\d+\]|WA\d+/;

        // We have to fetch all and filter in JS because regex search on name might be slow or complex to get right for "ends with" if not using atlas search, but simple regex works.
        const allProducts = await Product.find({});
        const invalidNameProducts = allProducts.filter(p => {
            return imageExtensions.test(p.name) || namePatterns.test(p.name);
        });

        console.log(`Found ${invalidNameProducts.length} products with image-like names.`);

        // Combine IDs to delete
        const idsToDelete = [
            ...noImageProducts.map(p => p._id),
            ...invalidNameProducts.map(p => p._id)
        ];

        // Remove duplicates
        const uniqueIds = [...new Set(idsToDelete.map(id => id.toString()))];

        if (uniqueIds.length === 0) {
            console.log('No invalid products found to delete.');
        } else {
            console.log(`Deleting ${uniqueIds.length} unique products...`);
            const result = await Product.deleteMany({ _id: { $in: uniqueIds } });
            console.log(`Deleted ${result.deletedCount} products.`);
        }

    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database disconnected');
    }
};

cleanupProducts();
