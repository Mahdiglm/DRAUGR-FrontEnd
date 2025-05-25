import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const SpecialOffersMenu = ({ offers }) => {
  const categories = [...new Set(offers.map(offer => offer.category))];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  
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
      
      {/* Category Navigation - Ritual Tablets */}
      <div className="relative mx-auto max-w-5xl mb-12 px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              className={`relative py-3 px-1 rounded border text-sm font-medium overflow-hidden transition-all duration-300 ${
                selectedCategory === category
                  ? 'border-red-800 text-white'
                  : 'border-gray-800 text-gray-400 hover:text-white'
              }`}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
            >
              {/* Background Effects */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${
                selectedCategory === category
                  ? 'opacity-100'
                  : 'opacity-0'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 to-black"></div>
                <div className="absolute inset-0 bg-[url('/images/noise-texture.png')] mix-blend-overlay opacity-20"></div>
                {/* Ancient Runes Background */}
                <div className="absolute inset-0 opacity-10 bg-[url('/images/rune-pattern.png')]"></div>
              </div>
              
              {/* Category Name */}
              <span className="relative z-10">{category}</span>
              
              {/* Glowing Effect for Selected */}
              {selectedCategory === category && (
                <motion.div 
                  className="absolute inset-0 bg-red-900/20 pointer-events-none"
                  animate={{ 
                    boxShadow: ["inset 0 0 10px rgba(220,38,38,0.3)", "inset 0 0 20px rgba(220,38,38,0.5)", "inset 0 0 10px rgba(220,38,38,0.3)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Cursed Artifacts Grid */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="relative bg-black/50 rounded-lg p-5 border border-gray-800 h-full backdrop-blur-sm overflow-hidden">
              {/* Decorative Corner Elements */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-red-900/50 rounded-tl-lg pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-red-900/50 rounded-tr-lg pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-red-900/50 rounded-bl-lg pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-red-900/50 rounded-br-lg pointer-events-none"></div>
              
              <h3 className="relative text-xl text-white mb-6 flex items-center">
                <span className="inline-block w-6 h-6 mr-2">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF0000" strokeWidth="1.5"/>
                    <path d="M12 6V12L16 14" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-red-200">
                  {selectedCategory}
                </span>
                <BloodDrip className="h-3 w-full absolute -bottom-3 left-0 text-red-900/50" />
              </h3>
              
              <div className="space-y-4">
                {filteredOffers.map((offer) => (
                  <motion.div
                    key={offer.id}
                    className={`relative cursor-pointer transition-all duration-300 overflow-hidden group bg-black/70 border ${
                      selectedOffer?.id === offer.id
                        ? 'border-red-800/60 shadow-[0_0_15px_rgba(255,0,0,0.2)]'
                        : 'border-gray-800/40'
                    }`}
                    onClick={() => setSelectedOffer(offer)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ borderRadius: '1px' }}
                  >
                    {/* Subtle texture overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                      <div className="w-full h-full" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10,10 L20,20 M20,10 L10,20 M30,30 L40,40 M40,30 L30,40' stroke='%23ff0000' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`
                      }}></div>
                    </div>

                    <div className="flex flex-col">
                      <div className="relative w-full h-28 overflow-hidden">
                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                        
                        <img 
                          src={offer.image} 
                          alt={offer.title} 
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 filter brightness-70 contrast-110"
                        />
                        
                        {/* Featured badge */}
                        {offer.featured && (
                          <div className="absolute top-2 right-2 z-20">
                            <div className="bg-black/90 border border-red-900/60 text-xs text-red-400 font-medium py-1 px-2 flex items-center">
                              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L15 5L12 8L9 5L12 2Z" fill="currentColor" />
                              </svg>
                              انتخاب
                            </div>
                          </div>
                        )}
                        
                        {/* Discount badge */}
                        <div className="absolute bottom-2 left-2 z-20 bg-black/90 border border-red-900/50 text-xs text-red-400 px-2 py-1">
                          {offer.discount}
                        </div>
                      </div>
                      
                      <div className="p-3 relative">
                        {/* Selection indicator */}
                        {selectedOffer?.id === offer.id && (
                          <div className="absolute top-0 right-3 w-2 h-2 bg-red-600 transform rotate-45 -translate-y-1"></div>
                        )}
                        
                        <h4 className="text-white text-sm font-medium mb-1 group-hover:text-red-300 transition-colors">
                          {offer.title}
                        </h4>
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 group-hover:text-gray-400 transition-colors">
                          {offer.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
                      boxShadow: 'inset 0 0 15px rgba(255, 0, 0, 0.05)'
                    }}></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Side: Detailed Artifact View */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <AnimatePresence mode="wait">
              {selectedOffer && (
                <motion.div
                  key={selectedOffer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative bg-black/50 rounded-lg overflow-hidden border border-gray-800 h-full backdrop-blur-sm"
                >
                  {/* Ritualistic Corner Decorations */}
                  <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none z-30">
                    <svg viewBox="0 0 64 64" fill="none">
                      <path d="M0 0L64 0L0 64L0 0Z" fill="#450a0a" fillOpacity="0.3" />
                      <path d="M0 0L40 0L0 40L0 0Z" fill="#450a0a" fillOpacity="0.5" />
                      <path d="M0 0L20 0L0 20L0 0Z" fill="#450a0a" fillOpacity="0.7" />
                    </svg>
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none z-30">
                    <svg viewBox="0 0 64 64" fill="none">
                      <path d="M64 0L0 0L64 64L64 0Z" fill="#450a0a" fillOpacity="0.3" />
                      <path d="M64 0L24 0L64 40L64 0Z" fill="#450a0a" fillOpacity="0.5" />
                      <path d="M64 0L44 0L64 20L64 0Z" fill="#450a0a" fillOpacity="0.7" />
                    </svg>
                  </div>
                  
                  {/* Header Image with Horror Effects */}
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black z-10"
                      animate={{ 
                        backgroundPosition: ['0% 0%', '100% 100%'],
                        opacity: [0.7, 0.9]
                      }}
                      transition={{ 
                        duration: 20, 
                        repeat: Infinity, 
                        repeatType: "reverse" 
                      }}
                    ></motion.div>
                    
                    <motion.img 
                      src={selectedOffer.image} 
                      alt={selectedOffer.title} 
                      className="w-full h-full object-cover"
                      animate={{ scale: 1.05 }}
                      transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                    />
                    
                    {/* Animated Fog Overlay */}
                    <div className="absolute inset-0 bg-[url('/images/fog-texture-3.png')] bg-cover opacity-20 mix-blend-overlay animate-fog-slow z-10"></div>
                    
                    {/* Vignette Effect */}
                    <div className="absolute inset-0 bg-radial-gradient z-10"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                      <div className="flex flex-col md:flex-row md:items-end justify-between">
                        <div>
                          <h2 className="text-2xl md:text-4xl text-white font-bold drop-shadow-lg mb-2">
                            {selectedOffer.title}
                          </h2>
                          <p className="text-gray-300 text-sm md:text-base max-w-2xl">
                            {selectedOffer.description}
                          </p>
                        </div>
                        <motion.div
                          className="bg-black/80 text-red-500 border border-red-900/50 px-4 py-2 rounded mt-3 md:mt-0 inline-flex md:flex-col items-center"
                          animate={{ 
                            boxShadow: ["0 0 5px rgba(220,38,38,0.3)", "0 0 10px rgba(220,38,38,0.5)", "0 0 5px rgba(220,38,38,0.3)"]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <span className="text-sm mr-2 md:mr-0 md:mb-1">تخفیف ویژه</span>
                          <span className="text-lg md:text-xl font-bold">{selectedOffer.discount}</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Products Section with Horror Styling */}
                  <div className="p-5 md:p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 mr-3">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M19 5L5 19" stroke="#ff0000" strokeWidth="1.5" />
                          <path d="M5 5L19 19" stroke="#ff0000" strokeWidth="1.5" />
                          <circle cx="12" cy="12" r="10" stroke="#ff0000" strokeWidth="1.5" />
                          <circle cx="12" cy="12" r="4" stroke="#ff0000" strokeWidth="1.5" />
                        </svg>
                      </div>
                      <h3 className="text-xl md:text-2xl font-ritual text-white relative inline-block">
                        <span className="relative z-10">اقلام نفرین شده</span>
                        <motion.span 
                          className="absolute -inset-1 bg-red-900/10 rounded blur-sm"
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        ></motion.span>
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {selectedOffer.items.map((item) => (
                        <motion.div
                          key={item.id}
                          className="relative bg-black/80 border border-gray-800/40 overflow-hidden group"
                          whileHover={{ y: -3 }}
                          transition={{ duration: 0.3 }}
                          style={{ borderRadius: '1px' }}
                        >
                          {/* Subtle claw mark texture */}
                          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                              <path d="M10,10 L90,90 M20,10 L90,80 M30,10 L90,70" stroke="#ff0000" strokeWidth="0.5" fill="none" />
                            </svg>
                          </div>
                          
                          <div className="relative h-36 overflow-hidden">
                            {/* Dark gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70 z-10"></div>
                            
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 filter brightness-75 contrast-110"
                            />
                            
                            {/* Subtle grain texture */}
                            <div className="absolute inset-0 opacity-15 mix-blend-overlay z-10" style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                            }}></div>
                          </div>
                          
                          <div className="p-4 relative">
                            <h4 className="text-white text-sm font-medium mb-3 group-hover:text-red-300 transition-colors">
                              {item.name}
                            </h4>
                            
                            <div className="flex justify-between items-center mb-3">
                              <div className="text-gray-600 text-xs line-through">
                                {formatPrice(item.price * 1.2)}
                              </div>
                              <div className="text-red-400 text-sm font-semibold">
                                {formatPrice(item.price)}
                              </div>
                            </div>
                            
                            <Link 
                              to={`/product/${item.id}`} 
                              className="block text-center py-2 px-4 text-xs text-gray-300 relative overflow-hidden group border border-gray-700/50 bg-black/40 hover:text-red-300 hover:border-red-900/40 transition-all duration-300"
                              style={{ borderRadius: '1px' }}
                            >
                              <span className="relative z-10">مشاهده محصول</span>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                            </Link>
                          </div>
                          
                          {/* Hover glow effect */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
                            boxShadow: 'inset 0 0 15px rgba(255, 0, 0, 0.08), 0 0 10px rgba(255, 0, 0, 0.05)'
                          }}></div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* CTA Button - Ritualistic Styling */}
                    <div className="mt-12 text-center">
                      <Link 
                        to={`/special-offers/${selectedOffer.id}`}
                        className="relative inline-block overflow-hidden group"
                      >
                        {/* Button with Pulse Effect */}
                        <span className="relative z-10 inline-block bg-gradient-to-br from-red-800 to-red-950 text-white px-8 py-3 rounded border border-red-900/50">
                          <span className="flex items-center justify-center">
                            <span>خرید این مجموعه نفرین شده</span>
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                              <path d="M14 5L21 12M21 12L14 19M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </span>
                        
                        {/* Glowing Outline Effect */}
                        <motion.span 
                          className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 pointer-events-none"
                          animate={{ 
                            boxShadow: [
                              "0 0 0 0 rgba(220,38,38,0)",
                              "0 0 0 4px rgba(220,38,38,0.3)",
                              "0 0 0 0 rgba(220,38,38,0)"
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        ></motion.span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpecialOffersMenu;
