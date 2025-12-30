// API Service for Rose Chemicals E-commerce Frontend

// Determine API base URL based on environment
const getAPIBaseURL = () => {
  // If explicitly set in env, use that
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // In browser, use relative path (Nginx will proxy)
  if (typeof window !== 'undefined') {
    return '/api';
  }

  // Server-side fallback
  return 'http://localhost:5001/api';
};

const API_BASE_URL = getAPIBaseURL();

// Helper function to get auth token with admin fallback
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    return token || null; // Only return actual token, no fallback
  }
  return null; // Server-side fallback
};

// Helper function to make API requests with retry logic
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Handle FormData (for file uploads)
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  // Retry logic for network failures
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, config);

      // Check if response is ok
      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: 'Server error' }));
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      lastError = error;

      // Don't retry for auth errors or client errors (4xx)
      if (error.message.includes('401') || error.message.includes('403') || error.message.includes('404')) {
        throw error;
      }

      // If it's a network error and we have retries left, wait and retry
      if (attempt < maxRetries && (error.name === 'TypeError' || error.message.includes('Failed to fetch'))) {
        console.warn(`API request failed (attempt ${attempt}/${maxRetries}), retrying...`, error.message);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000)); // Progressive delay
        continue;
      }

      // If all retries exhausted or it's not a network error, throw
      break;
    }
  }

  throw lastError;
};

// Authentication API
export const authAPI = {
  // Register new user
  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Login user
  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  // Get current user
  getCurrentUser: () =>
    apiRequest('/auth/me'),

  // Logout (client-side)
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  // Update user profile
  updateProfile: (userData) =>
    apiRequest('/auth/update-profile', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    }),
};

// Products API
export const productsAPI = {
  // Get all products with filters
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`);
  },

  // Get single product
  getProduct: (id) =>
    apiRequest(`/products/${id}`),

  // Create product (admin only)
  createProduct: (productData) =>
    apiRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  // Update product (admin only)
  updateProduct: (id, productData) => {
    const options = {
      method: 'PATCH',
    };

    if (productData instanceof FormData) {
      options.body = productData;
      // Don't set Content-Type for FormData - let browser set it
    } else {
      options.body = JSON.stringify(productData);
      options.headers = {
        'Content-Type': 'application/json',
      };
    }

    return apiRequest(`/products/${id}`, options);
  },

  // Delete product (admin only)
  deleteProduct: (id) =>
    apiRequest(`/products/${id}`, {
      method: 'DELETE',
    }),

  // Search products
  searchProducts: (query) =>
    apiRequest(`/products/search?q=${encodeURIComponent(query)}`),

  // Get featured products
  getFeaturedProducts: (limit = 8) =>
    apiRequest(`/products/featured?limit=${limit}`),

  // Get product suggestions for autocomplete
  getProductSuggestions: (query, limit = 5) =>
    apiRequest(`/products/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`),

  // Get products by category
  getProductsByCategory: (categoryId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products/category/${categoryId}${queryString ? `?${queryString}` : ''}`);
  },

  // Get product categories
  getCategories: () =>
    apiRequest('/products/categories'),
};

// Cart API
export const cartAPI = {
  // Get user's cart
  getCart: () =>
    apiRequest('/cart'),

  // Add item to cart
  addToCart: (productId, quantity = 1) =>
    apiRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),

  // Update cart item quantity
  updateCartItem: (productId, quantity) =>
    apiRequest('/cart/update', {
      method: 'PATCH',
      body: JSON.stringify({ productId, quantity }),
    }),

  // Remove item from cart
  removeFromCart: (productId) =>
    apiRequest(`/cart/remove/${productId}`, {
      method: 'DELETE',
    }),

  // Clear entire cart
  clearCart: () =>
    apiRequest('/cart/clear', {
      method: 'DELETE',
    }),

  // Validate cart items
  validateCart: () =>
    apiRequest('/cart/validate', {
      method: 'POST',
    }),

  // Merge temporary cart
  mergeTempCart: (tempCartItems) =>
    apiRequest('/cart/merge-temp', {
      method: 'POST',
      body: JSON.stringify({ tempCartItems }),
    }),
};

// Orders API
export const ordersAPI = {
  // Create new order
  createOrder: (orderData) =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  // Get user's orders (supports optional query params: page, limit, status, etc.)
  getMyOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders/my-orders${queryString ? `?${queryString}` : ''}`);
  },

  // Get single order
  getOrder: (id) =>
    apiRequest(`/orders/${id}`),

  // Cancel order
  cancelOrder: (id) =>
    apiRequest(`/orders/${id}/cancel`, {
      method: 'PATCH',
    }),

  // Update order status (admin only)
  updateOrderStatus: (id, status) =>
    apiRequest(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Send Delivery OTP (Admin only)
  sendDeliveryOTP: (id) =>
    apiRequest(`/orders/${id}/send-otp`, {
      method: 'POST',
    }),

  // Verify Delivery OTP (User)
  verifyDeliveryOTP: (id, otp) =>
    apiRequest(`/orders/${id}/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ otp }),
    }),
};

// Payment API
export const paymentAPI = {
  // Create payment order
  createPaymentOrder: (orderId) =>
    apiRequest('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    }),

  // Verify payment
  verifyPayment: (paymentData) =>
    apiRequest('/payment/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  // Get payment status
  getPaymentStatus: (orderId) =>
    apiRequest(`/payment/status/${orderId}`),

  // Retry failed payment
  retryPayment: (orderId) =>
    apiRequest('/payment/retry', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    }),
};

// Reviews API
export const reviewsAPI = {
  // Get reviews for a product
  getProductReviews: (productId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/reviews/product/${productId}${queryString ? `?${queryString}` : ''}`);
  },

  // Create a review
  createReview: (productId, reviewData) =>
    apiRequest(`/reviews/product/${productId}`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),

  // Update a review
  updateReview: (reviewId, reviewData) =>
    apiRequest(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    }),

  // Delete a review
  deleteReview: (reviewId) =>
    apiRequest(`/reviews/${reviewId}`, {
      method: 'DELETE',
    }),

  // Mark review as helpful
  markHelpful: (reviewId) =>
    apiRequest(`/reviews/${reviewId}/helpful`, {
      method: 'PATCH',
    }),

  // Report a review
  reportReview: (reviewId, reason) =>
    apiRequest(`/reviews/${reviewId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // Get user's reviews
  getUserReviews: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/reviews/my-reviews${queryString ? `?${queryString}` : ''}`);
  },
};

// Wishlist API
export const wishlistAPI = {
  // Get user's wishlist
  getWishlist: () =>
    apiRequest('/wishlist'),

  // Add item to wishlist
  addToWishlist: (productId, options = {}) =>
    apiRequest(`/wishlist/add/${productId}`, {
      method: 'POST',
      body: JSON.stringify(options),
    }),

  // Remove item from wishlist
  removeFromWishlist: (productId) =>
    apiRequest(`/wishlist/remove/${productId}`, {
      method: 'DELETE',
    }),

  // Update wishlist settings
  updateWishlist: (wishlistData) =>
    apiRequest('/wishlist', {
      method: 'PATCH',
      body: JSON.stringify(wishlistData),
    }),

  // Update wishlist item
  updateWishlistItem: (productId, options) =>
    apiRequest(`/wishlist/item/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(options),
    }),

  // Check if product is in wishlist
  checkWishlistStatus: (productId) =>
    apiRequest(`/wishlist/check/${productId}`),

  // Get public wishlist
  getPublicWishlist: (userId) =>
    apiRequest(`/wishlist/public/${userId}`),

  // Move items to cart
  moveToCart: (productIds) =>
    apiRequest('/wishlist/move-to-cart', {
      method: 'POST',
      body: JSON.stringify({ productIds }),
    }),
};

// Razorpay Integration Helper
export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const processPayment = async (orderId, userInfo) => {
  try {
    // Load Razorpay script
    const res = await initializeRazorpay();
    if (!res) {
      throw new Error('Razorpay SDK failed to load');
    }

    // Create payment order
    const { razorpayOrder, order } = await paymentAPI.createPaymentOrder(orderId);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Rose Chemicals',
      description: `Payment for Order #${order._id}`,
      order_id: razorpayOrder.id,
      prefill: {
        name: userInfo.name,
        email: userInfo.email,
        contact: userInfo.phone,
      },
      theme: {
        color: '#3399cc',
      },
      handler: async function (response) {
        try {
          await paymentAPI.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderId,
          });
          alert('Payment successful!');
          // Redirect to success page
          window.location.href = '/order-success';
        } catch (error) {
          alert('Payment verification failed');
        }
      },
      modal: {
        ondismiss: function () {
          alert('Payment cancelled');
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  }
};

// Address API
export const addressAPI = {
  // Get all user addresses
  getAddresses: () => apiRequest('/addresses'),

  // Add new address
  addAddress: (addressData) =>
    apiRequest('/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    }),

  // Update address
  updateAddress: (addressId, addressData) =>
    apiRequest(`/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    }),

  // Delete address
  deleteAddress: (addressId) =>
    apiRequest(`/addresses/${addressId}`, {
      method: 'DELETE',
    }),

  // Set default address
  setDefaultAddress: (addressId) =>
    apiRequest(`/addresses/${addressId}/default`, {
      method: 'PUT',
    }),
};

// Admin API
export const adminAPI = {
  // Dashboard & Analytics
  getAnalytics: () => apiRequest('/admin/analytics'),
  getDashboardStats: () => apiRequest('/admin/dashboard/stats'),
  getSalesAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/analytics/sales${queryString ? `?${queryString}` : ''}`);
  },
  getProductAnalytics: () => apiRequest('/admin/analytics/products'),
  getUserAnalytics: () => apiRequest('/admin/analytics/users'),
  getRevenueAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/analytics/revenue${queryString ? `?${queryString}` : ''}`);
  },

  // Recent Activity
  getRecentOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/orders/recent${queryString ? `?${queryString}` : ''}`);
  },

  getRecentUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users/recent${queryString ? `?${queryString}` : ''}`);
  },

  // Product Management
  getAllProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/products${queryString ? `?${queryString}` : ''}`);
  },

  createProduct: (productData) =>
    apiRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  updateProduct: (productId, productData) =>
    apiRequest(`/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),

  deleteProduct: (productId) =>
    apiRequest(`/admin/products/${productId}`, {
      method: 'DELETE',
    }),

  updateProductStock: (productId, stock) =>
    apiRequest(`/admin/products/${productId}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    }),

  // Order Management
  getOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/orders${queryString ? `?${queryString}` : ''}`);
  },

  getAllOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/orders${queryString ? `?${queryString}` : ''}`);
  },

  updateOrderStatus: (orderId, status) =>
    apiRequest(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  bulkUpdateOrders: (data) =>
    apiRequest('/admin/orders/bulk-update', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getOrderDetails: (orderId) =>
    apiRequest(`/admin/orders/${orderId}`),

  // User Management
  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  getAllUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  getUserDetails: (userId) =>
    apiRequest(`/admin/users/${userId}`),

  updateUserStatus: (userId, status) =>
    apiRequest(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  updateUserStatusEnhanced: (userId, isActive) =>
    apiRequest(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    }),

  deleteUser: (userId) =>
    apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    }),

  // Review Management
  getReviews: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/reviews${queryString ? `?${queryString}` : ''}`);
  },

  getAllReviews: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/reviews${queryString ? `?${queryString}` : ''}`);
  },

  updateReviewStatus: (reviewId, status) =>
    apiRequest(`/admin/reviews/${reviewId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  deleteReview: (reviewId) =>
    apiRequest(`/admin/reviews/${reviewId}`, {
      method: 'DELETE',
    }),

  getReviewStats: () =>
    apiRequest('/admin/reviews/stats'),

  // Settings Management
  getSettings: () =>
    apiRequest('/admin/settings'),

  updateSettings: (settings) =>
    apiRequest('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  // WhatsApp Management
  getWhatsAppConversations: () =>
    apiRequest('/admin/whatsapp/conversations'),

  getWhatsAppChatHistory: (phoneNumber) =>
    apiRequest(`/admin/whatsapp/history/${phoneNumber}`),

  // Inquiry Management
  getInquiries: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/inquiries${queryString ? `?${queryString}` : ''}`);
  },

  updateInquiryStatus: (id, data) =>
    apiRequest(`/inquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Public Inquiries API
export const inquiryAPI = {
  submit: (data) =>
    apiRequest('/inquiries/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Public Settings API
export const settingsAPI = {
  getPublicSettings: () => apiRequest('/settings/public'),
};
