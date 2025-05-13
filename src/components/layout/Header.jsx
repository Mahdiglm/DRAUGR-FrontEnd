import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ cartItems, onCartClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const brandName = "DRAUGR";
  const navigate = useNavigate();

  // Sample categories data with subcategories
  const categories = [
    {
      name: "لباس و پوشاک",
      subcategories: ["لباس مردانه", "لباس زنانه", "کفش", "اکسسوری پوشاک"]
    },
    {
      name: "لوازم الکترونیکی",
      subcategories: ["موبایل", "لپ تاپ", "تبلت", "لوازم جانبی"]
    },
    {
      name: "اکسسوری",
      subcategories: ["ساعت", "زیورآلات", "عینک", "کیف و کوله"]
    },
    {
      name: "کتاب و سرگرمی",
      subcategories: ["کتاب", "بازی", "محصولات فرهنگی", "لوازم تحریر"]
    },
    {
      name: "ابزار و تجهیزات",
      subcategories: ["ابزار برقی", "ابزار دستی", "لوازم باغبانی", "تجهیزات ایمنی"]
    },
    {
      name: "خانه و آشپزخانه",
      subcategories: ["لوازم آشپزخانه", "دکوراسیون", "لوازم خواب", "لوازم حمام"]
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Typing animation effect
  useEffect(() => {
    if (isTyping) {
      if (typedText.length < brandName.length) {
        const timeout = setTimeout(() => {
          setTypedText(brandName.slice(0, typedText.length + 1));
        }, 200);
        return () => clearTimeout(timeout);
      } else {
        // Wait and then clear the text to restart
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
        return () => clearTimeout(timeout);
      }
    } else {
      // Reset after a delay
      const timeout = setTimeout(() => {
        setTypedText("");
        setIsTyping(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [typedText, isTyping]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-black text-white py-4 sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'shadow-[0_0_15px_rgba(255,0,0,0.3)]' : ''
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 flex justify-between items-center">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-xl md:text-2xl font-bold flex items-center relative w-44 md:w-56 cursor-pointer"
          onClick={() => navigate('/')}
        >
          {/* Fixed width container for the logo text to prevent layout shifts */}
          <div className="absolute left-0 top-0 h-full flex items-center">
            <span className="blood-text animate-pulse-slow relative">
              <span className="inline-block min-w-[76px] md:min-w-[96px]">{typedText || '\u00A0'}</span>
              <span className={`inline-block w-0.5 h-6 bg-draugr-500 absolute ml-1 ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
            </span>
            <span className="mr-1"> فروشگاه</span>
          </div>
        </motion.div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <NavLink to="/" label="خانه" />
          <NavLink to="/" label="محصولات" />
          <NavLink isCategory={true} label="دسته‌بندی‌ها" categories={categories} />
          <NavLink to="/" label="درباره ما" />
        </nav>
        
        <div className="flex items-center space-x-3 md:space-x-4">
          <motion.button 
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 0 12px rgba(255, 0, 0, 0.7)',
              textShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
            }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:block bg-gradient-to-r from-draugr-900 to-draugr-700 text-white px-4 py-2 rounded-md font-medium border border-draugr-600 hover:border-draugr-500 text-sm ml-3 md:ml-4 transition-all duration-300"
            onClick={() => navigate('/login')}
          >
            ورود
          </motion.button>

          <motion.div 
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ rotate: { duration: 0.5 } }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer"
            onClick={onCartClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartItems.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-draugr-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                {cartItems.length}
              </motion.span>
            )}
          </motion.div>
          
          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden text-white"
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed top-0 right-0 h-screen w-3/4 bg-gradient-to-b from-black to-draugr-950 shadow-[-10px_0px_30px_rgba(0,0,0,0.5)] z-50 overflow-y-auto"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            <div className="w-full h-full flex flex-col">
              {/* Menu Header with Close Button */}
              <div className="p-4 flex justify-between items-center border-b border-draugr-800">
                <span className="blood-text text-xl font-bold">{brandName}</span>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMobileMenu}
                  className="text-white p-1 rounded-full hover:bg-draugr-900"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </motion.button>
              </div>
              
              {/* Menu Items */}
              <motion.nav 
                className="flex flex-col p-4 flex-grow"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                <MobileNavLink to="/" label="خانه" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink to="/" label="محصولات" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink isCategory={true} label="دسته‌بندی‌ها" categories={categories} />
                <MobileNavLink to="/" label="درباره ما" onClick={() => setIsMobileMenuOpen(false)} />
                
                <div className="border-t border-draugr-800 my-4"></div>
                
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "#660000" }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-draugr-800 to-draugr-600 text-white px-4 py-3 rounded-md font-medium border border-draugr-600 text-sm mt-2 shadow-[0_0_15px_rgba(255,0,0,0.2)] w-full flex items-center justify-center"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  ورود به حساب کاربری
                </motion.button>
              </motion.nav>
              
              {/* Footer */}
              <div className="p-4 border-t border-draugr-800 mt-auto">
                <div className="text-sm text-gray-400">
                  © 2023 DRAUGR فروشگاه
                </div>
              </div>
            </div>
            
            {/* Background overlay */}
            <motion.div 
              className="fixed inset-0 z-40 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Desktop nav link component with enhanced hover effect
const NavLink = ({ to, label, isCategory = false, categories = [] }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div className="relative group">
      {isCategory ? (
        <motion.div 
          className="hover:text-draugr-500 ml-8 relative group inline-flex items-center cursor-pointer"
          whileHover={{ y: -2 }}
        >
          {label}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <motion.span 
            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-draugr-500 transition-all duration-300 group-hover:w-full"
            whileHover={{ width: "100%" }}
          ></motion.span>
        </motion.div>
      ) : (
        <motion.div 
          onClick={() => navigate(to)} 
          className="hover:text-draugr-500 ml-8 relative group inline-flex items-center cursor-pointer"
          whileHover={{ y: -2 }}
        >
          {label}
          <motion.span 
            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-draugr-500 transition-all duration-300 group-hover:w-full"
            whileHover={{ width: "100%" }}
          ></motion.span>
        </motion.div>
      )}
      
      {isCategory && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0 }}
            transition={{ 
              duration: 0.3,
              staggerChildren: 0.05,
              delayChildren: 0.1
            }}
            style={{ transformOrigin: 'top center' }}
            className="absolute right-0 mt-2 w-52 rounded-md shadow-lg bg-gradient-to-b from-black to-draugr-900 border border-draugr-700 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50"
          >
            <div className="rounded-md py-1">
              {categories.map((category, index) => (
                <CategoryItem key={index} category={category} index={index} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

// Category item with subcategories
const CategoryItem = ({ category, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="relative group/item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="block px-4 py-2 text-sm text-white hover:bg-draugr-800 hover:text-draugr-300 border-b border-draugr-800 last:border-0 flex justify-between items-center cursor-pointer"
        variants={{
          hidden: { opacity: 0, x: -20 },
          visible: { opacity: 1, x: 0 }
        }}
        initial="hidden"
        animate="visible"
        transition={{ 
          delay: index * 0.05,
          type: "spring",
          stiffness: 200,
          damping: 10
        }}
        whileHover={{ 
          textShadow: "0 0 8px rgba(255, 0, 0, 0.8)",
          color: "#ff0000"
        }}
      >
        <span>{category.name}</span>
        {category.subcategories && category.subcategories.length > 0 && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </motion.div>
      
      {/* Subcategory dropdown */}
      {category.subcategories && category.subcategories.length > 0 && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute right-full top-0 w-48 bg-gradient-to-b from-draugr-950 to-black border border-draugr-700 rounded-md shadow-horror mr-1 z-50"
              initial={{ opacity: 0, x: 20, scaleX: 0.8 }}
              animate={{ opacity: 1, x: 0, scaleX: 1 }}
              exit={{ opacity: 0, x: 10, scaleX: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ transformOrigin: 'right center' }}
            >
              <div className="rounded-md py-1">
                {category.subcategories.map((subcategory, subIndex) => (
                  <motion.div
                    key={subIndex}
                    className="block px-4 py-2 text-sm text-white hover:bg-draugr-800 hover:text-draugr-300 border-b border-draugr-800 last:border-0 cursor-pointer"
                    variants={{
                      hidden: { opacity: 0, x: 10 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    initial="hidden"
                    animate="visible"
                    transition={{ 
                      delay: subIndex * 0.03,
                      duration: 0.2
                    }}
                    whileHover={{ 
                      x: -5,
                      textShadow: "0 0 8px rgba(255, 0, 0, 0.8)",
                      color: "#ff0000"
                    }}
                  >
                    {subcategory}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

// Mobile nav link with animation
const MobileNavLink = ({ to, label, isCategory = false, categories = [], onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const navigate = useNavigate();
  
  const toggleSubcategory = (index) => {
    if (expandedCategory === index) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(index);
    }
  };
  
  const handleClick = () => {
    if (isCategory) {
      setIsOpen(!isOpen);
    } else if (to && onClick) {
      navigate(to);
      onClick();
    }
  };
  
  return (
    <motion.div className="mb-3">
      <motion.div 
        className="flex items-center justify-between py-3 cursor-pointer border-b border-draugr-900 hover:border-draugr-700 transition-colors duration-300" 
        variants={{
          hidden: { opacity: 0, x: 20 },
          show: { opacity: 1, x: 0 }
        }}
        onClick={handleClick}
      >
        <motion.div 
          className="text-lg font-medium hover:text-draugr-500 transform transition-all duration-300"
          whileHover={{ x: 5, color: "#ff0000", textShadow: "0 0 8px rgba(255, 0, 0, 0.3)" }}
        >
          {label}
        </motion.div>
        {isCategory && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="bg-draugr-900 rounded-full p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        )}
      </motion.div>
      
      {isCategory && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-md my-1 mr-4 border-r-2 border-draugr-700"
            >
              {categories.map((category, index) => (
                <div key={index} className="border-b border-draugr-900 last:border-0">
                  <motion.div 
                    className="flex items-center justify-between py-3 px-4 text-sm text-gray-200 hover:text-draugr-500 cursor-pointer"
                    variants={{
                      hidden: { opacity: 0, x: 10 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5, backgroundColor: "rgba(255, 0, 0, 0.1)" }}
                    onClick={() => toggleSubcategory(index)}
                  >
                    <span>{category.name}</span>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <motion.svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-3 w-3" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        animate={{ rotate: expandedCategory === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    )}
                  </motion.div>
                  
                  {/* Mobile subcategories with enhanced styling */}
                  {category.subcategories && (
                    <AnimatePresence>
                      {expandedCategory === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden bg-black bg-opacity-30 border-r border-draugr-700 mr-2 rounded-b-md"
                        >
                          {category.subcategories.map((subcategory, subIndex) => (
                            <motion.div
                              key={subIndex}
                              className="py-2 px-6 text-sm text-gray-300 hover:text-draugr-500 cursor-pointer hover:bg-draugr-950 border-b border-draugr-900 last:border-0 flex items-center"
                              variants={{
                                hidden: { opacity: 0, x: -5 },
                                visible: { opacity: 1, x: 0 }
                              }}
                              initial="hidden"
                              animate="visible"
                              transition={{ delay: subIndex * 0.03 }}
                              whileHover={{ x: 3 }}
                            >
                              <motion.span
                                className="w-1 h-1 rounded-full bg-draugr-700 inline-block mr-2"
                                variants={{
                                  hidden: { scale: 0 },
                                  visible: { scale: 1 }
                                }}
                                transition={{ delay: subIndex * 0.03 + 0.2 }}
                              />
                              {subcategory}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default Header; 