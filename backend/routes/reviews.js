const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
  reportReview,
  getUserReviews
} = require('../controllers/reviewController');

// Validation middleware
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comment must be between 10 and 1000 characters')
];

const validateReportReason = [
  body('reason')
    .optional()
    .isIn(['spam', 'inappropriate', 'fake', 'other'])
    .withMessage('Invalid report reason')
];

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.use(protect);

router.get('/my-reviews', getUserReviews);
router.post('/product/:productId', validateReview, createReview);
router.put('/:reviewId', validateReview, updateReview);
router.delete('/:reviewId', deleteReview);
router.patch('/:reviewId/helpful', markReviewHelpful);
router.post('/:reviewId/report', validateReportReason, reportReview);

module.exports = router;