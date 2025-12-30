const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price images gstPercentage');

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

    // Check max quantity limit (50)
    if (quantity > 50) {
      return res.status(400).json({
        success: false,
        message: 'Maximum quantity allowed per item is 50'
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

    cart = await cart.populate('items.product', 'name price images gstPercentage');

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
    cart = await cart.populate('items.product', 'name price images gstPercentage');

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

    // Check max quantity limit (50)
    if (quantity > 50) {
      return res.status(400).json({
        success: false,
        message: 'Maximum quantity allowed per item is 50'
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
    cart = await cart.populate('items.product', 'name price images gstPercentage');

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

// Validate cart items (check stock, prices, active status)
exports.validateCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price stock isActive images gstPercentage');

    if (!cart || cart.items.length === 0) {
      return res.json({
        success: true,
        valid: true,
        cart: { items: [], totalAmount: 0, totalItems: 0 },
        issues: []
      });
    }

    const issues = [];
    const validItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product || !product.isActive) {
        issues.push({
          type: 'unavailable',
          productId: item.product?._id || 'unknown',
          productName: product?.name || 'Unknown Product',
          message: 'Product is no longer available'
        });
        continue;
      }

      if (product.stock < item.quantity) {
        if (product.stock === 0) {
          issues.push({
            type: 'out_of_stock',
            productId: product._id,
            productName: product.name,
            message: 'Product is out of stock'
          });
          continue;
        } else {
          issues.push({
            type: 'insufficient_stock',
            productId: product._id,
            productName: product.name,
            requestedQuantity: item.quantity,
            availableStock: product.stock,
            message: `Only ${product.stock} items available, but ${item.quantity} requested`
          });
          // Update quantity to available stock
          item.quantity = product.stock;
        }
      }

      validItems.push(item);
    }

    // Update cart with valid items only
    cart.items = validItems;
    await cart.save();

    // Recalculate totals
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
    const totalItems = cart.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    res.json({
      success: true,
      valid: issues.length === 0,
      cart: {
        ...cart.toObject(),
        totalAmount,
        totalItems
      },
      issues
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating cart',
      error: error.message
    });
  }
};

// Merge temporary cart (for guest users who then log in)
exports.mergeTempCart = async (req, res) => {
  try {
    const { tempCartItems } = req.body;

    if (!tempCartItems || !Array.isArray(tempCartItems)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid temporary cart data'
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }

    // Merge temporary cart items
    for (const tempItem of tempCartItems) {
      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === tempItem.productId
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity
        cart.items[existingItemIndex].quantity += tempItem.quantity;
      } else {
        // Add new item
        cart.items.push({
          product: tempItem.productId,
          quantity: tempItem.quantity
        });
      }
    }

    await cart.save();
    cart = await cart.populate('items.product', 'name price images gstPercentage');

    // Calculate totals
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
    const totalItems = cart.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    res.json({
      success: true,
      message: 'Cart merged successfully',
      cart: {
        ...cart.toObject(),
        totalAmount,
        totalItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error merging cart',
      error: error.message
    });
  }
};
