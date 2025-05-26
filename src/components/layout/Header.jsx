import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import pfpIcon from '../../assets/pfp-icon.png';

const Header = ({ cartItems, onCartClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const brandName = "DRAUGR";
  const navigate = useNavigate();
  const location = useLocation();

  // Updated navigation structure based on new requirements
  const navigationItems = [
    {
      name: "خانه",
      path: "/",
      icon: "🏠",
      subcategories: []
    },
    {
      name: "فروشگاه",
      path: "/shop",
      icon: "🛍️",
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
      icon: "⭐",
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
      icon: "📦",
      subcategories: []
    },
    {
      name: "درباره ما",
      path: "/about",
      icon: "ℹ️",
      subcategories: []
    },
    {
      name: "بلاگ / مقالات",
      path: "/blog",
      icon: "📖",
      subcategories: []
    }
  ];

  // Listen for route changes and close mobile menu when navigation occurs
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      document.body.style.overflow = 'auto';
    }
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    setExpandedCategory(null); // Reset expanded categories
    
    // Prevent body scroll when menu is open
    if (newState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
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
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
        return () => clearTimeout(timeout);
      }
    } else {
      const timeout = setTimeout(() => {
        setTypedText("");
        setIsTyping(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [typedText, isTyping]);

  // Add scroll effect with reduced header height when scrolled
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryToggle = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const navigateToPage = (path) => {
    navigate(path);
    toggleMobileMenu();
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        height: isScrolled ? '60px' : '70px'
      }}
      transition={{ duration: 0.3 }}
      className={`bg-black/95 backdrop-blur-md text-white sticky top-0 z-50 w-full transition-all duration-300 border-b border-draugr-900/30 ${
        isScrolled ? 'shadow-[0_0_20px_rgba(255,0,0,0.2)]' : ''
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 h-full flex justify-between items-center">
        {/* Logo - More compact for mobile */}
        <motion.div 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="blood-text text-lg sm:text-xl font-bold">{typedText || '\u00A0'}</div>
            <div className="h-4 sm:h-5 w-0.5 bg-draugr-500 animate-pulse"></div>
            <div className="text-sm sm:text-base font-medium">فروشگاه</div>
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
        
        {/* Header Actions - Optimized spacing and sizing */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Profile Button - Touch optimized */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-1 rounded-full transition-all duration-200"
            onClick={() => navigate('/login')}
          >
            <img 
              src={pfpIcon} 
              alt="Profile" 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-draugr-600/50"
            />
          </motion.button>

          {/* Cart Button - Touch optimized with better visual feedback */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, rotate: [0, -5, 5, 0] }}
            className="relative p-2 rounded-full hover:bg-draugr-900/30 transition-all duration-200"
            onClick={onCartClick}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 sm:h-6 sm:w-6 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartItems.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-draugr-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium"
              >
                {cartItems.length > 99 ? '99+' : cartItems.length}
              </motion.span>
            )}
          </motion.button>
          
          {/* Mobile Menu Button - Larger and more accessible */}
          <motion.button 
            className="md:hidden p-2 rounded-lg hover:bg-draugr-900/30 transition-all duration-200"
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={isMobileMenuOpen ? "open" : "closed"}
              className="w-6 h-6 flex flex-col justify-center items-center"
            >
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 6 }
                }}
                className="w-5 h-0.5 bg-white block transition-all duration-300 origin-center"
              />
              <motion.span
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 }
                }}
                className="w-5 h-0.5 bg-white block mt-1.5 transition-all duration-300"
              />
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -6 }
                }}
                className="w-5 h-0.5 bg-white block mt-1.5 transition-all duration-300 origin-center"
              />
            </motion.div>
          </motion.button>
        </div>
      </div>
      
      {/* Enhanced Mobile Menu - Full screen overlay for better UX */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            {/* Background with modern gradient */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-black via-draugr-950 to-black"
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative h-full flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-draugr-900/30">
                <div className="flex items-center gap-2">
                  <span className="blood-text text-xl font-bold">{brandName}</span>
                  <span className="text-sm text-gray-400">منو</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-full hover:bg-draugr-900/30 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              {/* Navigation */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 space-y-2">
                  {navigationItems.map((item, index) => (
                    <MobileNavItem
                      key={index}
                      item={item}
                      isExpanded={expandedCategory === item.name}
                      onToggle={() => handleCategoryToggle(item.name)}
                      onNavigate={navigateToPage}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-draugr-900/30">
                <div className="text-center text-xs text-gray-500">
                  © 2024 DRAUGR Shop - تمامی حقوق محفوظ است
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Enhanced Mobile Navigation Item Component
const MobileNavItem = ({ item, isExpanded, onToggle, onNavigate, delay }) => {
  const hasSubcategories = item.subcategories && item.subcategories.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="border border-draugr-900/30 rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm"
    >
      {/* Main Item */}
      <motion.div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-draugr-900/20 transition-all duration-200"
        onClick={() => hasSubcategories ? onToggle() : onNavigate(item.path)}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{item.icon}</span>
          <span className="text-white font-medium">{item.name}</span>
        </div>
        
        {hasSubcategories && (
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-5 h-5 text-draugr-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        )}
      </motion.div>
      
      {/* Subcategories */}
      <AnimatePresence>
        {hasSubcategories && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-draugr-900/30 bg-black/10"
          >
            <div className="p-3 space-y-1">
              {item.subcategories.map((category, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  className="p-3 rounded-lg hover:bg-draugr-900/30 transition-colors cursor-pointer"
                  onClick={() => onNavigate(`${item.path}/${category.name.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300 font-medium">{category.name}</span>
                    <svg className="w-4 h-4 text-draugr-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  
                  {category.items && category.items.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      {category.items.slice(0, 2).join(', ')}
                      {category.items.length > 2 && ` و ${category.items.length - 2} مورد دیگر`}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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

export default Header; 