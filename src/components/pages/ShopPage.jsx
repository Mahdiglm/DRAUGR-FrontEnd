import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';

import ProductList from '../product/ProductList';
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
      inset 0 0 15px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(154, 36, 50, 0.3);
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
  };
  
  // Toggle category selection
  const toggleCategory = (categorySlug) => {
    if (selectedCategories.includes(categorySlug)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== categorySlug));
    } else {
      setSelectedCategories([...selectedCategories, categorySlug]);
    }
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
    
    // Enhanced scroll to top on page change with multiple methods for better browser compatibility
    // First set scroll behavior to auto for immediate response
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Use multiple scroll methods for better browser compatibility
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    
    // Add a small timeout to ensure it works after content changes
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
      // Reset scroll behavior to smooth after scrolling
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 50);
  };
  
  // Render development page content with cool styling
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
      {/* Custom styles */}
      <style dangerouslySetInnerHTML={{ __html: enhancedStyles }} />
      
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-80 z-0"></div>
      
      {/* Mist Animation */}
      <MistAnimation />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Page Title */}
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
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg">اقلام شگفت‌انگیز ما را کشف کنید، برای ماجراجویی‌های حماسی شما طراحی شده‌اند</p>
        </motion.div>
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex justify-center mb-6">
          <motion.button
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="flex items-center bg-draugr-800 text-white py-2 px-4 rounded-md shadow-horror"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FilterIcon />
            <span className="mr-2">فیلترها</span>
          </motion.button>
        </div>
        
        {/* Main Content Grid */}
        <div className="flex flex-col md:flex-row">
          {/* Filters Sidebar - Mobile */}
          <AnimatePresence>
            {isFilterMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black bg-opacity-80 z-50 md:hidden overflow-auto"
              >
                <div className="sidebar-horror h-full w-4/5 max-w-sm overflow-auto p-5 border-r border-draugr-800">
                  <div className="filter-content">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-white filter-title">فیلترها</h3>
                      <button 
                        onClick={() => setIsFilterMenuOpen(false)}
                        className="text-white p-1 rounded-full hover:bg-draugr-900"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Mobile Filter Content - Same as desktop */}
                    <div className="space-y-6">
                      {/* Search */}
                      <div>
                        <h4 className="text-lg font-medium text-white mb-2 filter-title">جستجو</h4>
                        <div className="relative">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="جستجوی محصولات..."
                            className="w-full bg-ash bg-opacity-70 text-white py-2 px-3 pr-10 rounded-md focus:outline-none focus:ring-1 focus:ring-draugr-500"
                          />
                          <span className="absolute left-3 top-2.5 text-gray-400">
                            <SearchIcon />
                          </span>
                        </div>
                      </div>
                      
                      <div className="horror-divider"></div>
                      
                      {/* Categories */}
                      <div>
                        <h4 className="text-lg font-medium text-white mb-2 filter-title">دسته‌بندی‌ها</h4>
                        <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-hide">
                          {expandedCategories.map(category => (
                            <div key={category.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`mobile-category-${category.slug}`}
                                checked={selectedCategories.includes(category.slug)}
                                onChange={() => toggleCategory(category.slug)}
                                className="hidden"
                              />
                              <label
                                htmlFor={`mobile-category-${category.slug}`}
                                className={`block w-full px-3 py-2 rounded-md cursor-pointer transition-all ${
                                  selectedCategories.includes(category.slug)
                                    ? 'bg-draugr-800 text-white shadow-[0_0_10px_rgba(239,35,60,0.2)]'
                                    : 'text-gray-300 hover:bg-ash hover:bg-opacity-50'
                                }`}
                              >
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="horror-divider"></div>
                      
                      {/* Sort By */}
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
                      
                      {/* Reset Filters */}
                      <div className="pt-2">
                        <motion.button
                          onClick={resetFilters}
                          className="w-full bg-vampire-dark text-white py-2 px-4 rounded-md border border-draugr-700 hover:bg-vampire-primary transition-all hover:shadow-[0_0_15px_rgba(239,35,60,0.4)]"
                          whileHover={{ scale: 1.02 }}
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
            )}
          </AnimatePresence>
          
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
                  {/* Search */}
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
                  
                  {/* Categories */}
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
                                ? 'bg-draugr-800 text-white shadow-[0_0_10px_rgba(239,35,60,0.2)]'
                                : 'text-gray-300 hover:bg-ash hover:bg-opacity-50'
                            }`}
                            whileHover={{ 
                              x: 3,
                              transition: { type: "spring", stiffness: 400 }
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
                  
                  {/* Sort By */}
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
                  
                  {/* Reset Filters */}
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
          
          {/* Products Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1 md:mr-6 mt-6 md:mt-0"
          >
            {/* Sort and Results Info - Desktop */}
            {currentPage === 1 && (
              <div className="hidden md:flex justify-between items-center mb-6 bg-ash bg-opacity-50 p-3 rounded-md">
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
              </div>
            )}
            
            {/* Results Info - Mobile */}
            {currentPage === 1 && (
              <div className="md:hidden text-center mb-4 text-white">
                <span>{sortedProducts.length} محصول یافت شد</span>
              </div>
            )}
            
            {/* Active Filters Display */}
            {currentPage === 1 && (selectedCategories.length > 0 || searchTerm) && (
              <div className="mb-6 bg-ash bg-opacity-30 p-3 rounded-md">
                <div className="flex flex-wrap gap-2 rtl">
                  <span className="text-gray-300">فیلترهای فعال:</span>
                  
                  {selectedCategories.map(categorySlug => {
                    const categoryName = expandedCategories.find(c => c.slug === categorySlug)?.name;
                    return (
                      <motion.span 
                        key={categorySlug}
                        className="inline-flex items-center bg-vampire-primary text-white px-2 py-1 rounded-md text-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        {categoryName}
                        <button 
                          onClick={() => toggleCategory(categorySlug)}
                          className="mr-1 text-white"
                        >
                          ×
                        </button>
                      </motion.span>
                    );
                  })}
                  
                  {searchTerm && (
                    <motion.span 
                      className="inline-flex items-center bg-vampire-primary text-white px-2 py-1 rounded-md text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      جستجو: {searchTerm}
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="mr-1 text-white"
                      >
                        ×
                      </button>
                    </motion.span>
                  )}
                  
                  <motion.button
                    onClick={resetFilters}
                    className="text-gray-300 text-sm hover:text-white"
                    whileHover={{ scale: 1.05 }}
                  >
                    پاک کردن همه
                  </motion.button>
                </div>
              </div>
            )}
            
            {/* Products Display or Development Page */}
            <AnimatePresence mode="wait">
              {currentPage === 1 ? (
                <motion.div
                  key="page-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {sortedProducts.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20 bg-ash bg-opacity-30 rounded-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-xl font-bold text-white mb-2">محصولی یافت نشد</h3>
                      <p className="text-gray-400 mb-4">لطفاً معیارهای جستجوی خود را تغییر دهید</p>
                      <motion.button
                        onClick={resetFilters}
                        className="bg-draugr-800 text-white py-2 px-6 rounded-md shadow-horror"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        پاک کردن فیلترها
                      </motion.button>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedProducts.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={addToCart}
                        />
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
            
            {/* Pagination - Static for demo */}
            {sortedProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex justify-center mt-12"
              >
                <div className="flex flex-row space-x-3" style={{ direction: 'ltr' }}>
                  {/* Left Arrow */}
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
                  
                  {/* Page 1 */}
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
                  
                  {/* Page 2 */}
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
                  
                  {/* Page 3 */}
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
                  
                  {/* Right Arrow */}
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