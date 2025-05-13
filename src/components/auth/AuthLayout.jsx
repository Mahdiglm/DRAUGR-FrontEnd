import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Assets
import backgroundImage from '../../assets/BackGround-Login.jpg';

const AuthLayout = ({ children, title }) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>
      
      {/* Bottom gradient overlay for smooth transition to footer */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 z-0" 
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.95))',
          pointerEvents: 'none'
        }}
      ></div>
      
      {/* Main content container */}
      <div className="w-full max-w-md relative z-20">
        {/* Logo with typing animation */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <motion.div 
              className="text-4xl font-bold text-draugr-500 text-shadow-horror"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              DRAUGR
            </motion.div>
          </Link>
        </div>
        
        {/* Form container with horror styling */}
        <motion.div
          className="bg-charcoal bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-lg shadow-horror border border-draugr-900 p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Section title */}
          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            <span className="relative">
              {title}
              <motion.span 
                className="absolute -bottom-2 left-0 right-0 h-0.5 bg-draugr-500"
                initial={{ width: 0, left: '50%', right: '50%' }}
                animate={{ width: '100%', left: 0, right: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              ></motion.span>
            </span>
          </h2>
          
          {/* Content */}
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout; 