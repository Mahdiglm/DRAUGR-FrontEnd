import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SpecialOffersBanner = ({ offers }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile-specific horizontal scrolling banner
  const MobileBanner = () => (
    <div className="mb-8">
      <div className="px-4 mb-4">
        <h3 className="text-lg font-bold text-white mb-1">پیشنهادات ویژه</h3>
        <p className="text-gray-400 text-sm">بهترین تخفیف‌ها را از دست ندهید</p>
      </div>
      
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 px-4 pb-2" style={{ width: 'max-content' }}>
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              className="relative w-72 bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/30"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Compact image header */}
              <div className="relative h-32 overflow-hidden">
                <img 
                  src={offer.image} 
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Compact discount badge */}
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                  {offer.discount}
                </div>
                
                {/* Title overlay */}
                <div className="absolute bottom-2 left-3 right-3">
                  <h4 className="text-white text-sm font-semibold line-clamp-1 mb-1">
                    {offer.title}
                  </h4>
                  <p className="text-gray-300 text-xs line-clamp-1">
                    {offer.description}
                  </p>
                </div>
              </div>
              
              {/* Compact action area */}
              <div className="p-3">
                <Link 
                  to={`/special-offers/${offer.id}`}
                  className="block w-full bg-red-600/20 border border-red-600/40 text-red-400 text-center py-2 rounded-lg text-xs font-semibold hover:bg-red-600/30 transition-colors"
                >
                  مشاهده پیشنهاد
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="flex justify-center mt-3">
        <div className="flex gap-1">
          {offers.map((_, index) => (
            <div key={index} className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );

  // Desktop version (unchanged)
  const DesktopBanner = () => (
    <div className="mb-20 flex justify-center">
      <motion.div 
        className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {offers.map((offer, index) => (
          <motion.div
            key={offer.id}
            className="relative group w-full lg:w-1/3 bg-black/40 backdrop-blur-md border-2 border-gray-700/50 overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.3 + (index * 0.15),
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            whileHover={{ 
              y: -8,
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            style={{
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Animated gradient background */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-red-900/20 opacity-0 rounded-2xl"
              animate={{ 
                opacity: [0, 0.3, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Main image container - Enhanced for mobile */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-t-2xl">
              <motion.img 
                src={offer.image} 
                alt={offer.title} 
                className="w-full h-full object-cover filter brightness-80 contrast-110"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              {/* Subtle animated texture */}
              <motion.div 
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%']
                }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  backgroundSize: '200% 200%'
                }}
              />
              
              {/* Enhanced discount badge */}
              <motion.div 
                className="absolute top-4 left-4 bg-red-600/95 backdrop-blur-sm border-2 border-red-500/60 text-white px-3 py-2 text-sm font-bold tracking-wide rounded-xl shadow-lg"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                whileHover={{ scale: 1.1, rotate: 2 }}
              >
                {offer.discount} تخفیف
              </motion.div>
            </div>

            {/* Content section - Enhanced spacing and typography */}
            <div className="p-5 sm:p-6 relative">
              {/* Title with enhanced typography */}
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-red-300 transition-colors duration-300 line-clamp-1">
                {offer.title}
              </h3>
              
              {/* Description with better mobile formatting */}
              <p className="text-sm sm:text-base text-gray-400 mb-6 leading-relaxed line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
                {offer.description}
              </p>
            
              {/* Enhanced CTA button */}
              <Link 
                to={`/special-offers/${offer.id}`}
                className="relative inline-block w-full group overflow-hidden"
              >
                <motion.span
                  className="block text-center py-3 sm:py-3.5 bg-black/60 backdrop-blur-sm border-2 border-red-600/40 text-red-400 text-sm sm:text-base font-semibold rounded-xl relative z-10"
                  whileHover={{ 
                    backgroundColor: "rgba(127, 29, 29, 0.3)",
                    borderColor: "rgba(239, 68, 68, 0.6)",
                    color: "#f87171"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  مشاهده پیشنهاد
                </motion.span>
                
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-xl" />
              </Link>
            </div>
            
            {/* Enhanced hover glow effect */}
            <motion.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
              style={{
                boxShadow: 'inset 0 0 30px rgba(239, 68, 68, 0.15), 0 0 30px rgba(239, 68, 68, 0.1)'
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden">
        <MobileBanner />
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <DesktopBanner />
      </div>
    </>
  );
};

export default SpecialOffersBanner;