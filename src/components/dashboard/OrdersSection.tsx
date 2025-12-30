'use client';

import { useState, useEffect } from 'react';
import { Package, Eye, Download, RefreshCw, Filter, Calendar, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ordersAPI } from '../../services/api';

interface Order {
  _id: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      images?: Array<{ url: string }>;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

interface OrdersProps {
  onBack: () => void;
}

export default function OrdersSection({ onBack }: OrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, filter, dateRange]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage.toString(),
        limit: '10',
        ...(filter !== 'all' && { status: filter }),
        ...(dateRange !== 'all' && { dateRange })
      };

      const response = await ordersAPI.getMyOrders(params);
      setOrders(response.orders || []);
      setTotalPages(Math.ceil((response.total || 0) / 10));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStatusColor = (status: string) => {
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

  const filteredOrders = orders.filter(order => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order._id.toLowerCase().includes(searchLower) ||
        order.items.some(item =>
          item.product.name.toLowerCase().includes(searchLower)
        )
      );
    }
    return true;
  });

  const orderStatusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: 'year', label: 'This Year' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {orderStatusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Refresh */}
          <button
            onClick={fetchOrders}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filter !== 'all' || dateRange !== 'all'
              ? 'Try adjusting your filters or search terms'
              : "You haven't placed any orders yet"
            }
          </p>
          {!searchTerm && filter === 'all' && dateRange === 'all' && (
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Start Shopping
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            // Calculate progress based on 4 days (345,600,000 ms)
            const orderDate = new Date(order.createdAt).getTime();
            const now = Date.now();
            const fourDaysMs = 4 * 24 * 60 * 60 * 1000;
            const elapsed = Math.min(now - orderDate, fourDaysMs);
            const progressPercent = Math.max(0, Math.floor((elapsed / fourDaysMs) * 100));

            return (
              <div key={order._id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getOrderStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Simplified Tracking Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                    <span>Order Placed</span>
                    <span>{progressPercent === 100 ? 'Delivered' : 'Delivery in Progress'}</span>
                  </div>
                  <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${progressPercent === 100 ? 'bg-green-500' : 'bg-primary'
                        }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 italic">
                    * Estimated delivery: 4 days from order placement.
                  </p>
                </div>

                {/* OTP Verification for "Out for Delivery" or "Shipped" */}
                {(order.orderStatus === 'out-for-delivery' || order.orderStatus === 'shipped') && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                      Verify Delivery
                    </h4>
                    <p className="text-xs text-gray-600 mb-4">
                      Share the OTP sent to your email with the delivery person, or enter it here to confirm delivery.
                    </p>
                    <div className="flex gap-2">
                      <input
                        id={`otp-${order._id}`}
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        maxLength={6}
                      />
                      <button
                        onClick={async () => {
                          const otpInput = document.getElementById(`otp-${order._id}`) as HTMLInputElement;
                          if (!otpInput.value) return;
                          try {
                            await ordersAPI.verifyDeliveryOTP(order._id, otpInput.value);
                            alert('Order marked as delivered! Thank you for shopping with us.');
                            fetchOrders();
                          } catch (err: any) {
                            alert(err.message || 'Invalid OTP');
                          }
                        }}
                        className="bg-primary text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-primary-dark transition-colors"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                )}

                {/* Prompt for review if delivered */}
                {order.orderStatus === 'delivered' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-green-800 font-medium mb-2">We hope you loved your purchase!</p>
                    <Link
                      href={`/products/${order.items[0]?.product?._id}`}
                      className="text-primary hover:underline font-bold text-sm"
                    >
                      Write a review for {order.items[0]?.product?.name} →
                    </Link>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} title={item.product?.name} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                        <Package size={14} className="text-gray-400" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/orders/${order._id}`}
                    className="text-sm font-bold text-gray-600 hover:text-primary transition-colors flex items-center gap-1"
                  >
                    Details <Eye size={14} />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (page > totalPages) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 border rounded-lg ${currentPage === page
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}