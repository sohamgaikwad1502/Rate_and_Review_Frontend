import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StarRating from '../../components/StarRating';

const ROLE_MAP = {
  admin: { cls: 'badge-admin', label: 'Admin' },
  user: { cls: 'badge-user', label: 'User' },
  store_owner: { cls: 'badge-store-owner', label: 'Store Owner' },
};

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await adminAPI.getUserById(id);
        if (!cancelled) setUser(res.data.data.user);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to fetch user details');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchUser();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading user details..." />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="alert-error">{error || 'User not found'}</div>
        <button onClick={() => navigate('/admin/users')} className="mt-4 btn-secondary">
          ← Back to Users
        </button>
      </div>
    );
  }

  const role = ROLE_MAP[user.role] || ROLE_MAP.user;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/users')}
          className="text-sm text-primary-600 hover:text-primary-800 font-medium"
        >
          ← Back to Users
        </button>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="page-title !mb-0">User Details</h1>
          <span className={`badge ${role.cls}`}>{role.label}</span>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="section-title !mb-0">Personal Information</h2>
        </div>
        <dl className="divide-y divide-gray-100">
          {[
            ['Full Name', user.name],
            ['Email', user.email],
            ['Address', user.address || '—'],
            ['Role', <span key="role" className={`badge ${role.cls}`}>{role.label}</span>],
            [
              'Member Since',
              new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
            ],
          ].map(([label, value]) => (
            <div key={label} className="px-6 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">{label}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Stores — only for store_owners */}
      {user.role === 'store_owner' && (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="section-title !mb-0">Owned Stores</h2>
          </div>

          {(!user.stores || user.stores.length === 0) ? (
            <p className="px-6 py-8 text-center text-sm text-gray-500">No stores assigned yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {user.stores.map((store, idx) => {
                const avg = parseFloat(store.average_rating || 0);
                const total = Number(store.total_ratings || 0);
                return (
                  <div key={idx} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {store.store_name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {total} {total === 1 ? 'rating' : 'ratings'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StarRating rating={avg} readOnly size="sm" />
                      <span className="text-sm font-medium text-gray-700 w-8 text-right">
                        {avg > 0 ? avg.toFixed(1) : '—'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDetails;