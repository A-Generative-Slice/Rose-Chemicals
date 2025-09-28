const express = require('express');
const router = express.Router();
const {
  getUserAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress
} = require('../controllers/addressController');
const { protect } = require('../middleware/auth');

// All routes are protected (require authentication)
router.use(protect);

// @route   GET /api/addresses
// @desc    Get all addresses for user
// @access  Private
router.get('/', getUserAddresses);

// @route   GET /api/addresses/default
// @desc    Get default address for user
// @access  Private
router.get('/default', getDefaultAddress);

// @route   POST /api/addresses
// @desc    Create new address
// @access  Private
router.post('/', createAddress);

// @route   GET /api/addresses/:id
// @desc    Get specific address
// @access  Private
router.get('/:id', getAddress);

// @route   PUT /api/addresses/:id
// @desc    Update address
// @access  Private
router.put('/:id', updateAddress);

// @route   DELETE /api/addresses/:id
// @desc    Delete address
// @access  Private
router.delete('/:id', deleteAddress);

// @route   PUT /api/addresses/:id/default
// @desc    Set address as default
// @access  Private
router.put('/:id/default', setDefaultAddress);

module.exports = router;