import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const CreateStore = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: '',
  });
  const [storeOwners, setStoreOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOwners, setLoadingOwners] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchStoreOwners();
  }, []);

  const fetchStoreOwners = async () => {
    try {
      setLoadingOwners(true);
      const response = await adminAPI.getUsers({ role: 'store_owner' });
      setStoreOwners(response.data.data.users);
    } catch (error) {
      console.error('Failed to fetch store owners:', error);
      setError('Failed to load store owners');
    } finally {
      setLoadingOwners(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (formData.name.length < 1 || formData.name.length > 100) {
      setError('Store name must be between 1 and 100 characters');
      return false;
    }
    
    if (formData.address.length > 400) {
      setError('Address must not exceed 400 characters');
      return false;
    }

    if (!formData.owner_id) {
      setError('Please select a store owner');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await adminAPI.createStore(formData);
      setSuccess('Store created successfully!');
      setFormData({
        name: '',
        email: '',
        address: '',
        owner_id: '',
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create store');
    }
    setLoading(false);
  };

  if (loadingOwners) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/stores')}
          className="text-primary-600 hover:text-primary-800 mb-4"
        >
          ← Back to Stores
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Store</h1>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Store Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="input-field mt-1"
              value={formData.name}
              onChange={handleChange}
              maxLength="100"
              placeholder="Enter store name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Store Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input-field mt-1"
              value={formData.email}
              onChange={handleChange}
              placeholder="store@example.com"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Store Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              rows="3"
              required
              className="input-field mt-1"
              value={formData.address}
              onChange={handleChange}
              maxLength="400"
              placeholder="Enter complete store address"
            />
            <p className="mt-1 text-sm text-gray-500">
              {formData.address.length}/400 characters
            </p>
          </div>

          <div>
            <label htmlFor="owner_id" className="block text-sm font-medium text-gray-700">
              Store Owner <span className="text-red-500">*</span>
            </label>
            <select
              id="owner_id"
              name="owner_id"
              required
              className="input-field mt-1"
              value={formData.owner_id}
              onChange={handleChange}
            >
              <option value="">Select a store owner</option>
              {storeOwners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
            {storeOwners.length === 0 && (
              <p className="mt-1 text-sm text-red-500">
                No store owners available. Please create store owner users first.
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || storeOwners.length === 0}
              className="btn-primary flex-1 flex justify-center"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Store'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/stores')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStore;