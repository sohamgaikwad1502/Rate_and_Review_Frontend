import React, { useState, useEffect } from 'react';
import { storesAPI, ratingsAPI } from '../../utils/api';
import StarRating from '../../components/StarRating';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    address: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  useEffect(() => {
    const loadStores = async () => {
      try {
        const response = await storesAPI.getAll(filters);
        setStores(response.data.data.stores);
      } catch (error) {
        console.error('Error loading stores:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, [filters]);

  const loadStores = async () => {
    try {
      const response = await storesAPI.getAll(filters);
      setStores(response.data.data.stores);
    } catch (error) {
      console.error('Error loading stores:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({
      ...filters,
      name: searchName,
      address: searchAddress,
    });
  };

  const submitRating = async (storeId, rating, comment = '') => {
    try {
      await ratingsAPI.submit({ store_id: storeId, rating, comment });
      loadStores(); // Refresh stores to show new rating
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const updateRating = async (ratingId, rating, comment = '') => {
    try {
      await ratingsAPI.update(ratingId, { rating, comment });
      loadStores(); // Refresh stores
    } catch (error) {
      console.error('Error updating rating:', error);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Stores</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by store name..."
              className="input-field flex-1"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by address..."
              className="input-field flex-1"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
            />
            <button type="submit" className="btn-primary">
              Search
            </button>
            <button 
              type="button" 
              onClick={() => {
                setSearchName('');
                setSearchAddress('');
                setFilters({
                  ...filters,
                  name: '',
                  address: '',
                });
              }}
              className="btn-secondary"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Sort Options */}
        <div className="flex gap-4 mb-6">
          <select
            className="input-field"
            value={filters.sortBy}
            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
          >
            <option value="created_at">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>
          <select
            className="input-field"
            value={filters.sortOrder}
            onChange={(e) => setFilters({...filters, sortOrder: e.target.value})}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onSubmitRating={submitRating}
            onUpdateRating={updateRating}
          />
        ))}
      </div>

      {stores.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No stores found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

const StoreCard = ({ store, onSubmitRating, onUpdateRating }) => {
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [newRating, setNewRating] = useState(store.user_rating?.rating || 0);
  const [comment, setComment] = useState(store.user_rating?.comment || '');
  const [loading, setLoading] = useState(false);

  const handleRatingSubmit = async () => {
    if (!newRating) return;
    
    setLoading(true);
    try {
      if (store.user_rating) {
        await onUpdateRating(store.user_rating.id, newRating, comment);
      } else {
        await onSubmitRating(store.id, newRating, comment);
      }
      setShowRatingForm(false);
    } catch (error) {
      console.error('Error with rating:', error);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{store.name}</h3>
      <p className="text-gray-600 mb-2">{store.address}</p>
      <p className="text-sm text-gray-500 mb-4">Owner: {store.owner_name}</p>
      
      {/* Overall Rating */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Overall Rating</p>
        <div className="flex items-center">
          <StarRating 
            rating={parseFloat(store.rating_info.average_rating) || 0} 
            readOnly 
          />
          <span className="ml-2 text-sm text-gray-600">
            ({store.rating_info.total_ratings} reviews)
          </span>
        </div>
      </div>

      {/* User's Rating */}
      {store.user_rating && (
        <div className="mb-4 p-3 bg-primary-50 rounded">
          <p className="text-sm font-medium text-primary-700 mb-1">Your Rating</p>
          <StarRating rating={store.user_rating.rating} readOnly />
          {store.user_rating.comment && (
            <p className="text-sm text-primary-600 mt-1">"{store.user_rating.comment}"</p>
          )}
        </div>
      )}

      {/* Rating Form */}
      {showRatingForm && (
        <div className="mb-4 p-4 border rounded">
          <p className="text-sm font-medium mb-2">
            {store.user_rating ? 'Update Your Rating' : 'Rate This Store'}
          </p>
          <div className="mb-3">
            <StarRating rating={newRating} onRatingChange={setNewRating} />
          </div>
          <textarea
            className="input-field mb-3"
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleRatingSubmit}
              disabled={loading || !newRating}
              className="btn-primary text-sm"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Submit'}
            </button>
            <button
              onClick={() => setShowRatingForm(false)}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={() => setShowRatingForm(true)}
        className="btn-primary w-full text-sm"
      >
        {store.user_rating ? 'Update Rating' : 'Rate Store'}
      </button>
    </div>
  );
};

export default UserDashboard;