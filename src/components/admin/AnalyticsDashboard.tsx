'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { adminAPI } from '../../services/api';

interface SalesData {
  date: string;
  sales: number;
  orders: number;
  revenue: number;
}

interface ProductPerformance {
  _id: string;
  name: string;
  salesCount: number;
  revenue: number;
  viewCount: number;
  averageRating: number;
  stock: number;
  category: string;
}

interface UserAnalytics {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  userGrowth: number;
  topLocations: Array<{
    location: string;
    users: number;
  }>;
}

interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  avgOrderValue: number;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [salesResponse, productResponse, userResponse, revenueResponse] = await Promise.all([
        adminAPI.getSalesAnalytics({ days: dateRange }),
        adminAPI.getProductAnalytics(),
        adminAPI.getUserAnalytics(),
        adminAPI.getRevenueAnalytics({ days: dateRange })
      ]);

      setSalesData(salesResponse.data || []);
      setProductPerformance(productResponse.products || []);
      setUserAnalytics(userResponse.analytics || null);
      setRevenueAnalytics(revenueResponse.analytics || null);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return <ArrowUp className="text-green-500" size={16} />;
    } else if (growth < 0) {
      return <ArrowDown className="text-red-500" size={16} />;
    }
    return null;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const renderSalesChart = () => {
    if (!salesData.length) return null;

    const maxRevenue = Math.max(...salesData.map(d => d.revenue));
    const maxOrders = Math.max(...salesData.map(d => d.orders));

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span>Revenue</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span>Orders</span>
            </div>
          </div>
        </div>

        <div className="relative h-64">
          {salesData.map((data, index) => {
            const revenueHeight = (data.revenue / maxRevenue) * 200;
            const ordersHeight = (data.orders / maxOrders) * 200;
            
            return (
              <div 
                key={index} 
                className="absolute bottom-0 flex items-end gap-1"
                style={{ left: `${(index / (salesData.length - 1)) * 90}%` }}
              >
                <div 
                  className="bg-blue-600 rounded-t w-6 min-h-[4px]"
                  style={{ height: `${revenueHeight}px` }}
                  title={`Revenue: ${formatCurrency(data.revenue)}`}
                />
                <div 
                  className="bg-green-600 rounded-t w-6 min-h-[4px]"
                  style={{ height: `${ordersHeight}px` }}
                  title={`Orders: ${data.orders}`}
                />
                <div className="absolute -bottom-6 left-0 text-xs text-gray-500 w-12 text-center">
                  {new Date(data.date).toLocaleDateString('en-IN', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderRevenueBreakdown = () => {
    if (!revenueAnalytics?.revenueByCategory.length) return null;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Category</h3>
        <div className="space-y-4">
          {revenueAnalytics.revenueByCategory.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ 
                    backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)` 
                  }}
                />
                <span className="text-sm font-medium text-gray-900">
                  {item.category}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {formatCurrency(item.revenue)}
                </div>
                <div className="text-xs text-gray-500">
                  {item.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueAnalytics && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(revenueAnalytics.totalRevenue)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(revenueAnalytics.revenueGrowth)}
                  <span className={`text-sm ${getGrowthColor(revenueAnalytics.revenueGrowth)}`}>
                    {Math.abs(revenueAnalytics.revenueGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
        )}

        {revenueAnalytics && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(revenueAnalytics.avgOrderValue)}
                </p>
                <p className="text-sm text-gray-500 mt-1">Per transaction</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        )}

        {userAnalytics && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(userAnalytics.totalUsers)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(userAnalytics.userGrowth)}
                  <span className={`text-sm ${getGrowthColor(userAnalytics.userGrowth)}`}>
                    {Math.abs(userAnalytics.userGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        )}

        {userAnalytics && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(userAnalytics.newUsers)}
                </p>
                <p className="text-sm text-gray-500 mt-1">This period</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        {renderSalesChart()}

        {/* Revenue Breakdown */}
        {renderRevenueBreakdown()}
      </div>

      {/* Product Performance */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productPerformance.slice(0, 10).map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={16} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatNumber(product.salesCount)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(product.revenue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {formatNumber(product.viewCount)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-900">
                        {product.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stock > 10 
                        ? 'bg-green-100 text-green-800' 
                        : product.stock > 0 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Analytics */}
      {userAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">User Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="text-blue-600" size={20} />
                  <span className="font-medium text-gray-900">Total Users</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {formatNumber(userAnalytics.totalUsers)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-green-600" size={20} />
                  <span className="font-medium text-gray-900">New Users</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {formatNumber(userAnalytics.newUsers)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <BarChart3 className="text-purple-600" size={20} />
                  <span className="font-medium text-gray-900">Active Users</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {formatNumber(userAnalytics.activeUsers)}
                </span>
              </div>
            </div>
          </div>

          {/* Top Locations */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Locations</h3>
            <div className="space-y-3">
              {userAnalytics.topLocations.map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {location.location}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatNumber(location.users)} users
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}