import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Assets
// Replaced local import with backend URL
// Using API_BASE_URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const backgroundImage = `${API_BASE_URL}/api/assets/BackGround-Login.jpg`;

const AuthLayout = ({ children, title }) => {
  // Ensure menu-open class is removed when the auth pages are mounted
  useEffect(() => {
    // Remove menu-open class to prevent blur effect on auth pages
    document.body.classList.remove('menu-open');
    
    // Cleanup on unmount
    return () => {
      // Ensure class is also removed when navigating away
      document.body.classList.remove('menu-open');
    };
  }, []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-0"></div>
      
      {/* Bottom gradient overlay for smooth transition to footer */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 z-0" 
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.95))',
          pointerEvents: 'none'
        }}
      ></div>
      
      {/* Subtle fog animations in background */}
      <div className="absolute inset-0 z-[1] opacity-20">
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{ 
            duration: 60, 
            ease: "linear", 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 2000 2000\' fill=\'none\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
            backgroundSize: '200% 200%'
          }}
        />
      </div>
      
      {/* Main content container - Slimmer on mobile, wider on desktop */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl relative z-20">
        {/* Logo with typing animation */}
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <Link to="/">
            <motion.div 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-draugr-500 text-shadow-horror"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              DRAUGR
            </motion.div>
          </Link>
        </div>
        
        {/* Form container with enhanced horror styling - More compact on mobile, spacious on desktop */}
        <motion.div
          className="relative bg-black/40 backdrop-filter backdrop-blur-md rounded-lg shadow-horror p-4 sm:p-5 md:p-7 lg:p-8 overflow-hidden border border-draugr-900/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Corner accents - smaller on mobile, larger on desktop */}
          <div className="absolute top-0 left-0 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 border-t border-l border-draugr-500/80"></div>
          <div className="absolute top-0 right-0 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 border-t border-r border-draugr-500/80"></div>
          <div className="absolute bottom-0 left-0 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 border-b border-l border-draugr-500/80"></div>
          <div className="absolute bottom-0 right-0 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 border-b border-r border-draugr-500/80"></div>
          
          {/* Subtle animated border glow */}
          <motion.div 
            className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{ 
              boxShadow: ['0 0 0 1px rgba(255,0,0,0.1)', '0 0 0 1px rgba(255,0,0,0.2)', '0 0 0 1px rgba(255,0,0,0.1)']
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          
          {/* Section title - Smaller on mobile, larger on desktop */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-5 md:mb-7 text-white relative z-10">
            <motion.span 
              className="relative inline-block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {title}
              <motion.span 
                className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-px sm:h-0.5 bg-gradient-to-r from-transparent via-draugr-500 to-transparent"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 0.8 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              ></motion.span>
            </motion.span>
          </h2>
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout; 