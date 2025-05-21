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
      <div className="text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">دسته‌بندی‌ها</h2>
        <div className="h-px w-16 bg-draugr-500/60 mx-auto mt-2"></div>
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
    [1.05, 1, 0.85]
  );
  
  const opacity = useTransform(
    y,
    [-ellipseB, 0, ellipseB],
    [1, 0.9, 0.7]
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
        opacity
      }}
      className="absolute origin-center cursor-pointer"
    >
      <Link 
        to={`/shop?category=${category.slug}`}
        className="block"
      >
        <motion.div 
          className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 relative"
          whileHover={{ scale: 1.05 }}
        >
          {/* Background circle with conditional styling */}
          <motion.div
            style={{
              backgroundColor: useTransform(isFront, (front) => 
                front ? 'rgba(30, 30, 30, 0.8)' : 'rgba(20, 20, 20, 0.5)'
              ),
              borderColor: useTransform(isFront, (front) => 
                front ? 'rgba(255, 0, 0, 0.3)' : 'rgba(70, 70, 70, 0.2)'
              ),
              boxShadow: useTransform(isFront, (front) => 
                front ? '0 4px 20px rgba(255, 0, 0, 0.12)' : 'none'
              ),
            }}
            className="absolute inset-0 rounded-full border backdrop-blur-sm"
          />
          
          {/* Front indicator line */}
          <motion.div
            style={{
              opacity: useTransform(isFront, (front) => front ? 1 : 0),
              width: useTransform(isFront, (front) => front ? '30px' : '0px'),
            }}
            className="absolute -bottom-5 h-px bg-draugr-500"
            transition={{ duration: 0.2 }}
          />
          
          {/* Icon and text */}
          <div className="text-2xl mb-1 relative z-10">{getCategoryIcon(category.slug)}</div>
          <motion.span 
            className="text-xs md:text-sm font-medium relative z-10 tracking-wide"
            style={{
              color: useTransform(isFront, (front) => 
                front ? 'rgba(255, 255, 255, 0.95)' : 'rgba(210, 210, 210, 0.8)'
              )
            }}
          >
            {category.name}
          </motion.span>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default CategoryWheel; 