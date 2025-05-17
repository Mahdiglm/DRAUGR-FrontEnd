import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';

import ProductCard from '../product/ProductCard';
import { products, categories } from '../../utils/mockData';

// Using only a fallback background image URL
const shopBackground = "https://images.unsplash.com/photo-1574015974293-817f0ebf0e95?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// Custom CSS for glowing effects and enhanced styling
const enhancedStyles = `
  .sidebar-horror {
    background: linear-gradient(145deg, #1a1a1a, #111111);
    box-shadow: 
      0 10px 30px -10px rgba(0, 0, 0, 0.9),
      0 0 10px 2px rgba(154, 36, 50, 0.3),
      inset 0 0 15px rgba(0, 0, 0, 0.5),
      inset 0 0 10px rgba(239, 35, 60, 0.2); /* Added inner red glow */
    border: 1px solid rgba(154, 36, 50, 0.4); /* Darker border */
    position: relative;
    overflow: hidden;
  }
  
  .sidebar-horror::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(239, 35, 60, 0.6), transparent);
    animation: glowPulse 4s ease-in-out infinite;
    z-index: 1;
  }
  
  .sidebar-horror::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(to right, transparent, rgba(154, 36, 50, 0.4), transparent);
    filter: blur(3px);
    z-index: 0;
  }
  
  @keyframes glowPulse {
    0% { opacity: 0.3; }
    50% { opacity: 0.8; }
    100% { opacity: 0.3; }
  }
  
  .horror-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(239, 35, 60, 0.4), transparent);
    margin: 16px 0;
    position: relative;
  }
  
  .horror-divider::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    background: inherit;
    top: 1px;
    left: 0;
    filter: blur(1px);
  }
  
  .filter-content {
    position: relative;
    z-index: 10;
  }
  
  .filter-title {
    text-shadow: 0 0 8px rgba(239, 35, 60, 0.6);
    position: relative;
    display: inline-block;
  }
  
  .filter-title::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(239, 35, 60, 0.8), transparent);
  }
  
  .noise-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='a'%3E%3CfeTurbulence baseFrequency='.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)' opacity='.08'/%3E%3C/svg%3E");
    opacity: 0.2;
    mix-blend-mode: overlay;
    pointer-events: none;
    z-index: 2;
  }
`;

// Filter icons
const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
  </svg>
);

const SortIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

// Expanded category options for the demo
const expandedCategories = [
  ...categories,
  { id: 5, name: "کتاب‌های نادر", slug: "rare-books" },
  { id: 6, name: "جواهرات", slug: "jewelry" },
  { id: 7, name: "ابزارها", slug: "tools" },
  { id: 8, name: "گیاهان", slug: "herbs" }
];

// Animation variants for product grid
const productContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    }
  }
};

const productItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 14
    }
  }
};

const ShopPage = () => {
  const { addToCart } = useOutletContext();
  
  // States for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter products based on criteria
  const filteredProducts = products.filter(product => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(product.category);
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
      default:
        return b.id - a.id; // Using ID as a proxy for newness
    }
  });
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSortBy('newest');
    setCurrentPage(1); // Reset to first page
  };
  
  // Toggle category selection
  const toggleCategory = (categorySlug) => {
    if (selectedCategories.includes(categorySlug)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== categorySlug));
    } else {
      setSelectedCategories([...selectedCategories, categorySlug]);
    }
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Generate mist animation in the background
  const MistAnimation = () => (
    <motion.div 
      className="absolute inset-0 z-[1] opacity-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ duration: 2 }}
    >
      <motion.div 
        className="absolute inset-0"
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{ 
          duration: 60, 
          ease: "linear", 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 2000 2000\' fill=\'none\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
          backgroundSize: '200% 200%'
        }}
      />
    </motion.div>
  );
  
  // Function to handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    
    // Enhanced scroll to top on page change
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
    
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 50);
  };
  
  // Render development page content
  const renderDevelopmentPage = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="py-32 px-4 flex flex-col items-center justify-center bg-ash bg-opacity-30 rounded-lg"
      >
        <motion.div
          className="relative"
          animate={{ 
            rotate: [0, 2, 0, -2, 0],
            scale: [1, 1.02, 1, 0.98, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div
            className="absolute inset-0 bg-draugr-500 blur-xl opacity-20 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <svg 
            className="h-32 w-32 text-draugr-500 relative z-10 opacity-70" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
            />
          </svg>
        </motion.div>
        
        <motion.h2 
          className="mt-8 text-3xl font-bold text-white text-center"
          animate={{ 
            textShadow: ['0 0 8px rgba(239,35,60,0.3)', '0 0 16px rgba(239,35,60,0.7)', '0 0 8px rgba(239,35,60,0.3)']
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
          }}
        >
          در حال توسعه...
        </motion.h2>
        
        <motion.p 
          className="mt-4 text-gray-300 text-center max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          این صفحه در حال ساخت است و به زودی با محصولات جدید و شگفت‌انگیز تکمیل خواهد شد
        </motion.p>
        
        <motion.div 
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.button
            className="bg-vampire-dark text-white py-2 px-6 rounded-md border border-draugr-500 hover:bg-vampire-primary transition-all"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 15px rgba(239,35,60,0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(1)}
          >
            بازگشت به صفحه اصلی
          </motion.button>
        </motion.div>
      </motion.div>
    );
  };
  
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full relative overflow-hidden py-8 md:py-12"
      style={{
        backgroundImage: `url(${shopBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: enhancedStyles }} />
      
      <div className="absolute inset-0 bg-black bg-opacity-80 z-0"></div>
      <MistAnimation />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-shadow-horror">
            <span className="relative inline-block">
              فروشگاه دراگــر
              <motion.span 
                className="absolute -bottom-2 left-0 right-0 h-0.5 bg-draugr-500"
                initial={{ width: 0, left: '50%', right: '50%' }}
                animate={{ width: '100%', left: 0, right: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              ></motion.span>
            </span>
          </h1>
          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg"
            initial={{ opacity:0, y:10}}
            animate={{opacity:1, y:0}}
            transition={{delay:0.3, duration:0.6}}
          >
            اقلام شگفت‌انگیز ما را کشف کنید، برای ماجراجویی‌های حماسی شما طراحی شده‌اند
          </motion.p>
        </motion.div>
        
        {/* New Mobile Filter Trigger will go here or elsewhere as per design */}
        
        <div className="flex flex-col md:flex-row">
          
          {/* Filters Sidebar - Desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block w-64 lg:w-72 relative h-fit sticky top-24"
          >
            <div className="sidebar-horror p-5 rounded-lg">
              <div className="filter-content">
                <motion.h3 
                  className="text-xl font-bold text-white mb-4 flex items-center filter-title"
                  animate={{ textShadow: ['0 0 4px rgba(239,35,60,0.3)', '0 0 8px rgba(239,35,60,0.6)', '0 0 4px rgba(239,35,60,0.3)'] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <FilterIcon />
                  <span className="mr-2">فیلترها</span>
                </motion.h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2 filter-title">جستجو</h4>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="جستجوی محصولات..."
                        className="w-full bg-ash bg-opacity-70 text-white py-2 px-3 pr-10 rounded-md focus:outline-none focus:ring-1 focus:ring-draugr-500 focus:shadow-[0_0_10px_rgba(239,35,60,0.3)]"
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">
                        <SearchIcon />
                      </span>
                    </div>
                  </div>
                  
                  <div className="horror-divider"></div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2 filter-title">دسته‌بندی‌ها</h4>
                    <motion.div 
                      className="space-y-1 max-h-48 overflow-y-auto scrollbar-hide"
                    >
                      {expandedCategories.map(category => (
                        <div key={category.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${category.slug}`}
                            checked={selectedCategories.includes(category.slug)}
                            onChange={() => toggleCategory(category.slug)}
                            className="hidden"
                          />
                          <motion.label
                            htmlFor={`category-${category.slug}`}
                            className={`block w-full px-3 py-2 rounded-md cursor-pointer transition-all ${
                              selectedCategories.includes(category.slug)
                                ? 'bg-draugr-800 text-white shadow-[0_0_10px_rgba(239,35,60,0.3)] border-l-2 border-draugr-500'
                                : 'text-gray-300 hover:bg-ash hover:bg-opacity-60 hover:border-l-2 hover:border-draugr-600'
                            }`}
                            whileHover={{ 
                              x: selectedCategories.includes(category.slug) ? 0 : 4,
                              backgroundColor: selectedCategories.includes(category.slug) ? 'rgba(239, 35, 60, 0.9)' : 'rgba(239, 35, 60, 0.15)',
                              boxShadow: selectedCategories.includes(category.slug) ? "0 0 12px rgba(239,35,60,0.5)" : "0 0 8px rgba(239,35,60,0.3)",
                              transition: { duration: 0.15 }
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {category.name}
                          </motion.label>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                  
                  <div className="horror-divider"></div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2 filter-title">مرتب‌سازی</h4>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-ash bg-opacity-70 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-1 focus:ring-draugr-500"
                    >
                      <option value="newest">جدیدترین</option>
                      <option value="price-low">ارزان‌ترین</option>
                      <option value="price-high">گران‌ترین</option>
                      <option value="name">بر اساس نام</option>
                    </select>
                  </div>
                  
                  <div className="horror-divider"></div>
                  
                  <div className="pt-2">
                    <motion.button
                      onClick={resetFilters}
                      className="w-full bg-vampire-dark text-white py-2 px-4 rounded-md border border-draugr-700 hover:bg-vampire-primary transition-all hover:shadow-[0_0_15px_rgba(239,35,60,0.4)]"
                      whileHover={{ 
                        scale: 1.03,
                        boxShadow: "0 0 15px rgba(239,35,60,0.4)"
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      پاک کردن فیلترها
                    </motion.button>
                  </div>
                </div>
              </div>
              <div className="noise-overlay"></div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1 md:mr-6 mt-6 md:mt-0"
          >
            {currentPage === 1 && (
              <motion.div 
                className="hidden md:flex justify-between items-center mb-6 bg-ash bg-opacity-50 p-3 rounded-md shadow-lg border border-draugr-700/30"
                initial={{opacity:0, y: -10}}
                animate={{opacity:1, y:0}}
                transition={{delay:0.5, duration:0.4}}
              >
                <div className="text-white">
                  <span>{sortedProducts.length} محصول یافت شد</span>
                </div>
                <div className="flex items-center">
                  <SortIcon />
                  <span className="mx-2 text-white">مرتب‌سازی:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-vampire-dark text-white py-1 px-3 rounded-md focus:outline-none focus:ring-1 focus:ring-draugr-500"
                  >
                    <option value="newest">جدیدترین</option>
                    <option value="price-low">ارزان‌ترین</option>
                    <option value="price-high">گران‌ترین</option>
                    <option value="name">بر اساس نام</option>
                  </select>
                </div>
              </motion.div>
            )}
            
            {currentPage === 1 && (
              <div className="md:hidden text-center mb-4 text-white">
                <span>{sortedProducts.length} محصول یافت شد</span>
              </div>
            )}
            
            {currentPage === 1 && (selectedCategories.length > 0 || searchTerm) && (
              <motion.div 
                className="mb-6 bg-ash bg-opacity-30 p-3 rounded-md"
                initial={{opacity:0}}
                animate={{opacity:1}}
                transition={{duration:0.3}}
              >
                <div className="flex flex-wrap gap-2 rtl items-center">
                  <span className="text-gray-300">فیلترهای فعال:</span>
                  
                  <AnimatePresence>
                    {selectedCategories.map(categorySlug => {
                      const categoryName = expandedCategories.find(c => c.slug === categorySlug)?.name;
                      return (
                        <motion.span 
                          key={categorySlug}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="inline-flex items-center bg-vampire-primary text-white px-2.5 py-1 rounded-md text-sm shadow-md"
                          whileHover={{ backgroundColor: "rgba(239, 35, 60, 1)" }}
                        >
                          {categoryName}
                          <motion.button 
                            onClick={() => toggleCategory(categorySlug)}
                            className="mr-1.5 text-white hover:text-gray-200"
                            whileHover={{scale:1.2}}
                            whileTap={{scale:0.9}}
                          >
                            ×
                          </motion.button>
                        </motion.span>
                      );
                    })}
                  
                    {searchTerm && (
                      <motion.span 
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center bg-vampire-primary text-white px-2.5 py-1 rounded-md text-sm shadow-md"
                        whileHover={{ backgroundColor: "rgba(239, 35, 60, 1)" }}
                      >
                        جستجو: "{searchTerm}"
                        <motion.button 
                          onClick={() => setSearchTerm('')}
                          className="mr-1.5 text-white hover:text-gray-200"
                          whileHover={{scale:1.2}}
                          whileTap={{scale:0.9}}
                        >
                          ×
                        </motion.button>
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {(selectedCategories.length > 0 || searchTerm) && (
                    <motion.button
                      onClick={resetFilters}
                      className="text-gray-400 text-sm hover:text-draugr-300 transition-colors ml-auto px-2 py-1 rounded hover:bg-draugr-700/50"
                      whileHover={{ scale: 1.05, color: '#ef233c' }}
                      layout
                    >
                      پاک کردن همه
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
            
            <AnimatePresence mode="wait">
              {currentPage === 1 ? (
                <motion.div
                  key="page-1-products"
                  variants={productContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                >
                  {sortedProducts.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20 bg-ash bg-opacity-30 rounded-lg"
                    >
                      <motion.svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-20 w-20 mx-auto text-draugr-600 mb-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 150 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 14h6" />
                      </motion.svg>
                      <h3 className="text-xl font-bold text-white mb-2">محصولی یافت نشد</h3>
                      <p className="text-gray-400 mb-4">در دخمه‌های ما چیزی با این مشخصات پیدا نشد!</p>
                      <motion.button
                        onClick={resetFilters}
                        className="bg-draugr-800 text-white py-2 px-6 rounded-md shadow-horror"
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 35, 60, 0.8)' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        پاک کردن فیلترها
                      </motion.button>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
                      {sortedProducts.map(product => (
                        <motion.div 
                          key={product.id} 
                          variants={productItemVariants}
                          className="h-full" 
                        >
                          <ProductCard
                            product={product}
                            onAddToCart={addToCart}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key={`page-${currentPage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {renderDevelopmentPage()}
                </motion.div>
              )}
            </AnimatePresence>
            
            {sortedProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex justify-center mt-12"
              >
                <div className="flex flex-row space-x-3" style={{ direction: 'ltr' }}>
                  <motion.button
                    whileHover={{ 
                      scale: 1.15, 
                      boxShadow: "0 0 15px rgba(239,35,60,0.5)"
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-charcoal text-white border border-draugr-900/30 shadow-md overflow-hidden relative group"
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-draugr-900/0 via-draugr-800/10 to-draugr-900/0"
                      animate={{ 
                        x: ['-100%', '100%'] 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2,
                        ease: "linear"
                      }}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 z-10 ${currentPage === 1 ? 'opacity-50' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ 
                      scale: 1.15, 
                      boxShadow: "0 0 15px rgba(239,35,60,0.5)"
                    }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 flex items-center justify-center rounded-md shadow-md relative overflow-hidden ${
                      currentPage === 1 
                        ? 'bg-vampire-primary text-white' 
                        : 'bg-charcoal text-white border border-draugr-900/30'
                    }`}
                    onClick={() => handlePageChange(1)}
                  >
                    {currentPage === 1 && (
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-vampire-dark to-transparent opacity-50"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    <span className="text-white relative z-10 font-bold">1</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ 
                      scale: 1.15, 
                      boxShadow: "0 0 15px rgba(239,35,60,0.5)"
                    }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 flex items-center justify-center rounded-md shadow-md relative overflow-hidden ${
                      currentPage === 2 
                        ? 'bg-vampire-primary text-white' 
                        : 'bg-charcoal text-white border border-draugr-900/30'
                    }`}
                    onClick={() => handlePageChange(2)}
                  >
                    {currentPage === 2 && (
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-vampire-dark to-transparent opacity-50"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    <span className="relative z-10">2</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ 
                      scale: 1.15, 
                      boxShadow: "0 0 15px rgba(239,35,60,0.5)"
                    }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 flex items-center justify-center rounded-md shadow-md relative overflow-hidden ${
                      currentPage === 3
                        ? 'bg-vampire-primary text-white' 
                        : 'bg-charcoal text-white border border-draugr-900/30'
                    }`}
                    onClick={() => handlePageChange(3)}
                  >
                    {currentPage === 3 && (
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-vampire-dark to-transparent opacity-50"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    <span className="relative z-10">3</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ 
                      scale: 1.15, 
                      boxShadow: "0 0 15px rgba(239,35,60,0.5)"
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-charcoal text-white border border-draugr-900/30 shadow-md overflow-hidden relative group"
                    onClick={() => currentPage < 3 && handlePageChange(currentPage + 1)}
                    disabled={currentPage === 3}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-draugr-900/0 via-draugr-800/10 to-draugr-900/0"
                      animate={{ 
                        x: ['-100%', '100%'] 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2,
                        ease: "linear"
                      }}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 z-10 ${currentPage === 3 ? 'opacity-50' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ShopPage; 