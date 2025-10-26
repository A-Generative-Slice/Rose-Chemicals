'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Star,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../src/contexts/AuthContext';
import { adminAPI } from '../../src/services/api';
import ProductsManagement from '../../src/components/admin/ProductsManagement';
import OrdersManagement from '../../src/components/admin/OrdersManagement';
import UsersManagement from '../../src/components/admin/UsersManagement';
import ReviewsManagement from '../../src/components/admin/ReviewsManagement';
import AnalyticsDashboard from '../../src/components/admin/AnalyticsDashboard';
import SettingsManagement from '../../src/components/admin/SettingsManagement';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  totalReviews: number;
  averageRating: number;
}

interface RecentOrder {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  items: Array<{
    product: { name: string };
    quantity: number;
  }>;
}

interface RecentUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  isActive: boolean;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    totalReviews: 0,
    averageRating: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    // Check if user is admin
    if (user && user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard analytics from our enhanced admin API
      const [analyticsResponse, recentOrdersResponse, recentUsersResponse] = await Promise.all([
        adminAPI.getAnalytics(),
        // Use dedicated recent endpoints (they wrap data under data.orders/users)
        adminAPI.getRecentOrders ? adminAPI.getRecentOrders({ limit: 5 }) : adminAPI.getOrders({ limit: 5, sort: '-createdAt' }),
        adminAPI.getRecentUsers ? adminAPI.getRecentUsers({ limit: 5 }) : adminAPI.getUsers({ limit: 5, sort: '-createdAt' })
      ]);

      if (analyticsResponse.success) {
        setStats({
          totalUsers: analyticsResponse.data.totalUsers || 0,
          totalProducts: analyticsResponse.data.totalProducts || 0,
          totalOrders: analyticsResponse.data.totalOrders || 0,
          totalRevenue: analyticsResponse.data.totalRevenue || 0,
          pendingOrders: analyticsResponse.data.pendingOrders || 0,
          lowStockProducts: analyticsResponse.data.lowStockProducts || 0,
          totalReviews: analyticsResponse.data.totalReviews || 0,
          averageRating: analyticsResponse.data.averageRating || 0
        });
      }

      if (recentOrdersResponse?.success) {
        const orders = (recentOrdersResponse.data?.orders) || recentOrdersResponse.orders || [];
        setRecentOrders(Array.isArray(orders) ? orders : []);
      }

      if (recentUsersResponse?.success) {
        const users = (recentUsersResponse.data?.users) || recentUsersResponse.users || [];
        setRecentUsers(Array.isArray(users) ? users : []);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to default values on error
      setStats({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
        totalReviews: 0,
        averageRating: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
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

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
        <p className="opacity-90">Here's what's happening with your store today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp size={14} />
                +12% from last month
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              <p className="text-sm text-blue-600">
                {stats.pendingOrders} pending
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              <p className="text-sm text-orange-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {stats.lowStockProducts} low stock
              </p>
            </div>
            <Package className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-sm text-green-600">
                Active customers
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reviews Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Reviews Overview</h3>
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Reviews</span>
              <span className="font-semibold">{stats.totalReviews}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Rating</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{stats.averageRating.toFixed(1)}</span>
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(stats.averageRating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Server Status</span>
              <span className="text-green-600 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Payment Gateway</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'products':
        return <ProductsManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'users':
        return <UsersManagement />;
      case 'reviews':
        return <ReviewsManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {activeTab === 'overview' ? 'Dashboard' : activeTab}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-600">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
