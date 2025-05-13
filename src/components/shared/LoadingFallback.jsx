import React from 'react';
import { motion } from 'framer-motion';

const LoadingFallback = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-midnight text-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "linear"
        }}
        className="w-16 h-16 mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-draugr-500">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6v6l4 2"></path>
        </svg>
      </motion.div>
      <motion.h2
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ 
          repeat: Infinity, 
          duration: 1.5,
          ease: "easeInOut"
        }}
        className="text-xl font-bold"
      >
        در حال بارگذاری...
      </motion.h2>
    </div>
  );
};

export default LoadingFallback; 