import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = ({ items, removeItem, isOpen, onClose }) => {
  const totalPrice = items.reduce((total, item) => total + item.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 left-0 h-full w-full max-w-xs sm:max-w-sm md:max-w-md bg-white z-50 shadow-lg overflow-y-auto"
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">سبد خرید شما</h2>
                <button 
                  onClick={onClose} 
                  className="text-gray-500 hover:text-black p-1"
                  aria-label="بستن سبد خرید"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="mt-4 text-gray-500">سبد خرید شما خالی است</p>
                </div>
              ) : (
                <>
                  <ul className="divide-y divide-gray-200 -mx-4 px-4 sm:mx-0 sm:px-0">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ type: 'spring', damping: 25 }}
                          className="py-3 sm:py-4 flex"
                        >
                          <div className="mr-3 sm:mr-4 flex-1 flex flex-col justify-between">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-sm sm:text-base font-medium">{item.name}</h3>
                                <p className="text-xs sm:text-sm text-gray-500">{item.price.toFixed(2)} تومان</p>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-gray-400 hover:text-red-500 p-1"
                                aria-label={`حذف ${item.name} از سبد خرید`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                            {item.imageUrl && (
                              <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                            )}
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
                    <div className="flex justify-between text-base sm:text-lg font-medium">
                      <span>جمع کل</span>
                      <span>{totalPrice.toFixed(2)} تومان</span>
                    </div>
                    <p className="mt-0.5 text-xs sm:text-sm text-gray-500">هزینه حمل و نقل و مالیات در مرحله پرداخت محاسبه می‌شود.</p>
                    <div className="mt-4 sm:mt-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-black text-white py-2 sm:py-3 px-4 rounded-md font-medium text-sm sm:text-base"
                      >
                        تکمیل خرید
                      </motion.button>
                    </div>
                    <div className="mt-4 sm:mt-6 flex justify-center text-xs sm:text-sm text-gray-500">
                      <p>
                        یا
                        <button onClick={onClose} className="mr-1 text-black font-medium">
                          ادامه خرید
                        </button>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart; 