import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import ChangePassword from './components/ChangePassword';

// Authentication Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// User Pages
import UserDashboard from './pages/user/UserDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import CreateUser from './pages/admin/CreateUser';
import ManageStores from './pages/admin/ManageStores';
import CreateStore from './pages/admin/CreateStore';
import UserDetails from './pages/admin/UserDetails';

// Store Owner Pages
import StoreOwnerDashboard from './pages/store_owner/StoreOwnerDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (user) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'store_owner') {
      return <Navigate to="/store-owner/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

// Dashboard Redirect Component
const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to appropriate dashboard based on role
  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user.role === 'store_owner') {
    return <Navigate to="/store-owner/dashboard" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

// Unauthorized Page
const UnauthorizedPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-500">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.history.back()}
              className="btn-primary"
            >
              Go Back
            </button>
            {user && (
              <p className="mt-2 text-xs text-gray-500">
                Logged in as: {user.role}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Layout
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

// Main App Component
const AppContent = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />

        {/* Dashboard Redirect */}
        <Route path="/" element={<DashboardRedirect />} />

        {/* Password Change Route - Available to all authenticated users */}
        <Route path="/change-password" element={
          <ProtectedRoute>
            <AppLayout>
              <ChangePassword />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* User Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['user']}>
            <AppLayout>
              <UserDashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/stores" element={
          <ProtectedRoute allowedRoles={['user']}>
            <AppLayout>
              <UserDashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/my-ratings" element={
          <ProtectedRoute allowedRoles={['user']}>
            <AppLayout>
              <UserDashboard />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <ManageUsers />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users/create" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <CreateUser />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/stores" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <ManageStores />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/stores/create" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <CreateStore />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users/:id" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <UserDetails />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Store Owner Routes */}
        <Route path="/store-owner/dashboard" element={
          <ProtectedRoute allowedRoles={['store_owner']}>
            <AppLayout>
              <StoreOwnerDashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/store-owner/stores" element={
          <ProtectedRoute allowedRoles={['store_owner']}>
            <AppLayout>
              <StoreOwnerDashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/store-owner/ratings" element={
          <ProtectedRoute allowedRoles={['store_owner']}>
            <AppLayout>
              <StoreOwnerDashboard />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Error Routes */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900">404</h1>
              <p className="text-gray-600">Page not found</p>
              <button
                onClick={() => window.location.href = '/'}
                className="btn-primary mt-4"
              >
                Go Home
              </button>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
};

// Root App Component
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
