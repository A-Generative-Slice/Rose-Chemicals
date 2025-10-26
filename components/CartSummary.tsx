'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, CreditCard, Gift, Truck, Shield } from 'lucide-react';
import { useCart } from '../src/contexts/CartContext';
import { useAuth } from '../src/contexts/AuthContext';

interface CartSummaryProps {
  showCoupon?: boolean;
  showCheckoutButton?: boolean;
  showTrustIndicators?: boolean;
  className?: string;
}

export default function CartSummary({ 
  showCoupon = true, 
  showCheckoutButton = true, 
  showTrustIndicators = false,
  className = '' 
}: CartSummaryProps) {
  const { items, totalAmount, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setCouponLoading(true);
    try {
      // Mock coupon validation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (couponCode.toUpperCase() === 'SAVE10') {
        setAppliedCoupon({
          code: 'SAVE10',
          discount: 10,
          type: 'percentage'
        });
      } else if (couponCode.toUpperCase() === 'FLAT50') {
        setAppliedCoupon({
          code: 'FLAT50',
          discount: 50,
          type: 'fixed'
        });
      } else {
        alert('Invalid coupon code');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === 'percentage') {
      return totalAmount * (appliedCoupon.discount / 100);
    } else {
      return Math.min(appliedCoupon.discount, totalAmount);
    }
  };

  const discount = calculateDiscount();
  const subtotal = totalAmount;
  const tax = (subtotal - discount) * 0.18; // 18% GST
  const finalTotal = subtotal - discount + tax;

  if (items.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="text-center">
          <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Items Preview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">Items ({totalItems})</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>
        
        {/* Show first 3 items */}
        <div className="space-y-2">
          {items.slice(0, 3).map((item) => (
            <div key={item.product._id} className="flex items-center gap-3 text-sm">
              <img
                src={item.product.images?.[0] || '/images/placeholder-product.png'}
                alt={item.product.name}
                className="w-8 h-8 object-contain bg-gray-50 rounded"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder-product.png';
                }}
              />
              <span className="flex-1 text-gray-700 truncate">{item.product.name}</span>
              <span className="text-gray-500">×{item.quantity}</span>
            </div>
          ))}
          
          {items.length > 3 && (
            <p className="text-sm text-gray-500 text-center pt-2">
              +{items.length - 3} more items
            </p>
          )}
        </div>
      </div>

      {/* Coupon Section */}
      {showCoupon && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="text-primary" size={20} />
            <span className="font-medium text-gray-900">Have a coupon?</span>
          </div>
          
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <span className="text-green-800 font-medium">{appliedCoupon.code}</span>
                <p className="text-green-600 text-sm">
                  {appliedCoupon.type === 'percentage' 
                    ? `${appliedCoupon.discount}% off` 
                    : `₹${appliedCoupon.discount} off`}
                </p>
              </div>
              <button
                onClick={removeCoupon}
                className="text-green-700 hover:text-green-900 font-medium text-sm"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary text-sm"
              />
              <button
                onClick={applyCoupon}
                disabled={couponLoading || !couponCode.trim()}
                className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {couponLoading ? '...' : 'Apply'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pricing */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (18% GST)</span>
          <span className="font-medium">₹{tax.toFixed(2)}</span>
        </div>
        
        <hr className="my-4" />
        
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="text-primary">₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      {showCheckoutButton && (
        <>
          {isAuthenticated ? (
            <Link
              href="/checkout"
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard size={20} />
              Proceed to Checkout
            </Link>
          ) : (
            <div className="space-y-3">
              <Link
                href="/auth/login?redirect=/checkout"
                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                Sign In to Checkout
              </Link>
              <p className="text-xs text-gray-500 text-center">
                New customer?{' '}
                <Link href="/auth/register" className="text-primary hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          )}
        </>
      )}

      {/* Trust Indicators */}
      {showTrustIndicators && (
        <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield size={16} className="text-green-600" />
            <span>Secure checkout with SSL encryption</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Truck size={16} className="text-blue-600" />
            <span>Free shipping on all orders</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Quality guarantee on all products</span>
          </div>
        </div>
      )}
    </div>
  );
}