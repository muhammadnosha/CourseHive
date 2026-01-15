import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  switch (user.role) {
    case 'student':
      return <Navigate to="/student/dashboard" replace />;
    case 'instructor':
      return <Navigate to="/instructor/dashboard" replace />;
    case 'parent':
      return <Navigate to="/parent/dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      // Fallback for any other case
      return <Navigate to="/" replace />;
  }
};

export default DashboardRedirect;