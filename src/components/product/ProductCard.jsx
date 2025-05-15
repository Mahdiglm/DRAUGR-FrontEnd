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
      className={`bg-midnight rounded-md overflow-hidden shadow-lg h-full flex flex-col border-t border-draugr-500/30
        ${isHighlighted ? 'shadow-horror' : 'shadow-md shadow-black/50'}
        ${isDisabled ? 'pointer-events-none opacity-70' : 'cursor-pointer'}
        transform-gpu
      `}
    >
      <div 
        className={`relative overflow-hidden ${isDisabled ? '' : 'cursor-pointer'}`}
        onClick={handleViewDetails}
      >
        {/* Product image with proper aspect ratio preservation */}
        <div className="aspect-[4/3] w-full overflow-hidden bg-charcoal">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name}
              className="w-full h-full object-contain transform-gpu transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-charcoal text-bone/50">
              No Image
            </div>
          )}
        </div>
        
        {/* Image overlay with red gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-50 pointer-events-none"></div>
        
        {/* Red border accent on top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-draugr-700 via-draugr-500 to-draugr-700"></div>
        
        {/* Highlighted badge */}
        {isHighlighted && (
          <div className="absolute top-2 right-2 bg-draugr-700 text-bone text-xs px-2 py-1 rounded-sm shadow-md">
            ویژه
          </div>
        )}
      </div>
      
      <div className="p-3 flex-grow flex flex-col min-h-0 bg-charcoal">
        <h3 
          className={`font-bold text-lg truncate mb-1
            ${isDisabled ? 'text-bone/70' : 'cursor-pointer text-bone hover:text-draugr-300 transition-colors duration-300'}`}
          onClick={handleViewDetails}
        >
          {name}
        </h3>
        
        <p className="text-bone/60 text-sm mb-3 line-clamp-1">{description}</p>
        
        <div className="mt-auto flex justify-between items-center">
          <span className="font-bold text-base text-draugr-300">{price.toFixed(2)} تومان</span>
          
          <div className="flex gap-2">
            {!isDisabled && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="bg-draugr-600 hover:bg-draugr-700 text-bone p-1.5 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-300"
                  aria-label={`افزودن ${name} به سبد خرید`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewDetails}
                  className="bg-ash hover:bg-gray-800 text-bone p-1.5 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-300"
                  aria-label={`مشاهده جزئیات ${name}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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