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
  { id: 1, name: 'شمشیرهای افسانه‌ای', slug: 'swords', category: 'weapons', icon: '⚔️' },
  { id: 2, name: 'تبرها و گرزها', slug: 'axes', category: 'weapons', icon: '🪓' },
  { id: 3, name: 'کمان‌های جادویی', slug: 'bows', category: 'weapons', icon: '🏹' },
  { id: 4, name: 'سپرهای محافظ', slug: 'shields', category: 'armor', icon: '🛡️' },
  { id: 5, name: 'زره‌های سنگین', slug: 'heavy-armor', category: 'armor', icon: '👕' },
  { id: 6, name: 'کلاهخودها', slug: 'helmets', category: 'armor', icon: '⛑️' },
  { id: 7, name: 'معجون‌های درمانگر', slug: 'healing-potions', category: 'potions', icon: '💊' },
  { id: 8, name: 'اکسیرهای نیرو', slug: 'power-potions', category: 'potions', icon: '🧪' },
  { id: 9, name: 'طلسم‌های آتش', slug: 'fire-spells', category: 'spells', icon: '🔥' },
  { id: 10, name: 'طلسم‌های یخ', slug: 'ice-spells', category: 'spells', icon: '❄️' },
  { id: 11, name: 'گردنبندهای قدرت', slug: 'necklaces', category: 'accessories', icon: '📿' },
  { id: 12, name: 'انگشترهای جادویی', slug: 'rings', category: 'accessories', icon: '💍' },
  { id: 13, name: 'کتاب‌های جادوگری', slug: 'magic-books', category: 'rare_books', icon: '📕' },
  { id: 14, name: 'طومارهای باستانی', slug: 'scrolls', category: 'rare_books', icon: '📜' },
  { id: 15, name: 'نوشیدنی‌های نیرو', slug: 'energy-drinks', category: 'drinks', icon: '🥤' },
  { id: 16, name: 'شربت‌های جادویی', slug: 'magic-drinks', category: 'drinks', icon: '🧃' },
];

// Tags for additional filtering
const popularTags = [
  { id: 1, name: 'پرفروش‌ترین', slug: 'bestsellers', icon: '🏆' },
  { id: 2, name: 'جدیدترین', slug: 'new-arrivals', icon: '✨' },
  { id: 3, name: 'تخفیف‌دار', slug: 'on-sale', icon: '💰' },
  { id: 4, name: 'ویژه ماجراجویان', slug: 'for-adventurers', icon: '🗺️' },
  { id: 5, name: 'ویژه جادوگران', slug: 'for-wizards', icon: '🧙' },
  { id: 6, name: 'ویژه جنگجویان', slug: 'for-warriors', icon: '⚔️' },
  { id: 7, name: 'محبوب کاربران', slug: 'popular', icon: '❤️' },
  { id: 8, name: 'پیشنهاد درائوگر', slug: 'recommended', icon: '👑' },
  { id: 9, name: 'آخرین فرصت', slug: 'last-chance', icon: '⏰' },
  { id: 10, name: 'ویژه نخبگان', slug: 'for-elites', icon: '🎭' },
  { id: 11, name: 'نادر و کمیاب', slug: 'rare-items', icon: '💎' },
  { id: 12, name: 'تجهیزات ویژه', slug: 'special-gear', icon: '🛠️' },
];

const CategoryRows = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const sectionRef = useRef(null);
  
  // Check device performance on mount
  useEffect(() => {
    setIsLowPerformance(isLowPerformanceDevice());
  }, []);
  
  return (
    <div className="py-8 sm:py-12 md:py-16 w-full relative overflow-hidden" ref={sectionRef}>
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
      
      {/* Left side subcategories - now directly in the main section */}
      <div className="hidden md:block absolute top-0 left-0 bottom-0 w-1/5 z-10">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Top fade effect */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent z-10"></div>
          <VerticalScrollingMenu 
            items={subcategories} 
            direction="up" 
            columns={2} 
            startFromEdge={true} 
            parentRef={sectionRef}
            fullHeight={true}
          />
          {/* Bottom fade effect */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10"></div>
        </div>
      </div>

      {/* Main content - without side menus */}
      <div className="container mx-auto px-4 relative">
        {/* Center circular category animation */}
        <div className="w-full md:w-3/5 mx-auto">
          <div className="flex justify-center items-center my-8">
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
      
      {/* Right side tags - now directly in the main section */}
      <div className="hidden md:block absolute top-0 right-0 bottom-0 w-1/5 z-10">
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          {/* Top fade effect */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent z-10"></div>
          <VerticalScrollingMenu 
            items={popularTags} 
            direction="down" 
            columns={2} 
            startFromEdge={true}
            parentRef={sectionRef}
            fullHeight={true}
          />
          {/* Bottom fade effect */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10"></div>
        </div>
      </div>
      
      {/* View all categories button */}
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

// Vertical scrolling menu component with truly infinite scrolling
const VerticalScrollingMenu = ({ items, direction, columns = 2, startFromEdge = false, parentRef, fullHeight = false }) => {
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [parentHeight, setParentHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  
  // Calculate item height based on content
  const itemHeight = 40; // Height for each item
  const itemsPerSet = items.length;
  const totalSetHeight = itemsPerSet * itemHeight;
  
  // Define a constant speed in pixels per second
  const SCROLL_SPEED = 25; // pixels per second - same for both menus
  
  // Update container and parent height on mount and resize
  useEffect(() => {
    const updateSizes = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
      
      if (parentRef && parentRef.current) {
        setParentHeight(parentRef.current.offsetHeight);
      }
    };
    
    updateSizes();
    
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, [parentRef]);
  
  // Animation frame-based animation for consistent speed
  useEffect(() => {
    let lastTimestamp = 0;
    let animationFrameId = null;
    
    const animate = (timestamp) => {
      // Initialize lastTimestamp on first run
      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      
      // Calculate elapsed time since last frame in seconds
      const deltaTime = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      
      // Only update after we have a valid delta time
      if (deltaTime > 0 && deltaTime < 0.1) { // Avoid jumps if tab was inactive
        // Calculate how much to move based on direction and constant speed
        let movement = SCROLL_SPEED * deltaTime;
        
        // Update position based on direction
        if (direction === 'up') {
          setScrollY(prevY => {
            // Move upward (negative)
            let newY = prevY - movement;
            return newY;
          });
        } else {
          setScrollY(prevY => {
            // Move downward (positive)
            let newY = prevY + movement;
            return newY;
          });
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Start the animation
    animationFrameId = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [direction]);
  
  // Generate enough rows to fill the view and then some
  const visibleRows = Math.ceil(parentHeight / itemHeight) * 3; // Triple the needed amount
  
  // Function to render a single item based on index, handling wrapping
  const renderItem = (index) => {
    // Normalize the index to wrap around the items array
    const normalizedIndex = Math.abs(index % itemsPerSet);
    return items[normalizedIndex];
  };
  
  // Generate visible items for each column
  const generateVisibleItems = () => {
    // Calculate current "starting" index based on scroll position
    const startIdx = Math.floor(Math.abs(scrollY) / itemHeight);
    
    const columnItems = Array(columns).fill().map(() => []);
    
    // Generate enough rows for each column
    for (let i = 0; i < visibleRows; i++) {
      const rowIndex = startIdx + i;
      
      // Add appropriate item to each column
      for (let col = 0; col < columns; col++) {
        const itemIndex = Math.floor(rowIndex / columns) + col;
        columnItems[col].push({
          item: renderItem(itemIndex),
          // Unique key combining item ID, overall index, and column
          key: `item-${renderItem(itemIndex).id}-${itemIndex}-${col}`
        });
      }
    }
    
    return columnItems;
  };
  
  // Get columns of visible items
  const columnItems = generateVisibleItems();
  
  // Calculate the visual offset for smooth scrolling
  const visualScrollOffset = scrollY % itemHeight;
  
  return (
    <div 
      className={`relative ${fullHeight ? 'h-full min-h-[80vh]' : 'h-full'}`} 
      ref={containerRef}
      style={{ overflowY: 'hidden' }}
    >
      {/* Grid container for columns */}
      <div className="grid grid-cols-2 gap-x-4 h-full">
        {columnItems.map((column, colIndex) => (
          <div key={`col-${colIndex}`} className="relative overflow-hidden h-full">
            <div 
              className="absolute w-full will-change-transform"
              style={{ 
                transform: `translateY(${direction === 'up' ? -visualScrollOffset : visualScrollOffset}px)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {column.map(({ item, key }) => (
                <div 
                  key={key}
                  className="mb-3 will-change-transform"
                  style={{ 
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                    WebkitFontSmoothing: "antialiased"
                  }}
                >
                  <Link 
                    to={`/shop?${item.category ? 'subcategory' : 'tag'}=${item.slug}`} 
                    className="block py-2 px-3 rounded-md hover:bg-gray-800/50 transition-colors duration-300
                             border border-gray-700/10 hover:border-draugr-500/30 bg-gray-800/20 backdrop-blur-sm
                             text-gray-300 hover:text-white group"
                  >
                    <div className="flex items-center gap-2 rtl:flex-row-reverse">
                      {item.icon && (
                        <span className="text-lg opacity-75 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                      )}
                      <span className="text-sm">{item.name}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Smooth cubic easing function for animation
const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

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