import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            KidiCode 🇵🇰
          </Link>

          <div className="space-x-4 flex items-center">
            <Link to="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <Link to="/leaderboard" className="text-gray-600 hover:text-blue-600">
              Leaderboard
            </Link>

            {user ? (
              <>
                {/* --- Only for Students --- */}
                {user.role === 'student' && (
                  <>
                    <Link
                      to="/subscribe"
                      className="text-yellow-600 font-semibold hover:text-yellow-700"
                    >
                      Subscribe
                    </Link>

                    <Link
                      to="/profile"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      My Profile
                    </Link>
                  </>
                )}

                {/* --- Common for all logged-in users --- */}
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* --- Logged-out users --- */}
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
