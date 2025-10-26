// Temporary local file upload for testing
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for local storage (fallback)
const localStorage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Local upload endpoint (fallback if S3 fails)
router.post('/local/multiple', localStorage.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const uploadedImages = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      key: file.filename,
      originalName: file.originalname
    }));

    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully to local storage`,
      images: uploadedImages
    });
  } catch (error) {
    console.error('Local upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images locally',
      error: error.message
    });
  }
});

module.exports = router;