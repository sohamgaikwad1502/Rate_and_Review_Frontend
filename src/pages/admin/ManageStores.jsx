import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StarRating from '../../components/StarRating';

const ManageStores = () => {
  const [stores, setStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchFields, setSearchFields] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.email) params.email = filters.email;
      if (filters.address) params.address = filters.address;
      params.sortBy = filters.sortBy;
      params.sortOrder = filters.sortOrder;

      const response = await adminAPI.getStores(params);
      setStores(response.data.data.stores || []);
      setTotal(response.data.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores');
      setStores([]);
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
    setSearchFields({ name: '', email: '', address: '' });
    setFilters({
      name: '',
      email: '',
      address: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
  };

  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.split('-');
    setFilters({ ...filters, sortBy, sortOrder });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Manage Stores</h1>
          {!loading && <p className="text-sm text-gray-500 mt-1">{total} stores total</p>}
        </div>
        <button onClick={() => navigate('/admin/stores/create')} className="btn-primary">
          Add New Store
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {/* Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Filter by store name..."
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
            <input
              type="text"
              placeholder="Filter by address..."
              className="input-field"
              value={searchFields.address}
              onChange={(e) => setSearchFields({ ...searchFields, address: e.target.value })}
            />
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
            <button type="submit" className="btn-primary text-sm">Search</button>
            <button type="button" onClick={clearFilters} className="btn-secondary text-sm">
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {/* Stores Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading stores..." />
        </div>
      ) : stores.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
          </svg>
          <p className="text-gray-500 font-medium">No stores found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{store.name}</p>
                        <p className="text-sm text-gray-500">{store.email}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{store.address}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {store.owner_name || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StarRating
                          rating={parseFloat(store.rating || 0)}
                          readOnly
                          size="sm"
                        />
                        <span className="text-xs text-gray-500">
                          ({store.total_ratings || 0})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {store.created_at ? new Date(store.created_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
            Showing {stores.length} of {total} stores
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStores;