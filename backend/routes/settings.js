const express = require('express');
const router = express.Router();
const { getPublicSettings } = require('../controllers/adminEnhancedController');

// Public route to get general site settings (footer, header info)
router.get('/public', getPublicSettings);

module.exports = router;
