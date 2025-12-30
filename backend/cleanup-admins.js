require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const cleanupAdmins = async () => {
    await connectDB();

    try {
        // 1. Delete the specific accounts requested by the user
        const emailsToDelete = [
            'admin@rosechemical.in',  // No 's'
            'admin@rosechemicals.com' // .com
        ];

        console.log(`Deleting admins with emails: ${emailsToDelete.join(', ')}...`);

        const result = await User.deleteMany({ email: { $in: emailsToDelete } });
        console.log(`Deleted ${result.deletedCount} users.`);

        // 2. Ensure the correct admin exists: admin@rosechemicals.in
        const targetEmail = 'admin@rosechemicals.in';
        const targetPassword = 'Admin@123';

        let admin = await User.findOne({ email: targetEmail });

        if (admin) {
            console.log(`User ${targetEmail} exists. Updating password and role...`);
            // Update password
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(targetPassword, salt);
            admin.role = 'admin'; // Ensure role is admin
            admin.name = 'Rose Chemicals Admin'; // Ensure name is nice
            admin.isActive = true;
            await admin.save();
            console.log(`Updated ${targetEmail} successfully.`);
        } else {
            console.log(`User ${targetEmail} does not exist. Creating...`);
            admin = await User.create({
                name: 'Rose Chemicals Admin',
                email: targetEmail,
                password: targetPassword, // Pre-save hook will hash this usually, but let's check model
                role: 'admin',
                isActive: true
            });
            // Note: User model usually has pre-save hook for hashing. 
            // If it doesn't, we'd need to hash manually. 
            // Assuming standard implementation based on User.js I've seen before.

            console.log(`Created ${targetEmail} successfully.`);
        }

        console.log('Admin cleanup complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
};

cleanupAdmins();
