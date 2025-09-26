'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../src/contexts/CartContext';
import { useAuth } from '../src/contexts/AuthContext';

export default function ProductCard({ product }: { product: any }){
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      setLoading(true);
      // Use _id if available, otherwise fallback to id
      const productId = product._id || product.id;
      await addToCart(productId, 1);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestQuote = () => {
    // Open request quote modal or navigate to quote page
    alert('Request quote functionality will be implemented');
  };

  return (
    <div className="bg-tile-bg rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-tertiary">
      <Link href={`/products/${product._id || product.id}`}>
        <div className="overflow-hidden rounded-lg bg-white cursor-pointer">
          <img 
            src={product.images?.[0] || product.image || '/images/placeholder-product.svg'} 
            alt={product.name} 
            className="w-full h-48 object-contain transform transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder-product.svg';
            }}
          />
        </div>
      </Link>
      <Link href={`/products/${product._id || product.id}`}>
        <h3 className="mt-3 font-medium text-tile-text-primary hover:text-tertiary cursor-pointer transition-colors">
          {product.name}
        </h3>
      </Link>
      <p className="text-sm text-tile-text-secondary">
        {typeof product.price === 'number' ? `₹${product.price}` : product.price}
      </p>
      <div className="mt-3 flex gap-2">
        <button 
          onClick={handleAddToCart}
          disabled={loading}
          className="flex-1 bg-header-cta text-header-cta-text font-medium text-sm py-2 px-4 rounded-lg 
                   hover:bg-highlight/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
        <button 
          onClick={handleRequestQuote}
          className="flex-1 bg-transparent border border-tile-text-secondary text-tile-text-secondary text-sm py-2 px-4 rounded-lg
                   hover:border-tile-text-primary hover:text-tile-text-primary transition-colors duration-200"
        >
          Request Quote
        </button>
      </div>
    </div>
  )
}
