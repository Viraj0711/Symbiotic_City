import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, TrendingUp, DollarSign, Users, Package, BarChart3, Settings, Eye, MessageCircle, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProductAnalytics {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'inactive' | 'sold_out';
  pricing: {
    amount: number;
    unit: string;
  };
  analytics: {
    views: number;
    inquiries: number;
    sales: number;
    revenue: number;
  };
  performance: {
    viewsGrowth: number;
    salesGrowth: number;
    revenueGrowth: number;
  };
  lastUpdated: string;
}

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalRevenue: number;
  totalViews: number;
  totalInquiries: number;
  totalSales: number;
  averageRating: number;
  conversionRate: number;
}

const SiteOwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<ProductAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    if (user?.role !== 'USER') { // Temporarily using USER role until backend is updated
      return;
    }
    loadDashboardData();
  }, [user, selectedTimeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data for demo - replace with actual API calls
      const mockStats: DashboardStats = {
        totalProducts: 12,
        activeProducts: 8,
        totalRevenue: 145280,
        totalViews: 15420,
        totalInquiries: 892,
        totalSales: 234,
        averageRating: 4.7,
        conversionRate: 26.2
      };

      const mockProducts: ProductAnalytics[] = [
        {
          id: '1',
          title: 'Premium Green Hydrogen - 99.9% Purity',
          category: 'hydrogen',
          status: 'active',
          pricing: { amount: 8.50, unit: 'kg' },
          analytics: {
            views: 1243,
            inquiries: 89,
            sales: 23,
            revenue: 12580
          },
          performance: {
            viewsGrowth: 15.2,
            salesGrowth: 8.7,
            revenueGrowth: 22.1
          },
          lastUpdated: '2025-09-06'
        },
        {
          id: '2',
          title: 'Solar Energy Storage System',
          category: 'battery_storage',
          status: 'active',
          pricing: { amount: 120.00, unit: 'kWh' },
          analytics: {
            views: 876,
            inquiries: 45,
            sales: 12,
            revenue: 8640
          },
          performance: {
            viewsGrowth: -5.3,
            salesGrowth: 12.4,
            revenueGrowth: 18.9
          },
          lastUpdated: '2025-09-05'
        },
        {
          id: '3',
          title: 'Wind Energy Certificates',
          category: 'green_certificate',
          status: 'active',
          pricing: { amount: 25.00, unit: 'MWh' },
          analytics: {
            views: 2156,
            inquiries: 134,
            sales: 67,
            revenue: 15420
          },
          performance: {
            viewsGrowth: 28.6,
            salesGrowth: 35.2,
            revenueGrowth: 41.8
          },
          lastUpdated: '2025-09-07'
        }
      ];

      setStats(mockStats);
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  if (!user || user.role !== 'USER') { // Temporarily using USER role
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400">This dashboard is only available for site owners.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-white mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Site Owner Dashboard
              </h1>
              <p className="text-emerald-100">
                Manage your green energy products and track performance
              </p>
            </div>
            <button
              onClick={() => setShowAddProduct(true)}
              className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Range Selector */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Analytics Overview</h2>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <DollarSign className="h-10 w-10 text-emerald-500" />
              </div>
              <div className="mt-2 text-sm text-emerald-400">
                +12.5% from last period
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Products</p>
                  <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
                  <p className="text-sm text-gray-400">{stats.activeProducts} active</p>
                </div>
                <Package className="h-10 w-10 text-blue-500" />
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Views</p>
                  <p className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
                </div>
                <Eye className="h-10 w-10 text-purple-500" />
              </div>
              <div className="mt-2 text-sm text-emerald-400">
                +8.2% from last period
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Conversion Rate</p>
                  <p className="text-2xl font-bold text-white">{stats.conversionRate}%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-yellow-500" />
              </div>
              <div className="mt-2 text-sm text-emerald-400">
                +3.1% from last period
              </div>
            </div>
          </div>
        )}

        {/* Additional Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Customer Engagement</h3>
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Inquiries</span>
                  <span className="text-white font-semibold">{stats.totalInquiries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Sales</span>
                  <span className="text-white font-semibold">{stats.totalSales}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Average Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-white font-semibold">{stats.averageRating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Views per Product</span>
                  <span className="text-white font-semibold">{Math.round(stats.totalViews / stats.totalProducts)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Inquiry Rate</span>
                  <span className="text-white font-semibold">{((stats.totalInquiries / stats.totalViews) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Revenue per Sale</span>
                  <span className="text-white font-semibold">{formatCurrency(stats.totalRevenue / stats.totalSales)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                <Settings className="h-6 w-6 text-gray-400" />
              </div>
              <div className="space-y-3">
                <button className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                  Update Product Prices
                </button>
                <button className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                  Manage Inventory
                </button>
                <button className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                  View Messages
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Your Products</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{product.title}</div>
                      <div className="text-sm text-gray-400">Updated {product.lastUpdated}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white">
                      ${product.pricing.amount}/{product.pricing.unit}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{product.analytics.views.toLocaleString()}</div>
                      <div className={`text-sm ${product.performance.viewsGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatPercentage(product.performance.viewsGrowth)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{product.analytics.sales}</div>
                      <div className={`text-sm ${product.performance.salesGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatPercentage(product.performance.salesGrowth)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{formatCurrency(product.analytics.revenue)}</div>
                      <div className={`text-sm ${product.performance.revenueGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatPercentage(product.performance.revenueGrowth)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800'
                          : product.status === 'inactive'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-emerald-400 hover:text-emerald-300">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-blue-400 hover:text-blue-300">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-yellow-400 hover:text-yellow-300">
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Add New Product</h2>
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Title
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter product title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none">
                    <option value="">Select category</option>
                    <option value="hydrogen">Hydrogen</option>
                    <option value="solar">Solar Energy</option>
                    <option value="wind">Wind Energy</option>
                    <option value="battery_storage">Battery Storage</option>
                    <option value="green_certificate">Green Certificate</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Unit
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none">
                      <option value="kg">kg</option>
                      <option value="kWh">kWh</option>
                      <option value="MWh">MWh</option>
                      <option value="certificate">certificate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="Describe your product..."
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteOwnerDashboard;