import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

const ProductList = ({ products, onAddToCart, title = "محصولات" }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Extract unique categories from products
  const categories = ['all', ...new Set(products.map(product => product.category))];
  
  // Define Persian translations for categories
  const categoryTranslations = {
    'all': 'همه',
    'weapons': 'سلاح‌ها',
    'armor': 'زره‌ها',
    'potions': 'معجون‌ها',
    'magic': 'اقلام جادویی'
  };
  
  // Filter products by category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="w-full max-w-full mx-auto px-4 py-8 sm:py-12">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">{title}</h2>
      
      {/* Category Filter */}
      <div className="flex justify-center mb-6 sm:mb-10 space-x-2 sm:space-x-4 overflow-x-auto pb-2 sm:pb-4 scrollbar-hide space-x-reverse">
        {categories.map(category => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm capitalize ${
              selectedCategory === category 
                ? 'bg-black text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {categoryTranslations[category] || category}
          </motion.button>
        ))}
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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
  );
};

export default ProductList; 