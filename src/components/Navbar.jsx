import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
      {children}
    </Link>
  );

  const MobileNavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
    >
      {children}
    </Link>
  );

  if (!user) {
    return null; // Don't show navbar if not authenticated
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-primary-600">Rate & Review</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {/* Role-based Navigation Links */}
            {user.role === 'admin' && (
              <>
                <NavLink to="/admin/dashboard">Dashboard</NavLink>
                <NavLink to="/admin/users">Users</NavLink>
                <NavLink to="/admin/stores">Stores</NavLink>
              </>
            )}
            
            {user.role === 'store_owner' && (
              <>
                <NavLink to="/store-owner/dashboard">Dashboard</NavLink>
                <NavLink to="/store-owner/stores">My Stores</NavLink>
                <NavLink to="/store-owner/ratings">My Ratings</NavLink>
              </>
            )}
            
            {user.role === 'user' && (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/stores">Browse Stores</NavLink>
                <NavLink to="/my-ratings">My Ratings</NavLink>
              </>
            )}

            {/* User Profile Dropdown */}
            <div className="relative">
              <div className="flex items-center space-x-4">
                <NavLink to="/change-password">Change Password</NavLink>
                <span className="text-sm text-gray-700">
                  Welcome, {user.name}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-red-100 text-red-800'
                    : user.role === 'store_owner'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role.replace('_', ' ').toUpperCase()}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition-colors"
              aria-label="toggle menu"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pt-4 pb-3">
            <div className="space-y-1">
              {/* Role-based Mobile Navigation Links */}
              {user.role === 'admin' && (
                <>
                  <MobileNavLink to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink to="/admin/users" onClick={() => setIsMenuOpen(false)}>
                    Users
                  </MobileNavLink>
                  <MobileNavLink to="/admin/stores" onClick={() => setIsMenuOpen(false)}>
                    Stores
                  </MobileNavLink>
                </>
              )}
              
              {user.role === 'store_owner' && (
                <>
                  <MobileNavLink to="/store-owner/dashboard" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink to="/store-owner/stores" onClick={() => setIsMenuOpen(false)}>
                    My Stores
                  </MobileNavLink>
                  <MobileNavLink to="/store-owner/ratings" onClick={() => setIsMenuOpen(false)}>
                    My Ratings
                  </MobileNavLink>
                </>
              )}
              
              {user.role === 'user' && (
                <>
                  <MobileNavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink to="/stores" onClick={() => setIsMenuOpen(false)}>
                    Browse Stores
                  </MobileNavLink>
                  <MobileNavLink to="/my-ratings" onClick={() => setIsMenuOpen(false)}>
                    My Ratings
                  </MobileNavLink>
                </>
              )}
              
              {/* Change Password - Available to all users */}
              <MobileNavLink to="/change-password" onClick={() => setIsMenuOpen(false)}>
                Change Password
              </MobileNavLink>
            </div>
            
            {/* Mobile User Info */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center px-3 py-2">
                <div className="flex-1">
                  <div className="text-base font-medium text-gray-800">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user.email}
                  </div>
                </div>
                <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-red-100 text-red-800'
                    : user.role === 'store_owner'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="px-3 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-base font-medium text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;