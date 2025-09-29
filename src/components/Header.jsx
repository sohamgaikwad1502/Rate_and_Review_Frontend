import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'store_owner') return '/store-owner';
    return '/dashboard';
  };

  return (
    <header className="bg-primary-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Rate & Review</h1>
            {user && (
              <span className="ml-4 text-primary-100">
                Welcome, {user.name}
              </span>
            )}
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(getDashboardPath())}
                className="text-primary-100 hover:text-white"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="bg-primary-700 hover:bg-primary-800 px-3 py-1 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;