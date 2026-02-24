const express = require('express');
const router = express.Router();
const { getSignedUrl, s3 } = require('../config/s3');
const { GetObjectCommand } = require('@aws-sdk/client-s3');

// GET /api/image/signed-url?key=products/filename.jpg
// Returns a temporary signed URL for S3 images
router.get('/signed-url', async (req, res) => {
    try {
        const { key } = req.query;
        if (!key) {
            return res.status(400).json({ error: 'Image key is required' });
        }

        const signedUrl = await getSignedUrl(key, 3600); // 1 hour expiry
        if (!signedUrl) {
            return res.status(404).json({ error: 'Could not generate signed URL' });
        }

        res.json({ url: signedUrl });
    } catch (error) {
        console.error('Error getting signed URL:', error);
        res.status(500).json({ error: 'Failed to get signed URL' });
    }
});

// GET /api/image/proxy?key=products/filename.jpg
// Streams the S3 image directly through the backend (no redirect)
router.get('/proxy', async (req, res) => {
    try {
        const { key } = req.query;
        if (!key) {
            return res.status(400).json({ error: 'Image key is required' });
        }

        if (!s3) {
            return res.status(500).json({ error: 'S3 not configured' });
        }

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET || 'rose-chemicals-products',
            Key: key
        });

        const response = await s3.send(command);

        // Set appropriate headers
        res.set('Content-Type', response.ContentType || 'image/jpeg');
        res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
        res.set('Content-Length', response.ContentLength);

        // Stream the image data
        response.Body.pipe(res);
    } catch (error) {
        console.error('Error proxying S3 image:', error);
        if (error.name === 'NoSuchKey') {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.status(500).json({ error: 'Failed to proxy image' });
    }
});

module.exports = router;
