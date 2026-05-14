const express = require('express');
const router = express.Router();
const { upload, deleteFromS3 } = require('../config/s3');
const { protect } = require('../middleware/auth');

// Upload single image
router.post('/single', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Handle both S3 and local uploads
    let imageUrl, key;
    if (req.file.location) {
      // S3 upload
      imageUrl = req.file.location;
      key = req.file.key;
    } else {
      // Local upload
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      imageUrl = `${baseUrl}/uploads/products/${req.file.filename}`;
      key = req.file.filename;
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      key: key
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
});

// Upload multiple images
router.post('/multiple', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const uploadedImages = req.files.map(file => {
      // Handle both S3 and local uploads
      if (file.location) {
        // S3 upload
        return {
          url: file.location,
          key: file.key,
          originalName: file.originalname
        };
      } else {
        // Local upload
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        return {
          url: `${baseUrl}/uploads/products/${file.filename}`,
          key: file.filename,
          originalName: file.originalname
        };
      }
    });

    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      images: uploadedImages
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
});

// Delete image from S3
router.delete('/:key(*)', protect, async (req, res) => {
  try {
    const key = req.params.key;
    const deleted = await deleteFromS3(key);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete image'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message
    });
  }
});

module.exports = router;
