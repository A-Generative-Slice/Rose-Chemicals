const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
    try {
        const filePath = req.query.path;

        if (!filePath) {
            return res.status(400).json({ success: false, message: 'Path is required' });
        }

        // Resolve the full path
        const uploadsDir = path.join(__dirname, '../uploads');
        // Prevent directory traversal attacks
        const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
        const fullPath = path.join(uploadsDir, safePath);

        // Verify the path is strictly within uploads directory
        if (!fullPath.startsWith(uploadsDir)) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        // Check if file exists
        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        // Determine content type (basic)
        const ext = path.extname(fullPath).toLowerCase();
        let contentType = 'application/octet-stream';
        if (ext === '.png') contentType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.webp') contentType = 'image/webp';
        else if (ext === '.gif') contentType = 'image/gif';
        else if (ext === '.svg') contentType = 'image/svg+xml';

        res.setHeader('Content-Type', contentType);
        res.sendFile(fullPath);

    } catch (error) {
        console.error('Image proxy error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
