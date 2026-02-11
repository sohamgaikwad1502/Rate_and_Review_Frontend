import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive(to)
          ? 'text-primary-700 bg-primary-50'
          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );

  const MobileNavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={() => { setIsMenuOpen(false); onClick?.(); }}
      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
        isActive(to)
          ? 'text-primary-700 bg-primary-50'
          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );

  const getRoleBadge = (role) => {
    const config = {
      admin: 'badge-admin',
      store_owner: 'badge-store-owner',
      user: 'badge-user',
    };
    return (
      <span className={config[role] || 'badge-user'}>
        {role.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-primary-600">Rate & Review</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
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
              </>
            )}

            {user.role === 'user' && (
              <>
                <NavLink to="/dashboard">Stores</NavLink>
              </>
            )}

            <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-3">
              <NavLink to="/change-password">Change Password</NavLink>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 max-w-[140px] truncate" title={user.name}>
                  {user.name}
                </span>
                {getRoleBadge(user.role)}
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors p-2"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-3 space-y-1">
            {user.role === 'admin' && (
              <>
                <MobileNavLink to="/admin/dashboard">Dashboard</MobileNavLink>
                <MobileNavLink to="/admin/users">Users</MobileNavLink>
                <MobileNavLink to="/admin/stores">Stores</MobileNavLink>
              </>
            )}

            {user.role === 'store_owner' && (
              <MobileNavLink to="/store-owner/dashboard">Dashboard</MobileNavLink>
            )}

            {user.role === 'user' && (
              <MobileNavLink to="/dashboard">Stores</MobileNavLink>
            )}

            <MobileNavLink to="/change-password">Change Password</MobileNavLink>

            <div className="border-t border-gray-200 pt-3 mt-3 px-3">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                {getRoleBadge(user.role)}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm font-medium text-red-600 hover:text-red-700 py-2"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;