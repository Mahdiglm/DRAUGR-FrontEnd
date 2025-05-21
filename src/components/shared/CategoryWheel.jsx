import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '../../utils/mockData';
import { isLowPerformanceDevice } from '../../utils/animationHelpers';

const CategoryWheel = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  
  // Check device performance on mount
  useEffect(() => {
    setIsLowPerformance(isLowPerformanceDevice());
  }, []);

  // Category card icons (simple icons for each category)
  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'weapons':
        return '⚔️';
      case 'armor':
        return '🛡️';
      case 'potions':
        return '🧪';
      case 'magic':
        return '✨';
      case 'accessories':
        return '📿';
      case 'rare_books':
        return '📚';
      default:
        return '🔍';
    }
  };

  return (
    <div className="py-12 relative">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-shadow-horror">دسته‌بندی‌ها</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-draugr-900/40 via-draugr-500 to-draugr-900/40 mx-auto mt-2 rounded-full"></div>
      </div>
      
      <div className="relative h-[250px] mx-auto max-w-3xl flex items-center justify-center">
        {categories.map((category, index) => {
          // Determine rotation duration based on performance
          const duration = isLowPerformance ? 20 + index : 15 + index;
          
          return (
            <motion.div
              key={category.id}
              className="absolute"
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                rotate: {
                  repeat: Infinity,
                  duration,
                  ease: "linear"
                }
              }}
              style={{
                width: '260px', 
                height: '140px',
                transformOrigin: 'center center'
              }}
            >
              <div 
                className="absolute" 
                style={{ 
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              >
                <Link 
                  to={`/shop?category=${category.slug}`}
                  className="flex flex-col items-center justify-center h-24 w-24 md:h-28 md:w-28 rounded-2xl backdrop-blur-md bg-gradient-to-br from-gray-900/70 to-black/70 shadow-md border border-gray-700/30"
                >
                  <div className="text-3xl mb-1">{getCategoryIcon(category.slug)}</div>
                  <span className="text-sm md:text-base font-medium text-gray-300">
                    {category.name}
                  </span>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryWheel; 