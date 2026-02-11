import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const PasswordStrength = ({ password }) => {
  const strength = useMemo(() => {
    if (!password) return { level: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;

    if (score <= 2) return { level: 1, label: 'Weak', color: 'bg-red-400' };
    if (score <= 3) return { level: 2, label: 'Fair', color: 'bg-yellow-400' };
    if (score <= 4) return { level: 3, label: 'Good', color: 'bg-blue-400' };
    return { level: 4, label: 'Strong', color: 'bg-green-500' };
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.level ? strength.color : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">{strength.label}</span>
        <div className="flex gap-2 text-gray-400">
          <span className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>A-Z</span>
          <span className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : ''}>!@#</span>
          <span className={password.length >= 8 ? 'text-green-600' : ''}>8+</span>
        </div>
      </div>
    </div>
  );
};

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (formData.name.length < 20 || formData.name.length > 60) {
      setError('Name must be between 20 and 60 characters');
      return false;
    }
    if (formData.password.length < 8 || formData.password.length > 16) {
      setError('Password must be between 8 and 16 characters');
      return false;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError('Password must contain at least one special character');
      return false;
    }
    if (formData.address.length > 400) {
      setError('Address must not exceed 400 characters');
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
      await adminAPI.createUser(formData);
      setSuccess(`${formData.role.replace('_', ' ')} created successfully!`);
      setFormData({ name: '', email: '', password: '', address: '', role: 'user' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/users')}
          className="text-sm text-primary-600 hover:text-primary-800 font-medium"
        >
          ← Back to Users
        </button>
        <h1 className="page-title mt-2">Create New User</h1>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-8">
          {error && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}

          <div>
            <label htmlFor="name" className="label">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="input-field"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              minLength="20"
              maxLength="60"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">20–60 characters</span>
              <span className={`text-xs ${formData.name.length < 20 || formData.name.length > 60 ? 'text-red-500' : 'text-green-600'}`}>
                {formData.name.length}/60
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="label">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input-field"
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input-field"
              placeholder="8–16 chars, uppercase & special"
              value={formData.password}
              onChange={handleChange}
              minLength="8"
              maxLength="16"
            />
            <PasswordStrength password={formData.password} />
          </div>

          <div>
            <label htmlFor="address" className="label">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              rows="3"
              required
              className="input-field"
              placeholder="Enter full address"
              value={formData.address}
              onChange={handleChange}
              maxLength="400"
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${formData.address.length > 400 ? 'text-red-500' : 'text-gray-400'}`}>
                {formData.address.length}/400
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="role" className="label">Role</label>
            <select
              id="role"
              name="role"
              className="input-field"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">Normal User</option>
              <option value="admin">System Administrator</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex justify-center items-center"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create User'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
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

export default CreateUser;