import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchFields, setSearchFields] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
  });
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.email) params.email = filters.email;
      if (filters.address) params.address = filters.address;
      if (filters.role) params.role = filters.role;
      params.sortBy = filters.sortBy;
      params.sortOrder = filters.sortOrder;

      const response = await adminAPI.getUsers(params);
      setUsers(response.data.data.users || []);
      setTotal(response.data.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({
      ...filters,
      name: searchFields.name,
      email: searchFields.email,
      address: searchFields.address,
    });
  };

  const clearFilters = () => {
    setSearchFields({ name: '', email: '', address: '', role: '' });
    setFilters({
      name: '',
      email: '',
      address: '',
      role: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
  };

  const handleRoleChange = (role) => {
    setSearchFields({ ...searchFields, role });
    setFilters({ ...filters, role });
  };

  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.split('-');
    setFilters({ ...filters, sortBy, sortOrder });
  };

  const getRoleBadge = (role) => {
    const config = {
      admin: 'badge-admin',
      user: 'badge-user',
      store_owner: 'badge-store-owner',
    };
    return (
      <span className={config[role] || 'badge-user'}>
        {role.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Manage Users</h1>
          {!loading && <p className="text-sm text-gray-500 mt-1">{total} users total</p>}
        </div>
        <button onClick={() => navigate('/admin/users/create')} className="btn-primary">
          Add New User
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {/* Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Filter by name..."
              className="input-field"
              value={searchFields.name}
              onChange={(e) => setSearchFields({ ...searchFields, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Filter by email..."
              className="input-field"
              value={searchFields.email}
              onChange={(e) => setSearchFields({ ...searchFields, email: e.target.value })}
            />
            <select
              className="input-field"
              value={searchFields.role}
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="store_owner">Store Owner</option>
            </select>
            <select
              className="input-field"
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
              <option value="email-asc">Email A–Z</option>
              <option value="email-desc">Email Z–A</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-sm">
              Search
            </button>
            <button type="button" onClick={clearFilters} className="btn-secondary text-sm">
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading users..." />
        </div>
      ) : users.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-500 font-medium">No users found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 max-w-xs truncate" title={user.address}>
                        {user.address}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
            Showing {users.length} of {total} users
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;