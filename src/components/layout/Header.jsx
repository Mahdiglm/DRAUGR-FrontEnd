import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = ({ cartItems, onCartClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const brandName = "DRAUGR";
  const navigate = useNavigate();
  const location = useLocation();

  // Updated navigation structure based on new requirements
  const navigationItems = [
    {
      name: "خانه",
      path: "/",
      subcategories: []
    },
    {
      name: "فروشگاه",
      path: "/shop",
      subcategories: [
        {
          name: "اکسسوری",
          items: ["دستبند", "گردنبند", "پیک", "فندک", "وست", "کامیک", "ویجا بورد", "زیرسیگاری", "ماگ", "چوب بیسبال ها"]
        },
        {
          name: "کتاب‌های نایاب",
          items: []
        },
        {
          name: "انجیل شیطانی",
          items: []
        }
      ]
    },
    {
      name: "پیشنهادات ویژه",
      path: "/special-offers",
      subcategories: []
    },
    {
      name: "پیگیری سفارش",
      path: "/order-tracking",
      subcategories: []
    },
    {
      name: "درباره ما",
      path: "/about",
      subcategories: []
    },
    {
      name: "بلاگ / مقالات",
      path: "/blog",
      subcategories: []
    }
  ];

  // Listen for route changes and close mobile menu when navigation occurs
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      document.body.classList.remove('menu-open');
    }
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    // Ensure menu-open class is removed on unmount
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, []);

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
            <div className="flex items-center gap-4">
              <div className="blood-text animate-pulse-slow">{typedText || '\u00A0'}</div>
              <div className="h-6 w-0.5 bg-draugr-500 animate-pulse"></div>
              <div>فروشگاه</div>
            </div>
          </div>
        </motion.div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4">
          {navigationItems.map((item, index) => (
            <NavLink 
              key={index}
              to={item.path} 
              label={item.name} 
              isNested={item.name === "فروشگاه" && item.subcategories.length > 0}
              navItem={item}
            />
          ))}
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
      
      {/* Mobile Menu with separate overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Background overlay with subtle blur effect */}
            <motion.div 
              className="fixed inset-0 z-40 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={toggleMobileMenu}
              style={{ 
                cursor: 'pointer',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                MozBackdropFilter: 'blur(6px)'
              }}
            />

            {/* Menu content */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden fixed top-0 right-0 h-screen w-3/4 bg-gradient-to-b from-black to-draugr-950 shadow-[-10px_0px_30px_rgba(0,0,0,0.5)] z-50 overflow-y-auto"
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
                
                {/* Mobile Navigation Links */}
                <div className="py-4 px-4 overflow-y-auto flex-1">
                  <div className="flex flex-col space-y-1">
                    {navigationItems.map((item, index) => (
                      <MobileNavLink 
                        key={index}
                        to={item.path} 
                        label={item.name} 
                        isNested={item.name === "فروشگاه" && item.subcategories.length > 0}
                        navItem={item}
                        onClick={toggleMobileMenu}
                      />
                    ))}
                  </div>

                  {/* Login Button (Mobile) */}
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-draugr-900 to-draugr-700 text-white py-3 rounded-md font-medium border border-draugr-600 hover:border-draugr-500 mt-6 transition-all duration-300"
                    onClick={() => {
                      navigate('/login');
                      toggleMobileMenu();
                    }}
                  >
                    ورود / ثبت نام
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Updated NavLink component for desktop navigation
const NavLink = ({ to, label, isNested = false, navItem }) => {
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  // Handle mouseenter with delay to prevent accidental hover
  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsHovering(true);
  };
  
  // Handle mouseleave with delay to allow movement to dropdown
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovering(false);
    }, 100);
  };
  
  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsHovering(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
    
  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isHovering) {
        setIsHovering(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHovering]);
  
  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        className={`cursor-pointer text-white text-sm font-medium px-2 py-2 mx-1 rounded-md transition-colors duration-200 relative group ${
          isHovering ? 'text-draugr-500 bg-black bg-opacity-80' : 'hover:text-draugr-300'
        }`}
        onClick={() => isNested ? null : navigate(to)}
      >
        <div className="flex items-center space-x-1 rtl:space-x-reverse">
          <span>{label}</span>
          {isNested && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 transition-transform ${isHovering ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
        </div>
        {/* Animated red underline on hover */}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-draugr-500 transition-all duration-300 group-hover:w-full"></span>
      </motion.div>
      
      {/* Enhanced dropdown menu with multiple columns for shop */}
      {isNested && isHovering && navItem.name === "فروشگاه" && (
            <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full right-0 mt-1 py-2 bg-black border border-draugr-800 shadow-lg rounded-md z-10 overflow-hidden min-w-fit text-right"
          style={{ 
            minWidth: '650px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
            >
          {/* Multi-column layout for Shop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3">
            {navItem.subcategories.map((category, idx) => (
              <div key={idx} className="p-2">
                <h3 className="text-draugr-500 font-bold text-sm pb-2 border-b border-draugr-900 mb-2">
                  {category.name}
                </h3>
                <ul className="space-y-1">
                  {category.items && category.items.length > 0 ? (
                    category.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <Link 
                          to={`/shop/${category.name.toLowerCase().replace(/\s+/g, '-')}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-4 py-1.5 text-sm text-gray-300 hover:bg-draugr-900 hover:text-white transition-colors rounded"
                        >
                          {item}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li>
                      <Link 
                        to={`/shop/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-4 py-1.5 text-sm text-gray-300 hover:bg-draugr-900 hover:text-white transition-colors rounded"
                  >
                        {category.name}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
                ))}
              </div>
            </motion.div>
          )}
    </div>
  );
};

// Updated MobileNavLink component for mobile navigation
const MobileNavLink = ({ to, label, isNested = false, navItem, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState(-1);
  const navigate = useNavigate();
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleCategory = (index) => {
    setActiveCategory(activeCategory === index ? -1 : index);
  };
  
  const handleClick = () => {
    if (!isNested) {
      navigate(to);
      if (onClick) onClick();
    } else {
      toggleExpanded();
    }
  };
  
  return (
    <div className="border-b border-draugr-800 last:border-b-0">
      <div 
        className="flex justify-between items-center py-3 px-2 text-white hover:bg-draugr-900 transition-all duration-200 rounded-sm cursor-pointer"
        onClick={handleClick}
      >
        <span className="font-medium">{label}</span>
        {isNested && (
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        )}
      </div>
      
      {/* Only show subcategories for فروشگاه (Shop) */}
      {isNested && isExpanded && navItem.name === "فروشگاه" && (
            <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
          className="bg-draugr-950 pl-4 py-2"
        >
          {/* Special accordion style for Shop in mobile view */}
          <div className="space-y-1">
            {navItem.subcategories.map((category, idx) => (
              <div key={idx} className="border-b border-draugr-800 last:border-b-0 pb-2">
                <div 
                  className="flex justify-between items-center py-2 px-2 text-white cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(idx);
                  }}
                  >
                  <span className="text-sm font-medium text-draugr-400">{category.name}</span>
                  {category.items && category.items.length > 0 && (
                      <motion.svg 
                        xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      animate={{ rotate: activeCategory === idx ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    )}
                </div>
                  
                {category.items && category.items.length > 0 && activeCategory === idx && (
                        <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pr-2 pl-4 py-1"
                        >
                    {category.items.map((item, itemIdx) => (
                      <Link 
                        key={itemIdx}
                        to={`/shop/${category.name.toLowerCase().replace(/\s+/g, '-')}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block py-1.5 text-xs text-gray-400 hover:text-gray-200"
                        onClick={onClick}
                      >
                        {item}
                      </Link>
                          ))}
                        </motion.div>
                      )}
                
                {(!category.items || category.items.length === 0) && (
                  <Link 
                    to={`/shop/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block py-1.5 px-2 text-xs text-gray-400 hover:text-gray-200"
                    onClick={onClick}
                  >
                    {category.name}
                  </Link>
                  )}
                </div>
              ))}
          </div>
            </motion.div>
      )}
    </div>
  );
};

export default Header; 