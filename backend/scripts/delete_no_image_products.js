const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// Load env vars
dotenv.config({ path: '../.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const deleteNoImageProducts = async () => {
    try {
        await connectDB();

        console.log('Finding products with no images...');

        // Find products with empty images array
        const productsToDelete = await Product.find({
            $or: [
                { images: { $size: 0 } },
                { images: { $exists: false } },
                { images: null }
            ]
        });

        console.log(`Found ${productsToDelete.length} products to delete.`);

        if (productsToDelete.length > 0) {
            console.log('Products to be deleted:');
            productsToDelete.forEach(p => console.log(`- ${p.name}`));

            const result = await Product.deleteMany({
                $or: [
                    { images: { $size: 0 } },
                    { images: { $exists: false } },
                    { images: null }
                ]
            });

            console.log(`Deleted ${result.deletedCount} products successfully.`);
        } else {
            console.log('No products found without images.');
        }

        process.exit();
    } catch (error) {
        console.error('Error deleting products:', error);
        process.exit(1);
    }
};

deleteNoImageProducts();
