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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`bg-midnight border border-draugr-800 dark:border-draugr-900 rounded-lg overflow-hidden 
        ${isHighlighted ? 'shadow-horror' : 'shadow-lg shadow-black/30'}
        ${isDisabled ? 'pointer-events-none opacity-70' : 'cursor-pointer'}
        transform-gpu h-full flex flex-col relative
      `}
    >
      {/* Flickering candle effect for highlighted products */}
      {isHighlighted && (
        <div className="absolute inset-0 bg-gradient-to-b from-draugr-900/30 to-transparent opacity-0 animate-flicker z-10"></div>
      )}
      
      {/* Image container with proper object-fit to ensure full image display */}
      <div 
        className={`relative w-full h-64 sm:h-72 md:h-80 overflow-hidden group
          ${isDisabled ? '' : 'cursor-pointer'}
        `}
        onClick={handleViewDetails}
      >
        {/* Blood drip effect at top of card */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-draugr-600 z-20"></div>
        <div className="absolute top-1 left-1/4 w-px h-3 bg-draugr-700 animate-pulse z-20"></div>
        <div className="absolute top-1 right-1/3 w-px h-2 bg-draugr-700 animate-pulse z-20"></div>
        
        {/* Main product image with object-fit to ensure proper display */}
        <div 
          className="w-full h-full transition-all duration-500"
          style={{ 
            backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        {/* Layered overlays for horror effect */}
        <div className="absolute inset-0 bg-vampire-gradient opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-10"></div>
        <div className="absolute inset-0 bg-blood-texture opacity-20 mix-blend-overlay"></div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-midnight opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-midnight via-transparent to-midnight opacity-30"></div>
        
        {/* Highlight badge with flickering effect */}
        {isHighlighted && (
          <div className="absolute top-3 right-3 bg-draugr-800 text-bone text-xs px-2 py-1 rounded shadow-md animate-pulse-slow z-20 backdrop-blur-sm">
            ویژه
          </div>
        )}
      </div>

      {/* Product details with horror theme */}
      <div className="p-3 flex-grow flex flex-col min-h-0 bg-gradient-to-b from-charcoal to-midnight">
        {/* Product name with text effect */}
        <h3 
          className={`font-bold text-lg truncate mb-1
            ${isDisabled ? 'text-gray-400' : 'text-bone hover:text-draugr-200 transition-colors duration-300'}
            ${isHighlighted ? 'text-shadow-vampire' : ''}
          `}
          onClick={handleViewDetails}
        >
          {name}
        </h3>
        
        {/* Product description with fade effect */}
        <AnimatePresence>
          <motion.p 
            className="text-gray-400 text-sm mb-3 line-clamp-2"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            {description}
          </motion.p>
        </AnimatePresence>
        
        {/* Price and buttons */}
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-draugr-900/30">
          {/* Price with blood color */}
          <span className="font-bold text-base text-draugr-300">{price.toLocaleString()} تومان</span>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            {!isDisabled && (
              <>
                {/* Add to cart button */}
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: '#8B0000' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="bg-vampire-primary text-bone p-1.5 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-300 shadow-md"
                  aria-label={`افزودن ${name} به سبد خرید`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </motion.button>
                
                {/* View details button */}
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: '#330000' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewDetails}
                  className="bg-midnight text-bone p-1.5 rounded-full w-8 h-8 flex items-center justify-center border border-draugr-800/50 transition-colors duration-300 shadow-md"
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