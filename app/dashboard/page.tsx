'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Edit2,
  Plus,
  Trash2,
  Eye,
  Star,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import Header from '../../components/Header';
import { useAuth } from '../../src/contexts/AuthContext';
import { ordersAPI, wishlistAPI, reviewsAPI } from '../../src/services/api';
import OrdersSection from '../../src/components/dashboard/OrdersSection';
import AddressBookSection from '../../src/components/dashboard/AddressBookSection';
import ProfileSettingsSection from '../../src/components/dashboard/ProfileSettingsSection';
import WishlistSection from '../../src/components/dashboard/WishlistSection';
import ReviewsSection from '../../src/components/dashboard/ReviewsSection';

interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  totalReviews: number;
  wishlistItems: number;
}

interface RecentOrder {
  _id: string;
  items: Array<{
    product: {
      name: string;
      images?: Array<{ url: string }>;
    };
    quantity: number;
  }>;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

export default function UserDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    totalReviews: 0,
    wishlistItems: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);

  // Profile editing state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      fetchDashboardData();
    }
  }, [isAuthenticated, user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch orders
      const ordersResponse = await ordersAPI.getMyOrders();
      const orders = ordersResponse.orders || [];

      // Fetch wishlist
      const wishlistResponse = await wishlistAPI.getWishlist();
      const wishlist = wishlistResponse.wishlist || { items: [] };

      // Fetch user reviews
      const reviewsResponse = await reviewsAPI.getUserReviews({ limit: '5' });
      const reviews = reviewsResponse.reviews || [];

      // Calculate stats
      const totalSpent = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
      const completedOrders = orders.filter((order: any) => order.orderStatus === 'delivered');

      setStats({
        totalOrders: orders.length,
        totalSpent,
        totalReviews: reviews.length,
        wishlistItems: wishlist.items.length
      });

      setRecentOrders(orders.slice(0, 3));
      setWishlistItems(wishlist.items.slice(0, 4));
      setUserReviews(reviews);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
      case 'out-for-delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
      />
    ));
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'addresses', label: 'Address Book', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'reviews', label: 'My Reviews', icon: Star },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="bg-gray-200 rounded-lg h-96"></div>
              <div className="lg:col-span-3 bg-gray-200 rounded-lg h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
        <p className="opacity-90">Here&apos;s what&apos;s happening with your account</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
            </div>
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reviews Written</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Wishlist Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.wishlistItems}</p>
            </div>
            <Heart className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <Link
            href="#"
            onClick={() => setActiveTab('orders')}
            className="text-primary hover:text-primary-dark text-sm font-medium"
          >
            View All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No orders yet</p>
            <Link href="/products" className="text-primary hover:text-primary-dark text-sm">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.items.length} items • {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.orderStatus)}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </span>
                  <Link href={`/orders/${order._id}`}>
                    <Eye size={16} className="text-gray-600 hover:text-primary" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wishlist Preview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Wishlist</h3>
            <Link
              href="#"
              onClick={() => setActiveTab('wishlist')}
              className="text-primary hover:text-primary-dark text-sm font-medium"
            >
              View All
            </Link>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-6">
              <Heart className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p className="text-gray-600 text-sm">No items in wishlist</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {wishlistItems.map((item) => (
                <div key={item._id} className="border border-gray-200 rounded-lg p-3">
                  <div className="w-full h-20 bg-gray-100 rounded-lg mb-2"></div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.product?.name}
                  </p>
                  <p className="text-sm text-primary font-semibold">
                    {formatCurrency(item.product?.price || 0)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
            <Link
              href="#"
              onClick={() => setActiveTab('reviews')}
              className="text-primary hover:text-primary-dark text-sm font-medium"
            >
              View All
            </Link>
          </div>

          {userReviews.length === 0 ? (
            <div className="text-center py-6">
              <Star className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p className="text-gray-600 text-sm">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userReviews.slice(0, 2).map((review) => (
                <div key={review._id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {review.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {review.product?.name} • {formatDate(review.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'orders':
        return <OrdersSection onBack={() => setActiveTab('overview')} />;
      case 'addresses':
        return <AddressBookSection onBack={() => setActiveTab('overview')} />;
      case 'wishlist':
        return <WishlistSection onBack={() => setActiveTab('overview')} />;
      case 'reviews':
        return <ReviewsSection onBack={() => setActiveTab('overview')} />;
      case 'profile':
        return <ProfileSettingsSection onBack={() => setActiveTab('overview')} />;
      case 'security':
        return <div className="text-center py-8">Security settings will be implemented</div>;
      case 'notifications':
        return <div className="text-center py-8">Notification settings will be implemented</div>;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${activeTab === item.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <ChevronRight size={14} />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}

            <div className="mt-12 border-t pt-8 text-center bg-white rounded-lg p-6 shadow-sm border-gray-100">
              <p className="text-sm text-gray-500 mb-2">© {new Date().getFullYear()} Rose Chemicals. All rights reserved.</p>
              <p className="text-xs">
                <a
                  href="https://a-generative-slice.github.io/A-generative-slice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary transition-colors uppercase tracking-widest font-medium"
                >
                  BUILT WITH VIBE OF <span className="font-extrabold text-primary">A GENERATIVE SLICE</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
