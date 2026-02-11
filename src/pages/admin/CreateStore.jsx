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
    const fetchStoreOwners = async () => {
      try {
        const response = await adminAPI.getUsers({ role: 'store_owner' });
        setStoreOwners(response.data.data.users || []);
      } catch {
        setError('Failed to load store owners');
      } finally {
        setLoadingOwners(false);
      }
    };
    fetchStoreOwners();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.name.trim() || formData.name.length > 100) {
      setError('Store name is required (max 100 characters)');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Store email is required');
      return false;
    }
    if (!formData.address.trim() || formData.address.length > 400) {
      setError('Address is required (max 400 characters)');
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
      setFormData({ name: '', email: '', address: '', owner_id: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store');
    }
    setLoading(false);
  };

  if (loadingOwners) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading store owners..." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/stores')}
          className="text-sm text-primary-600 hover:text-primary-800 font-medium"
        >
          ← Back to Stores
        </button>
        <h1 className="page-title mt-2">Create New Store</h1>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-8">
          {error && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}

          <div>
            <label htmlFor="name" className="label">
              Store Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              maxLength="100"
              placeholder="Enter store name"
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-400">{formData.name.length}/100</span>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="label">
              Store Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              placeholder="store@example.com"
            />
          </div>

          <div>
            <label htmlFor="address" className="label">
              Store Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              rows="3"
              required
              className="input-field"
              value={formData.address}
              onChange={handleChange}
              maxLength="400"
              placeholder="Enter complete store address"
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${formData.address.length > 400 ? 'text-red-500' : 'text-gray-400'}`}>
                {formData.address.length}/400
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="owner_id" className="label">
              Store Owner <span className="text-red-500">*</span>
            </label>
            <select
              id="owner_id"
              name="owner_id"
              required
              className="input-field"
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
              <p className="mt-1 text-xs text-red-500">
                No store owners available. Create a store owner user first.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || storeOwners.length === 0}
              className="btn-primary flex-1 flex justify-center items-center"
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