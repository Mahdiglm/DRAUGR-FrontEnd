import React, { useState, useEffect } from 'react';

/**
 * AppStatusBar Component
 * 
 * Displays a status bar at the top of the application when
 * the backend server is unavailable and mock data is being used.
 */

const AppStatusBar = () => {
  const [usingMockData, setUsingMockData] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Check if the app is using mock data by examining api.js global status
  useEffect(() => {
    const checkApiStatus = () => {
      // Access the flag from window if it's been set
      if (window.draugr && typeof window.draugr.usingMockData === 'boolean') {
        setUsingMockData(window.draugr.usingMockData);
      }
    };

    // Check on mount
    checkApiStatus();

    // Set up interval to check periodically
    const intervalId = setInterval(checkApiStatus, 5000);

    // Set up listener for custom event
    const handleApiStatusChange = (event) => {
      setUsingMockData(event.detail.usingMockData);
    };
    
    window.addEventListener('draugr-api-status', handleApiStatusChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('draugr-api-status', handleApiStatusChange);
    };
  }, []);

  // If not using mock data, don't render anything
  if (!usingMockData) return null;

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${expanded ? 'bg-amber-800' : 'bg-amber-700'}`}
    >
      <div 
        className="container mx-auto px-4 py-2 text-white text-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2 animate-pulse" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="font-medium">
            حالت آفلاین: سرور در دسترس نیست، از داده‌های محلی استفاده می‌شود
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ml-2 transition-transform duration-300 ${expanded ? 'transform rotate-180' : ''}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        
        {expanded && (
          <div className="mt-2 pb-2 text-sm">
            <p>سرور پشتیبانی در حال حاضر در دسترس نیست. برنامه با داده‌های آزمایشی محلی کار می‌کند.</p>
            <p className="mt-1">برخی امکانات مانند ثبت سفارش و پرداخت غیرفعال هستند.</p>
            <div className="mt-2">
              <button 
                className="bg-white text-amber-800 px-3 py-1 rounded-md text-xs font-bold hover:bg-amber-100 transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.reload();
                }}
              >
                تلاش مجدد برای اتصال
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppStatusBar; 