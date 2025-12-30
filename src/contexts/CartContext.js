'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

// Cart Context
const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        totalItems: action.payload.totalItems || 0,
        loading: false
      };
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(item => item.product._id === action.payload.product._id);
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + action.payload.quantity,
          totalAmount: state.totalAmount + (action.payload.product.price * action.payload.quantity)
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
          totalItems: state.totalItems + action.payload.quantity,
          totalAmount: state.totalAmount + (action.payload.product.price * action.payload.quantity)
        };
      }
    case 'UPDATE_ITEM':
      const itemIndex = state.items.findIndex(item => item.product._id === action.payload.productId);
      if (itemIndex > -1) {
        const updatedItems = [...state.items];
        const oldQuantity = updatedItems[itemIndex].quantity;
        updatedItems[itemIndex].quantity = action.payload.quantity;
        const quantityDiff = action.payload.quantity - oldQuantity;
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + quantityDiff,
          totalAmount: state.totalAmount + (updatedItems[itemIndex].product.price * quantityDiff)
        };
      }
      return state;
    case 'REMOVE_ITEM':
      const removeIndex = state.items.findIndex(item => item.product._id === action.payload);
      if (removeIndex > -1) {
        const itemToRemove = state.items[removeIndex];
        return {
          ...state,
          items: state.items.filter(item => item.product._id !== action.payload),
          totalItems: state.totalItems - itemToRemove.quantity,
          totalAmount: state.totalAmount - (itemToRemove.product.price * itemToRemove.quantity)
        };
      }
      return state;
    case 'CLEAR_CART':
      return { items: [], totalAmount: 0, totalItems: 0, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalAmount: 0,
    totalItems: 0,
    loading: false,
    error: null,
  });

  const { isAuthenticated } = useAuth();

  const loadCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cartData = await cartAPI.getCart();
      dispatch({ type: 'SET_CART', payload: cartData.cart || { items: [], totalAmount: 0, totalItems: 0 } });
    } catch (error) {
      console.error('Failed to load cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated, loadCart]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (quantity > 50) {
      const errorMsg = 'Maximum quantity allowed per item is 50';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      throw new Error(errorMsg);
    }
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.addToCart(productId, quantity);
      dispatch({ type: 'SET_CART', payload: response.cart });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const updateCartItem = useCallback(async (productId, quantity) => {
    if (quantity > 50) {
      const errorMsg = 'Maximum quantity allowed per item is 50';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      throw new Error(errorMsg);
    }
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.updateCartItem(productId, quantity);
      dispatch({ type: 'SET_CART', payload: response.cart });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.removeFromCart(productId);
      dispatch({ type: 'SET_CART', payload: response.cart });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await cartAPI.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const validateCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.validateCart();
      dispatch({ type: 'SET_CART', payload: response.cart });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const mergeTempCart = useCallback(async (tempCartItems) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.mergeTempCart(tempCartItems);
      dispatch({ type: 'SET_CART', payload: response.cart });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      validateCart,
      mergeTempCart,
      loadCart,
      clearError,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
