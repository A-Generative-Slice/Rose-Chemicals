'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Header from '../../components/Header';
import { useCart } from '../../src/contexts/CartContext';
import { useAuth } from '../../src/contexts/AuthContext';

export default function CartPage() {
  const { items, totalAmount, updateCartItem, removeFromCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleQuantityUpdate = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await updateCartItem(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
            <p className="text-gray-600 mb-8">Please login to view your cart</p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-8">Add some products to get started</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Cart Items ({items.length})
                  </h2>
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.product._id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0">
                          <img
                            src={
                              item.product.images?.[0]?.url ?
                                (item.product.images[0].url.startsWith('/uploads/') ?
                                  `/api/image-proxy?path=${item.product.images[0].url.replace('/uploads/', '')}` :
                                  item.product.images[0].url
                                ) :
                                (item.product.image || '/images/placeholder-product.svg')
                            }
                            alt={item.product.name}
                            className="w-20 h-20 object-contain bg-gray-50 rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder-product.svg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product._id}`}
                            className="font-medium text-gray-900 hover:text-primary transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            {typeof item.product.category === 'object' && item.product.category?.name
                              ? item.product.category.name
                              : typeof item.product.category === 'string'
                                ? item.product.category
                                : 'Uncategorized'}
                          </p>
                          <p className="text-lg font-semibold text-gray-900 mt-2">
                            ₹{item.product.price}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-4">
                          <button
                            onClick={() => handleRemoveItem(item.product._id)}
                            disabled={updatingItems.has(item.product._id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityUpdate(item.product._id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItems.has(item.product._id)}
                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-medium">
                              {updatingItems.has(item.product._id) ? '...' : item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityUpdate(item.product._id, item.quantity + 1)}
                              disabled={updatingItems.has(item.product._id)}
                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="w-full mt-6 bg-primary text-white py-3 px-4 rounded-lg font-medium text-center block hover:bg-primary-dark transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/"
                  className="w-full mt-3 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium text-center block hover:bg-gray-200 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
