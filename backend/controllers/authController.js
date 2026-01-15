const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Prepare address data if provided
    let addresses = [];
    if (address) {
      addresses.push({
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.pincode, // Frontend sends 'pincode', schema expects 'postalCode'
        country: address.country || 'India',
        isDefault: true
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      addresses
    });

    // Create token
    const token = generateToken(user._id);

    // Send Welcome Email
    const emailService = require('../services/emailService');
    emailService.sendWelcomeEmail(user).catch(err => console.error('Welcome email failed:', err));

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        createdAt: user.createdAt,
        totalOrders: 0,
        address: user.addresses && user.addresses.length > 0 ? {
          ...user.addresses[0].toObject(),
          pincode: user.addresses[0].postalCode
        } : null
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Get total orders
    const totalOrders = await Order.countDocuments({ user: user._id });

    // Create token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        createdAt: user.createdAt,
        totalOrders,
        address: user.addresses && user.addresses.length > 0 ? {
          ...user.addresses[0].toObject(),
          pincode: user.addresses[0].postalCode
        } : null
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get total orders
    const totalOrders = await Order.countDocuments({ user: req.user.id });

    // Add virtual address field for frontend compatibility
    const userObj = user.toObject();
    if (userObj.addresses && userObj.addresses.length > 0) {
      userObj.address = {
        ...userObj.addresses[0],
        pincode: userObj.addresses[0].postalCode
      };
    }

    res.json({
      success: true,
      user: {
        ...userObj,
        totalOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate reset token (simplified version - in production use crypto)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Save reset token to user (you'll need to update User model)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send email
    const emailService = require('../services/emailService');
    try {
      await emailService.sendPasswordReset(user, resetToken);

      res.json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      console.error('Email send error:', error);
      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate new JWT token
    const jwtToken = generateToken(user._id);

    res.json({
      success: true,
      token: jwtToken,
      message: 'Password reset successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (address) {
      if (!user.addresses) user.addresses = [];

      const addrData = {
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode || address.pincode,
        country: address.country || 'India',
        isDefault: true
      };

      if (user.addresses.length > 0) {
        user.addresses[0] = { ...user.addresses[0], ...addrData };
      } else {
        user.addresses.push(addrData);
      }
    }

    await user.save();

    // Get total orders
    const totalOrders = await Order.countDocuments({ user: req.user.id });

    const updatedAddress = user.addresses && user.addresses.length > 0 ? {
      ...user.addresses[0].toObject(),
      pincode: user.addresses[0].postalCode
    } : null;

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
        totalOrders,
        address: updatedAddress
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
