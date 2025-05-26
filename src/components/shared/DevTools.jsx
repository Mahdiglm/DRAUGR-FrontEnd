import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// Only show in development mode
const isDev = import.meta.env.DEV;

const DevTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const logsRef = useRef([]);
  const updateScheduledRef = useRef(false);
  const consoleOverridesInitialized = useRef(false);
  const isTabVisibleRef = useRef(true);
  
  // Early return after hooks
  if (!isDev) return null;

  // Track tab visibility to avoid updates when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Add console log override to capture logs
  useEffect(() => {
    // Prevent duplicate initialization
    if (consoleOverridesInitialized.current) return;
    consoleOverridesInitialized.current = true;
    
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    const scheduleUpdate = () => {
      // Skip updates when tab is not visible or update already scheduled
      if (!isTabVisibleRef.current || updateScheduledRef.current) return;
      
      updateScheduledRef.current = true;
      // Use setTimeout to batch updates
      setTimeout(() => {
        if (isTabVisibleRef.current) { // Double-check tab is still visible
          setLogs([...logsRef.current]);
        }
        updateScheduledRef.current = false;
      }, 0);
    };

    console.log = (...args) => {
      try {
        // Skip state updates if args include circular references or complex objects
        const newLog = { 
          type: 'log', 
          content: args.map(arg => {
            try {
              return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
            } catch (e) {
              return '[Complex Object]';
            }
          }).join(' '), 
          time: new Date() 
        };
        logsRef.current = [...logsRef.current, newLog];
        scheduleUpdate();
      } catch (e) {
        // Fail silently to avoid breaking the app
      }
      originalConsoleLog(...args);
    };

    console.error = (...args) => {
      try {
        const newLog = { 
          type: 'error', 
          content: args.map(arg => {
            try {
              return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
            } catch (e) {
              return '[Complex Object]';
            }
          }).join(' '),
          time: new Date() 
        };
        logsRef.current = [...logsRef.current, newLog];
        scheduleUpdate();
      } catch (e) {
        // Fail silently
      }
      originalConsoleError(...args);
    };

    console.warn = (...args) => {
      try {
        const newLog = { 
          type: 'warn', 
          content: args.map(arg => {
            try {
              return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
            } catch (e) {
              return '[Complex Object]';
            }
          }).join(' '),
          time: new Date() 
        };
        logsRef.current = [...logsRef.current, newLog];
        scheduleUpdate();
      } catch (e) {
        // Fail silently
      }
      originalConsoleWarn(...args);
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      consoleOverridesInitialized.current = false;
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-3 py-2 rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        🛠️
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-12 left-0 bg-gray-900 text-white p-4 rounded-lg shadow-lg w-96 max-h-96 overflow-auto"
        >
          <h3 className="text-lg font-bold mb-2">Dev Tools</h3>
          
          <div className="mb-4">
            <p className="text-xs text-gray-400">Environment: {import.meta.env.MODE}</p>
            <p className="text-xs text-gray-400">React Version: {React.version}</p>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-bold mb-1">Console Logs:</h4>
            <div className="bg-gray-800 p-2 rounded text-xs h-48 overflow-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet...</p>
              ) : (
                logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`mb-1 ${
                      log.type === 'error' ? 'text-red-400' : 
                      log.type === 'warn' ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <span className="text-gray-500 ml-1">[{log.time.toLocaleTimeString()}]</span> 
                    {log.content}
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={() => {
                logsRef.current = [];
                setLogs([]);
              }}
              className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
            >
              Clear Logs
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DevTools; 