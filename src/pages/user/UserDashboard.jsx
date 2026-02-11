import React, { useState, useEffect, useCallback } from 'react';
import { storesAPI, ratingsAPI } from '../../utils/api';
import StarRating from '../../components/StarRating';
import LoadingSpinner from '../../components/LoadingSpinner';

const StoreCard = ({ store, onRatingDone }) => {
  const [open, setOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(store.user_rating?.rating || 0);
  const [comment, setComment] = useState(store.user_rating?.comment || '');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', msg }

  const hasExisting = !!store.user_rating;
  const avg = parseFloat(store.rating_info?.average_rating) || 0;
  const total = Number(store.rating_info?.total_ratings) || 0;

  const handleSubmit = async () => {
    if (!selectedRating) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      if (hasExisting) {
        await ratingsAPI.update(store.user_rating.id, { rating: selectedRating, comment });
        setFeedback({ type: 'success', msg: 'Rating updated!' });
      } else {
        await ratingsAPI.submit({ store_id: store.id, rating: selectedRating, comment });
        setFeedback({ type: 'success', msg: 'Rating submitted!' });
      }
      setTimeout(() => {
        onRatingDone();
        setOpen(false);
        setFeedback(null);
      }, 800);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setFeedback({ type: 'error', msg });
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
      <div className="p-5 flex-1">
        {/* Store name & owner */}
        <h3 className="text-base font-semibold text-gray-900 truncate" title={store.name}>
          {store.name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate" title={store.address}>
          {store.address}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">Owner: {store.owner_name}</p>

        {/* Overall rating */}
        <div className="flex items-center gap-2 mt-3">
          <StarRating rating={avg} readOnly size="sm" />
          <span className="text-sm text-gray-600">
            {avg > 0 ? avg.toFixed(1) : '0.0'} ({total})
          </span>
        </div>

        {/* Existing user rating badge */}
        {hasExisting && !open && (
          <div className="mt-3 px-3 py-2 bg-primary-50 rounded text-sm">
            <span className="font-medium text-primary-700">Your rating:</span>{' '}
            <span className="text-primary-800">{store.user_rating.rating}★</span>
            {store.user_rating.comment && (
              <p className="text-primary-600 text-xs mt-0.5 line-clamp-2">
                &ldquo;{store.user_rating.comment}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Rating form (toggled) */}
        {open && (
          <div className="mt-3 p-3 border border-gray-200 rounded-lg space-y-3">
            <p className="text-sm font-medium text-gray-700">
              {hasExisting ? 'Update Your Rating' : 'Rate This Store'}
            </p>

            {/* Star selector */}
            <div>
              <StarRating rating={selectedRating} onRatingChange={setSelectedRating} size="md" />
            </div>

            {/* Comment */}
            <textarea
              className="input-field text-sm"
              placeholder="Leave a comment (optional, max 500 chars)"
              rows="2"
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-end">
              <span className="text-xs text-gray-400">{comment.length}/500</span>
            </div>

            {feedback && (
              <div className={feedback.type === 'success' ? 'alert-success' : 'alert-error'}>
                {feedback.msg}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={submitting || !selectedRating}
                className="btn-primary text-sm flex-1 flex justify-center items-center"
              >
                {submitting ? (
                  <LoadingSpinner size="sm" />
                ) : hasExisting ? (
                  'Update Rating'
                ) : (
                  'Submit Rating'
                )}
              </button>
              <button
                onClick={() => { setOpen(false); setFeedback(null); }}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer button */}
      {!open && (
        <div className="px-5 pb-4">
          <button
            onClick={() => {
              setSelectedRating(store.user_rating?.rating || 0);
              setComment(store.user_rating?.comment || '');
              setOpen(true);
            }}
            className={`w-full text-sm ${hasExisting ? 'btn-secondary' : 'btn-primary'}`}
          >
            {hasExisting ? 'Update Rating' : 'Rate Store'}
          </button>
        </div>
      )}
    </div>
  );
};

/* ───── Dashboard ───── */
const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchFields, setSearchFields] = useState({ name: '', address: '' });
  const [filters, setFilters] = useState({
    name: '',
    address: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const loadStores = useCallback(async () => {
    setError('');
    try {
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.address) params.address = filters.address;
      params.sortBy = filters.sortBy;
      params.sortOrder = filters.sortOrder;

      const res = await storesAPI.getAll(params);
      setStores(res.data.data.stores || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { loadStores(); }, [loadStores]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, name: searchFields.name, address: searchFields.address }));
  };

  const clearFilters = () => {
    setSearchFields({ name: '', address: '' });
    setFilters({ name: '', address: '', sortBy: 'created_at', sortOrder: 'desc' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading stores..." />
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Browse Stores</h1>

      {error && <div className="alert-error mb-4">{error}</div>}

      {/* Search & Sort */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="label">Store Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Search by name..."
              value={searchFields.name}
              onChange={(e) => setSearchFields((s) => ({ ...s, name: e.target.value }))}
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="label">Address</label>
            <input
              type="text"
              className="input-field"
              placeholder="Search by address..."
              value={searchFields.address}
              onChange={(e) => setSearchFields((s) => ({ ...s, address: e.target.value }))}
            />
          </div>
          <div className="min-w-[130px]">
            <label className="label">Sort By</label>
            <select
              className="input-field"
              value={filters.sortBy}
              onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))}
            >
              <option value="created_at">Date</option>
              <option value="name">Name</option>
            </select>
          </div>
          <div className="min-w-[120px]">
            <label className="label">Order</label>
            <select
              className="input-field"
              value={filters.sortOrder}
              onChange={(e) => setFilters((f) => ({ ...f, sortOrder: e.target.value }))}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">Search</button>
            <button type="button" onClick={clearFilters} className="btn-secondary">Clear</button>
          </div>
        </form>
      </div>

      {/* Stores Grid */}
      {stores.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No stores found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} onRatingDone={loadStores} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;