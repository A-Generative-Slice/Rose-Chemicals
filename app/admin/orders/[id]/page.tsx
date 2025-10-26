'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit2, 
  Save, 
  X, 
  Phone, 
  Mail, 
  MapPin,
  Package,
  Truck,
  User,
  Calendar,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import Header from '../../../../components/Header';
import OrderTracking from '../../../../components/OrderTracking';
import { useAuth } from '../../../../src/context/AuthContext';

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    _id: string;
    product: {
      _id: string;
      name: string;
      category: string;
    };
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    name: string;
    phone: string;
    email?: string;
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
  cancelledAt?: string;
}

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out-for-delivery',
  'delivered',
  'cancelled'
];

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit states
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingTracking, setEditingTracking] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newTrackingNumber, setNewTrackingNumber] = useState('');
  const [newEstimatedDelivery, setNewEstimatedDelivery] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, isAuthenticated, user, router]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setOrder(data.order);
      setNewStatus(data.order.orderStatus);
      setNewTrackingNumber(data.order.trackingNumber || '');
      setNewEstimatedDelivery(data.order.estimatedDelivery ? 
        new Date(data.order.estimatedDelivery).toISOString().split('T')[0] : '');
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      setError(error.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async () => {
    try {
      setUpdating(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      await fetchOrderDetails();
      setEditingStatus(false);
    } catch (error: any) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const updateTrackingInfo = async () => {
    try {
      setUpdating(true);

      const updateData: any = {};
      if (newTrackingNumber !== (order?.trackingNumber || '')) {
        updateData.trackingNumber = newTrackingNumber;
      }
      if (newEstimatedDelivery !== (order?.estimatedDelivery ? 
        new Date(order.estimatedDelivery).toISOString().split('T')[0] : '')) {
        updateData.estimatedDelivery = newEstimatedDelivery;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update tracking information');
      }

      await fetchOrderDetails();
      setEditingTracking(false);
      setEditingDelivery(false);
    } catch (error: any) {
      console.error('Error updating tracking info:', error);
      alert('Failed to update tracking information');
    } finally {
      setUpdating(false);
    }
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Order</h2>
            <p className="text-gray-600 mb-6">{error || 'Order not found'}</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={fetchOrderDetails}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Try Again
              </button>
              <Link 
                href="/admin/orders"
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/orders"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-sm text-gray-600">
                Placed by {order.user.name} on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchOrderDetails}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={20} className={`text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Management</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Status
                  </label>
                  {editingStatus ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {ORDER_STATUSES.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={updateOrderStatus}
                        disabled={updating}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {updating ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingStatus(false);
                          setNewStatus(order.orderStatus);
                        }}
                        className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </span>
                      <button
                        onClick={() => setEditingStatus(true)}
                        className="p-1 text-gray-600 hover:text-primary transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus === 'completed' ? 'Paid' : order.paymentStatus}
                  </span>
                </div>

                {/* Tracking Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number
                  </label>
                  {editingTracking ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newTrackingNumber}
                        onChange={(e) => setNewTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <button
                        onClick={updateTrackingInfo}
                        disabled={updating}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {updating ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingTracking(false);
                          setNewTrackingNumber(order.trackingNumber || '');
                        }}
                        className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">
                        {order.trackingNumber || 'Not assigned'}
                      </span>
                      <button
                        onClick={() => setEditingTracking(true)}
                        className="p-1 text-gray-600 hover:text-primary transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Estimated Delivery */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Delivery
                  </label>
                  {editingDelivery ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={newEstimatedDelivery}
                        onChange={(e) => setNewEstimatedDelivery(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <button
                        onClick={updateTrackingInfo}
                        disabled={updating}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {updating ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingDelivery(false);
                          setNewEstimatedDelivery(order.estimatedDelivery ? 
                            new Date(order.estimatedDelivery).toISOString().split('T')[0] : '');
                        }}
                        className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">
                        {order.estimatedDelivery ? 
                          new Date(order.estimatedDelivery).toLocaleDateString('en-IN') : 
                          'Not set'}
                      </span>
                      <button
                        onClick={() => setEditingDelivery(true)}
                        className="p-1 text-gray-600 hover:text-primary transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
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

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items ({order.items.length})
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package size={24} className="text-gray-400" />
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
              
              <div className="border-t mt-6 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-primary">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User size={16} className="text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{order.user.name}</p>
                    <p className="text-sm text-gray-600">{order.user.email}</p>
                  </div>
                </div>
              </div>
            </div>

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

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Order Placed</p>
                    <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                
                {order.updatedAt !== order.createdAt && (
                  <div className="flex items-center gap-3">
                    <RefreshCw size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="font-medium text-gray-900">{formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                )}
                
                {order.cancelledAt && (
                  <div className="flex items-center gap-3">
                    <X size={16} className="text-red-400" />
                    <div>
                      <p className="text-sm text-gray-600">Cancelled</p>
                      <p className="font-medium text-gray-900">{formatDate(order.cancelledAt)}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}