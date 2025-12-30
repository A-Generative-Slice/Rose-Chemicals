const express = require('express');
const router = express.Router();
const { submitInquiry, getInquiries, updateInquiryStatus } = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth');

// Public route to submit inquiry
router.post('/submit', submitInquiry);

// Admin routes
router.get('/', protect, authorize('admin'), getInquiries);
router.patch('/:id/status', protect, authorize('admin'), updateInquiryStatus);

module.exports = router;
