// Test AWS S3 Connection
require('dotenv').config();
const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();

async function testS3Connection() {
  try {
    console.log('🧪 Testing AWS S3 Connection...');
    console.log('📊 Configuration:');
    console.log(`   Region: ${process.env.AWS_REGION}`);
    console.log(`   Bucket: ${process.env.AWS_S3_BUCKET}`);
    console.log(`   Access Key: ${process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID.substring(0, 8) + '...' : 'NOT SET'}`);
    
    // Test bucket access
    const params = {
      Bucket: process.env.AWS_S3_BUCKET || 'rose-chemicals-products'
    };
    
    const result = await s3.headBucket(params).promise();
    console.log('✅ AWS S3 Connection Successful!');
    console.log('✅ Bucket exists and is accessible');
    console.log('🎉 Ready to upload product images!');
    
  } catch (error) {
    console.error('❌ AWS S3 Connection Failed:');
    console.error('Error:', error.message);
    
    if (error.code === 'InvalidAccessKeyId') {
      console.error('🔑 Invalid Access Key ID - check your credentials');
    } else if (error.code === 'SignatureDoesNotMatch') {
      console.error('🔐 Invalid Secret Access Key - check your credentials');
    } else if (error.code === 'NoSuchBucket') {
      console.error('🪣 Bucket does not exist - check bucket name');
    } else {
      console.error('📝 Full error details:', error);
    }
  }
}

testS3Connection();