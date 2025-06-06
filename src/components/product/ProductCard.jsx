import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, isHighlighted = false, isDisabled = false, inSlider = false }) => {
  const navigate = useNavigate();
  
  // Handle various product structures (API vs mock data)
  const productId = product._id || product.id;
  const productName = product.name || 'Unknown Product';
  const productDescription = product.description || '';
  const productPrice = product.price || 0;
  
  // Handle different image structures
  let imageUrl;
  if (product.images && product.images.length > 0) {
    // MongoDB structure
    imageUrl = product.images[0].url;
  } else if (product.imageUrl) {
    // Mock data structure
    imageUrl = product.imageUrl;
  } else {
    // Fallback
    imageUrl = 'https://via.placeholder.com/400x400?text=No+Image';
  }
  
  // Debug log only in development mode with throttling
  if (import.meta.env.DEV && Math.random() < 0.01) {
    console.log('Product card:', productName);
  }

  const handleViewDetails = () => {
    if (isDisabled) return;
    
    // Set scroll behavior to auto for instant scrolling
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Force scroll to top before navigation
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    
    // Navigate to product detail
    navigate(`/product/${productId}`);
    
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

  // Special styling for slider cards
  const sliderStyles = inSlider ? {
    boxShadow: isHighlighted 
      ? "0 10px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(220, 38, 38, 0.35)" 
      : "0 5px 15px rgba(0, 0, 0, 0.3)",
    border: "none",
    borderRadius: "1rem",
    overflow: "hidden",
  } : {
    boxShadow: isHighlighted 
      ? "0 0 0 1px #dc2626, 0 0 8px 0 rgba(220, 38, 38, 0.5)" 
      : "0 0 0 1px #991b1b, 0 0 5px 0 rgba(153, 27, 27, 0.3)"
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
      style={sliderStyles}
      className={`bg-gradient-to-b ${inSlider ? 'from-[#1c0b0f] to-black' : 'from-black to-black'} rounded-lg overflow-hidden h-full flex flex-col relative
        ${isDisabled ? 'pointer-events-none opacity-80' : 'cursor-pointer'}
        transform-gpu
        ${inSlider ? '' : 'before:absolute before:inset-0 before:rounded-lg before:pointer-events-none hover:before:border before:border-red-600 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300'}
      `}
    >
      <div 
        className={`${inSlider ? 'h-48 sm:h-56 md:h-64' : 'h-64 sm:h-72 md:h-80'} bg-cover bg-center relative overflow-hidden
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
        <div className={`absolute inset-0 ${inSlider ? 'bg-gradient-to-t from-[#1c0b0f]/90 via-black/40 to-transparent' : 'bg-gradient-to-t from-red-950/70 via-black/40 to-transparent opacity-0 hover:opacity-100'} transition-opacity duration-300`}></div>
        
        {/* Highlight badge */}
        {isHighlighted && (
          <div className={`absolute top-2 right-2 ${inSlider ? 'bg-gradient-to-r from-[#8b1d2c] to-[#5c0d19] text-white' : 'bg-gradient-to-r from-red-700 to-red-900 text-white'} text-xs px-2 py-1 rounded-md shadow-lg shadow-red-800/30`}>
            ویژه
          </div>
        )}
      </div>
      <div className={`p-4 flex-grow flex flex-col min-h-0 ${inSlider ? 'bg-gradient-to-b from-[#1c0b0f]/70 to-black' : 'bg-black'}`}>
        <h3 
          className={`font-bold text-lg truncate ${isDisabled ? 'text-gray-400' : `cursor-pointer ${inSlider ? 'text-[#e8a9b1] hover:text-[#f4cbd0]' : 'text-red-50 hover:text-red-400'} transition-colors duration-300`}`}
          onClick={handleViewDetails}
        >
          {productName}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-1">{productDescription}</p>
        <div className={`flex justify-between items-center mt-auto pt-2 ${inSlider ? 'border-t border-[#3c171e]/50' : 'border-t border-red-800'}`}>
          <span className={`font-bold text-base ${inSlider ? 'text-[#d64356]' : 'text-red-500'}`}>{productPrice.toFixed(2)} تومان</span>
          <div className="flex gap-2">
            {!isDisabled && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: inSlider ? "#c42b3b" : "#dc2626" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAddToCart}
                  className={`${inSlider ? 'bg-[#a11d2b] hover:bg-[#b8242f]' : 'bg-red-700 hover:bg-red-600'} text-white p-1.5 rounded-full w-8 h-8 flex items-center justify-center shadow-md shadow-black/30 transition-all duration-200`}
                  aria-label={`افزودن ${productName} به سبد خرید`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: inSlider ? "#7c141e" : "#7f1d1d" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleViewDetails}
                  className={`${inSlider ? 'bg-[#60111a] hover:bg-[#701319]' : 'bg-red-900 hover:bg-red-800'} text-white p-1.5 rounded-full w-8 h-8 flex items-center justify-center shadow-md shadow-black/30 transition-all duration-200`}
                  aria-label={`مشاهده جزئیات ${productName}`}
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