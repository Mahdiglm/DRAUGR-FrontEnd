import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  const { id, name, description, price, imageUrl } = product;
  const navigate = useNavigate();

  const handleViewDetails = () => {
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
      whileHover={{ y: -10 }}
      className="bg-white rounded-lg overflow-hidden shadow-lg h-full flex flex-col"
    >
      <div 
        className="h-52 sm:h-64 md:h-72 bg-cover bg-center cursor-pointer relative overflow-hidden" 
        style={{ 
          backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        onClick={handleViewDetails}
      >
        {/* Image gradient overlay for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-3 sm:p-4 flex-grow flex flex-col">
        <h3 
          className="font-bold text-lg sm:text-xl mb-1 cursor-pointer text-draugr-900 hover:text-draugr-600 transition-colors duration-300 line-clamp-1"
          onClick={handleViewDetails}
        >
          {name}
        </h3>
        <p className="text-gray-700 text-sm sm:text-base mb-2 sm:mb-3 flex-grow line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="font-bold text-base sm:text-xl">{price.toFixed(2)} تومان</span>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="bg-black text-white p-2 rounded-full w-9 h-9 flex items-center justify-center"
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
              className="bg-draugr-800 text-white p-2 rounded-full w-9 h-9 flex items-center justify-center"
              aria-label={`مشاهده جزئیات ${name}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 