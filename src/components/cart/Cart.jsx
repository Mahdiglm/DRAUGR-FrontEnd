import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = ({ items, removeItem, isOpen, onClose, addToCartPlus }) => {
  // Calculate total price considering quantities
  const totalPrice = items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  
  // Calculate total number of items (sum of quantities)
  const totalQuantity = items.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with blur effect */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(5px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
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
                <div className="p-5 sm:p-6">
                  <ul className="divide-y divide-gray-200 space-y-1">
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
                          className="py-4 flex items-center group rounded-lg hover:bg-gray-50 transition-colors duration-300 -mx-2 px-2"
                        >
                          {/* Product image with shadow on hover */}
                          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden flex-shrink-0 mr-4 group-hover:shadow-md transition-shadow duration-300">
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
                          
                          {/* Product details with improved typography */}
                          <div className="flex-1 flex flex-col">
                            <div className="flex justify-between">
                              <div className="flex items-start">
                                <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-draugr-700 transition-colors duration-300">{item.name}</h3>
                                {item.quantity > 1 && (
                                  <span className="mr-2 bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-md text-xs font-medium">
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </motion.button>
                            </div>
                            <div className="flex justify-between items-end mt-1">
                              <p className="text-xs sm:text-sm text-gray-500">{(item.quantity || 1) + " × " + item.price.toLocaleString('fa-IR') + " تومان"}</p>
                              <p className="text-sm sm:text-base font-medium text-draugr-900">{((item.price * (item.quantity || 1))).toLocaleString('fa-IR')} تومان</p>
                            </div>
                            
                            {/* Quantity controls */}
                            <div className="flex items-center mt-2">
                              <div className="flex space-x-3 rtl:space-x-reverse bg-gray-100 rounded-lg p-1">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => removeItem(item.id)}
                                  className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  aria-label="کاهش تعداد"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                  </svg>
                                </motion.button>
                                
                                <span className="flex items-center justify-center w-8 text-sm font-medium">
                                  {item.quantity || 1}
                                </span>
                                
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    // We need to simulate adding the same product
                                    const productToAdd = { ...item };
                                    delete productToAdd.quantity; // Remove quantity so addToCart logic works
                                    addToCartPlus(productToAdd);
                                  }}
                                  className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  aria-label="افزایش تعداد"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                  </svg>
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

            {/* Footer with checkout button and total */}
            {items.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-5 sm:p-6 border-t border-gray-200 bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.05)]"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">تعداد اقلام</p>
                    <p className="text-lg font-bold">{totalQuantity}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">مجموع قیمت</p>
                    <p className="text-lg font-bold text-draugr-900">{totalPrice.toLocaleString('fa-IR')}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-draugr-800 to-draugr-600 text-white py-3 px-4 rounded-lg font-medium text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    تکمیل خرید
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ backgroundColor: "#f8f8f8" }}
                    onClick={onClose}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                  >
                    ادامه خرید
                  </motion.button>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>حمل و نقل:</span>
                    <span className="font-medium">متغیر</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>مالیات:</span>
                    <span className="font-medium">در فاکتور نهایی</span>
                  </div>
                </div>
              </motion.div>
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
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
`;
document.head.appendChild(styleElement);

export default Cart; 