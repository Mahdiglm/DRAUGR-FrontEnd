import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { safeBlur, safeFilterTransition } from '../../utils/animationHelpers';

const Cart = ({ items, removeItem, isOpen, onClose, addToCartPlus }) => {
  // Calculate total price considering quantities - fixed calculation
  const totalPrice = items.reduce((total, item) => {
    const itemQuantity = item.quantity || 1;
    const itemPrice = parseFloat(item.price) || 0;
    return total + (itemPrice * itemQuantity);
  }, 0);
  
  // Calculate total number of items (sum of quantities) - fixed calculation
  const totalQuantity = items.reduce((total, item) => {
    const itemQuantity = item.quantity || 1;
    return total + itemQuantity;
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with blur effect */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: safeBlur(0) }}
            animate={{ opacity: 1, backdropFilter: safeBlur(5) }}
            exit={{ opacity: 0, backdropFilter: safeBlur(0) }}
            transition={{ 
              duration: 0.3,
              backdropFilter: safeFilterTransition() // Use our helper for safe transitions
            }}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Cart panel with horror theme aesthetics */}
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 150 }}
            className="fixed top-0 left-0 h-full w-full max-w-xs sm:max-w-sm md:max-w-md bg-gradient-to-b from-gray-100 to-gray-50 z-50 shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border-r border-draugr-900/10"
          >
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-draugr-900/40 via-draugr-500/60 to-draugr-900/40 z-10"></div>
            
            {/* Enhanced header with horror theme styling */}
            <div className="relative p-4 sm:p-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-100 to-gray-50 shadow-md overflow-hidden">
              {/* Subtle animated background texture */}
              <motion.div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0z\' fill=\'none\'/%3E%3Cpath d=\'M1 1h1v1H1zM18 1h1v1h-1zM1 18h1v1H1zM18 18h1v1h-1z\' fill=\'%23ef233c\' fill-opacity=\'0.2\'/%3E%3C/svg%3E")'
                }}
                animate={{
                  backgroundPosition: ['0px 0px', '20px 20px'],
                }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <div className="flex items-center">
                <motion.h2 
                  className="text-xl sm:text-2xl font-bold text-gray-900 relative"
                  animate={{
                    textShadow: ['0 0 0px rgba(239,35,60,0)', '0 0 2px rgba(239,35,60,0.3)', '0 0 0px rgba(239,35,60,0)']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  سبد خرید
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-draugr-500/0 via-draugr-500/60 to-draugr-500/0"></span>
                </motion.h2>
                {totalQuantity > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="mr-2 bg-gradient-to-br from-draugr-700 to-draugr-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md border border-draugr-600/20"
                  >
                    {totalQuantity}
                  </motion.div>
                )}
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90, color: 'rgb(239, 35, 60)' }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose} 
                className="text-gray-500 hover:text-draugr-600 p-1 transition-all duration-300"
                aria-label="بستن سبد خرید"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Cart content with horror-themed scrollbar */}
            <div className="flex-grow overflow-y-auto horror-scrollbar relative">
              {/* Subtle shadow overlay at top of scrolling area */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-200/50 to-transparent z-10 pointer-events-none"></div>

              {items.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center py-12 px-4 flex flex-col items-center justify-center h-full"
                >
                  <motion.div 
                    className="relative w-28 h-28 sm:w-36 sm:h-36 mb-6 rounded-full"
                    animate={{ 
                      boxShadow: [
                        "0 0 0 rgba(239, 35, 60, 0)",
                        "0 0 20px rgba(239, 35, 60, 0.3)",
                        "0 0 0 rgba(239, 35, 60, 0)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full shadow-inner border border-gray-200"></div>
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-draugr-800/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </motion.div>
                  </motion.div>
                  
                  <motion.h3 
                    className="text-lg sm:text-xl font-bold text-gray-800 mb-2"
                    animate={{ 
                      color: ["#1f2937", "#991b1b", "#1f2937"] 
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    سبد خرید شما خالی است
                  </motion.h3>
                  <p className="text-gray-500 text-sm sm:text-base max-w-[250px]">محصولات منحصر به فرد ما را کاوش کنید و به سبد خرید خود اضافه کنید</p>
                  
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(239, 35, 60, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="mt-7 px-6 py-2.5 bg-gradient-to-r from-draugr-900 to-draugr-800 text-white rounded-md text-sm sm:text-base hover:from-draugr-800 hover:to-draugr-700 transition-all duration-300 shadow-md relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <span className="relative flex items-center">
                      مشاهده محصولات
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-70 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </motion.button>
                </motion.div>
              ) : (
                <div className="p-4 sm:p-5">
                  {/* Improved cart items list with subtle dividers and better spacing */}
                  <ul className="divide-y divide-gray-100 space-y-0.5">
                    <AnimatePresence>
                      {items.map((item, index) => (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
                          transition={{ 
                            delay: index * 0.05,
                            duration: 0.3,
                            layout: { duration: 0.3 }
                          }}
                          layout
                          className="py-4 px-2 my-3 flex items-center group rounded-xl transition-all duration-300 relative overflow-hidden border border-draugr-900/20 shadow-md hover:shadow-xl"
                          style={{
                            background: "linear-gradient(to right, rgba(0,0,0,0.03), rgba(0,0,0,0.07), rgba(0,0,0,0.03))"
                          }}
                        >
                          {/* Ambient glow effect on hover */}
                          <motion.div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            animate={{
                              boxShadow: [
                                "inset 0 0 20px rgba(239, 35, 60, 0)",
                                "inset 0 0 30px rgba(239, 35, 60, 0.15)",
                                "inset 0 0 20px rgba(239, 35, 60, 0)"
                              ],
                              transition: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }
                            }}
                          />
                          
                          {/* Decorative corner accents */}
                          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-draugr-500/30 rounded-tr-md" />
                          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-draugr-500/30 rounded-bl-md" />
                          
                          {/* Product image with enhanced presentation */}
                          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg overflow-hidden flex-shrink-0 mr-4 relative group-hover:scale-105 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-black/10">
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10"
                              animate={{
                                opacity: [0.4, 0.6, 0.4],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                            
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          {/* Enhanced product details with horror theme */}
                          <div className="flex-1 flex flex-col min-w-0 overflow-hidden pr-1 ml-1">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start">
                                <h3 className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-draugr-600 transition-all duration-300 truncate max-w-[130px] sm:max-w-[160px] relative">
                                  {item.name}
                                  <motion.span 
                                    className="absolute -bottom-1 left-0 h-0.5 bg-draugr-500/40 w-0 group-hover:w-full" 
                                    transition={{ duration: 0.3 }}
                                  />
                                </h3>
                                {item.quantity > 1 && (
                                  <motion.div 
                                    className="mr-1.5 bg-draugr-900/10 border border-draugr-900/20 text-draugr-800 px-1.5 py-0.5 rounded-md text-xs font-bold flex-shrink-0 flex items-center"
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 35, 60, 0.15)" }}
                                  >
                                    <span>{item.quantity}×</span>
                                  </motion.div>
                                )}
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.2, color: "#ef4444" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeItem(item.id);
                                }}
                                className="text-gray-600 hover:text-draugr-500 p-1 -mt-1 -mr-1 focus:outline-none transition-colors duration-300"
                                aria-label={`حذف ${item.name} از سبد خرید`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </motion.button>
                            </div>
                            
                            {/* Enhanced price information with better typography */}
                            <div className="flex justify-between items-end mt-2">
                              <div className="flex flex-col">
                                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                                  <span className="opacity-70">{(item.quantity || 1) + " × " + item.price.toLocaleString('fa-IR')}</span>
                                  <span className="text-[10px] mr-1 opacity-60">تومان</span>
                                </p>
                              </div>
                              <div className="flex flex-col items-end">
                                <p className="text-sm sm:text-base font-bold text-draugr-800 group-hover:text-draugr-700 transition-colors duration-300">
                                  {((item.price * (item.quantity || 1))).toLocaleString('fa-IR')} 
                                  <span className="text-[10px] mr-1 font-normal text-draugr-700/70">تومان</span>
                                </p>
                              </div>
                            </div>
                            
                            {/* Redesigned quantity controls with horror theme */}
                            <div className="flex items-center justify-end mt-3">
                              <div className="flex items-center rtl:space-x-reverse relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-draugr-500/5 to-black/5 rounded-lg blur-sm -z-10"></div>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => removeItem(item.id)}
                                  className="w-7 h-7 flex items-center justify-center rounded-l-md bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 shadow-sm border-r border-black/10"
                                  aria-label="کاهش تعداد"
                                >
                                  <span className="text-lg font-bold leading-none pb-0.5">-</span>
                                </motion.button>
                                
                                <span className="flex items-center justify-center w-9 h-7 text-sm font-bold text-gray-800 bg-gradient-to-b from-white to-gray-100 shadow-inner border-t border-b border-black/10">
                                  {item.quantity || 1}
                                </span>
                                
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    // We need to simulate adding the same product
                                    const productToAdd = { ...item };
                                    delete productToAdd.quantity; // Remove quantity so addToCart logic works
                                    addToCartPlus(productToAdd);
                                  }}
                                  className="w-7 h-7 flex items-center justify-center rounded-r-md bg-gradient-to-br from-draugr-800 to-draugr-700 text-white shadow-sm border-l border-black/10"
                                  aria-label="افزایش تعداد"
                                >
                                  <span className="text-lg font-bold leading-none pb-0.5">+</span>
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
              )}
            </div>
            
            {/* Enhanced Footer with horror-themed styling */}
            {items.length > 0 && (
              <div className="border-t border-gray-300/40 relative bg-gradient-to-b from-gray-100 to-gray-50 p-5">
                {/* Top shadow effect */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-transparent to-gray-200/10 z-10 pointer-events-none"></div>
                
                {/* Total calculation with upgraded styling */}
                <div className="flex justify-between items-center mb-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-lg">مجموع</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {items.length} {items.length === 1 ? 'محصول' : 'محصول'} در سبد خرید
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <motion.div 
                      className="text-xl font-bold bg-gradient-to-r from-draugr-800 to-draugr-700 bg-clip-text text-transparent"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {totalPrice.toLocaleString('fa-IR')}
                      <span className="mr-1 text-sm font-medium">تومان</span>
                    </motion.div>
                  </div>
                </div>
                
                {/* Enhanced action buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ 
                      scale: 1.03, 
                      backgroundColor: 'rgba(243, 244, 246, 1)', 
                      borderColor: 'rgba(239, 35, 60, 0.2)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="py-3 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:shadow-md transition-all duration-200"
                  >
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      ادامه خرید
                    </span>
                  </motion.button>
                  
                  <Link 
                    to="/checkout"
                    onClick={onClose}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ 
                        scale: 1.03,
                        boxShadow: "0 0 15px rgba(239, 35, 60, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-4 bg-gradient-to-r from-draugr-900 to-draugr-800 text-white rounded-md text-sm font-medium flex items-center justify-center relative overflow-hidden group shadow-md"
                    >
                      {/* Moving highlight effect */}
                      <span className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                      
                      <span className="ml-1.5 relative z-10">تکمیل خرید</span>
                      <motion.svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 relative z-10" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          repeatType: "loop",
                          ease: "easeInOut",
                          repeatDelay: 1
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </motion.svg>
                    </motion.div>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Add global styles for horror-themed scrollbar
const styleElement = document.createElement('style');
styleElement.textContent = `
  .horror-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .horror-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-left: 1px solid rgba(0, 0, 0, 0.05);
  }
  .horror-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #6b0000, #911919);
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }
  .horror-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #911919, #ef233c);
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 5px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f5f5f5;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d1d1;
    border-radius: 5px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #b1b1b1;
  }
`;
document.head.appendChild(styleElement);

export default Cart; 