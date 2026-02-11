import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storeOwnerAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StarRating from '../../components/StarRating';

const StarBar = ({ star, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-4 text-right text-gray-500">{star}</span>
      <svg className="w-3 h-3 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.783.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L1.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
      </svg>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-gray-400 text-right">{count}</span>
    </div>
  );
};

const StoreOwnerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [usersWhoRated, setUsersWhoRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      try {
        const [dashRes, ratingsRes] = await Promise.all([
          storeOwnerAPI.getDashboard(),
          storeOwnerAPI.getRatingsUsers(),
        ]);
        if (!cancelled) {
          setDashboardData(dashRes.data.data);
          setUsersWhoRated(ratingsRes.data.data.users || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const overview = dashboardData?.overview;
  const stores = dashboardData?.stores || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Store Owner Dashboard</h1>
        <p className="text-sm text-gray-500 -mt-3">Welcome back, {user.name}</p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'My Stores', value: overview?.total_stores ?? 0 },
          { label: 'Total Ratings', value: overview?.total_ratings_received ?? 0 },
          { label: 'Avg Rating', value: overview?.overall_average_rating ? `${parseFloat(overview.overall_average_rating).toFixed(1)} ★` : '—' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* My Stores */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="section-title !mb-0">My Stores</h2>
        </div>

        {stores.length === 0 ? (
          <div className="text-center py-12 px-6">
            <svg className="mx-auto h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No stores yet. Contact admin to get a store assigned.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {stores.map((store) => {
              const stats = store.rating_stats || {};
              const avg = parseFloat(stats.average_rating || 0);
              const total = Number(stats.total_ratings || 0);
              const bd = stats.star_breakdown || {};

              return (
                <div key={store.id} className="px-6 py-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{store.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{store.address}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <StarRating rating={avg} readOnly size="sm" />
                        <span className="text-sm text-gray-600">
                          {avg > 0 ? avg.toFixed(1) : '0.0'} ({total})
                        </span>
                      </div>
                    </div>

                    {/* Star breakdown */}
                    {total > 0 && (
                      <div className="w-full sm:w-48 space-y-0.5 shrink-0">
                        {[5, 4, 3, 2, 1].map((s) => {
                          const key = ['one_star', 'two_star', 'three_star', 'four_star', 'five_star'][s - 1];
                          return <StarBar key={s} star={s} count={Number(bd[key] || 0)} total={total} />;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Users Who Rated */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="section-title !mb-0">Recent Ratings from Users</h2>
          {usersWhoRated.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">{usersWhoRated.length} total</p>
          )}
        </div>

        {usersWhoRated.length === 0 ? (
          <div className="text-center py-12 px-6">
            <svg className="mx-auto h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No ratings received yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {usersWhoRated.map((r) => (
              <div key={r.rating_id} className="px-6 py-3 flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <StarRating rating={r.rating} readOnly size="sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate">{r.user_name}</span>
                    <span className="text-xs text-gray-400 shrink-0">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{r.store_name}</p>
                  {r.comment && (
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">&ldquo;{r.comment}&rdquo;</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;