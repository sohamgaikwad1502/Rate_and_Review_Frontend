import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    role: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await adminAPI.getUsers(filters);
        setUsers(response.data.data.users);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Manage Users</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Filter by name"
            className="input-field"
            value={filters.name}
            onChange={(e) => setFilters({...filters, name: e.target.value})}
          />
          <input
            type="email"
            placeholder="Filter by email"
            className="input-field"
            value={filters.email}
            onChange={(e) => setFilters({...filters, email: e.target.value})}
          />
          <select
            className="input-field"
            value={filters.role}
            onChange={(e) => setFilters({...filters, role: e.target.value})}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
          <select
            className="input-field"
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters({...filters, sortBy, sortOrder});
            }}
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div>
                      <p className="text-lg font-medium text-gray-900">{user.name}</p>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.address}</p>
                    </div>
                    <span className={`ml-4 px-2 py-1 text-xs font-medium rounded ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'store_owner' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  {user.average_rating && (
                    <p className="text-sm text-yellow-600 mt-1">
                      Average Store Rating: {user.average_rating}★
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                    className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <div className="text-sm text-gray-500">
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;