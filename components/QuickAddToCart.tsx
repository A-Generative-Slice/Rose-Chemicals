'use client';

import { useState } from 'react';
import { ShoppingBag, Plus, Check } from 'lucide-react';
import { useCart } from '../src/contexts/CartContext';
import { useAuth } from '../src/contexts/AuthContext';

interface QuickAddToCartProps {
  product: {
    _id: string;
    name: string;
    price: number;
    stock: number;
    images?: string[];
  };
  size?: 'sm' | 'md' | 'lg';
  showQuantity?: boolean;
  className?: string;
}

export default function QuickAddToCart({ 
  product, 
  size = 'md', 
  showQuantity = false,
  className = '' 
}: QuickAddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    if (product.stock < quantity) {
      alert('Insufficient stock available');
      return;
    }

    try {
      setLoading(true);
      await addToCart(product._id, quantity);
      setAdded(true);
      
      // Reset the "added" state after 2 seconds
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  if (product.stock === 0) {
    return (
      <button
        disabled
        className={`${sizeClasses[size]} bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="space-y-2">
      {showQuantity && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-sm"
          >
            -
          </button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-sm"
          >
            +
          </button>
        </div>
      )}
      
      <button
        onClick={handleAddToCart}
        disabled={loading || added}
        className={`${sizeClasses[size]} ${
          added 
            ? 'bg-green-500 text-white' 
            : 'bg-primary text-white hover:bg-primary-dark'
        } rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Adding...
          </>
        ) : added ? (
          <>
            <Check size={iconSizes[size]} />
            Added!
          </>
        ) : (
          <>
            <ShoppingBag size={iconSizes[size]} />
            Add to Cart
            {showQuantity && quantity > 1 && (
              <span className="ml-1 px-1.5 py-0.5 bg-white bg-opacity-20 rounded text-xs">
                {quantity}
              </span>
            )}
          </>
        )}
      </button>
      
      {product.stock < 10 && product.stock > 0 && (
        <p className="text-xs text-orange-600 text-center">
          Only {product.stock} left in stock
        </p>
      )}
    </div>
  );
}