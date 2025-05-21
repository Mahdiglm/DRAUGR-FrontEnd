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
  
  // Category card icons
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
    <div className="py-12 relative" ref={containerRef}>
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-shadow-horror">دسته‌بندی‌ها</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-draugr-900/40 via-draugr-500 to-draugr-900/40 mx-auto mt-2 rounded-full"></div>
      </div>
      
      <div className="relative h-[250px] mx-auto max-w-3xl select-none">
        <RotatingCategories 
          categories={categories} 
          isLowPerformance={isLowPerformance}
          getCategoryIcon={getCategoryIcon} 
        />
      </div>
    </div>
  );
};

// Separated rotating mechanism into its own component
const RotatingCategories = ({ categories, isLowPerformance, getCategoryIcon }) => {
  // Use Framer Motion's time utility for continuous animation
  const time = useTime();
  // Transform time to rotation (slower or faster based on performance)
  const rotation = useTransform(
    time,
    (value) => value / (isLowPerformance ? 15000 : 10000) * Math.PI * 2
  );
  
  return (
    <>
      {categories.map((category, index) => (
        <CategoryItem 
          key={category.id}
          category={category}
          index={index}
          totalItems={categories.length}
          rotation={rotation}
          getCategoryIcon={getCategoryIcon}
        />
      ))}
    </>
  );
};

const CategoryItem = ({ category, index, totalItems, rotation, getCategoryIcon }) => {
  // Calculate position on ellipse
  const ellipseA = 130; // horizontal radius
  const ellipseB = 70;  // vertical radius
  
  // Calculate the position dynamically based on rotation
  const angle = useTransform(
    rotation,
    (r) => ((index / totalItems) * 2 * Math.PI) + r
  );
  
  // Create reactive values for x, y, and scale
  const x = useTransform(
    angle,
    (a) => ellipseA * Math.cos(a)
  );
  
  const y = useTransform(
    angle,
    (a) => ellipseB * Math.sin(a)
  );
  
  const scale = useTransform(
    y,
    [-ellipseB, 0, ellipseB],
    [1.1, 1, 0.8]
  );
  
  const brightness = useTransform(
    y,
    [-ellipseB, ellipseB],
    [1, 0.7]
  );
  
  const zIndex = useTransform(
    y,
    [-ellipseB, ellipseB],
    [100, 1]
  );
  
  // Determine if this item is at the front (bottom of ellipse)
  const isFront = useTransform(
    y,
    (yValue) => yValue < -ellipseB * 0.8
  );
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        x,
        y,
        scale,
        zIndex,
        filter: useTransform(brightness, (b) => `brightness(${b})`)
      }}
      className="absolute origin-center cursor-pointer"
    >
      <motion.div style={{ scale }}>
        <Link 
          to={`/shop?category=${category.slug}`}
          className="flex flex-col items-center justify-center h-24 w-24 md:h-28 md:w-28 rounded-2xl backdrop-blur-md bg-gradient-to-br from-gray-900/70 to-black/70 shadow-md border border-gray-700/30"
        >
          <motion.div
            style={{
              background: useTransform(isFront, (front) => 
                front 
                  ? 'linear-gradient(to bottom right, rgba(153, 0, 0, 0.9), rgba(102, 0, 0, 0.9))' 
                  : 'none'
              ),
              borderColor: useTransform(isFront, (front) => 
                front ? 'rgba(255, 0, 0, 0.4)' : 'rgba(75, 75, 75, 0.3)'
              ),
              borderWidth: useTransform(isFront, (front) => front ? '2px' : '1px'),
              boxShadow: useTransform(isFront, (front) => 
                front ? '0 4px 14px 0 rgba(255, 0, 0, 0.3)' : 'none'
              )
            }}
            className="absolute inset-0 rounded-2xl"
          />
          <div className="text-3xl mb-1 relative z-10">{getCategoryIcon(category.slug)}</div>
          <motion.span 
            className="text-sm md:text-base font-medium relative z-10"
            style={{
              color: useTransform(isFront, (front) => 
                front ? 'rgba(255, 255, 255, 1)' : 'rgba(210, 210, 210, 0.8)'
              )
            }}
          >
            {category.name}
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default CategoryWheel; 