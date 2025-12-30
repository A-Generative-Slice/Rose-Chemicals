'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  ShoppingCart,
  Users,
  Star,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../src/contexts/AuthContext';
import { adminAPI } from '../../src/services/api';
import ProductsManagement from '../../src/components/admin/ProductsManagement';
import OrdersManagement from '../../src/components/admin/OrdersManagement';
import UsersManagement from '../../src/components/admin/UsersManagement';
import ReviewsManagement from '../../src/components/admin/ReviewsManagement';
import AnalyticsDashboard from '../../src/components/admin/AnalyticsDashboard';
import SettingsManagement from '../../src/components/admin/SettingsManagement';
import WhatsAppManagement from '../../src/components/admin/WhatsAppManagement';
import { MessageSquare } from 'lucide-react';

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
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('products');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

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
    // If auth is still checking, do nothing.
    if (authLoading) return;

    // If check finished and not authenticated, redirect.
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    // If authenticated but not admin, redirect.
    if (user && user.role !== 'admin') {
      router.push('/');
      return;
    }

    // If authenticated and is admin, fetch data.
    if (isAuthenticated && user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [isAuthenticated, user, router, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setDataLoading(true);

      const analyticsResponse = await adminAPI.getAnalytics().catch(err => ({ success: false, error: err }));

      const [recentOrdersResponse, recentUsersResponse] = await Promise.all([
        (adminAPI.getRecentOrders ? adminAPI.getRecentOrders({ limit: 5 }) : adminAPI.getOrders({ limit: 5, sort: '-createdAt' })).catch(() => ({ success: false, data: { orders: [] } })),
        (adminAPI.getRecentUsers ? adminAPI.getRecentUsers({ limit: 5 }) : adminAPI.getUsers({ limit: 5, sort: '-createdAt' })).catch(() => ({ success: false, data: { users: [] } }))
      ]);

      if (analyticsResponse?.success) {
        setStats({
          totalUsers: analyticsResponse.data?.totalUsers || 0,
          totalProducts: analyticsResponse.data?.totalProducts || 0,
          totalOrders: analyticsResponse.data?.totalOrders || 0,
          totalRevenue: analyticsResponse.data?.totalRevenue || 0,
          pendingOrders: analyticsResponse.data?.pendingOrders || 0,
          lowStockProducts: analyticsResponse.data?.lowStockProducts || 0,
          totalReviews: analyticsResponse.data?.totalReviews || 0,
          averageRating: analyticsResponse.data?.averageRating || 0
        });
      }

      const orders = recentOrdersResponse?.data?.orders || recentOrdersResponse?.orders || [];
      setRecentOrders(Array.isArray(orders) ? orders : []);

      const users = recentUsersResponse?.data?.users || recentUsersResponse?.users || [];
      setRecentUsers(Array.isArray(users) ? users : []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDataLoading(false);
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
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'whatsapp', label: 'WhatsApp Chats', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'products': return <ProductsManagement />;
      case 'orders': return <OrdersManagement />;
      case 'users': return <UsersManagement />;
      case 'reviews': return <ReviewsManagement />;
      case 'analytics': return <AnalyticsDashboard />;
      case 'settings': return <SettingsManagement />;
      case 'whatsapp': return <WhatsAppManagement />;
      default: return <ProductsManagement />;
    }
  };

  if (authLoading || (isAuthenticated && dataLoading)) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center space-y-6">
        <div className="text-white font-black tracking-[0.2em] uppercase text-xs animate-pulse">
          {authLoading ? 'Authenticating...' : 'Loading Dashboard...'}
        </div>

        {/* Failsafe Logout Button */}
        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="text-gray-500 hover:text-white text-xs underline transition-colors"
        >
          Stuck? Click to Logout
        </button>
      </div>
    );
  }

  // If we are here, we are authenticated, admin, and data is loaded (or loading failed but allowed through)
  // or we are about to redirect (user is null).
  // Ideally, if (!user) check is handled by useEffect redirect, but for render safety:
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0
          ${desktopSidebarOpen ? 'lg:w-64' : 'lg:w-20'}
        `}
      >
        <div className="flex items-center justify-between p-6 border-b h-[73px]">
          <h1 className={`text-xl font-bold text-gray-900 overflow-hidden whitespace-nowrap transition-all duration-300 ${!desktopSidebarOpen && 'lg:hidden'}`}>
            Admin Panel
          </h1>
          <div className={`hidden lg:flex items-center justify-center w-full ${desktopSidebarOpen ? 'hidden' : 'flex'}`}>
            <span className="font-bold text-blue-600 text-xl">RC</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
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
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors relative group
                  ${activeTab === item.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}
                  ${!desktopSidebarOpen ? 'justify-center px-2' : ''}
                `}
                title={!desktopSidebarOpen ? item.label : ''}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${!desktopSidebarOpen ? 'lg:hidden' : 'opacity-100'}`}>
                  {item.label}
                </span>

                {/* Tooltip for collapsed state */}
                {!desktopSidebarOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 hidden lg:block">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors
              ${!desktopSidebarOpen ? 'justify-center px-2' : ''}
            `}
            title={!desktopSidebarOpen ? "Logout" : ""}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${!desktopSidebarOpen ? 'lg:hidden' : 'opacity-100'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 py-4 lg:px-6 h-[73px]">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4">
              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={24} />
              </button>

              {/* Desktop Collapse Toggle */}
              <button
                onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
                className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
              >
                <Menu size={20} />
              </button>

              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 capitalize truncate">
                {activeTab === 'overview' ? 'Dashboard' : activeTab}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
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
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
}
