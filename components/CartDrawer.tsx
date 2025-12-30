'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../src/contexts/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totalAmount, totalItems, updateCartItem, removeFromCart, loading } = useCart();
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-primary" size={24} />
            <h2 className="text-lg font-semibold">
              Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading && items.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <ShoppingBag className="text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some products to get started</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {items.map((item) => {
                const isUpdating = updatingItems.has(item.product._id);
                return (
                  <div
                    key={item.product._id}
                    className={`flex gap-4 p-4 border border-gray-200 rounded-lg transition-opacity ${isUpdating ? 'opacity-50' : ''
                      }`}
                  >
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
                      className="w-16 h-16 object-contain bg-gray-50 rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-product.svg';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        ₹{item.product.price.toFixed(2)} each
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityUpdate(item.product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isUpdating}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityUpdate(item.product._id, item.quantity + 1)}
                            disabled={isUpdating}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item.product._id)}
                            disabled={isUpdating}
                            className="p-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-primary">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="space-y-2">
              <Link
                href="/cart"
                onClick={onClose}
                className="w-full block text-center px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full block text-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Checkout
              </Link>
            </div>

          </div>
        )}
      </div>
    </>
  );
}