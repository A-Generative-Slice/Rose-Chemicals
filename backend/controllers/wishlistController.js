const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const wishlist = await Wishlist.getOrCreate(userId);
    
    res.json({
      success: true,
      wishlist
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
      error: error.message
    });
  }
};

// Add item to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const { notifyOnSale, notifyOnStock } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const wishlist = await Wishlist.getOrCreate(userId);
    
    // Check if product is already in wishlist
    if (wishlist.hasProduct(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    await wishlist.addItem(productId, { notifyOnSale, notifyOnStock });
    await wishlist.populate('items.product');

    res.json({
      success: true,
      message: 'Product added to wishlist',
      wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to wishlist',
      error: error.message
    });
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    if (!wishlist.hasProduct(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product not in wishlist'
      });
    }

    await wishlist.removeItem(productId);
    await wishlist.populate('items.product');

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from wishlist',
      error: error.message
    });
  }
};

// Update wishlist settings
exports.updateWishlist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    if (name) wishlist.name = name;
    if (description !== undefined) wishlist.description = description;
    if (isPublic !== undefined) wishlist.isPublic = isPublic;

    await wishlist.save();
    await wishlist.populate('items.product');

    res.json({
      success: true,
      message: 'Wishlist updated successfully',
      wishlist
    });
  } catch (error) {
    console.error('Update wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating wishlist',
      error: error.message
    });
  }
};

// Update wishlist item notifications
exports.updateWishlistItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { notifyOnSale, notifyOnStock } = req.body;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    const item = wishlist.items.find(item => 
      item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }

    if (notifyOnSale !== undefined) item.notifyOnSale = notifyOnSale;
    if (notifyOnStock !== undefined) item.notifyOnStock = notifyOnStock;

    await wishlist.save();
    await wishlist.populate('items.product');

    res.json({
      success: true,
      message: 'Wishlist item updated successfully',
      wishlist
    });
  } catch (error) {
    console.error('Update wishlist item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating wishlist item',
      error: error.message
    });
  }
};

// Check if product is in wishlist
exports.checkWishlistStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId });
    const inWishlist = wishlist ? wishlist.hasProduct(productId) : false;

    res.json({
      success: true,
      inWishlist
    });
  } catch (error) {
    console.error('Check wishlist status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking wishlist status',
      error: error.message
    });
  }
};

// Get public wishlist (for sharing)
exports.getPublicWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.findOne({ 
      user: userId, 
      isPublic: true 
    }).populate('items.product user', 'name email');

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Public wishlist not found'
      });
    }

    res.json({
      success: true,
      wishlist
    });
  } catch (error) {
    console.error('Get public wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching public wishlist',
      error: error.message
    });
  }
};

// Move items from wishlist to cart
exports.moveToCart = async (req, res) => {
  try {
    const { productIds } = req.body; // Array of product IDs
    const userId = req.user.id;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product IDs to move to cart'
      });
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    // Here you would integrate with your cart API
    // For now, we'll just remove from wishlist
    const Cart = require('../models/Cart');
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const movedProducts = [];
    
    for (const productId of productIds) {
      if (wishlist.hasProduct(productId)) {
        // Check if product exists and has stock
        const product = await Product.findById(productId);
        if (product && product.stock > 0) {
          // Add to cart
          const existingCartItem = cart.items.find(item => 
            item.product.toString() === productId
          );
          
          if (existingCartItem) {
            existingCartItem.quantity += 1;
          } else {
            cart.items.push({ product: productId, quantity: 1 });
          }
          
          // Remove from wishlist
          await wishlist.removeItem(productId);
          movedProducts.push(productId);
        }
      }
    }

    await cart.save();
    await wishlist.populate('items.product');

    res.json({
      success: true,
      message: `${movedProducts.length} items moved to cart`,
      movedCount: movedProducts.length,
      wishlist
    });
  } catch (error) {
    console.error('Move to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error moving items to cart',
      error: error.message
    });
  }
};