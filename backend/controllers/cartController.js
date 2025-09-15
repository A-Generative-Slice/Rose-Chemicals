const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price images');

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }

    // Calculate totals
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const totalItems = cart.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    res.json({
      success: true,
      cart: {
        ...cart.toObject(),
        totalAmount,
        totalItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { productId, quantity } = req.body;

    console.log('Add to cart request:', { productId, quantity, userId: req.user.id });

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity }]
      });
    } else {
      // Check if product exists in cart
      const existingItem = cart.items.find(
        item => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    cart = await cart.populate('items.product', 'name price images');

    // Calculate totals
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const totalItems = cart.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    res.json({
      success: true,
      cart: {
        ...cart.toObject(),
        totalAmount,
        totalItems
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to cart',
      error: error.message
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    cart = await cart.populate('items.product', 'name price images');

    // Calculate totals
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const totalItems = cart.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    res.json({
      success: true,
      cart: {
        ...cart.toObject(),
        totalAmount,
        totalItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from cart',
      error: error.message
    });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find the item in cart
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    existingItem.quantity = quantity;
    await cart.save();
    cart = await cart.populate('items.product', 'name price images');

    // Calculate totals
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const totalItems = cart.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    res.json({
      success: true,
      cart: {
        ...cart.toObject(),
        totalAmount,
        totalItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart: {
        ...cart.toObject(),
        totalAmount: 0,
        totalItems: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};
