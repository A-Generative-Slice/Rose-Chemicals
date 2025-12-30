'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Download, ArrowRight, CreditCard, Calendar, MapPin, Phone, Mail, Share2 } from 'lucide-react';
import Header from '../../components/Header';
import PaymentStatus from '../../components/PaymentStatus';
import { ordersAPI } from '../../src/services/api';

export default function EnhancedOrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      router.push('/orders');
    }
  }, [orderId, router]);

  const fetchOrderDetails = async () => {
    try {
      const response = await ordersAPI.getOrder(orderId!);
      setOrder(response.order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleShare = async () => {
    if (!navigator.share) {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Order link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
      return;
    }

    setSharing(true);
    try {
      await navigator.share({
        title: `Rose Chemicals - Order #${orderId?.slice(-8)}`,
        text: `I just placed an order with Rose Chemicals!`,
        url: window.location.href,
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    } finally {
      setSharing(false);
    }
  };

  const downloadInvoice = () => {
    // In a real app, this would download the actual invoice
    alert('Invoice download will be available once payment is confirmed and order is processed.');
  };

  const getEstimatedDelivery = () => {
    const orderDate = new Date(order?.createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 days delivery

    return deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The order you\'re looking for could not be found.'}</p>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <CheckCircle className="text-green-500" size={80} />
              {paymentId && (
                <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1">
                  <CreditCard className="text-white" size={16} />
                </div>
              )}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                Order ID: #{orderId?.slice(-8).toUpperCase()}
              </p>
            </div>

            <button
              onClick={handleShare}
              disabled={sharing}
              className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
            >
              <Share2 size={16} />
              {sharing ? 'Sharing...' : 'Share'}
            </button>
          </div>

          {/* Payment Status */}
          {order.paymentMethod === 'online' && (
            <PaymentStatus
              orderId={orderId!}
              className="max-w-md mx-auto mb-6"
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="text-gray-400 mt-1" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">Order Date</p>
                      <p className="text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="text-gray-400 mt-1" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">Payment Method</p>
                      <p className="text-gray-600">
                        {order.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Package className="text-gray-400 mt-1" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">Estimated Delivery</p>
                      <p className="text-gray-600">{getEstimatedDelivery()}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-1" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">Order Status</p>
                      <span className="inline-flex px-2 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                        {order.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">{order.shippingAddress?.name}</p>
                    <p className="text-gray-600">{order.shippingAddress?.street}</p>
                    <p className="text-gray-600">
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>
                    <p className="text-gray-600">{order.shippingAddress?.country}</p>
                    <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        <span className="text-gray-600">{order.shippingAddress?.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Ordered */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Items Ordered</h3>
              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.product?.images?.[0] || '/images/placeholder-product.png'}
                      alt={item.product?.name || 'Product'}
                      className="w-16 h-16 object-contain bg-gray-50 rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-product.png';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product?.name || 'Product'}</h4>
                      <p className="text-gray-600">SKU: {item.product?.sku || 'N/A'}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-gray-900 font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Order Total */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Total</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(order.totalAmount / 1.18)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18% GST)</span>
                  <span className="font-medium">{formatCurrency(order.totalAmount - (order.totalAmount / 1.18))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={downloadInvoice}
                  className="w-full flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download size={20} />
                  Download Invoice
                </button>

                <Link
                  href="/orders"
                  className="w-full flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Package size={20} />
                  Track Order
                </Link>

                <Link
                  href="/contact"
                  className="w-full flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Mail size={20} />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Package className="mx-auto text-primary mb-4" size={48} />
            <h3 className="font-semibold text-gray-900 mb-2">Order Processing</h3>
            <p className="text-gray-600 text-sm mb-4">
              We&apos;ll prepare your order and send you updates about its progress.
            </p>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              Track Progress <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Download className="mx-auto text-primary mb-4" size={48} />
            <h3 className="font-semibold text-gray-900 mb-2">Order Documents</h3>
            <p className="text-gray-600 text-sm mb-4">
              Your invoice and shipping documents will be available for download.
            </p>
            <button
              onClick={downloadInvoice}
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              Download <ArrowRight size={16} />
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <CheckCircle className="mx-auto text-primary mb-4" size={48} />
            <h3 className="font-semibold text-gray-900 mb-2">Continue Shopping</h3>
            <p className="text-gray-600 text-sm mb-4">
              Explore more quality chemical products for your needs.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-6">
            If you have any questions about your order, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Mail size={20} />
              Contact Support
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package size={20} />
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}