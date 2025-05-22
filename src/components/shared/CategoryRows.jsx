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

// Subcategories data for side menus
const subcategories = [
  { id: 1, name: 'شمشیرهای افسانه‌ای', slug: 'swords', category: 'weapons' },
  { id: 2, name: 'تبرها و گرزها', slug: 'axes', category: 'weapons' },
  { id: 3, name: 'کمان‌های جادویی', slug: 'bows', category: 'weapons' },
  { id: 4, name: 'سپرهای محافظ', slug: 'shields', category: 'armor' },
  { id: 5, name: 'زره‌های سنگین', slug: 'heavy-armor', category: 'armor' },
  { id: 6, name: 'کلاهخودها', slug: 'helmets', category: 'armor' },
  { id: 7, name: 'معجون‌های درمانگر', slug: 'healing-potions', category: 'potions' },
  { id: 8, name: 'اکسیرهای نیرو', slug: 'power-potions', category: 'potions' },
  { id: 9, name: 'طلسم‌های آتش', slug: 'fire-spells', category: 'spells' },
  { id: 10, name: 'طلسم‌های یخ', slug: 'ice-spells', category: 'spells' },
  { id: 11, name: 'گردنبندهای قدرت', slug: 'necklaces', category: 'accessories' },
  { id: 12, name: 'انگشترهای جادویی', slug: 'rings', category: 'accessories' },
  { id: 13, name: 'کتاب‌های جادوگری', slug: 'magic-books', category: 'rare_books' },
  { id: 14, name: 'طومارهای باستانی', slug: 'scrolls', category: 'rare_books' },
  { id: 15, name: 'نوشیدنی‌های نیرو', slug: 'energy-drinks', category: 'drinks' },
  { id: 16, name: 'شربت‌های جادویی', slug: 'magic-drinks', category: 'drinks' },
];

// Tags for additional filtering
const popularTags = [
  { id: 1, name: 'پرفروش‌ترین', slug: 'bestsellers' },
  { id: 2, name: 'جدیدترین', slug: 'new-arrivals' },
  { id: 3, name: 'تخفیف‌دار', slug: 'on-sale' },
  { id: 4, name: 'ویژه ماجراجویان', slug: 'for-adventurers' },
  { id: 5, name: 'ویژه جادوگران', slug: 'for-wizards' },
  { id: 6, name: 'ویژه جنگجویان', slug: 'for-warriors' },
  { id: 7, name: 'محبوب کاربران', slug: 'popular' },
  { id: 8, name: 'پیشنهاد درائوگر', slug: 'recommended' }
];

const CategoryRows = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Check device performance on mount
  useEffect(() => {
    setIsLowPerformance(isLowPerformanceDevice());
  }, []);
  
  return (
    <div className="py-8 sm:py-12 md:py-16 w-full relative overflow-hidden">
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
      
      {/* Main content with side menus */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start">
          {/* Left side subcategories (2 columns going down) - Only visible on md+ screens */}
          <div className="hidden md:block w-full md:w-1/5 mb-6 md:mb-0">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {subcategories.slice(0, 8).map((subcat, index) => (
                <motion.div
                  key={subcat.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="mb-1"
                >
                  <Link 
                    to={`/shop?subcategory=${subcat.slug}`} 
                    className="text-sm block py-1 px-2 rounded hover:bg-gray-800/30 transition-colors duration-200 text-gray-300 hover:text-white"
                  >
                    {subcat.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Center circular category animation */}
          <div className="w-full md:w-3/5">
            <div className="flex justify-center items-center">
              <div className="relative w-full h-[300px] md:h-[400px] max-w-[900px] mx-auto overflow-hidden">
                <CircularCategoryLoop 
                  categories={enhancedCategories.filter(cat => 
                    cat.name.includes(searchTerm) || 
                    cat.description.includes(searchTerm)
                  )}
                  isLowPerformance={isLowPerformance}
                />
              </div>
            </div>
          </div>
          
          {/* Right side tags (2 columns going up) - Only visible on md+ screens */}
          <div className="hidden md:block w-full md:w-1/5 mb-6 md:mb-0">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {popularTags.slice(0, 8).map((tag, index) => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (8 - index) * 0.05, duration: 0.3 }}
                  className="mb-1"
                >
                  <Link 
                    to={`/shop?tag=${tag.slug}`} 
                    className="text-sm block py-1 px-2 rounded hover:bg-gray-800/30 transition-colors duration-200 text-gray-300 hover:text-white"
                  >
                    {tag.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile subcategories - horizontal scrolling for small screens */}
        <div className="md:hidden w-full mt-8 overflow-x-auto">
          <div className="flex space-x-2 pb-3 px-1 -space-x-3 rtl:space-x-reverse">
            {subcategories.slice(0, 8).map((subcat) => (
              <Link
                key={subcat.id}
                to={`/shop?subcategory=${subcat.slug}`}
                className="whitespace-nowrap flex-none px-3 py-1 bg-gray-800/30 rounded-full text-xs text-gray-300"
              >
                {subcat.name}
              </Link>
            ))}
          </div>
        </div>
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

// 2D Circular Category Loop Animation
const CircularCategoryLoop = ({ categories, isLowPerformance }) => {
  const time = useTime();
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  // Calculate appropriate radii based on container size
  // Reduced horizontal radius to bring items closer to center
  const radiusX = isMobile 
    ? Math.min(dimensions.width * 0.35, 160) 
    : Math.min(dimensions.width * 0.35, 250); // Reduced from 350 to 250
  
  // Reduced vertical radius but still keeping the height at edges
  const radiusY = isMobile 
    ? Math.min(dimensions.height * 0.3, 80) 
    : Math.min(dimensions.height * 0.45, 150); // Reduced from 180 to 150
  
  const duration = isLowPerformance ? 30 : 25; // Seconds for a full rotation
  
  // Responsive item count - 5 for mobile, 8 for desktop
  const itemsCount = isMobile ? 5 : 8;
  
  // Update dimensions and check if mobile on mount and on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth;
        const newHeight = containerRef.current.offsetHeight;
        
        setDimensions({
          width: newWidth,
          height: newHeight
        });
        
        // Check if mobile based on width (breakpoint at 768px)
        setIsMobile(window.innerWidth < 768);
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Duplicate categories to ensure enough items
  const duplicatedCategories = [...categories, ...categories].slice(0, itemsCount);
  
  return (
    <div 
      className="h-full w-full relative" 
      ref={containerRef}
    >
      {/* Center point for the ellipse - reduced size */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 flex justify-center items-center">
        {duplicatedCategories.map((category, index) => (
          <EllipticalItem 
            key={`${category.id}-${index}`}
            category={category}
            index={index}
            totalItems={itemsCount}
            time={time}
            duration={duration}
            radiusX={radiusX}
            radiusY={radiusY}
            isLowPerformance={isLowPerformance}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
};

// Individual item on elliptical path (2D)
const EllipticalItem = ({ category, index, totalItems, time, duration, radiusX, radiusY, isLowPerformance, isMobile }) => {
  // Calculate position along the ellipse
  const position = useTransform(
    time,
    (time) => {
      const cycleProgress = (time % (duration * 1000)) / (duration * 1000);
      // Offset each item by its position in the array
      const itemProgress = (cycleProgress + index / totalItems) % 1;
      
      // Convert to radians (full circle = 2π)
      const angle = itemProgress * 2 * Math.PI;
      
      // Calculate 2D position on an ellipse
      const x = Math.cos(angle) * radiusX;
      const y = Math.sin(angle) * radiusY;
      
      return { x, y, angle };
    }
  );
  
  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{
        x: useTransform(position, p => p.x),
        y: useTransform(position, p => p.y),
        // All items have same z-index to maintain insertion order
        zIndex: 10,
      }}
    >
      <CategoryItem 
        category={category}
        isLowPerformance={isLowPerformance}
        isMobile={isMobile}
      />
    </motion.div>
  );
};

// Individual category item - simplified design
const CategoryItem = ({ category, isLowPerformance, isMobile }) => {
  // Smaller icons on mobile
  const iconSize = isMobile ? "w-14 h-14" : "w-16 h-16";
  
  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="inline-flex flex-col items-center justify-center mx-2 group"
    >
      <div className={`${iconSize} rounded-full flex items-center justify-center 
                     bg-gradient-to-br from-gray-900/70 to-black/70 backdrop-blur-sm 
                     border border-gray-800/30 group-hover:border-draugr-500/40 
                     transition-all duration-300 mb-2`}>
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