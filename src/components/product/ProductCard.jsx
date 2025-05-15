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
      className={`bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden shadow-md h-full flex flex-col
        ${isHighlighted ? 'shadow-xl shadow-red-900/30 border border-red-900/30' : 'border border-gray-800'}
        ${isDisabled ? 'pointer-events-none opacity-80' : 'cursor-pointer'}
        transform-gpu
      `}
    >
      <div 
        className={`h-64 sm:h-72 md:h-80 bg-cover bg-center relative overflow-hidden
          ${isDisabled ? '' : 'cursor-pointer'}
        `}
        style={{ 
          backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.3s ease'
        }}
        onClick={handleViewDetails}
      >
        {/* Image gradient overlay for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Highlight badge */}
        {isHighlighted && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-red-900 to-red-800 text-white text-xs px-2 py-1 rounded-md shadow-lg shadow-red-900/30">
            ویژه
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col min-h-0 bg-gray-900">
        <h3 
          className={`font-bold text-lg truncate ${isDisabled ? 'text-gray-400' : 'cursor-pointer text-gray-200 hover:text-red-300 transition-colors duration-300'}`}
          onClick={handleViewDetails}
        >
          {name}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-1">{description}</p>
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-800">
          <span className="font-bold text-base text-red-500">{price.toFixed(2)} تومان</span>
          <div className="flex gap-2">
            {!isDisabled && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#7f1d1d" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAddToCart}
                  className="bg-red-900 hover:bg-red-800 text-white p-1.5 rounded-full w-8 h-8 flex items-center justify-center shadow-md shadow-red-900/20 transition-all duration-200"
                  aria-label={`افزودن ${name} به سبد خرید`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#27272a" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleViewDetails}
                  className="bg-gray-800 hover:bg-gray-700 text-white p-1.5 rounded-full w-8 h-8 flex items-center justify-center shadow-md shadow-black/20 transition-all duration-200"
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