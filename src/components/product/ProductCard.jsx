import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, isHighlighted = false, isDisabled = false }) => {
  const { id, name, description, price, imageUrl } = product;
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleViewDetails = () => {
    if (isDisabled) return;
    
    // Set scroll behavior to auto for instant scrolling
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Force scroll to top before navigation
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    
    // Navigate to product detail
    navigate(`/product/${id}`);
    
    // Reset scroll behavior to smooth after navigation
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 100);
  };

  const handleAddToCart = (e) => {
    if (isDisabled) return;
    
    e.stopPropagation(); // Prevent navigation to product detail when clicking add to cart
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // Eerie blood drip SVG background
  const bloodDripPattern = `url("data:image/svg+xml,%3Csvg width='60' height='96' viewBox='0 0 60 96' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0V56C20 64 0 64 0 80C0 88 8 96 20 96C32 96 40 88 40 80C40 64 20 64 20 56V0Z' fill='%23660000' fill-opacity='0.15'/%3E%3C/svg%3E")`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={isDisabled ? {} : { 
        y: -5,
        scale: 1.03,
        transition: { 
          type: "spring", 
          stiffness: 200, 
          damping: 20 
        }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group bg-gray-900 border border-red-900/30 rounded-md overflow-hidden shadow-xl h-full flex flex-col
        ${isHighlighted ? 'shadow-2xl shadow-red-900/20' : 'shadow-lg shadow-black/50'}
        ${isDisabled ? 'pointer-events-none opacity-70' : 'cursor-pointer'}
        transform-gpu relative
      `}
    >
      {/* Ambient background effect with blood pattern */}
      <div 
        className="absolute inset-0 opacity-30 mix-blend-color-burn"
        style={{ 
          backgroundImage: bloodDripPattern,
          backgroundSize: '60px 96px',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center top'
        }}
      />
      
      {/* Glowing border effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-md pointer-events-none"
            style={{ 
              boxShadow: `0 0 8px 1px rgba(220, 38, 38, 0.6), inset 0 0 8px 1px rgba(220, 38, 38, 0.4)`,
              zIndex: 5
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Product image with horror effects */}
      <div 
        className={`h-64 sm:h-72 md:h-80 bg-cover bg-center relative overflow-hidden
          ${isDisabled ? '' : 'cursor-pointer'} group-hover:grayscale-[30%]
        `}
        style={{ 
          backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'all 0.4s ease'
        }}
        onClick={handleViewDetails}
      >
        {/* Noise texture overlay */}
        <div 
          className="absolute inset-0 mix-blend-overlay opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        />
        
        {/* Dark gradient overlay with red tint */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"
          animate={{
            opacity: isHovered ? 0.9 : 0.7,
            background: isHovered 
              ? 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(139,0,0,0.2), transparent)'
              : 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Hidden description that appears on hover */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-3 bg-black/80 translate-y-full"
          animate={{ translateY: isHovered ? 0 : '100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <p className="text-gray-200 text-sm line-clamp-2">{description}</p>
        </motion.div>
        
        {/* Highlight badge */}
        {isHighlighted && (
          <div className="absolute top-2 right-2 bg-red-900 text-white text-xs px-3 py-1 rounded-sm shadow-md">
            ویژه
          </div>
        )}
      </div>
      
      <div className="p-3 flex-grow flex flex-col min-h-0 bg-gradient-to-b from-gray-900 to-black relative z-10">
        <h3 
          className={`font-bold text-lg truncate ${isDisabled ? 'text-gray-400' : 'cursor-pointer text-gray-100 group-hover:text-red-400 transition-colors duration-300'}`}
          onClick={handleViewDetails}
        >
          {name}
        </h3>
        
        <div className="mt-2 flex justify-between items-center">
          <motion.span 
            className="font-bold text-base text-red-500"
            animate={{ textShadow: isHovered ? '0 0 8px rgba(220, 38, 38, 0.7)' : '0 0 0px transparent' }}
            transition={{ duration: 0.3 }}
          >
            {price.toFixed(2)} تومان
          </motion.span>
          
          <div className="flex gap-1">
            {!isDisabled && (
              <>
                <motion.button
                  whileHover={{ scale: 1.15, backgroundColor: '#991b1b' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAddToCart}
                  className="bg-red-800 text-white p-1.5 rounded-full w-8 h-8 flex items-center justify-center shadow-md shadow-black/30"
                  aria-label={`افزودن ${name} به سبد خرید`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15, backgroundColor: '#1e293b' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleViewDetails}
                  className="bg-gray-800 text-white p-1.5 rounded-full w-8 h-8 flex items-center justify-center shadow-md shadow-black/30"
                  aria-label={`مشاهده جزئیات ${name}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 