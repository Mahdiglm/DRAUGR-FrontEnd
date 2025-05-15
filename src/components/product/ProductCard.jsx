import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, isHighlighted = false, isDisabled = false }) => {
  const { id, name, description, price, imageUrl } = product;
  const navigate = useNavigate();

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={isDisabled ? {} : { 
        y: -5,
        scale: 1.02,
        transition: { 
          type: "spring", 
          stiffness: 200, 
          damping: 25 
        }
      }}
      className={`bg-gray-900 rounded-md overflow-hidden h-full flex flex-col
        ${isHighlighted ? 'ring-2 ring-red-800 ring-offset-2 ring-offset-gray-900' : 'border border-gray-800'}
        ${isDisabled ? 'pointer-events-none opacity-70' : 'cursor-pointer'}
        transform-gpu shadow-xl shadow-red-900/20
      `}
    >
      {/* Product image container */}
      <div 
        className={`h-64 sm:h-72 md:h-80 relative overflow-hidden
          ${isDisabled ? '' : 'cursor-pointer group'}
        `}
        onClick={handleViewDetails}
      >
        {/* Product image with contained aspect ratio */}
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <img 
            src={imageUrl} 
            alt={name}
            className="object-contain w-full h-full transition-all duration-500 group-hover:scale-105"
          />
        </div>
        
        {/* Blood-like gradient overlay for horror effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-radial-gradient opacity-40 pointer-events-none"></div>
        
        {/* Highlight badge */}
        {isHighlighted && (
          <div className="absolute top-3 right-3 bg-red-900 text-white text-xs px-3 py-1 font-bold tracking-wider uppercase rounded-sm shadow-lg shadow-red-900/50 border border-red-700/50">
            ویژه
          </div>
        )}
      </div>

      {/* Product details */}
      <div className="p-4 flex-grow flex flex-col space-y-3 bg-gradient-to-t from-black to-gray-900 min-h-0">
        <h3 
          className={`font-bold text-lg truncate ${isDisabled ? 'text-gray-400' : 'cursor-pointer text-white group-hover:text-red-400 transition-colors duration-300'}`}
          onClick={handleViewDetails}
        >
          {name}
        </h3>
        
        <p className="text-gray-400 text-sm line-clamp-2 min-h-[2.5rem]">{description}</p>
        
        <div className="flex justify-between items-center pt-2 mt-auto">
          <span className="font-bold text-base text-red-500">{price.toFixed(2)} تومان</span>
          
          <div className="flex gap-2">
            {!isDisabled && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAddToCart}
                  className="bg-red-800 hover:bg-red-700 text-white p-2 rounded-md w-9 h-9 flex items-center justify-center shadow-md shadow-red-900/30 border border-red-700"
                  aria-label={`افزودن ${name} به سبد خرید`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleViewDetails}
                  className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-md w-9 h-9 flex items-center justify-center shadow-md border border-gray-700"
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