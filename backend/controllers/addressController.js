const Address = require('../models/Address');
const User = require('../models/User');

// @desc    Get all addresses for the logged-in user
// @route   GET /api/addresses
// @access  Private
const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({ isDefault: -1, createdAt: -1 });
    
    res.json({
      success: true,
      addresses,
      count: addresses.length
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching addresses'
    });
  }
};

// @desc    Get a specific address
// @route   GET /api/addresses/:id
// @access  Private
const getAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    res.json({
      success: true,
      address
    });
  } catch (error) {
    console.error('Get address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching address'
    });
  }
};

// @desc    Create a new address
// @route   POST /api/addresses
// @access  Private
const createAddress = async (req, res) => {
  try {
    const {
      name,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      type,
      isDefault
    } = req.body;

    // Validate required fields
    if (!name || !phone || !street || !city || !state || !postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required address fields'
      });
    }

    // Validate postal code format
    if (country === 'India' && !/^\d{6}$/.test(postalCode)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 6-digit postal code'
      });
    }

    // Validate phone number
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number'
      });
    }

    // Check if this is the first address for the user
    const existingAddresses = await Address.countDocuments({ user: req.user.id });
    const shouldBeDefault = existingAddresses === 0 || isDefault;

    const address = await Address.create({
      user: req.user.id,
      name: name.trim(),
      phone: phone.replace(/\D/g, ''),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country || 'India',
      type: type || 'home',
      isDefault: shouldBeDefault
    });

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      address
    });
  } catch (error) {
    console.error('Create address error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating address'
    });
  }
};

// @desc    Update an address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const {
      name,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      type,
      isDefault
    } = req.body;

    let address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Validate postal code format if provided
    if (postalCode && country === 'India' && !/^\d{6}$/.test(postalCode)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 6-digit postal code'
      });
    }

    // Validate phone number if provided
    if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number'
      });
    }

    // Update fields
    if (name) address.name = name.trim();
    if (phone) address.phone = phone.replace(/\D/g, '');
    if (street) address.street = street.trim();
    if (city) address.city = city.trim();
    if (state) address.state = state.trim();
    if (postalCode) address.postalCode = postalCode.trim();
    if (country) address.country = country;
    if (type) address.type = type;
    if (typeof isDefault === 'boolean') address.isDefault = isDefault;

    await address.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      address
    });
  } catch (error) {
    console.error('Update address error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating address'
    });
  }
};

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If this is the default address, make another address default
    if (address.isDefault) {
      const otherAddress = await Address.findOne({
        user: req.user.id,
        _id: { $ne: address._id }
      }).sort({ createdAt: -1 });

      if (otherAddress) {
        otherAddress.isDefault = true;
        await otherAddress.save();
      }
    }

    await Address.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting address'
    });
  }
};

// @desc    Set an address as default
// @route   PUT /api/addresses/:id/default
// @access  Private
const setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Use the static method to set default address
    const updatedAddress = await Address.setDefaultAddress(req.user.id, req.params.id);

    res.json({
      success: true,
      message: 'Default address updated successfully',
      address: updatedAddress
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while setting default address'
    });
  }
};

// @desc    Get default address
// @route   GET /api/addresses/default
// @access  Private
const getDefaultAddress = async (req, res) => {
  try {
    const defaultAddress = await Address.getDefaultAddress(req.user.id);

    if (!defaultAddress) {
      return res.status(404).json({
        success: false,
        message: 'No default address found'
      });
    }

    res.json({
      success: true,
      address: defaultAddress
    });
  } catch (error) {
    console.error('Get default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching default address'
    });
  }
};

module.exports = {
  getUserAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress
};