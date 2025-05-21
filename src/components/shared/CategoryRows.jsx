import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimationControls, animate, useTime, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '../../utils/mockData';
import { isLowPerformanceDevice } from '../../utils/animationHelpers';
import accessoriesIcon from '../../assets/accessories-icon.png';

// Sample category data - in real implementation, this would come from an API or props
const categoryRows = [
  { id: 1, name: 'اکسسوری', slug: 'accessories', icon: accessoriesIcon, direction: 'left' },
  { id: 2, name: 'کتاب‌ها', slug: 'books', icon: null, direction: 'right' },
  { id: 3, name: 'دکوراسیون', slug: 'decoration', icon: null, direction: 'left' },
  { id: 4, name: 'سلاح‌ها', slug: 'weapons', icon: null, direction: 'right' },
  { id: 5, name: 'زره‌ها', slug: 'armor', icon: null, direction: 'left' },
  { id: 6, name: 'معجون‌ها', slug: 'potions', icon: null, direction: 'right' },
  { id: 7, name: 'طلسم‌ها', slug: 'spells', icon: null, direction: 'left' },
  { id: 8, name: 'نوشیدنی‌ها', slug: 'drinks', icon: null, direction: 'right' },
  { id: 9, name: 'لباس‌ها', slug: 'clothing', icon: null, direction: 'left' },
  { id: 10, name: 'هدایا', slug: 'gifts', icon: null, direction: 'right' },
];

// Placeholder icon if custom icon isn't available yet
const getPlaceholderIcon = (category) => {
  switch (category) {
    case 'accessories':
      return null; // We already have a custom icon for this
    case 'books':
      return '📚';
    case 'decoration':
      return '🏺';
    case 'weapons':
      return '⚔️';
    case 'armor':
      return '🛡️';
    case 'potions':
      return '🧪';
    case 'spells':
      return '✨';
    case 'drinks':
      return '🍹';
    case 'clothing':
      return '👕';
    case 'gifts':
      return '🎁';
    default:
      return '🔍';
  }
};

const CategoryRows = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  
  // Check device performance on mount
  useEffect(() => {
    setIsLowPerformance(isLowPerformanceDevice());
  }, []);
  
  return (
    <div className="py-12 relative">
      {/* Section title */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-shadow-horror">دسته‌بندی‌ها</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-draugr-900/40 via-draugr-500 to-draugr-900/40 mx-auto mt-2 rounded-full"></div>
      </div>
      
      {/* Scrolling rows */}
      <div className="space-y-8 overflow-hidden">
        {categoryRows.map((row) => (
          <CategoryRow 
            key={row.id}
            category={row}
            isLowPerformance={isLowPerformance}
          />
        ))}
      </div>
    </div>
  );
};

const CategoryRow = ({ category, isLowPerformance }) => {
  // Use time for continuous animation
  const time = useTime();
  
  // Create different animation duration for each direction
  // This adds visual interest as rows move at slightly different speeds
  const baseSpeed = isLowPerformance ? 120 : 80; // seconds for one full cycle (slower on low-performance devices)
  const speed = category.id % 3 === 0 ? baseSpeed : 
               category.id % 2 === 0 ? baseSpeed * 1.2 : baseSpeed * 0.8;
  
  // Determine scroll direction and create animation
  const x = useTransform(
    time,
    (time) => {
      const progress = (time % (speed * 1000)) / (speed * 1000);
      return category.direction === 'left' 
        ? `${-100 * progress}%`  // Move left
        : `${100 * (1 - progress)}%`;  // Move right
    }
  );
  
  // Create duplicated items for continuous scrolling effect
  const items = Array(10).fill(category);
  
  return (
    <div className="relative overflow-hidden py-2">
      {/* Main row - animated */}
      <motion.div 
        className="flex items-center"
        style={{ x }}
      >
        <div className="flex items-center whitespace-nowrap">
          {items.map((item, index) => (
            <CategoryItem 
              key={`${item.id}-${index}`}
              category={item}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const CategoryItem = ({ category }) => {
  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="inline-flex flex-col items-center justify-center mx-4 group"
    >
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-900/70 to-black/70 backdrop-blur-md border border-gray-700/30 group-hover:border-draugr-500/40 transition-all duration-300 mb-2">
        {category.icon ? (
          <img src={category.icon} alt={category.name} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
        ) : (
          <span className="text-3xl">{getPlaceholderIcon(category.slug)}</span>
        )}
      </div>
      <span className="text-sm md:text-base text-gray-300 group-hover:text-white transition-colors duration-300">
        {category.name}
      </span>
    </Link>
  );
};

export default CategoryRows; 