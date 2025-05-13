import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ cartItems, onCartClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const brandName = "DRAUGR";
  const location = useLocation();

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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

  // Blood drop animation for logo - removing this
  const bloodDropVariants = {
    initial: { y: -5, opacity: 0 },
    animate: { 
      y: 15, 
      opacity: [0, 1, 1, 0],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatDelay: 4,
        ease: "easeInOut" 
      }
    }
  };

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
          className="text-xl md:text-2xl font-bold flex items-center relative w-44 md:w-56"
        >
          {/* Fixed width container for the logo text to prevent layout shifts */}
          <Link to="/" className="absolute left-0 top-0 h-full flex items-center">
            <span className="blood-text animate-pulse-slow relative">
              <span className="inline-block min-w-[76px] md:min-w-[96px]">{typedText || '\u00A0'}</span>
              <span className={`inline-block w-0.5 h-6 bg-draugr-500 absolute ml-1 ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
            </span>
            <span className="mr-1"> فروشگاه</span>
          </Link>
        </motion.div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <NavLink to="/" label="خانه" active={location.pathname === '/'} />
          <NavLink to="/products" label="محصولات" active={location.pathname === '/products'} />
          <NavLink to="#" label="دسته‌بندی‌ها" isCategory={true} categories={categories} />
          <NavLink to="/about" label="درباره ما" active={location.pathname === '/about'} />
        </nav>
        
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Login/Sign Up Buttons */}
          {location.pathname !== '/login' && location.pathname !== '/signup' && (
            <div className="hidden sm:flex space-x-2">
              <Link to="/login">
                <motion.button 
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 0 12px rgba(255, 0, 0, 0.7)',
                    textShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent text-white px-3 py-1.5 rounded-md font-medium border border-draugr-800 hover:border-draugr-500 text-sm ml-2 transition-all duration-300"
                >
                  ورود
                </motion.button>
              </Link>
              
              <Link to="/signup">
                <motion.button 
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 0 12px rgba(255, 0, 0, 0.7)',
                    textShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-draugr-900 to-draugr-700 text-white px-3 py-1.5 rounded-md font-medium border border-draugr-600 hover:border-draugr-500 text-sm transition-all duration-300"
                >
                  ثبت نام
                </motion.button>
              </Link>
            </div>
          )}

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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-charcoal shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-2">
              <MobileNavLink to="/" label="خانه" active={location.pathname === '/'} />
              <MobileNavLink to="/products" label="محصولات" active={location.pathname === '/products'} />
              <MobileNavLink to="#" label="دسته‌بندی‌ها" isCategory={true} categories={categories} />
              <MobileNavLink to="/about" label="درباره ما" active={location.pathname === '/about'} />
              
              {/* Mobile Login/Signup */}
              {location.pathname !== '/login' && location.pathname !== '/signup' && (
                <div className="py-2 flex justify-evenly">
                  <Link to="/login" className="w-1/2 ml-1">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-transparent text-white px-3 py-2 rounded-md font-medium border border-draugr-800 text-sm transition-all duration-300"
                    >
                      ورود
                    </motion.button>
                  </Link>
                  
                  <Link to="/signup" className="w-1/2 mr-1">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-draugr-900 to-draugr-700 text-white px-3 py-2 rounded-md font-medium border border-draugr-600 text-sm transition-all duration-300"
                    >
                      ثبت نام
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Updated NavLink component to use Link from react-router-dom
const NavLink = ({ to, label, active = false, isCategory = false, categories = [] }) => (
  <div className="relative group">
    <Link to={to}>
      <motion.span
        className={`text-sm inline-block py-2 pr-4 pl-3 cursor-pointer ${
          active ? 'text-draugr-500' : 'text-gray-200'
        } hover:text-draugr-400`}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {label}
      </motion.span>
    </Link>
    
    {/* Dropdown for Categories */}
    {isCategory && (
      <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 bg-charcoal border border-draugr-900 rounded-md shadow-horror w-56 right-0 mt-1 transition-all duration-300 z-20">
        <div className="py-2">
          {categories.map((category, index) => (
            <CategoryItem key={index} category={category} index={index} />
          ))}
        </div>
      </div>
    )}
  </div>
);

// Category item with subcategories
const CategoryItem = ({ category, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="relative group/item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.a
        href="#"
        className="block px-4 py-2 text-sm text-white hover:bg-draugr-800 hover:text-draugr-300 border-b border-draugr-800 last:border-0 flex justify-between items-center"
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
      </motion.a>
      
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
                  <motion.a
                    key={subIndex}
                    href="#"
                    className="block px-4 py-2 text-sm text-white hover:bg-draugr-800 hover:text-draugr-300 border-b border-draugr-800 last:border-0"
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
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

// Update MobileNavLink to use Link from react-router-dom
const MobileNavLink = ({ to, label, active = false, isCategory = false, categories = [] }) => {
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(Array(categories.length).fill(false));
  
  const toggleSubcategory = (index) => {
    setIsSubcategoryOpen(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };
  
  return (
    <div className="py-1 border-b border-gray-800">
      {isCategory ? (
        <div>
          <motion.div 
            className="flex items-center justify-between py-2 text-gray-200 hover:text-draugr-400 cursor-pointer"
            onClick={() => {}}
            whileHover={{ backgroundColor: 'rgba(255, 0, 0, 0.05)' }}
          >
            <span className="text-sm">{label}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
          <div className="pl-4">
            {categories.map((category, index) => (
              <div key={index} className="border-r border-gray-800 mr-2">
                <motion.div 
                  className="flex items-center justify-between py-2 text-gray-300 hover:text-draugr-400 cursor-pointer pr-2"
                  onClick={() => toggleSubcategory(index)}
                  whileHover={{ backgroundColor: 'rgba(255, 0, 0, 0.05)' }}
                >
                  <span className="text-sm">{category.name}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transition-transform duration-200 ${isSubcategoryOpen[index] ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
                <AnimatePresence>
                  {isSubcategoryOpen[index] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 border-r border-gray-800 mr-2"
                    >
                      {category.subcategories.map((subcategory, subIndex) => (
                        <motion.div 
                          key={subIndex}
                          className="py-2 text-sm text-gray-400 hover:text-draugr-400 cursor-pointer pr-2"
                          whileHover={{ x: 5, backgroundColor: 'rgba(255, 0, 0, 0.05)' }}
                        >
                          {subcategory}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Link to={to}>
          <motion.div 
            className={`py-2 text-sm ${active ? 'text-draugr-500' : 'text-gray-200'} hover:text-draugr-400`}
            whileHover={{ x: 5, backgroundColor: 'rgba(255, 0, 0, 0.05)' }}
          >
            {label}
          </motion.div>
        </Link>
      )}
    </div>
  );
};

export default Header; 