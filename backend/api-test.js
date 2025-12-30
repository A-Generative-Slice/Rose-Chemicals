require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const nodemailer = require('nodemailer');
const Razorpay = require('razorpay');

async function testConnections() {
    console.log('🚀 Starting Commercial Readiness API Test...\n');

    // 1. MongoDB Atlas Test
    console.log('--- 🍃 MongoDB Atlas ---');
    try {
        const mongoUri = process.env.MONGO_URI;
        console.log(`Connecting to Atlas...`);
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('✅ MongoDB Connection Successful!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ MongoDB Failed:', err.message);
        if (err.message.includes('whitelisted')) {
            console.log('👉 TIP: Go to MongoDB Atlas -> Network Access -> Add IP Address -> "Allow Access From Anywhere" (0.0.0.0/0)');
        }
    }

    // 2. AWS S3 Test
    console.log('\n--- ☁️ AWS S3 ---');
    const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
    });

    try {
        const bucketName = process.env.AWS_S3_BUCKET;
        const testKey = 'test-connection.txt';

        // Upload
        await s3.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: testKey,
            Body: 'This is a test file to verify production readiness.',
        }));
        console.log('✅ S3 Upload Successful!');

        // Clean up
        await s3.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: testKey,
        }));
        console.log('✅ S3 Delete Successful!');
    } catch (err) {
        console.error('❌ S3 Failed:', err.message);
        console.log('👉 TIP: Verify bucket name and that you clicked "Create Bucket" in AWS.');
    }

    // 3. Gmail SMTP Test
    console.log('\n--- 💌 Gmail SMTP ---');
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    try {
        await transporter.verify();
        console.log('✅ SMTP Server is ready!');
    } catch (err) {
        console.error('❌ SMTP Failed:', err.message);
        console.log('👉 TIP: Check your Gmail App Password.');
    }

    // 4. Razorpay Test
    console.log('\n--- 💳 Razorpay ---');
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        // Just try to fetch orders to verify credentials
        await rzp.orders.all({ count: 1 });
        console.log('✅ Razorpay Authentication Successful!');
    } catch (err) {
        console.error('❌ Razorpay Failed:', err.message);
    }

    console.log('\n--- 🏁 Test Complete ---');
    process.exit(0);
}

testConnections();
