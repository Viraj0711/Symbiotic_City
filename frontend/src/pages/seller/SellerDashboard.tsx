import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSellerProfile } from '../../hooks/useSellerProfile';
import { 
  ShoppingBag, 
  Package, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile, stats, loading } = useSellerProfile();

  useEffect(() => {
    // Redirect if not a seller
    if (!loading && !profile) {
      navigate('/');
    }
  }, [profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E2EAD6' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E2EAD6' }}>
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">No Seller Profile Found</h2>
          <p className="text-gray-600 mb-6">You need to create a seller profile to access the dashboard.</p>
          <button
            onClick={() => navigate('/seller/apply')}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
          >
            Become a Seller
          </button>
        </div>
      </div>
    );
  }

  const formatMoney = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E2EAD6' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#059669' }} className="text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Seller Dashboard</h1>
              <p className="text-emerald-100 mt-1">{profile.business_name}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-emerald-100">KYC Status</div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                profile.kyc_status === 'verified' ? 'bg-green-500' :
                profile.kyc_status === 'rejected' ? 'bg-red-500' :
                'bg-yellow-500'
              }`}>
                {profile.kyc_status === 'verified' && <CheckCircle className="h-4 w-4 mr-1" />}
                {profile.kyc_status === 'pending' && <Clock className="h-4 w-4 mr-1" />}
                {profile.kyc_status === 'rejected' && <AlertCircle className="h-4 w-4 mr-1" />}
                {profile.kyc_status.charAt(0).toUpperCase() + profile.kyc_status.slice(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats ? formatMoney(stats.total_revenue_cents) : '$0.00'}
                </p>
                <p className="text-xs text-gray-400 mt-1">All time</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Pending Payouts */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Payouts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats ? formatMoney(stats.pending_payout_cents) : '$0.00'}
                </p>
                <p className="text-xs text-gray-400 mt-1">Available for withdrawal</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats ? stats.total_orders : 0}
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  {stats ? stats.pending_orders : 0} pending
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats ? stats.total_products : 0}
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  {stats ? stats.active_products : 0} active
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/seller/products/new')}
              className="flex items-center justify-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Package className="h-5 w-5" />
              <span>Add New Product</span>
            </button>
            <button
              onClick={() => navigate('/seller/orders')}
              className="flex items-center justify-center space-x-2 border border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>View Orders</span>
            </button>
            <button
              onClick={() => navigate('/seller/payouts')}
              className="flex items-center justify-center space-x-2 border border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <DollarSign className="h-5 w-5" />
              <span>Request Payout</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No recent activity</p>
            <p className="text-sm mt-1">Your recent orders and updates will appear here</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <button
            onClick={() => navigate('/seller/products')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <Package className="h-8 w-8 text-emerald-600 mb-3" />
            <h3 className="text-lg font-bold mb-2">Manage Products</h3>
            <p className="text-sm text-gray-600">Add, edit, and manage your product catalog</p>
          </button>

          <button
            onClick={() => navigate('/seller/orders')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <ShoppingBag className="h-8 w-8 text-emerald-600 mb-3" />
            <h3 className="text-lg font-bold mb-2">Orders</h3>
            <p className="text-sm text-gray-600">Track and fulfill customer orders</p>
          </button>

          <button
            onClick={() => navigate('/seller/settings')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <TrendingUp className="h-8 w-8 text-emerald-600 mb-3" />
            <h3 className="text-lg font-bold mb-2">Settings</h3>
            <p className="text-sm text-gray-600">Configure your seller profile and preferences</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
