import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimationControls, animate, useTime, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '../../utils/mockData';
import { isLowPerformanceDevice } from '../../utils/animationHelpers';

const CategoryWheel = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const containerRef = useRef(null);
  
  // Check device performance on mount
  useEffect(() => {
    setIsLowPerformance(isLowPerformanceDevice());
  }, []);
  
  // Use Framer Motion's time utility for continuous animation
  const time = useTime();
  // Transform time to rotation (slower or faster based on performance)
  const rotation = useTransform(
    time,
    (time) => time / (isLowPerformance ? 25 : 20)
  );

  // Calculate positions on an ellipse
  const getEllipsePosition = (index, totalItems, rotation) => {
    // Add the rotation value to create continuous movement
    const angle = ((index / totalItems) * 2 * Math.PI) + rotation;
    
    // Ellipse parameters (horizontal radius, vertical radius)
    const a = 130; // horizontal radius
    const b = 70;  // vertical radius
    
    const x = a * Math.cos(angle);
    const y = b * Math.sin(angle);
    
    // Calculate scale based on y position for depth effect
    // Items at the "back" of the ellipse (positive y) should be smaller
    const scale = 1 - (y / b) * 0.2;
    const zIndex = Math.round(100 - (y / b) * 50);
    
    // Determine if this item is at the front (bottom of ellipse)
    // This is approximately when y is at its minimum (most negative)
    const isFront = y < -b * 0.8;
    
    return { x, y, scale, zIndex, isFront };
  };

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
    <div 
      className="py-12 relative"
      ref={containerRef}
    >
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-shadow-horror">دسته‌بندی‌ها</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-draugr-900/40 via-draugr-500 to-draugr-900/40 mx-auto mt-2 rounded-full"></div>
      </div>
      
      <div className="relative h-[250px] mx-auto max-w-3xl select-none">
        {/* Category Items */}
        {categories.map((category, index) => {
          // Get position based on current rotation value
          const { x, y, scale, zIndex, isFront } = getEllipsePosition(
            index, 
            categories.length,
            rotation.get() // Get current rotation value
          );
          
          return (
            <motion.div
              key={category.id}
              className="absolute origin-center cursor-pointer"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                zIndex,
                filter: y > 0 ? 'brightness(0.7)' : 'brightness(1)'
              }}
              animate={{
                x,
                y,
                scale,
              }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 100,
                duration: 0.2
              }}
            >
              <Link 
                to={`/shop?category=${category.slug}`}
                className={`flex flex-col items-center justify-center h-24 w-24 md:h-28 md:w-28 rounded-2xl backdrop-blur-md ${
                  isFront 
                    ? 'bg-gradient-to-br from-draugr-800/90 to-draugr-900/90 shadow-horror scale-110 border-2 border-draugr-500/40'
                    : 'bg-gradient-to-br from-gray-900/70 to-black/70 shadow-md border border-gray-700/30'
                }`}
              >
                <div className="text-3xl mb-1">{getCategoryIcon(category.slug)}</div>
                <span className={`text-sm md:text-base font-medium ${isFront ? 'text-white' : 'text-gray-300'}`}>
                  {category.name}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryWheel; 