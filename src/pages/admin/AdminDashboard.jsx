import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data.data.dashboard);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {dashboardData && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card text-center">
              <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
              <p className="text-3xl font-bold text-primary-600 mt-2">
                {dashboardData.total_users}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                +{dashboardData.recent_activity.users_this_month} this month
              </p>
            </div>

            <div className="card text-center">
              <h3 className="text-lg font-medium text-gray-900">Total Stores</h3>
              <p className="text-3xl font-bold text-primary-600 mt-2">
                {dashboardData.total_stores}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                +{dashboardData.recent_activity.stores_this_month} this month
              </p>
            </div>

            <div className="card text-center">
              <h3 className="text-lg font-medium text-gray-900">Total Ratings</h3>
              <p className="text-3xl font-bold text-primary-600 mt-2">
                {dashboardData.total_ratings}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                +{dashboardData.recent_activity.ratings_this_month} this month
              </p>
            </div>
          </div>

          {/* Average Rating */}
          <div className="card mb-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Average Rating</h3>
            <p className="text-4xl font-bold text-yellow-500">
              {dashboardData.average_platform_rating}★
            </p>
          </div>
        </>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Management</h3>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/admin/users/create'}
              className="btn-primary w-full"
            >
              Create New User
            </button>
            <button
              onClick={() => window.location.href = '/admin/users'}
              className="btn-secondary w-full"
            >
              View All Users
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Store Management</h3>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/admin/stores/create'}
              className="btn-primary w-full"
            >
              Create New Store
            </button>
            <button
              onClick={() => window.location.href = '/admin/stores'}
              className="btn-secondary w-full"
            >
              View All Stores
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;