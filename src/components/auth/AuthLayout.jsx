import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Assets
// Using an empty file as a placeholder - will play sound conditionally
import bloodDropSound from '../../assets/blood-drop.mp3';

const AuthLayout = ({ children, title }) => {
  const [bloodDrops, setBloodDrops] = useState([]);
  
  // Blood drops animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Random position for new blood drop
      const newDrop = {
        id: Date.now(),
        left: Math.random() * 100,
        delay: Math.random(),
        size: Math.random() * 10 + 5,
      };
      
      setBloodDrops(prevDrops => [...prevDrops, newDrop]);
      
      // Try to play sound, but handle failures gracefully
      try {
        const audio = new Audio(bloodDropSound);
        audio.volume = 0.1;
        audio.play().catch(e => {
          console.log("Audio play prevented or file missing:", e);
        });
      } catch (error) {
        console.log("Sound not available:", error);
      }
      
      // Remove old drops to prevent memory issues
      if (bloodDrops.length > 15) {
        setBloodDrops(prevDrops => prevDrops.slice(1));
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [bloodDrops.length]);
  
  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated blood drops */}
      {bloodDrops.map(drop => (
        <motion.div
          key={drop.id}
          className="absolute top-0 bg-draugr-500 rounded-full z-10"
          style={{
            left: `${drop.left}%`,
            width: `${drop.size}px`,
            height: `${drop.size * 1.5}px`,
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: ['0%', '100vh'],
            opacity: [0, 1, 0],
            scaleY: [1, 1.5, 1],
          }}
          transition={{
            duration: 8,
            ease: "easeIn",
            delay: drop.delay,
            times: [0, 0.05, 1]
          }}
        />
      ))}
      
      {/* Background overlay with subtle texture */}
      <div className="absolute inset-0 bg-blood-texture opacity-15 z-0"></div>
      
      {/* Glowing red border pattern */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-draugr-800 to-transparent opacity-70"></div>
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-draugr-800 to-transparent opacity-70"></div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-draugr-800 to-transparent opacity-70"></div>
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-draugr-800 to-transparent opacity-70"></div>
      
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
          className="bg-charcoal rounded-lg shadow-horror border border-draugr-900 p-8 relative overflow-hidden"
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