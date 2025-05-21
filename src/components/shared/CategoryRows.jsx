import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '../../utils/mockData';
import { isLowPerformanceDevice } from '../../utils/animationHelpers';

// Enhanced category data with proper icons, descriptions, and SVG patterns
const enhancedCategories = [
  { 
    id: 1, 
    name: 'سلاح‌ها', 
    slug: 'weapons', 
    icon: '⚔️',
    description: 'سلاح‌های افسانه‌ای برای ماجراجویی‌های حماسی',
    bgColor: 'from-red-900/60 to-gray-900/60',
    borderColor: 'border-red-900/50',
    pattern: "M8 12L16 4L24 12L16 20L8 12Z M16 4V0 M16 20V24 M8 12H4 M28 12H24",
    patternStroke: "rgba(255, 0, 0, 0.3)"
  },
  { 
    id: 2, 
    name: 'زره‌ها', 
    slug: 'armor', 
    icon: '🛡️',
    description: 'محافظت در برابر تاریکی با زره‌های باستانی',
    bgColor: 'from-blue-900/60 to-gray-900/60', 
    borderColor: 'border-blue-900/50',
    pattern: "M12 4H20V12H28V20H20V28H12V20H4V12H12V4Z",
    patternStroke: "rgba(59, 130, 246, 0.3)"
  },
  { 
    id: 3, 
    name: 'معجون‌ها', 
    slug: 'potions', 
    icon: '🧪',
    description: 'اکسیرهای قدرتمند با خواص جادویی',
    bgColor: 'from-purple-900/60 to-gray-900/60',
    borderColor: 'border-purple-900/50',
    pattern: "M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z M24 8C26.2091 8 28 9.79086 28 12C28 14.2091 26.2091 16 24 16C21.7909 16 20 14.2091 20 12C20 9.79086 21.7909 8 24 8Z",
    patternStroke: "rgba(168, 85, 247, 0.3)"
  },
  { 
    id: 4, 
    name: 'اقلام جادویی', 
    slug: 'magic', 
    icon: '✨',
    description: 'ابزارهای جادویی برای فراخوانی قدرت‌های ماوراء',
    bgColor: 'from-indigo-900/60 to-gray-900/60',
    borderColor: 'border-indigo-900/50',
    pattern: "M14.5 5.5L17 0L19.5 5.5L25 3L22.5 8.5L28 11L22.5 13.5L25 19L19.5 16.5L17 22L14.5 16.5L9 19L11.5 13.5L6 11L11.5 8.5L9 3L14.5 5.5Z",
    patternStroke: "rgba(99, 102, 241, 0.3)"
  },
  { 
    id: 5, 
    name: 'اکسسوری', 
    slug: 'accessories', 
    icon: '🔮',
    description: 'زیورآلات و اکسسوری‌های منحصر به فرد',
    bgColor: 'from-emerald-900/60 to-gray-900/60',
    borderColor: 'border-emerald-900/50',
    pattern: "M16 0V8M24 16H32M16 24V32M8 16H0M4 4L12 12M28 4L20 12M28 28L20 20M4 28L12 20",
    patternStroke: "rgba(16, 185, 129, 0.3)"
  },
  { 
    id: 6, 
    name: 'کتاب‌های نایاب', 
    slug: 'rare_books', 
    icon: '📚',
    description: 'دانش باستانی در کتاب‌های کمیاب و اسرارآمیز',
    bgColor: 'from-amber-900/60 to-gray-900/60',
    borderColor: 'border-amber-900/50',
    pattern: "M8 4H24V28H8V4Z M10 8H22 M10 12H22 M10 16H18",
    patternStroke: "rgba(217, 119, 6, 0.3)"
  },
  { 
    id: 7, 
    name: 'نوشیدنی‌ها', 
    slug: 'drinks', 
    icon: '🍹',
    description: 'نوشیدنی‌های اسرارآمیز از سرزمین‌های دور',
    bgColor: 'from-teal-900/60 to-gray-900/60',
    borderColor: 'border-teal-900/50',
    pattern: "M12 4V12C8 12 4 15 4 19V28H20V19C20 15 16 12 12 12Z",
    patternStroke: "rgba(20, 184, 166, 0.3)"
  },
  { 
    id: 8, 
    name: 'طلسم‌ها', 
    slug: 'spells', 
    icon: '🔥',
    description: 'طلسم‌های قدرتمند برای محافظت و تسخیر',
    bgColor: 'from-rose-900/60 to-gray-900/60',
    borderColor: 'border-rose-900/50',
    pattern: "M16 4C18 8 20 10 24 12C20 14 18 16 16 20C14 16 12 14 8 12C12 10 14 8 16 4Z",
    patternStroke: "rgba(225, 29, 72, 0.3)"
  },
];

// SVG background pattern component for categories
const CategoryPattern = ({ pattern, stroke = "rgba(255,255,255,0.1)", animate = true }) => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        <pattern
          id={`pattern-${pattern.slice(0,8)}`}
          x="0"
          y="0"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
          patternTransform={animate ? "rotate(0)" : ""}
        >
          <path
            d={pattern}
            stroke={stroke}
            strokeWidth="1"
            fill="none"
          />
        </pattern>

        <rect 
          width="100%" 
          height="100%" 
          fill={`url(#pattern-${pattern.slice(0,8)})`}
          className={animate ? "animate-rotate" : ""}
        />

        {animate && (
          <rect 
            width="100%" 
            height="100%" 
            fill={`url(#pattern-${pattern.slice(0,8)})`}
            className="animate-rotate-reverse" 
            style={{ opacity: 0.6 }}
          />
        )}
      </svg>
    </div>
  );
};

const CategoryRows = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Check device performance on mount
  useEffect(() => {
    setIsLowPerformance(isLowPerformanceDevice());
  }, []);
  
  // Filter categories based on search term
  const filteredCategories = enhancedCategories.filter(category => 
    category.name.includes(searchTerm) || 
    category.description.includes(searchTerm)
  );

  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Item variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };
  
  return (
    <div className="py-10 md:py-16 relative">
      {/* Decorative background elements */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-draugr-800/20 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-draugr-800/20 to-transparent"></div>
      
      {/* Section header with enhanced styling */}
      <div className="text-center mb-12">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-white mb-3"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="text-draugr-500">دسته‌بندی‌های</span> محصولات
        </motion.h2>
        
        <motion.p
          className="text-gray-400 max-w-2xl mx-auto mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          مجموعه‌های اختصاصی ما را کاوش کنید و کالای مورد نظر خود را بیابید
        </motion.p>
        
        {/* Search and filter controls */}
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-3 mb-8 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="جستجوی دسته‌بندی..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/50 border border-gray-700 rounded-full px-5 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-draugr-500/50 focus:border-draugr-500 w-full max-w-xs"
            />
            <div className="absolute left-3 top-2.5 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Category grid with animations */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {filteredCategories.map(category => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.03,
              transition: { duration: 0.3 }
            }}
            className={`bg-gradient-to-br ${category.bgColor} backdrop-blur-sm rounded-xl overflow-hidden 
                       border ${category.borderColor} shadow-lg hover:shadow-xl hover:shadow-draugr-900/20 
                       transition-all duration-300 group relative`}
          >
            {/* SVG pattern background */}
            <CategoryPattern pattern={category.pattern} stroke={category.patternStroke} animate={!isLowPerformance} />
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-draugr-500/5 to-transparent"></div>
            
            <Link to={`/shop?category=${category.slug}`} className="block h-full relative z-10">
              <div className="p-6 flex flex-col h-full">
                {/* Icon with glow effect */}
                <div className="mb-4 flex justify-center">
                  <motion.div 
                    className="w-20 h-20 flex items-center justify-center rounded-full
                               bg-gray-900/80 backdrop-blur-sm border border-gray-700/50
                               shadow-inner relative overflow-hidden group-hover:border-draugr-500/30"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-80"></div>
                    
                    {/* Icon */}
                    <span className="text-4xl relative z-10">{category.icon}</span>
                    
                    {/* Pulsing glow effect */}
                    <motion.div 
                      className="absolute inset-0 bg-draugr-500/10 rounded-full opacity-0 group-hover:opacity-100"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0, 0.15, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    />
                  </motion.div>
                </div>
                
                {/* Category name with animated underline */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-white mb-2 text-center group-hover:text-draugr-200 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <motion.div 
                    className="h-0.5 bg-draugr-500 absolute left-1/2 bottom-0 w-0"
                    initial={{ width: '0%', x: '-50%' }}
                    whileInView={{ width: '30%', x: '-50%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                  <motion.div 
                    className="h-0.5 bg-draugr-500 absolute left-1/2 bottom-0 w-0 group-hover:w-1/2"
                    initial={{ width: '0%', x: '-50%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                {/* Category description */}
                <p className="text-gray-400 group-hover:text-gray-300 text-center text-sm flex-grow transition-colors duration-300">{category.description}</p>
                
                {/* Bottom arrow indicator */}
                <div className="mt-4 flex justify-center">
                  <motion.div 
                    className="text-draugr-500 flex items-center text-sm font-medium group-hover:text-draugr-300"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    مشاهده محصولات
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:transform rtl:rotate-180 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
      
      {/* View all categories button */}
      <div className="text-center mt-12">
        <Link to="/shop">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-draugr-800 to-draugr-700 text-white px-8 py-3 rounded-md
                     border border-draugr-600/50 shadow-lg hover:shadow-draugr-900/20
                     flex items-center justify-center gap-2 mx-auto group"
          >
            <span>مشاهده همه محصولات</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default CategoryRows;