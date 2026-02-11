import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await adminAPI.getDashboard();
        setDashboardData(response.data.data.dashboard);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="page-title">Admin Dashboard</h1>

      {dashboardData && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="card">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {dashboardData.total_users}
              </p>
              <p className="text-xs text-green-600 mt-2">
                +{dashboardData.recent_activity.users_this_month} this month
              </p>
            </div>

            <div className="card">
              <p className="text-sm font-medium text-gray-500">Total Stores</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {dashboardData.total_stores}
              </p>
              <p className="text-xs text-green-600 mt-2">
                +{dashboardData.recent_activity.stores_this_month} this month
              </p>
            </div>

            <div className="card">
              <p className="text-sm font-medium text-gray-500">Total Ratings</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {dashboardData.total_ratings}
              </p>
              <p className="text-xs text-green-600 mt-2">
                +{dashboardData.recent_activity.ratings_this_month} this month
              </p>
            </div>

            <div className="card">
              <p className="text-sm font-medium text-gray-500">Avg. Platform Rating</p>
              <p className="text-3xl font-bold text-yellow-500 mt-1">
                {dashboardData.average_platform_rating}
                <span className="text-xl ml-1">★</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">Across all stores</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card">
              <h3 className="section-title mb-4">User Management</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/users/create')}
                  className="btn-primary w-full"
                >
                  Create New User
                </button>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="btn-secondary w-full"
                >
                  View All Users
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="section-title mb-4">Store Management</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/stores/create')}
                  className="btn-primary w-full"
                >
                  Create New Store
                </button>
                <button
                  onClick={() => navigate('/admin/stores')}
                  className="btn-secondary w-full"
                >
                  View All Stores
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;