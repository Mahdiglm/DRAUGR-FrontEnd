import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls, useTime, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '../../utils/mockData';
import { isLowPerformanceDevice } from '../../utils/animationHelpers';

// Enhanced category data with proper icons and descriptions
const enhancedCategories = [
  { 
    id: 1, 
    name: 'سلاح‌ها', 
    slug: 'weapons', 
    icon: '⚔️',
    description: 'سلاح‌های افسانه‌ای',
    bgColor: 'from-red-900/40 to-gray-900/40',
    borderColor: 'border-red-900/30'
  },
  { 
    id: 2, 
    name: 'زره‌ها', 
    slug: 'armor', 
    icon: '🛡️',
    description: 'محافظت در برابر تاریکی',
    bgColor: 'from-blue-900/40 to-gray-900/40', 
    borderColor: 'border-blue-900/30'
  },
  { 
    id: 3, 
    name: 'معجون‌ها', 
    slug: 'potions', 
    icon: '🧪',
    description: 'اکسیرهای قدرتمند',
    bgColor: 'from-purple-900/40 to-gray-900/40',
    borderColor: 'border-purple-900/30'
  },
  { 
    id: 4, 
    name: 'اقلام جادویی', 
    slug: 'magic', 
    icon: '✨',
    description: 'ابزارهای جادویی',
    bgColor: 'from-indigo-900/40 to-gray-900/40',
    borderColor: 'border-indigo-900/30'
  },
  { 
    id: 5, 
    name: 'اکسسوری', 
    slug: 'accessories', 
    icon: '🔮',
    description: 'زیورآلات منحصر به فرد',
    bgColor: 'from-emerald-900/40 to-gray-900/40',
    borderColor: 'border-emerald-900/30'
  },
  { 
    id: 6, 
    name: 'کتاب‌های نایاب', 
    slug: 'rare_books', 
    icon: '📚',
    description: 'دانش باستانی',
    bgColor: 'from-amber-900/40 to-gray-900/40',
    borderColor: 'border-amber-900/30'
  },
  { 
    id: 7, 
    name: 'نوشیدنی‌ها', 
    slug: 'drinks', 
    icon: '🍹',
    description: 'نوشیدنی‌های اسرارآمیز',
    bgColor: 'from-teal-900/40 to-gray-900/40',
    borderColor: 'border-teal-900/30'
  },
  { 
    id: 8, 
    name: 'طلسم‌ها', 
    slug: 'spells', 
    icon: '🔥',
    description: 'طلسم‌های قدرتمند',
    bgColor: 'from-rose-900/40 to-gray-900/40',
    borderColor: 'border-rose-900/30'
  },
];

const CategoryRows = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Check device performance on mount
  useEffect(() => {
    setIsLowPerformance(isLowPerformanceDevice());
  }, []);
  
  return (
    <div className="py-10 md:py-16 relative">
      {/* Section header with simplified styling */}
      <div className="text-center mb-8">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-white mb-3"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="text-draugr-500">دسته‌بندی‌های</span> محصولات
        </motion.h2>
        
        <motion.p
          className="text-gray-400 max-w-2xl mx-auto mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          مجموعه‌های اختصاصی ما را کاوش کنید
        </motion.p>
        
        {/* Search input - simplified */}
        <motion.div 
          className="flex justify-center mb-8 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="جستجوی دسته‌بندی..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/30 border border-gray-800 rounded-full px-5 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-draugr-500/50 focus:border-draugr-500 w-full"
            />
            <div className="absolute left-3 top-2.5 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Circular loop categories */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden perspective-1000 mx-auto max-w-7xl">
        <CircularCategoryLoop 
          categories={enhancedCategories.filter(cat => 
            cat.name.includes(searchTerm) || 
            cat.description.includes(searchTerm)
          )}
          isLowPerformance={isLowPerformance}
        />
      </div>
      
      {/* View all categories button - simplified */}
      <div className="text-center mt-12">
        <Link to="/shop">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-gradient-to-r from-draugr-800 to-draugr-700 text-white px-8 py-3 rounded-md
                     border border-draugr-600/30 mx-auto"
          >
            <span>مشاهده همه محصولات</span>
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

// Circular Category Loop Animation
const CircularCategoryLoop = ({ categories, isLowPerformance }) => {
  const time = useTime();
  const containerRef = useRef(null);
  const radius = 200; // Base radius of the ellipse
  const duration = isLowPerformance ? 30 : 25; // Seconds for a full rotation
  const itemsCount = 16; // Number of items to display along the path
  
  // Duplicate categories to ensure enough items
  const duplicatedCategories = [...categories, ...categories, ...categories, ...categories].slice(0, itemsCount);
  
  return (
    <div 
      className="h-full w-full relative" 
      ref={containerRef}
      style={{ perspective: '1000px' }}
    >
      {/* Center point for the ellipse */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0">
        {duplicatedCategories.map((category, index) => (
          <CircularItem 
            key={`${category.id}-${index}`}
            category={category}
            index={index}
            totalItems={itemsCount}
            time={time}
            duration={duration}
            radius={radius}
            isLowPerformance={isLowPerformance}
          />
        ))}
      </div>
    </div>
  );
};

// Individual item on circular path
const CircularItem = ({ category, index, totalItems, time, duration, radius, isLowPerformance }) => {
  // Calculate position along the ellipse
  const position = useTransform(
    time,
    (time) => {
      const cycleProgress = (time % (duration * 1000)) / (duration * 1000);
      // Offset each item by its position in the array
      const itemProgress = (cycleProgress + index / totalItems) % 1;
      
      // Convert to radians (full circle = 2π)
      const angle = itemProgress * 2 * Math.PI;
      
      // Calculate 3D position on an ellipse
      // We're making the ellipse wider than tall (2:1 ratio)
      const x = Math.cos(angle) * radius * 2;
      const y = Math.sin(angle) * radius * 0.6;
      // Z coordinate for 3D effect - items further away are "smaller"
      const z = Math.sin(angle) * radius;
      
      return { x, y, z, angle };
    }
  );
  
  // Scale based on z position (depth)
  const scale = useTransform(
    position, 
    ({ z }) => {
      // Items in front are larger, items in back are smaller
      const depthScale = mapRange(z, -radius, radius, 0.7, 1.3);
      return depthScale;
    }
  );
  
  // Opacity based on position (items at the back are more transparent)
  const opacity = useTransform(
    position,
    ({ z }) => {
      return mapRange(z, -radius, radius, 0.4, 1);
    }
  );
  
  // Z-index based on position (items in front appear above others)
  const zIndex = useTransform(
    position,
    ({ z }) => {
      return Math.round(mapRange(z, -radius, radius, 1, 100));
    }
  );
  
  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{
        x: useTransform(position, p => p.x),
        y: useTransform(position, p => p.y),
        z: useTransform(position, p => p.z),
        scale,
        opacity,
        zIndex,
        transformStyle: 'preserve-3d',
      }}
    >
      <CategoryItem 
        category={category}
        isLowPerformance={isLowPerformance}
      />
    </motion.div>
  );
};

// Helper function to map values from one range to another
const mapRange = (value, fromMin, fromMax, toMin, toMax) => {
  // Ensure value is within source range
  const clampedValue = Math.max(fromMin, Math.min(value, fromMax));
  
  // Calculate the percentage in the source range
  const percentage = (clampedValue - fromMin) / (fromMax - fromMin);
  
  // Map to the target range
  return toMin + percentage * (toMax - toMin);
};

// Individual category item - simplified design
const CategoryItem = ({ category, isLowPerformance }) => {
  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="inline-flex flex-col items-center justify-center mx-2 group"
    >
      <div className="w-16 h-16 rounded-full flex items-center justify-center 
                     bg-gradient-to-br from-gray-900/70 to-black/70 backdrop-blur-sm 
                     border border-gray-800/30 group-hover:border-draugr-500/40 
                     transition-all duration-300 mb-2">
        <span className="text-3xl">{category.icon}</span>
      </div>
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300 text-center whitespace-nowrap">
        {category.name}
      </span>
      <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300 text-center whitespace-nowrap">
        {category.description}
      </span>
    </Link>
  );
};

export default CategoryRows;