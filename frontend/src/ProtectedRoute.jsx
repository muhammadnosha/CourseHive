import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

// This component checks for authentication and authorization
// 1. If user is not logged in, redirect to /login
// 2. If user is logged in but role doesn't match, redirect to their default dashboard
const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading spinner or message while checking auth state
    return <div className="text-center p-10">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // User is logged in but doesn't have the required role.
    // Redirect them to their own dashboard.
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and authorized, render the child components
  return children;
};

export default ProtectedRoute;