'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  Edit2,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Download,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone
} from 'lucide-react';
import { adminAPI } from '../../services/api';

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
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
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Bulk selection state
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, paymentFilter, dateRange, sortBy, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(paymentFilter !== 'all' && { paymentStatus: paymentFilter }),
        ...(dateRange !== 'all' && { dateRange }),
        ...(searchTerm && { search: searchTerm }),
        sort: sortBy
      };

      const response = await adminAPI.getAllOrders(params);
      setOrders(Array.isArray(response.orders) ? response.orders : []);
      setTotalPages(response.pages || Math.ceil((response.total || 0) / 10));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      await adminAPI.updateOrderStatus(orderId, newStatus);

      // Update local state immediately
      setOrders(prev => prev.map(order =>
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      ));

      // Also update selectedOrder if it's currently open
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
      }

      // No need to re-fetch entire list if we updated local state
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update status');
      // Revert/Fetch on error
      fetchOrders();
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleBulkStatusUpdate = async (type: 'order' | 'payment', value: string) => {
    if (selectedOrderIds.length === 0) return;

    try {
      setIsBulkLoading(true);
      const data = {
        orderIds: selectedOrderIds,
        ...(type === 'order' ? { status: value } : { paymentStatus: value })
      };

      await adminAPI.bulkUpdateOrders(data);
      alert(`Successfully updated ${selectedOrderIds.length} orders`);
      setSelectedOrderIds([]);
      fetchOrders();
    } catch (error) {
      console.error('Bulk update error:', error);
      alert('Failed to perform bulk update');
    } finally {
      setIsBulkLoading(false);
    }
  };

  const exportSelectionToCSV = () => {
    const ordersToExport = selectedOrderIds.length > 0
      ? orders.filter(o => selectedOrderIds.includes(o._id))
      : orders;

    if (ordersToExport.length === 0) {
      alert('No orders to export');
      return;
    }

    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Email',
      'Phone',
      'Street Address',
      'City',
      'State',
      'Pincode',
      'Country',
      'Items Ordered (Product Name x Qty)',
      'Total Amount',
      'Payment Method',
      'Payment Status',
      'Order Status'
    ];

    const csvContent = [
      headers.join(','),
      ...ordersToExport.map(o => [
        o._id || 'N/A',
        o.createdAt ? new Date(o.createdAt).toLocaleString() : 'N/A',
        `"${o.shippingAddress?.name || o.user?.name || 'N/A'}"`,
        `"${o.user?.email || 'N/A'}"`,
        `"${o.shippingAddress?.phone || o.user?.phone || 'N/A'}"`,
        `"${o.shippingAddress?.street || 'N/A'}"`,
        `"${o.shippingAddress?.city || 'N/A'}"`,
        `"${o.shippingAddress?.state || 'N/A'}"`,
        `"${o.shippingAddress?.postalCode || 'N/A'}"`,
        `"${o.shippingAddress?.country || 'N/A'}"`,
        `"${(o.items || []).map(i => `${i.product?.name || 'Unknown Product'} (x${i.quantity || 0})`).join(' | ')}"`,
        o.totalAmount || 0,
        `"${(o.paymentMethod || 'N/A').toUpperCase()}"`,
        `"${(o.paymentStatus || 'N/A').toUpperCase()}"`,
        `"${(o.orderStatus || 'N/A').toUpperCase()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === orders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(orders.map(o => o._id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter(i => i !== id));
    } else {
      setSelectedOrderIds([...selectedOrderIds, id]);
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
      year: 'numeric'
    });
  };

  const getOrderStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
          <p className="text-sm text-gray-500">Manage, track and update customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportSelectionToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedOrderIds.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-primary">{selectedOrderIds.length} orders selected</span>
            <button
              onClick={() => setSelectedOrderIds([])}
              className="text-xs text-gray-500 hover:text-primary underline"
            >
              Clear selection
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Update Status:</span>
              <select
                onChange={(e) => handleBulkStatusUpdate('order', e.target.value)}
                disabled={isBulkLoading}
                className="text-xs px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
              >
                <option value="">Order status...</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Update Payment:</span>
              <select
                onChange={(e) => handleBulkStatusUpdate('payment', e.target.value)}
                disabled={isBulkLoading}
                className="text-xs px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
              >
                <option value="">Payment status...</option>
                <option value="completed">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Filters Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative col-span-1 lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID, Name, Phone or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Payments</option>
            <option value="completed">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Anytime</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.length > 0 && selectedOrderIds.length === orders.length}
                    onChange={toggleSelectAll}
                    className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Order & Date</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 uppercase tracking-tighter">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500 italic">
                    No orders found matching the criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className={`hover:bg-gray-50/80 transition-colors ${selectedOrderIds.includes(order._id) ? 'bg-primary/5' : ''}`}>
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedOrderIds.includes(order._id)}
                        onChange={() => toggleSelectOrder(order._id)}
                        className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-bold text-gray-900 mb-0.5">#{order._id.slice(-8).toUpperCase()}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <User size={12} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-900">{order.shippingAddress?.name || order.user?.name || 'Guest User'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1"><Phone size={10} /> {order.shippingAddress?.phone || order.user?.phone || 'N/A'}</span>
                        <span className="flex items-center gap-1"><Mail size={10} /> {order.user?.email || 'No Email'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getOrderStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-black text-gray-900">{formatCurrency(order.totalAmount)}</div>
                      <div className="text-[10px] text-gray-400">{order.items?.length || 0} items</div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-white rounded-full"
                        title="View Full Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal Overhaul */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-mono">#{selectedOrder._id.slice(-8).toUpperCase()}</span>
                  <span>•</span>
                  <span>{formatDate(selectedOrder.createdAt)}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Order Info & Items */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Status Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Status</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getOrderStatusColor(selectedOrder.orderStatus)}`}>
                        {selectedOrder.orderStatus}
                      </span>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Payment</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                      <h4 className="text-sm font-semibold text-gray-900">Items ({selectedOrder.items?.length || 0})</h4>
                      <span className="text-sm font-bold text-gray-900">Total: {formatCurrency(selectedOrder.totalAmount)}</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {selectedOrder.items?.map((item, idx) => (
                        <div key={idx} className="p-4 flex gap-4">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center">
                            {item.product?.images && item.product.images[0] ? (
                              <img src={item.product.images[0].url} alt="" className="h-full w-full object-cover object-center" />
                            ) : (
                              <Package className="h-8 w-8 text-gray-300" />
                            )}
                          </div>
                          <div className="flex flex-1 flex-col justify-center">
                            <h5 className="text-sm font-medium text-gray-900 line-clamp-1">{item.product?.name || 'Unknown Product'}</h5>
                            <div className="mt-1 flex items-center justify-between text-sm">
                              <span className="text-gray-500">{item.quantity} x {formatCurrency(item.price)}</span>
                              <span className="font-medium text-gray-900">{formatCurrency(item.quantity * item.price)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer & Shipping */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <User size={16} /> Customer Details
                      </h4>
                      <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 text-sm space-y-2">
                        <p className="font-medium text-gray-900">{selectedOrder.user?.name || 'Guest'}</p>
                        <p className="text-gray-600 flex items-center gap-2">
                          <Mail size={14} /> {selectedOrder.user?.email || 'N/A'}
                        </p>
                        <p className="text-gray-600 flex items-center gap-2">
                          <Phone size={14} /> {selectedOrder.user?.phone || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Truck size={16} /> Shipping Address
                      </h4>
                      <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 text-sm">
                        <p className="font-medium text-gray-900 mb-1">{selectedOrder.shippingAddress?.name}</p>
                        <p className="text-gray-600 leading-relaxed">
                          {selectedOrder.shippingAddress?.street}<br />
                          {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}<br />
                          {selectedOrder.shippingAddress?.postalCode}<br />
                          {selectedOrder.shippingAddress?.country}
                        </p>
                        <p className="text-gray-600 mt-2 flex items-center gap-2">
                          <Phone size={14} /> {selectedOrder.shippingAddress?.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="p-5 rounded-xl border border-gray-200 shadow-sm bg-white space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Manage Order</h4>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-500 uppercase">Order Status</label>
                      <select
                        value={selectedOrder.orderStatus}
                        onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                        disabled={updatingStatus === selectedOrder._id}
                        className="block w-full rounded-lg border-gray-300 bg-gray-50 py-2.5 px-3 text-sm focus:border-primary focus:ring-primary disabled:opacity-50 transition-all font-medium"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="out-for-delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-500 uppercase">Payment Status</label>
                      <select
                        value={selectedOrder.paymentStatus}
                        onChange={(e) => {
                          handleBulkStatusUpdate('payment', e.target.value);
                          setSelectedOrder({ ...selectedOrder, paymentStatus: e.target.value });
                        }}
                        className="block w-full rounded-lg border-gray-300 bg-gray-50 py-2.5 px-3 text-sm focus:border-primary focus:ring-primary disabled:opacity-50 transition-all font-medium"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Paid / Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>

                    {updatingStatus === selectedOrder._id && (
                      <div className="flex items-center justify-center gap-2 text-xs font-medium text-primary animate-pulse pt-2">
                        <Clock size={14} /> Updating status...
                      </div>
                    )}
                  </div>

                  {/* Internal Notes */}
                  <div className="p-5 rounded-xl border border-yellow-200 bg-yellow-50 space-y-3">
                    <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wide flex items-center gap-2">
                      <Edit2 size={12} /> Internal Notes
                    </h4>
                    <textarea
                      placeholder="Add notes for your team (e.g. 'Customer called about delivery time')..."
                      className="w-full h-32 rounded-lg border-yellow-200 bg-white p-3 text-sm placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400 resize-none"
                    />
                    <button className="w-full rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-yellow-900 hover:bg-yellow-500 transition-colors">
                      Save Note
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
