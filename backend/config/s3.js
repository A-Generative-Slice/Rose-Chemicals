const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

console.log('Image storage: Local disk (uploads/products)');

// Always use local disk storage (S3 removed — was on free tier which expired)
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      cb(null, `${timestamp}-${safeName}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Stub — no S3 delete needed for local storage
const deleteFromS3 = async (key) => {
  try {
    const filePath = path.join(__dirname, '../uploads/products', path.basename(key));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return true;
  } catch (error) {
    console.error('Error deleting local file:', error);
    return false;
  }
};

// Stub — no signed URLs needed for local storage
const getSignedUrl = async (key, expires = 3600) => {
  return null;
};

// s3 client stub — routes that import it need to handle null gracefully
const s3 = null;

module.exports = {
  s3,
  upload,
  deleteFromS3,
  getSignedUrl
};
