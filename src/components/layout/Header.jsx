import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import pfpIcon from '../../assets/pfp-icon.png';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ cartItems, onCartClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);
  const brandName = "DRAUGR";
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();

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
      subcategories: [
        {
          name: "پک‌های ویژه",
          items: ["پک آیین تاریک", "پک هالووین", "پک طلسم‌ها", "پک گاتیک"]
        },
        {
          name: "تخفیف‌های فصلی",
          items: ["تخفیف زمستانی", "حراج شب یلدا", "فروش ویژه هالووین"]
        },
        {
          name: "محصولات محدود",
          items: ["کالکشن مخصوص", "آیتم‌های کمیاب", "انحصاری دراوگر"]
        }
      ]
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

  // Handle clicks outside the mobile menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
          document.body.classList.remove('menu-open');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

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

  // Handle clicks outside the user dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle user logout
  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate('/');
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-black text-white py-5 sm:py-4 md:py-3 sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'shadow-[0_0_15px_rgba(255,0,0,0.3)]' : ''
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-5 md:px-4 flex justify-between items-center">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-lg sm:text-xl md:text-2xl font-bold flex items-center relative w-36 sm:w-44 md:w-56 cursor-pointer"
          onClick={() => navigate('/')}
        >
          {/* Fixed width container for the logo text to prevent layout shifts */}
          <div className="absolute left-0 top-0 h-full flex items-center">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="blood-text animate-pulse-slow">{typedText || '\u00A0'}</div>
              <div className="h-4 sm:h-5 md:h-6 w-0.5 bg-draugr-500 animate-pulse"></div>
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
        
        {/* Header right section: improved for mobile */}
        <div className="flex items-center">
          {/* User Account Button - Updated for authentication */}
          <div className="relative" ref={userDropdownRef}>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              transition={{ 
                scale: { duration: 0.3, ease: "easeOut" } 
              }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer"
              onClick={() => isAuthenticated ? setShowUserDropdown(!showUserDropdown) : navigate('/login')}
            >
              <img 
                src={pfpIcon} 
                alt={isAuthenticated ? `پروفایل ${user?.name || 'کاربر'}` : "ورود"} 
                className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full object-cover transition-all duration-300 ${
                  isAuthenticated ? 'border-2 border-green-500' : 'border-2 border-draugr-600'
                }`}
              />
              {isAuthenticated && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
              )}
            </motion.div>
            
            {/* User Dropdown */}
            {isAuthenticated && showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-black bg-opacity-50 border border-draugr-900/30 rounded-lg shadow-xl z-50 text-right" dir="rtl">
                <div className="p-3 border-b border-gray-700">
                  <p className="font-medium text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                      حساب کاربری
                    </div>
                  </Link>
                  <Link
                    to="/order-tracking"
                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      سفارشات
                    </div>
                  </Link>
                  <Link
                    to="/dashboard/wishlist"
                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      علاقه‌مندی‌ها
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-right px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white"
                  >
                    <div className="flex items-center text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      خروج
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Spacer div with adjusted spacing for mobile */}
          <div className="w-5 sm:w-4 md:w-4"></div>

          <motion.div 
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            initial={{ scale: 1, rotate: 0 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              rotate: { duration: 0.5 },
              scale: { duration: 0.3, ease: "easeOut" } 
            }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer"
            onClick={onCartClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartItems.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-draugr-500 text-white rounded-full w-5 h-5 sm:w-5 sm:h-5 flex items-center justify-center text-[0.65rem] sm:text-xs"
              >
                {cartItems.length}
              </motion.span>
            )}
          </motion.div>
          
          {/* Another spacer div */}
          <div className="w-5 sm:w-4 md:w-4"></div>
          
          {/* Mobile Menu Button - Improved for better tap targets */}
          <motion.button 
            className="md:hidden flex items-center justify-center text-white bg-black/40 rounded-md p-2 border border-draugr-900/40"
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle mobile menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 sm:h-5 sm:w-5" 
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
      
      {/* Mobile Menu with improved overlay and accessibility */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Background overlay with improved blur effect */}
            <motion.div 
              className="fixed inset-0 z-40 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMobileMenu}
              style={{ 
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                MozBackdropFilter: 'blur(8px)'
              }}
            />

            {/* Menu content - Improved responsive sizing and accessibility */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden fixed top-0 right-0 h-screen w-[85%] xs:w-[75%] sm:w-[60%] bg-gradient-to-b from-black to-draugr-950 shadow-[-10px_0px_30px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col"
            >
              {/* Menu Header with improved UX */}
              <div className="p-3 sm:p-4 flex justify-between items-center border-b border-draugr-800 shrink-0">
                <div className="flex items-center">
                  <span className="blood-text text-base sm:text-lg font-bold">{brandName}</span>
                  <div className="h-4 sm:h-5 w-0.5 mx-2 bg-draugr-800"></div>
                  <span className="text-sm sm:text-base text-gray-400">منو</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMobileMenu}
                  className="text-white p-1.5 rounded-full hover:bg-draugr-900 focus:outline-none focus:ring-1 focus:ring-draugr-500"
                  aria-label="Close menu"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
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
              
              {/* Mobile Navigation Links with improved scrolling and touch targets */}
              <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-draugr-950 scrollbar-thumb-draugr-800">
                <div className="py-2 px-3 overflow-y-auto">
                  <div className="flex flex-col">
                    {navigationItems.map((item, index) => (
                      <MobileNavLink 
                        key={index}
                        to={item.path} 
                        label={item.name} 
                        isNested={item.subcategories && item.subcategories.length > 0}
                        navItem={item}
                        onClick={toggleMobileMenu}
                      />
                    ))}
                    
                    {/* User Account options in mobile menu */}
                    {isAuthenticated && (
                      <div className="mt-4 pt-4 border-t border-draugr-800/50">
                        <div className="flex items-center px-3 py-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold mr-2">
                            {user?.name?.charAt(0) || 'ک'}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user?.name || 'کاربر'}</p>
                            <p className="text-xs text-gray-400">{user?.email || ''}</p>
                          </div>
                        </div>
                        
                        <Link 
                          to="/dashboard" 
                          className="flex items-center px-3 py-2.5 text-sm text-gray-300 hover:bg-black/40 hover:text-white rounded-md transition-all duration-200"
                          onClick={toggleMobileMenu}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                          </svg>
                          حساب کاربری
                        </Link>
                        
                        <Link 
                          to="/order-tracking" 
                          className="flex items-center px-3 py-2.5 text-sm text-gray-300 hover:bg-black/40 hover:text-white rounded-md transition-all duration-200"
                          onClick={toggleMobileMenu}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          سفارشات
                        </Link>
                        
                        <button 
                          onClick={() => {
                            logout();
                            toggleMobileMenu();
                            navigate('/');
                          }}
                          className="flex items-center px-3 py-2.5 text-sm text-red-500 hover:bg-black/40 hover:text-red-400 rounded-md transition-all duration-200 w-full text-right"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          خروج
                        </button>
                      </div>
                    )}
                  </div>
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
  
  // Handle click to navigate to the shop page even when nested
  const handleClick = () => {
    navigate(to);
  };
  
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
        className={`cursor-pointer text-white text-sm font-medium px-3 py-2 mx-1 rounded-md transition-all duration-200 relative group ${
          isHovering ? 'text-draugr-500 bg-black bg-opacity-80' : 'hover:text-draugr-300'
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center space-x-1 rtl:space-x-reverse">
          <span>{label}</span>
          {isNested && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-3.5 w-3.5 transition-transform ${isHovering ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
        {/* Animated red underline on hover - more subtle */}
        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-draugr-500 transition-all duration-300 group-hover:w-full"></span>
      </motion.div>
      
      {/* Enhanced dropdown menu with premium minimal design */}
      {isNested && isHovering && (navItem.name === "فروشگاه" || navItem.name === "پیشنهادات ویژه") && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute top-full right-0 mt-1.5 py-4 bg-black border-[0.5px] border-draugr-800/70 shadow-xl rounded-md z-10 overflow-hidden min-w-fit text-right backdrop-blur-lg"
          style={{ 
            minWidth: navItem.name === "پیشنهادات ویژه" ? '550px' : '600px',
            maxHeight: '75vh',
            overflowY: 'auto',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 15px 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(139, 0, 0, 0.15)'
          }}
        >
          {/* Premium header with subtle separator */}
          <div className="px-6 pb-3 mb-2 border-b border-draugr-900/50">
            <h2 className="text-sm text-gray-400 font-normal tracking-wider uppercase">
              {navItem.name === "فروشگاه" ? "دسته‌بندی‌های محصولات" : "پیشنهادات ویژه فروشگاه"}
            </h2>
          </div>
          
          {/* Multi-column layout for Shop - more refined */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
            {navItem.subcategories.map((category, idx) => (
              <div key={idx} className="p-3">
                <h3 className={`${navItem.name === "پیشنهادات ویژه" ? "text-draugr-400" : "text-draugr-500"} font-medium text-sm pb-1.5 mb-2 flex items-center`}>
                  <span className={`${navItem.name === "پیشنهادات ویژه" ? "bg-draugr-500" : "bg-draugr-600"} w-1 h-1 rounded-full mr-2 opacity-70`}></span>
                  {category.name}
                </h3>
                <ul className="space-y-1 border-r border-draugr-900/30 pr-2">
                  {category.items && category.items.length > 0 ? (
                    category.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <Link 
                          to={navItem.name === "فروشگاه" 
                            ? `/shop/${category.name.toLowerCase().replace(/\s+/g, '-')}/${item.toLowerCase().replace(/\s+/g, '-')}`
                            : `/special-offers/${item.toLowerCase().replace(/\s+/g, '-')}`
                          }
                          className={`block px-3 py-1.5 text-xs text-gray-400 hover:bg-draugr-900/40 hover:text-white transition-all duration-150 rounded-sm group flex items-center ${
                            navItem.name === "پیشنهادات ویژه" ? "hover:bg-draugr-800/30" : ""
                          }`}
                        >
                          {item}
                          {navItem.name === "پیشنهادات ویژه" && (
                            <span className="mr-2 text-[0.6rem] bg-draugr-600 px-1.5 py-0.5 rounded text-white">ویژه</span>
                          )}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li>
                      <Link 
                        to={`/shop/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-3 py-1.5 text-xs text-gray-400 hover:bg-draugr-900/40 hover:text-white transition-all duration-150 rounded-sm group flex items-center"
                      >
                        {category.name}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
          
          {/* View All Products Button - more premium */}
          <div className="mt-3 px-4 pt-2 text-center border-t border-draugr-900/50">
            <Link 
              to={navItem.name === "فروشگاه" ? "/shop" : "/special-offers"}
              className="inline-block px-5 py-1.5 text-white text-xs font-light tracking-wide uppercase hover:text-draugr-400 transition-all duration-300"
            >
              {navItem.name === "فروشگاه" ? "مشاهده همه محصولات" : "مشاهده همه پیشنهادات ویژه"}
              <span className="inline-block mr-1.5 text-[0.6rem]">⟶</span>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Completely redesigned MobileNavLink component for better mobile experience
const MobileNavLink = ({ to, label, isNested = false, navItem, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState(-1);
  const navigate = useNavigate();
  
  const toggleExpanded = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const toggleCategory = (index, e) => {
    e.stopPropagation();
    setActiveCategory(activeCategory === index ? -1 : index);
  };
  
  const handleClick = () => {
    if (!isNested || !navItem.subcategories || navItem.subcategories.length === 0) {
      navigate(to);
      if (onClick) onClick();
    } else {
      // Just toggle the dropdown for nested items
      setIsExpanded(!isExpanded);
    }
  };
  
  return (
    <div className="mb-1">
      <div 
        className={`flex justify-between items-center py-3 px-3 text-white transition-all duration-200 rounded-md cursor-pointer ${isExpanded ? 'bg-draugr-900/40 mb-1' : 'hover:bg-black/40'}`}
        onClick={handleClick}
      >
        <span className="text-sm font-medium tracking-wide">{label}</span>
        {isNested && navItem.subcategories && navItem.subcategories.length > 0 && (
          <motion.button
            onClick={toggleExpanded}
            className="p-1.5 rounded-full hover:bg-black/40 focus:outline-none focus:ring-1 focus:ring-draugr-500"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3.5 w-3.5 text-draugr-500/80" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        )}
      </div>
      
      {/* Improved subcategories for mobile - better spacing and touch targets */}
      {isNested && isExpanded && navItem.subcategories && navItem.subcategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="mx-2 mb-2 overflow-hidden rounded-md border-[0.5px] border-draugr-900/50 bg-gradient-to-b from-black/40 to-draugr-950/30"
        >
          {/* Mobile categories - improved touch targets */}
          <div className="space-y-1 p-1.5">
            {navItem.subcategories.map((category, idx) => (
              <div key={idx} className="overflow-hidden rounded-md">
                <div 
                  className={`flex justify-between items-center py-2.5 px-3 cursor-pointer transition-colors rounded-md ${activeCategory === idx ? 'bg-black/60' : 'hover:bg-black/40'}`}
                  onClick={(e) => toggleCategory(idx, e)}
                >
                  <span className={`text-xs font-medium ${activeCategory === idx ? 'text-draugr-400' : 'text-gray-300'} flex items-center`}>
                    <span className={`w-1.5 h-1.5 ${activeCategory === idx ? 'bg-draugr-500' : 'bg-draugr-800'} rounded-full mr-2`}></span>
                    {category.name}
                  </span>
                  {category.items && category.items.length > 0 && (
                    <motion.svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-3 w-3 ${activeCategory === idx ? 'text-draugr-500' : 'text-gray-500'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      animate={{ rotate: activeCategory === idx ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  )}
                </div>
                  
                {category.items && category.items.length > 0 && activeCategory === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="py-1 px-2 bg-black/20 rounded-b-md"
                  >
                    {category.items.map((item, itemIdx) => (
                      <Link 
                        key={itemIdx}
                        to={navItem.name === "فروشگاه"
                          ? `/shop/${category.name.toLowerCase().replace(/\s+/g, '-')}/${item.toLowerCase().replace(/\s+/g, '-')}`
                          : `/special-offers/${item.toLowerCase().replace(/\s+/g, '-')}`
                        }
                        className="block py-2.5 px-2 text-xs text-gray-400 hover:text-white hover:bg-black/20 rounded-md transition-all duration-200 flex items-center justify-between"
                        onClick={onClick}
                      >
                        <span>{item}</span>
                        {navItem.name === "پیشنهادات ویژه" && (
                          <span className="text-[0.6rem] bg-draugr-600 px-1.5 py-0.5 rounded text-white">ویژه</span>
                        )}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          
          {/* Quick access button to all category items */}
          <div className="m-1 mt-0 border-t border-draugr-900/30">
            <Link 
              to={to}
              className="block py-2.5 px-3 text-xs text-center text-draugr-400 hover:text-white hover:bg-black/40 rounded-md transition-all duration-200"
              onClick={onClick}
            >
              مشاهده همه {navItem.name === "فروشگاه" ? "محصولات" : "پیشنهادات"}
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Header; 