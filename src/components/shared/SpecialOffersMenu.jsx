import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const SpecialOffersMenu = ({ offers }) => {
  const categories = [...new Set(offers.map(offer => offer.category))];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Blood drip SVG
  const BloodDrip = ({ className }) => (
    <svg className={className} viewBox="0 0 100 20" preserveAspectRatio="none">
      <path 
        d="M0,0 Q5,5 10,0 Q15,5 20,0 Q25,5 30,0 Q35,5 40,0 Q45,5 50,0 Q55,5 60,0 Q65,5 70,0 Q75,5 80,0 Q85,5 90,0 Q95,5 100,0 L100,20 L0,20 Z" 
        fill="currentColor" 
      />
    </svg>
  );
  
  // Select the first offer from the selected category by default
  useEffect(() => {
    const firstOfferInCategory = offers.find(offer => offer.category === selectedCategory);
    setSelectedOffer(firstOfferInCategory || null);
  }, [selectedCategory, offers]);

  // Filter offers by the selected category
  const filteredOffers = offers.filter(offer => offer.category === selectedCategory);

  // Format price with comma separators and add Toman
  const formatPrice = (price) => {
    return `${price.toLocaleString()} تومان`;
  };

  // Mobile-specific compact category selector
  const MobileCategorySelector = () => (
    <div className="relative mb-6">
      <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
        {categories.map((category, index) => (
          <motion.button
            key={category}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-300 border border-gray-700/50'
            }`}
            onClick={() => setSelectedCategory(category)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  );

  // Mobile-specific offer cards with swipe-friendly design
  const MobileOfferCards = () => (
    <div className="space-y-3 mb-6">
      {filteredOffers.map((offer, index) => (
        <motion.div
          key={offer.id}
          className={`relative p-3 rounded-2xl border transition-all duration-300 ${
            selectedOffer?.id === offer.id
              ? 'bg-red-950/30 border-red-600/50 shadow-lg'
              : 'bg-black/30 border-gray-700/30'
          }`}
          onClick={() => setSelectedOffer(offer)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <img 
                src={offer.image} 
                alt={offer.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-md font-bold">
                {offer.discount}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-sm font-semibold mb-1 truncate">
                {offer.title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                {offer.description}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Mobile-specific detailed view with bottom sheet style
  const MobileDetailedView = () => (
    <AnimatePresence mode="wait">
      {selectedOffer && (
        <motion.div
          key={selectedOffer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="relative bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/30"
        >
          {/* Compact header */}
          <div className="relative h-40 overflow-hidden">
            <img 
              src={selectedOffer.image} 
              alt={selectedOffer.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            
            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex items-end justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white mb-1">
                    {selectedOffer.title}
                  </h2>
                  <p className="text-gray-300 text-xs line-clamp-2">
                    {selectedOffer.description}
                  </p>
                </div>
                <div className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold ml-3">
                  {selectedOffer.discount}
                </div>
              </div>
            </div>
          </div>

          {/* Compact products grid */}
          <div className="p-4">
            <h3 className="text-white text-sm font-semibold mb-3 flex items-center">
              <span className="w-4 h-4 mr-2 text-red-400">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15 5L12 8L9 5L12 2Z" />
                </svg>
              </span>
              اقلام ویژه
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {selectedOffer.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="bg-black/30 rounded-xl overflow-hidden border border-gray-700/30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative h-24 overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  
                  <div className="p-2">
                    <h4 className="text-white text-xs font-medium mb-1 truncate">
                      {item.name}
                    </h4>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs line-through">
                        {formatPrice(item.price * 1.2)}
                      </span>
                      <span className="text-red-400 text-xs font-bold">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Compact CTA */}
            <Link 
              to={`/special-offers/${selectedOffer.id}`}
              className="block w-full bg-red-600 text-white text-center py-3 rounded-xl font-semibold text-sm"
            >
              مشاهده کامل
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative mb-32 pt-12 pb-20"
    >
      {/* Background Fog Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/fog-texture.png')] opacity-30 animate-fog-drift"></div>
        <div className="absolute inset-0 bg-[url('/images/fog-texture-2.png')] opacity-20 animate-fog-drift-reverse"></div>
      </div>
      
      {/* Section Header with Ritual Elements */}
      <div className="relative mb-12 text-center">
        <div className="relative inline-block">
          <motion.h2 
            className="text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 font-ritual mb-3 px-12"
            animate={{ 
              textShadow: isHovering ? 
                "0 0 7px rgba(255,0,0,0.8), 0 0 10px rgba(255,0,0,0.5), 0 0 21px rgba(255,0,0,0.3)" : 
                "0 0 4px rgba(255,0,0,0.6), 0 0 7px rgba(255,0,0,0.3), 0 0 14px rgba(255,0,0,0.2)"
            }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            پیشنهادات ویژه دراگر
          </motion.h2>
          
          {/* Decorative Elements */}
          <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-6 opacity-80">
            <svg viewBox="0 0 24 24" fill="none" className="text-red-800">
              <path d="M12 2L15 5L12 8L9 5L12 2Z" fill="currentColor" />
              <path d="M12 22L9 19L12 16L15 19L12 22Z" fill="currentColor" />
              <path d="M2 12L5 9L8 12L5 15L2 12Z" fill="currentColor" />
              <path d="M22 12L19 15L16 12L19 9L22 12Z" fill="currentColor" />
              <path d="M12 10L14 12L12 14L10 12L12 10Z" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-6 opacity-80">
            <svg viewBox="0 0 24 24" fill="none" className="text-red-800">
              <path d="M12 2L15 5L12 8L9 5L12 2Z" fill="currentColor" />
              <path d="M12 22L9 19L12 16L15 19L12 22Z" fill="currentColor" />
              <path d="M2 12L5 9L8 12L5 15L2 12Z" fill="currentColor" />
              <path d="M22 12L19 15L16 12L19 9L22 12Z" fill="currentColor" />
              <path d="M12 10L14 12L12 14L10 12L12 10Z" fill="currentColor" />
            </svg>
          </div>
        </div>
        <p className="text-gray-400 text-base md:text-lg mt-1">کالاهای نفرین شده با <span className="text-red-500">تخفیف ویژه</span> را از دست ندهید</p>
        
        {/* Blood Drip Divider */}
        <BloodDrip className="h-4 w-full max-w-md mx-auto mt-4 text-red-900/80" />
      </div>
      
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="max-w-sm mx-auto px-4">
          <MobileCategorySelector />
          <MobileOfferCards />
          <MobileDetailedView />
        </div>
      </div>

      {/* Desktop Layout (unchanged from previous version) */}
      <div className="hidden md:block">
        {/* Category Navigation - Redesigned for Better Balance & Mobile-First */}
        <div className="relative mx-auto max-w-4xl mb-16 px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                className={`relative w-full sm:w-auto min-w-[200px] sm:min-w-[180px] md:min-w-[200px] 
                  py-4 px-6 rounded-xl font-medium text-sm md:text-base
                  overflow-hidden transition-all duration-500 ease-out
                  ${selectedCategory === category
                    ? 'bg-gradient-to-r from-red-900/90 to-red-800/90 text-white border-2 border-red-600/50 shadow-2xl shadow-red-900/40'
                    : 'bg-black/40 backdrop-blur-sm text-gray-300 border-2 border-gray-700/50 hover:border-red-700/50 hover:text-white'
                  }`}
                onClick={() => setSelectedCategory(category)}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -4,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
              >
                {/* Animated Background Gradient */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-red-500/30 to-red-600/20 opacity-0 rounded-xl"
                  animate={{ 
                    opacity: selectedCategory === category ? [0.3, 0.6, 0.3] : 0,
                    scale: selectedCategory === category ? [1, 1.02, 1] : 1
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: selectedCategory === category ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Subtle texture overlay for non-selected buttons */}
                {selectedCategory !== category && (
                  <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-white/10 to-transparent rounded-xl" />
                )}
                
                {/* Category Name with Enhanced Typography */}
                <span className="relative z-10 font-semibold tracking-wide">
                  {category}
                </span>
                
                {/* Selection Indicator */}
                {selectedCategory === category && (
                  <motion.div
                    className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/80 rounded-full"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 32, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  />
                )}
                
                {/* Hover glow effect */}
                <motion.div 
                  className="absolute inset-0 rounded-xl opacity-0 pointer-events-none"
                  whileHover={{ 
                    opacity: selectedCategory === category ? 0 : 1,
                    boxShadow: "0 0 30px rgba(239, 68, 68, 0.4), inset 0 0 20px rgba(239, 68, 68, 0.1)"
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Main Content Area - Enhanced Mobile-First Design */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Side: Offers List - Redesigned */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <div className="relative bg-black/30 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-800/50 h-full overflow-hidden">
                {/* Modern Corner Accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-red-600/30 rounded-tl-2xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-red-600/30 rounded-br-2xl pointer-events-none" />
                
                <h3 className="relative text-lg sm:text-xl text-white mb-6 flex items-center font-semibold">
                  <span className="inline-block w-6 h-6 mr-3 text-red-400">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-red-200">
                    {selectedCategory}
                  </span>
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
                  {filteredOffers.map((offer, offerIndex) => (
                    <motion.div
                      key={offer.id}
                      className={`relative cursor-pointer transition-all duration-300 overflow-hidden group 
                        bg-black/50 backdrop-blur-sm rounded-xl border-2 ${
                        selectedOffer?.id === offer.id
                          ? 'border-red-600/60 shadow-lg shadow-red-900/20 bg-red-950/20'
                          : 'border-gray-700/40 hover:border-red-600/40'
                      }`}
                      onClick={() => setSelectedOffer(offer)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: offerIndex * 0.1 }}
                      whileHover={{ 
                        y: -2,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-32 h-32 sm:h-24 overflow-hidden rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none">
                          {/* Enhanced gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                          
                          <img 
                            src={offer.image} 
                            alt={offer.title} 
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 filter brightness-75 contrast-110"
                          />
                          
                          {/* Discount badge - repositioned for mobile */}
                          <div className="absolute top-2 right-2 z-20 bg-red-600/90 backdrop-blur-sm border border-red-500/50 text-white px-2 py-1 text-xs font-bold rounded-md">
                            {offer.discount}
                          </div>
                        </div>
                        
                        <div className="p-3 sm:p-4 flex-1 relative">
                          {/* Selection indicator - enhanced */}
                          {selectedOffer?.id === offer.id && (
                            <div className="absolute top-0 right-3 w-3 h-3 bg-red-500 transform rotate-45 -translate-y-1.5 shadow-lg" />
                          )}
                          
                          <h4 className="text-white text-sm sm:text-base font-semibold mb-2 group-hover:text-red-300 transition-colors line-clamp-1">
                            {offer.title}
                          </h4>
                          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-2 group-hover:text-gray-300 transition-colors">
                            {offer.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Side: Detailed View - Enhanced */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <AnimatePresence mode="wait">
                {selectedOffer && (
                  <motion.div
                    key={selectedOffer.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative bg-black/30 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-800/50 h-full"
                  >
                    {/* Modern Corner Decorations */}
                    <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none z-30 opacity-60">
                      <div className="w-full h-full border-t-2 border-l-2 border-red-500/40 rounded-tl-2xl" />
                    </div>
                    <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none z-30 opacity-60">
                      <div className="w-full h-full border-t-2 border-r-2 border-red-500/40 rounded-tr-2xl" />
                    </div>
                    
                    {/* Header Image - Enhanced Mobile Design */}
                    <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80 z-10"
                        animate={{ 
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          ease: "easeInOut"
                        }}
                      />
                      
                      <motion.img 
                        src={selectedOffer.image} 
                        alt={selectedOffer.title} 
                        className="w-full h-full object-cover"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      />
                      
                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                          <div className="flex-1">
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-bold drop-shadow-lg mb-2">
                              {selectedOffer.title}
                            </h2>
                            <p className="text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                              {selectedOffer.description}
                            </p>
                          </div>
                          <motion.div
                            className="bg-black/80 backdrop-blur-sm text-red-400 border-2 border-red-600/50 px-4 py-3 rounded-xl flex flex-col items-center min-w-[100px]"
                            animate={{ 
                              boxShadow: ["0 0 10px rgba(239,68,68,0.3)", "0 0 20px rgba(239,68,68,0.5)", "0 0 10px rgba(239,68,68,0.3)"]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <span className="text-xs sm:text-sm font-medium mb-1">تخفیف ویژه</span>
                            <span className="text-lg sm:text-xl lg:text-2xl font-bold">{selectedOffer.discount}</span>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Products Section - Mobile-First Enhanced */}
                    <div className="p-4 sm:p-6 lg:p-8">
                      <div className="flex items-center mb-6 sm:mb-8">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-red-400">
                          <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L15 5L12 8L9 5L12 2Z" fill="currentColor" />
                            <path d="M12 22L9 19L12 16L15 19L12 22Z" fill="currentColor" />
                            <circle cx="12" cy="12" r="3" fill="currentColor" />
                          </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white relative inline-block">
                          <span className="relative z-10">اقلام ویژه</span>
                          <motion.span 
                            className="absolute -inset-1 bg-red-900/20 rounded-lg blur-sm"
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          />
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {selectedOffer.items.map((item, itemIndex) => (
                          <motion.div
                            key={item.id}
                            className="relative bg-black/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden group hover:border-red-600/50 transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: itemIndex * 0.1 }}
                            whileHover={{ 
                              y: -4,
                              transition: { duration: 0.2 }
                            }}
                          >
                            <div className="relative h-40 sm:h-44 overflow-hidden">
                              {/* Enhanced gradient overlay */}
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10" />
                              
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 filter brightness-80 contrast-110"
                              />
                            </div>
                            
                            <div className="p-4 relative">
                              <h4 className="text-white text-sm sm:text-base font-semibold mb-3 group-hover:text-red-300 transition-colors line-clamp-1">
                                {item.name}
                              </h4>
                              
                              <div className="flex justify-between items-center mb-4">
                                <div className="text-gray-500 text-xs sm:text-sm line-through">
                                  {formatPrice(item.price * 1.2)}
                                </div>
                                <div className="text-red-400 text-sm sm:text-base font-bold">
                                  {formatPrice(item.price)}
                                </div>
                              </div>
                              
                              <Link 
                                to={`/product/${item.id}`} 
                                className="block text-center py-2.5 px-4 text-xs sm:text-sm text-gray-300 
                                  relative overflow-hidden group border border-gray-600/50 bg-black/30 
                                  hover:text-white hover:border-red-600/50 transition-all duration-300 rounded-lg
                                  hover:bg-red-950/20"
                              >
                                <span className="relative z-10 font-medium">مشاهده محصول</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                              </Link>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Enhanced CTA Button */}
                      <div className="mt-8 sm:mt-12 text-center">
                        <Link 
                          to={`/special-offers/${selectedOffer.id}`}
                          className="relative inline-block group"
                        >
                          <motion.span 
                            className="relative z-10 inline-block bg-gradient-to-r from-red-700 to-red-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-red-600/50 font-semibold text-sm sm:text-base"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span className="flex items-center justify-center">
                              <span>مشاهده پیشنهاد کامل</span>
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24" fill="none">
                                <path d="M14 5L21 12M21 12L14 19M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </span>
                          </motion.span>
                          
                          {/* Enhanced Glow Effect */}
                          <motion.span 
                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
                            animate={{ 
                              boxShadow: [
                                "0 0 0 0 rgba(239,68,68,0)",
                                "0 0 0 6px rgba(239,68,68,0.3)",
                                "0 0 0 0 rgba(239,68,68,0)"
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpecialOffersMenu;
