const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, forgotPassword, resetPassword, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { check } = require('express-validator');

// Validation middleware
const validateRegistration = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

const validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getCurrentUser);
router.post('/forgot-password', [
  check('email', 'Please include a valid email').isEmail()
], forgotPassword);
router.post('/reset-password', [
  check('token', 'Reset token is required').not().isEmpty(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], resetPassword);
router.patch('/update-profile', protect, [
  check('name', 'Name is required').optional().not().isEmpty()
], updateProfile);

module.exports = router;
