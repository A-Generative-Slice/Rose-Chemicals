// API Service for Rose Chemicals E-commerce Frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to make API requests
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

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
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
    apiRequest('/products', {
      method: 'POST',
      body: productData, // FormData for file uploads
    }),

  // Update product (admin only)
  updateProduct: (id, productData) => 
    apiRequest(`/products/${id}`, {
      method: 'PATCH',
      body: productData instanceof FormData ? productData : JSON.stringify(productData),
    }),

  // Delete product (admin only)
  deleteProduct: (id) => 
    apiRequest(`/products/${id}`, {
      method: 'DELETE',
    }),

  // Search products
  searchProducts: (query) => 
    apiRequest(`/products/search?q=${encodeURIComponent(query)}`),
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
};

// Orders API
export const ordersAPI = {
  // Create new order
  createOrder: (orderData) => 
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  // Get user's orders
  getMyOrders: () => 
    apiRequest('/orders/my-orders'),

  // Get single order
  getOrder: (id) => 
    apiRequest(`/orders/${id}`),
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
