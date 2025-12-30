'use client';

import { useState, useEffect } from 'react';

interface TempCartItem {
  productId: string;
  quantity: number;
  addedAt: number;
}

interface TempCart {
  items: TempCartItem[];
  updatedAt: number;
}

const TEMP_CART_KEY = 'rosechemicals_temp_cart';
const TEMP_CART_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export const useTempCart = () => {
  const [tempCart, setTempCart] = useState<TempCart>({ items: [], updatedAt: Date.now() });

  // Load temp cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(TEMP_CART_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          
          // Check if cart is expired
          if (Date.now() - parsed.updatedAt > TEMP_CART_EXPIRY) {
            localStorage.removeItem(TEMP_CART_KEY);
            return;
          }
          
          // Filter out expired items (older than 7 days)
          const validItems = parsed.items.filter(
            (item: TempCartItem) => Date.now() - item.addedAt < TEMP_CART_EXPIRY
          );
          
          if (validItems.length !== parsed.items.length) {
            const updatedCart = { items: validItems, updatedAt: Date.now() };
            localStorage.setItem(TEMP_CART_KEY, JSON.stringify(updatedCart));
            setTempCart(updatedCart);
          } else {
            setTempCart(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading temp cart:', error);
        localStorage.removeItem(TEMP_CART_KEY);
      }
    }
  }, []);

  const saveTempCart = (cart: TempCart) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(TEMP_CART_KEY, JSON.stringify(cart));
        setTempCart(cart);
      } catch (error) {
        console.error('Error saving temp cart:', error);
      }
    }
  };

  const addToTempCart = (productId: string, quantity: number = 1) => {
    const existingItemIndex = tempCart.items.findIndex(item => item.productId === productId);
    const newItems = [...tempCart.items];
    
    if (existingItemIndex > -1) {
      newItems[existingItemIndex].quantity += quantity;
    } else {
      newItems.push({
        productId,
        quantity,
        addedAt: Date.now()
      });
    }
    
    const updatedCart = {
      items: newItems,
      updatedAt: Date.now()
    };
    
    saveTempCart(updatedCart);
  };

  const updateTempCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromTempCart(productId);
      return;
    }
    
    const newItems = tempCart.items.map(item =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    );
    
    const updatedCart = {
      items: newItems,
      updatedAt: Date.now()
    };
    
    saveTempCart(updatedCart);
  };

  const removeFromTempCart = (productId: string) => {
    const newItems = tempCart.items.filter(item => item.productId !== productId);
    const updatedCart = {
      items: newItems,
      updatedAt: Date.now()
    };
    
    saveTempCart(updatedCart);
  };

  const clearTempCart = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TEMP_CART_KEY);
    }
    setTempCart({ items: [], updatedAt: Date.now() });
  };

  const getTempCartCount = () => {
    return tempCart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const hasTempCart = () => {
    return tempCart.items.length > 0;
  };

  return {
    tempCart,
    addToTempCart,
    updateTempCartItem,
    removeFromTempCart,
    clearTempCart,
    getTempCartCount,
    hasTempCart
  };
};

export default useTempCart;