import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">MediCare SaaS</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">Welcome, {user.name} ({user.role})</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link to="/register" className="text-gray-600 hover:text-blue-600 font-medium">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;