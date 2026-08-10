const express = require('express');
const router = express.Router();

// S3 is no longer in use (AWS free tier expired).
// These endpoints are kept as stubs so existing code doesn't break.

// GET /api/image/signed-url?key=... — no longer applicable
router.get('/signed-url', async (req, res) => {
  return res.status(503).json({
    error: 'S3 storage is not configured. Images are served from /uploads/ directly.'
  });
});

// GET /api/image/proxy?key=... — redirect to local uploads instead
router.get('/proxy', async (req, res) => {
  const { key } = req.query;
  if (!key) {
    return res.status(400).json({ error: 'Image key is required' });
  }

  // If the key looks like a path, strip it down to just the filename
  const filename = require('path').basename(key);
  res.redirect(`/uploads/products/${filename}`);
});

module.exports = router;
