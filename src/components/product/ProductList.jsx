import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import productBackground from '../../assets/BackGround-Product.jpg';

const ProductList = ({ products = [], onAddToCart, title = "محصولات", backgroundType = null }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Extract unique categories from products
  const categories = ['all', ...new Set(products.map(product => product.category))];
  
  // Category translations for Persian display
  const categoryTranslations = {
    'all': 'همه',
    'clothing': 'پوشاک',
    'electronics': 'الکترونیک',
    'home': 'خانه',
    'accessories': 'لوازم جانبی',
    'books': 'کتاب',
  };
  
  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);
  
  // Get background styling if needed
  const getBackgroundStyling = () => {
    if (backgroundType === 'product') {
      return {
        style: {
          backgroundImage: `url(${productBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        },
        overlay: true
      };
    }
    return { style: {}, overlay: false };
  };
  
  const { style, overlay } = getBackgroundStyling();
  
  return (
    <div 
      className={`w-full max-w-full mx-auto px-4 py-8 sm:py-12 ${backgroundType ? 'relative overflow-hidden' : ''}`}
      style={style}
    >
      {overlay && (
        <>
          {/* Dark overlay for better readability */}
          <div className="absolute inset-0 bg-black bg-opacity-70 z-0"></div>
          
          {/* Bottom gradient overlay for smooth transition */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-32 z-0" 
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.95))',
              pointerEvents: 'none'
            }}
          ></div>
          
          {/* Subtle fog animations in background */}
          <div className="absolute inset-0 z-[1] opacity-20">
            <motion.div 
              className="absolute inset-0"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%']
              }}
              transition={{ 
                duration: 60, 
                ease: "linear", 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 2000 2000\' fill=\'none\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
                backgroundSize: '200% 200%'
              }}
            />
          </div>
        </>
      )}
      
      <div className={`${overlay ? 'relative z-10' : ''}`}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">{title}</h2>
        
        {/* Category Filter - Improved spacing */}
        <div className="flex flex-wrap justify-center mb-8 sm:mb-12 space-x-0 gap-3 sm:gap-4 md:gap-5 overflow-visible pb-4 pt-2 rtl">
          {categories.map(category => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm transition-all duration-300 min-w-[80px] sm:min-w-[100px] ${
                selectedCategory === category 
                  ? 'bg-black text-white font-medium shadow-md' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              whileHover={{ 
                scale: 1.05,
                y: 2 // Move down slightly when hovering
              }}
              whileTap={{ scale: 0.95 }}
            >
              {categoryTranslations[category] || category}
            </motion.button>
          ))}
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-8 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">محصولی در این دسته‌بندی یافت نشد.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList; 