import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import pfpIcon from '../../assets/pfp-icon.png';

// Dashboard layout component - serves as a container for all dashboard views
const DashboardLayout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname.split('/')[2] || 'profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Dashboard navigation items
  const navItems = [
    { id: 'profile', label: 'اطلاعات شخصی', icon: 'user' },
    { id: 'orders', label: 'سفارشات من', icon: 'shopping-bag' },
    { id: 'favorites', label: 'لیست علاقه‌مندی‌ها', icon: 'heart' },
    { id: 'addresses', label: 'آدرس‌های من', icon: 'map-pin' },
    { id: 'password', label: 'تغییر رمز عبور', icon: 'lock' },
    { id: 'notifications', label: 'اعلان‌ها', icon: 'bell' },
    { id: 'support', label: 'پشتیبانی', icon: 'help-circle' },
  ];

  // Handle logout
  const handleLogout = () => {
    logout();
    // Redirect will happen automatically due to the !isAuthenticated check above
  };

  // Icons for the navigation
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'user':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        );
      case 'shopping-bag':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
        );
      case 'heart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        );
      case 'map-pin':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        );
      case 'lock':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        );
      case 'bell':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        );
      case 'help-circle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile menu button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-between w-full px-4 py-3 bg-gray-900 rounded-lg text-white"
          >
            <span className="font-medium">داشبورد {user?.firstName || 'کاربر'}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform ${isMobileMenuOpen ? 'transform rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <motion.div
            className={`w-full md:w-64 bg-gray-900 rounded-lg overflow-hidden md:block ${isMobileMenuOpen ? 'block' : 'hidden'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* User profile section */}
            <div className="p-4 border-b border-gray-800 flex flex-col items-center">
              <div className="relative">
                <img
                  src={user?.profileImage || pfpIcon}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="w-20 h-20 rounded-full border-2 border-draugr-600 object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border border-black"></div>
              </div>
              <h2 className="mt-4 text-white text-lg font-medium text-center">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-400 text-sm truncate max-w-full text-center">{user?.email}</p>
            </div>
            
            {/* Navigation items */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/dashboard/${item.id}`}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-draugr-900/50 text-draugr-400'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className="mr-3">{getIcon(item.icon)}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2.5 rounded-lg text-draugr-400 hover:bg-gray-800/50 hover:text-draugr-300 transition-colors"
              >
                <span className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm7 12.5a.5.5 0 01-.5-.5v-6a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v6a.5.5 0 01-.5.5h-1z" clipRule="evenodd" />
                    <path d="M10.5 6a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1z" />
                  </svg>
                </span>
                <span>خروج از حساب</span>
              </button>
            </nav>
          </motion.div>
          
          {/* Main content area */}
          <motion.div
            className="flex-1 bg-gray-900 rounded-lg p-6 mt-4 md:mt-0 md:mr-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 