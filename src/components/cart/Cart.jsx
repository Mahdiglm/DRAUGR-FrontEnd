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
          
          {/* Cart panel with improved aesthetics */}
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 150 }}
            className="fixed top-0 left-0 h-full w-full max-w-xs sm:max-w-sm md:max-w-md bg-gradient-to-b from-white to-gray-50 z-50 shadow-[0_0_25px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col"
          >
            {/* Header with improved styling and cart count badge */}
            <div className="p-5 sm:p-6 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm">
              <div className="flex items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">سبد خرید</h2>
                {totalQuantity > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mr-2 bg-draugr-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {totalQuantity}
                  </motion.div>
                )}
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose} 
                className="text-gray-500 hover:text-draugr-600 p-1 transition-colors duration-200"
                aria-label="بستن سبد خرید"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Cart content with improved scrolling */}
            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {items.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center py-12 px-4 flex flex-col items-center justify-center h-full"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">سبد خرید شما خالی است</h3>
                  <p className="text-gray-500 text-sm sm:text-base max-w-[250px]">به نظر می‌رسد هنوز محصولی به سبد خرید خود اضافه نکرده‌اید</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="mt-6 px-6 py-2 bg-black text-white rounded-md text-sm sm:text-base hover:bg-draugr-900 transition-colors duration-300"
                  >
                    مشاهده محصولات
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
                          className="py-3 flex items-center group rounded-xl hover:bg-gray-50/80 transition-colors duration-300 border border-transparent hover:border-gray-100"
                        >
                          {/* Product image with improved size and position */}
                          <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-xl overflow-hidden flex-shrink-0 mr-3 group-hover:shadow-lg transition-all duration-300">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          {/* Product details with improved layout */}
                          <div className="flex-1 flex flex-col min-w-0 overflow-hidden pr-1">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start">
                                <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-draugr-700 transition-colors duration-300 truncate max-w-[140px] sm:max-w-[160px]">{item.name}</h3>
                                {item.quantity > 1 && (
                                  <span className="mr-1.5 bg-draugr-50 text-draugr-700 px-1.5 py-0.5 rounded-md text-xs font-medium flex-shrink-0">
                                    {item.quantity}×
                                  </span>
                                )}
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.2, color: "#ef4444" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeItem(item.id);
                                }}
                                className="text-gray-400 p-1 -mt-1 -mr-1 focus:outline-none"
                                aria-label={`حذف ${item.name} از سبد خرید`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </motion.button>
                            </div>
                            
                            {/* Price information with improved visibility */}
                            <div className="flex justify-between items-end mt-1">
                              <p className="text-xs sm:text-sm text-gray-500 font-medium">{(item.quantity || 1) + " × " + item.price.toLocaleString('fa-IR') + " تومان"}</p>
                              <p className="text-sm sm:text-base font-bold text-draugr-900">{((item.price * (item.quantity || 1))).toLocaleString('fa-IR')} <span className="text-xs">تومان</span></p>
                            </div>
                            
                            {/* Improved quantity controls with better positioning */}
                            <div className="flex items-center justify-end mt-2">
                              <div className="flex space-x-2 rtl:space-x-reverse bg-gray-50 rounded-lg p-0.5 border border-gray-100 shadow-sm">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => removeItem(item.id)}
                                  className="w-7 h-7 flex items-center justify-center rounded-full bg-black text-white shadow-sm"
                                  aria-label="کاهش تعداد"
                                >
                                  <span className="text-xl font-bold leading-none">-</span>
                                </motion.button>
                                
                                <span className="flex items-center justify-center w-8 text-sm font-bold text-gray-800">
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
                                  className="w-7 h-7 flex items-center justify-center rounded-full bg-black text-white shadow-sm"
                                  aria-label="افزایش تعداد"
                                >
                                  <span className="text-xl font-bold leading-none">+</span>
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
            
            {/* Footer with cart total and checkout button */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-gray-800">مجموع:</span>
                  <span className="text-lg font-bold text-draugr-800">{totalPrice.toLocaleString('fa-IR')} تومان</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="py-2.5 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    ادامه خرید
                  </motion.button>
                  
                  <Link 
                    to="/checkout"
                    onClick={onClose}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-draugr-800 to-draugr-600 text-white rounded-md text-sm font-medium flex items-center justify-center"
                    >
                      <span className="ml-1.5">تکمیل خرید</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
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

// Add global styles for custom scrollbar
const styleElement = document.createElement('style');
styleElement.textContent = `
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