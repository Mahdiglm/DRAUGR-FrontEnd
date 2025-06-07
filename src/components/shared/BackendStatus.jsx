import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiIntegration from '../../services/apiIntegration';

const BackendStatus = ({ className = '' }) => {
  const [status, setStatus] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Initial status check
    updateStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(updateStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const updateStatus = () => {
    const backendStatus = apiIntegration.getBackendStatus();
    setStatus(backendStatus);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await apiIntegration.refreshBackendStatus();
      updateStatus();
    } catch (error) {
      console.error('Failed to refresh backend status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!status) return null;

  const isConnected = status.available;
  const usingMockData = status.usingMockData;

  return (
    <div className={`relative ${className}`}>
      {/* Status Indicator */}
      <motion.button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          isConnected 
            ? 'bg-green-900/30 text-green-400 border border-green-700/50 hover:bg-green-900/50' 
            : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50 hover:bg-yellow-900/50'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Status Dot */}
        <motion.div
          className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-400' : 'bg-yellow-400'
          }`}
          animate={{
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Status Text */}
        <span>
          {isConnected ? 'متصل به سرور' : 'حالت آفلاین'}
        </span>
        
        {/* Arrow Icon */}
        <motion.svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: showDetails ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      {/* Dropdown Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{ direction: 'rtl' }}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600/50">
              <h3 className="text-white font-semibold text-sm">وضعیت اتصال Backend</h3>
            </div>

            {/* Status Details */}
            <div className="p-4 space-y-3">
              {/* Connection Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">وضعیت اتصال:</span>
                <div className={`flex items-center gap-2 text-sm font-medium ${
                  isConnected ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-400' : 'bg-yellow-400'
                  }`} />
                  {isConnected ? 'متصل' : 'قطع'}
                </div>
              </div>

              {/* Data Source */}
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">منبع داده:</span>
                <span className={`text-sm font-medium ${
                  usingMockData ? 'text-blue-400' : 'text-green-400'
                }`}>
                  {usingMockData ? 'داده‌های آزمایشی' : 'سرور واقعی'}
                </span>
              </div>

              {/* Last Check */}
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">آخرین بررسی:</span>
                <span className="text-gray-400 text-xs">
                  {status.lastChecked ? new Date(status.lastChecked).toLocaleTimeString('fa-IR') : 'نامشخص'}
                </span>
              </div>

              {/* Warning for Mock Data */}
              {usingMockData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg"
                >
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-yellow-400 text-xs font-medium">حالت توسعه</p>
                      <p className="text-yellow-300/80 text-xs mt-1">
                        از داده‌های آزمایشی استفاده می‌شود. تغییرات ذخیره نمی‌شوند.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Refresh Button */}
              <motion.button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: isRefreshing ? 360 : 0 }}
                  transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </motion.svg>
                {isRefreshing ? 'در حال بررسی...' : 'بررسی مجدد'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BackendStatus; 