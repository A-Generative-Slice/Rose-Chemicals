const { S3Client, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl: getSignedUrlV3 } = require('@aws-sdk/s3-request-presigner');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const fs = require('fs');

// Check if AWS credentials are properly configured
const hasValidAWSCredentials = () => {
  const accessKey = process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
  return accessKey && secretKey &&
    !accessKey.includes('your_aws') &&
    !secretKey.includes('your_aws') &&
    accessKey.length > 10 && secretKey.length > 20;
};

const USE_S3 = hasValidAWSCredentials();
console.log('AWS S3 Upload:', USE_S3 ? 'Enabled' : 'Disabled (using local storage)');

// Create S3 client only if credentials are valid
let s3 = null;
if (USE_S3) {
  try {
    s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION || 'us-east-1'
    });
  } catch (error) {
    console.warn('S3 client creation failed, falling back to local storage:', error.message);
  }
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for S3 or local uploads
const upload = multer({
  storage: USE_S3 && s3 ? multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET || 'rose-chemicals-products',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const filename = `products/${timestamp}-${file.originalname}`;
      cb(null, filename);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE
  }) : multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.originalname}`;
      cb(null, filename);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Function to delete files from S3
const deleteFromS3 = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET || 'rose-chemicals-products',
      Key: key
    });
    await s3.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting from S3:', error);
    return false;
  }
};

// Function to get signed URL for secure uploads
const getSignedUrl = async (key, expires = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET || 'rose-chemicals-products',
      Key: key
    });
    return await getSignedUrlV3(s3, command, { expiresIn: expires });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
};

module.exports = {
  s3,
  upload,
  deleteFromS3,
  getSignedUrl
};