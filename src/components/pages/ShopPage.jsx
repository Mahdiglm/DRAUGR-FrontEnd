import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';

import ProductList from '../product/ProductList';
import ProductCard from '../product/ProductCard';
import { products, categories } from '../../utils/mockData';

// Using only a fallback background image URL
const shopBackground = "https://images.unsplash.com/photo-1574015974293-817f0ebf0e95?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

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
                <div className="bg-charcoal h-full w-4/5 max-w-sm overflow-auto p-4 border-r border-draugr-800">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">فیلترها</h3>
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
                      <h4 className="text-lg font-medium text-white mb-2">جستجو</h4>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="جستجوی محصولات..."
                          className="w-full bg-ash text-white py-2 px-3 pr-10 rounded-md focus:outline-none focus:ring-1 focus:ring-draugr-500"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">
                          <SearchIcon />
                        </span>
                      </div>
                    </div>
                    
                    {/* Categories */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">دسته‌بندی‌ها</h4>
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
                              className={`block w-full px-3 py-2 rounded-md cursor-pointer transition-colors ${
                                selectedCategories.includes(category.slug)
                                  ? 'bg-draugr-800 text-white'
                                  : 'text-gray-300 hover:bg-ash'
                              }`}
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Sort By */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">مرتب‌سازی</h4>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full bg-ash text-white py-2 px-3 rounded-md focus:outline-none focus:ring-1 focus:ring-draugr-500"
                      >
                        <option value="newest">جدیدترین</option>
                        <option value="price-low">ارزان‌ترین</option>
                        <option value="price-high">گران‌ترین</option>
                        <option value="name">بر اساس نام</option>
                      </select>
                    </div>
                    
                    {/* Reset Filters */}
                    <div className="pt-2">
                      <motion.button
                        onClick={resetFilters}
                        className="w-full bg-vampire-dark text-white py-2 px-4 rounded-md border border-draugr-800 hover:bg-vampire-primary transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        پاک کردن فیلترها
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Filters Sidebar - Desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block w-64 lg:w-72 bg-charcoal p-4 rounded-lg shadow-horror border border-draugr-900/50 h-fit sticky top-24"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <FilterIcon />
              <span className="mr-2">فیلترها</span>
            </h3>
            
            <div className="space-y-6">
              {/* Search */}
              <div>
                <h4 className="text-lg font-medium text-white mb-2">جستجو</h4>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="جستجوی محصولات..."
                    className="w-full bg-ash text-white py-2 px-3 pr-10 rounded-md focus:outline-none focus:ring-1 focus:ring-draugr-500"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <SearchIcon />
                  </span>
                </div>
              </div>
              
              {/* Categories */}
              <div>
                <h4 className="text-lg font-medium text-white mb-2">دسته‌بندی‌ها</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-hide">
                  {expandedCategories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.slug}`}
                        checked={selectedCategories.includes(category.slug)}
                        onChange={() => toggleCategory(category.slug)}
                        className="hidden"
                      />
                      <label
                        htmlFor={`category-${category.slug}`}
                        className={`block w-full px-3 py-2 rounded-md cursor-pointer transition-colors ${
                          selectedCategories.includes(category.slug)
                            ? 'bg-draugr-800 text-white'
                            : 'text-gray-300 hover:bg-ash'
                        }`}
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Sort By */}
              <div>
                <h4 className="text-lg font-medium text-white mb-2">مرتب‌سازی</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-ash text-white py-2 px-3 rounded-md focus:outline-none focus:ring-1 focus:ring-draugr-500"
                >
                  <option value="newest">جدیدترین</option>
                  <option value="price-low">ارزان‌ترین</option>
                  <option value="price-high">گران‌ترین</option>
                  <option value="name">بر اساس نام</option>
                </select>
              </div>
              
              {/* Reset Filters */}
              <div className="pt-2">
                <motion.button
                  onClick={resetFilters}
                  className="w-full bg-vampire-dark text-white py-2 px-4 rounded-md border border-draugr-800 hover:bg-vampire-primary transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  پاک کردن فیلترها
                </motion.button>
              </div>
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
            
            {/* Results Info - Mobile */}
            <div className="md:hidden text-center mb-4 text-white">
              <span>{sortedProducts.length} محصول یافت شد</span>
            </div>
            
            {/* Active Filters Display */}
            {(selectedCategories.length > 0 || searchTerm) && (
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
            
            {/* Products Display */}
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
            
            {/* Pagination - Static for demo */}
            {sortedProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex justify-center mt-10"
              >
                <div className="flex space-x-1 rtl">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-ash text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-draugr-800 text-white"
                  >
                    1
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-ash text-white"
                  >
                    2
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-ash text-white"
                  >
                    3
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-ash text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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