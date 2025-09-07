'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Download, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import { ordersAPI } from '../../src/services/api';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await ordersAPI.getOrder(orderId);
      setOrder(response.order);
    } catch (error) {
      console.error('Error fetching order details:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <CheckCircle className="text-green-500" size={80} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          
          {orderId && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <p className="text-green-800">
                <strong>Order ID:</strong> #{orderId.slice(-8).toUpperCase()}
              </p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : order ? (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Shipping Information</h3>
                <div className="text-gray-600 space-y-1">
                  <p><strong>Name:</strong> {order.shippingAddress?.name}</p>
                  <p><strong>Phone:</strong> {order.shippingAddress?.phone}</p>
                  <p><strong>Address:</strong></p>
                  <p className="ml-4">
                    {order.shippingAddress?.street}<br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                    {order.shippingAddress?.pincode}, {order.shippingAddress?.country}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Order Information</h3>
                <div className="text-gray-600 space-y-1">
                  <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
                  <p><strong>Payment Method:</strong> {order.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}</p>
                  <p><strong>Payment Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus || 'Pending'}
                    </span>
                  </p>
                  <p><strong>Total Amount:</strong> ₹{order.totalAmount?.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {order.items && order.items.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Items Ordered</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.product?.image || '/images/placeholder-product.png'}
                        alt={item.product?.name || 'Product'}
                        className="w-16 h-16 object-contain bg-gray-50 rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder-product.png';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product?.name || 'Product'}</h4>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-gray-900 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Package className="mx-auto text-primary mb-4" size={48} />
            <h3 className="font-semibold text-gray-900 mb-2">Track Your Order</h3>
            <p className="text-gray-600 text-sm mb-4">
              You'll receive tracking information via email once your order ships.
            </p>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              View Orders <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Download className="mx-auto text-primary mb-4" size={48} />
            <h3 className="font-semibold text-gray-900 mb-2">Download Invoice</h3>
            <p className="text-gray-600 text-sm mb-4">
              Your invoice will be available for download once payment is confirmed.
            </p>
            <button className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors">
              Download <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <CheckCircle className="mx-auto text-primary mb-4" size={48} />
            <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
            <p className="text-gray-600 text-sm mb-4">
              We'll prepare your order and send you updates about its progress.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-6">
            If you have any questions about your order, please don't hesitate to contact us.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/orders"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
