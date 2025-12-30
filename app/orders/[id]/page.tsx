'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  MessageCircle,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Package,
  Truck,
  X,
  Edit
} from 'lucide-react';
import Header from '../../../components/Header';
import OrderTracking from '../../../components/OrderTracking';
import PaymentStatus from '../../../components/PaymentStatus';
import { ordersAPI } from '../../../src/services/api';
import { useAuth } from '../../../src/contexts/AuthContext';

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    image?: string;
    images?: Array<{ url: string; alt?: string }>;
    category: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  orderNotes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, isAuthenticated, router]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersAPI.getOrder(orderId);
      setOrder(response.order);
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      setError(error.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrderDetails();
    setRefreshing(false);
  };

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      // Implement cancel order API call
      await ordersAPI.cancelOrder(orderId);
      await fetchOrderDetails();
      setShowCancelModal(false);
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please contact support.');
    } finally {
      setCancelling(false);
    }
  };

  const canCancelOrder = () => {
    if (!order) return false;
    return ['pending', 'confirmed', 'processing'].includes(order.orderStatus.toLowerCase());
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
      case 'out-for-delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadInvoice = () => {
    // Implement invoice download functionality
    alert('Invoice download will be implemented soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Order</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRefresh}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/orders"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
            <Link
              href="/orders"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/orders"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-sm text-gray-600">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh order status"
            >
              <RefreshCw size={20} className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            {order.orderStatus === 'delivered' && (
              <button
                onClick={downloadInvoice}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={16} />
                Download Invoice
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status & Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus === 'completed' ? 'Paid' : order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {canCancelOrder() && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm"
                  >
                    <X size={16} />
                    Cancel Order
                  </button>
                )}

                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <MessageCircle size={16} />
                  Contact Support
                </button>

                {order.orderStatus !== 'delivered' && (
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <Edit size={16} />
                    Modify Address
                  </button>
                )}
              </div>
            </div>

            {/* Order Tracking */}
            <OrderTracking
              orderId={order._id}
              currentStatus={order.orderStatus}
              orderDate={order.createdAt}
              estimatedDelivery={order.estimatedDelivery}
              trackingNumber={order.trackingNumber}
            />

            {/* Payment Status */}
            {order.paymentMethod === 'online' && order.paymentStatus !== 'completed' && (
              <PaymentStatus
                orderId={order._id}
                className="w-full"
              />
            )}

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items ({order.items.length})
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img
                        src={
                          item.product?.images?.[0]?.url ?
                            (item.product.images[0].url.startsWith('/uploads/') ?
                              `/api/image-proxy?path=${item.product.images[0].url.replace('/uploads/', '')}` :
                              item.product.images[0].url
                            ) :
                            (item.product?.image || '/images/placeholder-product.svg')
                        }
                        alt={item.product?.name || 'Product'}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder-product.svg';
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Category: {item.product.category}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="border-t mt-6 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-primary">₹{order.totalAmount.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Including all taxes and charges</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{order.shippingAddress.phone}</span>
                </div>

                {order.shippingAddress.email && (
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{order.shippingAddress.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium text-gray-900">
                      {order.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}
                    </p>
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="flex items-center gap-3">
                    <Truck size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Tracking Number</p>
                      <p className="font-medium text-gray-900">{order.trackingNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Notes */}
            {order.orderNotes && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h3>
                <p className="text-sm text-gray-600">{order.orderNotes}</p>
              </div>
            )}

            {/* Need Help */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-4">
                Our customer support team is here to help you with any questions about your order.
              </p>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-blue-700 hover:bg-blue-100 rounded transition-colors">
                  📞 Call Support: +91 98765 43210
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-blue-700 hover:bg-blue-100 rounded transition-colors">
                  ✉️ Email: support@rosechemicals.com
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-blue-700 hover:bg-blue-100 rounded transition-colors">
                  💬 Live Chat (9 AM - 6 PM)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
              If you&apos;ve already paid, the refund will be processed within 5-7 business days.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {cancelling && <RefreshCw size={16} className="animate-spin" />}
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}