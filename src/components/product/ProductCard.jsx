import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onAddToCart }) => {
  const { id, name, description, price, imageUrl } = product;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-lg overflow-hidden shadow-lg h-full flex flex-col"
    >
      <div 
        className="h-48 sm:h-56 md:h-64 bg-cover bg-center" 
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' }}
      ></div>
      <div className="p-4 sm:p-6 flex-grow flex flex-col">
        <h3 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2">{name}</h3>
        <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4 flex-grow line-clamp-3">{description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="font-bold text-base sm:text-xl">{price.toFixed(2)} تومان</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToCart(product)}
            className="bg-black text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-md"
            aria-label={`افزودن ${name} به سبد خرید`}
          >
            افزودن به سبد
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 