import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// Only show in development mode
const isDev = import.meta.env.DEV;

const DevTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const logsRef = useRef([]);
  const updateScheduledRef = useRef(false);
  
  // Early return after hooks
  if (!isDev) return null;

  // Add console log override to capture logs
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    const scheduleUpdate = () => {
      if (!updateScheduledRef.current) {
        updateScheduledRef.current = true;
        // Use setTimeout to batch updates
        setTimeout(() => {
          setLogs([...logsRef.current]);
          updateScheduledRef.current = false;
        }, 0);
      }
    };

    console.log = (...args) => {
      const newLog = { type: 'log', content: args.map(arg => JSON.stringify(arg)).join(' '), time: new Date() };
      logsRef.current = [...logsRef.current, newLog];
      scheduleUpdate();
      originalConsoleLog(...args);
    };

    console.error = (...args) => {
      const newLog = { type: 'error', content: args.map(arg => JSON.stringify(arg)).join(' '), time: new Date() };
      logsRef.current = [...logsRef.current, newLog];
      scheduleUpdate();
      originalConsoleError(...args);
    };

    console.warn = (...args) => {
      const newLog = { type: 'warn', content: args.map(arg => JSON.stringify(arg)).join(' '), time: new Date() };
      logsRef.current = [...logsRef.current, newLog];
      scheduleUpdate();
      originalConsoleWarn(...args);
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
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