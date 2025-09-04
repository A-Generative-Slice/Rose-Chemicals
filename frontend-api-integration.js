// API Service for Rose Chemicals E-commerce Frontend
// Save this as: src/services/api.js in your React frontend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
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
    localStorage.removeItem('token');
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
    apiRequest('/cart/remove', {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
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

// Admin API (admin only)
export const adminAPI = {
  // Get dashboard statistics
  getDashboardStats: () => 
    apiRequest('/admin/dashboard/stats'),

  // Update inventory
  updateInventory: (productId, stock, action) => 
    apiRequest('/admin/inventory/update', {
      method: 'PATCH',
      body: JSON.stringify({ productId, stock, action }),
    }),

  // Export orders to CSV
  exportOrders: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return apiRequest(`/admin/export/orders?${params.toString()}`);
  },

  // Export products to CSV
  exportProducts: () => 
    apiRequest('/admin/export/products'),

  // Get all users
  getAllUsers: (page = 1, limit = 10) => 
    apiRequest(`/admin/users?page=${page}&limit=${limit}`),

  // Update user status
  updateUserStatus: (userId, status) => 
    apiRequest(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Get all orders (admin view)
  getAllOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/orders${queryString ? `?${queryString}` : ''}`);
  },
};

// Example usage in React components:
/*
import React, { useState, useEffect } from 'react';
import { productsAPI, cartAPI } from '../services/api';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getProducts();
        setProducts(response.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await cartAPI.addToCart(productId, 1);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>${product.price}</p>
          <button onClick={() => handleAddToCart(product._id)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductsList;
*/

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
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
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
