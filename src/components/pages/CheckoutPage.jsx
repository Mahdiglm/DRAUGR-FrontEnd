import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';

// Detect if running on a mobile device
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
};

// Step components
const ShippingForm = ({ formData, updateFormData, goToNext }) => {
  // Validation state
  const [touchedFields, setTouchedFields] = useState({});
  
  // Mark field as touched when user interacts with it
  const markTouched = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };
  
  // Check if form is valid
  const isFormValid = formData.firstName && formData.lastName && formData.phone && 
                      formData.address && formData.postalCode;
  
  // Simplified animations for mobile
  const isMobile = isMobileDevice();
  const animProps = isMobile ? 
    { 
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    } : 
    {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
    };
  
  return (
    <motion.div
      {...animProps}
      transition={{ duration: isMobile ? 0.3 : 0.5 }}
      className="backdrop-blur-sm bg-gradient-to-b from-black/60 to-vampire-dark/80 p-6 sm:p-8 rounded-xl shadow-horror border border-draugr-900/40"
    >
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-draugr-900 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-draugr-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">
          <span className="text-draugr-400">اطلاعات</span> ارسال
        </h2>
      </div>
      
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative group">
            <label className="block text-sm font-medium mb-1.5 text-gray-300" htmlFor="firstName">
              نام <span className="text-draugr-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                id="firstName" 
                value={formData.firstName} 
                onChange={(e) => updateFormData('firstName', e.target.value)}
                onBlur={() => markTouched('firstName')}
                className="w-full p-3 pl-10 rounded-lg bg-midnight/80 border border-gray-700 text-white focus:border-draugr-600 focus:ring-1 focus:ring-draugr-600 transition-colors" 
                required 
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {touchedFields.firstName && !formData.firstName && (
              <p className="mt-1 text-xs text-draugr-500">لطفاً نام خود را وارد کنید</p>
            )}
            <div className="absolute -bottom-0.5 left-3 right-3 h-px bg-gradient-to-r from-draugr-900/0 via-draugr-600/30 to-draugr-900/0 group-focus-within:via-draugr-500/60 transition-all duration-300"></div>
          </div>
          
          <div className="relative group">
            <label className="block text-sm font-medium mb-1.5 text-gray-300" htmlFor="lastName">
              نام خانوادگی <span className="text-draugr-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                id="lastName" 
                value={formData.lastName} 
                onChange={(e) => updateFormData('lastName', e.target.value)}
                onBlur={() => markTouched('lastName')}
                className="w-full p-3 pl-10 rounded-lg bg-midnight/80 border border-gray-700 text-white focus:border-draugr-600 focus:ring-1 focus:ring-draugr-600 transition-colors" 
                required 
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
            {touchedFields.lastName && !formData.lastName && (
              <p className="mt-1 text-xs text-draugr-500">لطفاً نام خانوادگی خود را وارد کنید</p>
            )}
            <div className="absolute -bottom-0.5 left-3 right-3 h-px bg-gradient-to-r from-draugr-900/0 via-draugr-600/30 to-draugr-900/0 group-focus-within:via-draugr-500/60 transition-all duration-300"></div>
          </div>
        </div>
        
        <div className="relative group">
          <label className="block text-sm font-medium mb-1.5 text-gray-300" htmlFor="phone">
            شماره تماس <span className="text-draugr-500">*</span>
          </label>
          <div className="relative">
            <input 
              type="tel" 
              id="phone" 
              value={formData.phone} 
              onChange={(e) => updateFormData('phone', e.target.value)}
              onBlur={() => markTouched('phone')}
              className="w-full p-3 pl-10 rounded-lg bg-midnight/80 border border-gray-700 text-white focus:border-draugr-600 focus:ring-1 focus:ring-draugr-600 transition-colors" 
              required 
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
          </div>
          {touchedFields.phone && !formData.phone && (
            <p className="mt-1 text-xs text-draugr-500">لطفاً شماره تماس خود را وارد کنید</p>
          )}
          <div className="absolute -bottom-0.5 left-3 right-3 h-px bg-gradient-to-r from-draugr-900/0 via-draugr-600/30 to-draugr-900/0 group-focus-within:via-draugr-500/60 transition-all duration-300"></div>
        </div>
        
        <div className="relative group">
          <label className="block text-sm font-medium mb-1.5 text-gray-300" htmlFor="email">
            ایمیل <span className="text-gray-500">(اختیاری)</span>
          </label>
          <div className="relative">
            <input 
              type="email" 
              id="email" 
              value={formData.email} 
              onChange={(e) => updateFormData('email', e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-midnight/80 border border-gray-700 text-white focus:border-draugr-600 focus:ring-1 focus:ring-draugr-600 transition-colors" 
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          </div>
          <div className="absolute -bottom-0.5 left-3 right-3 h-px bg-gradient-to-r from-draugr-900/0 via-draugr-600/30 to-draugr-900/0 group-focus-within:via-draugr-500/60 transition-all duration-300"></div>
        </div>
        
        <div className="relative group">
          <label className="block text-sm font-medium mb-1.5 text-gray-300" htmlFor="address">
            آدرس <span className="text-draugr-500">*</span>
          </label>
          <div className="relative">
            <textarea 
              id="address" 
              rows="3" 
              value={formData.address} 
              onChange={(e) => updateFormData('address', e.target.value)}
              onBlur={() => markTouched('address')}
              className="w-full p-3 rounded-lg bg-midnight/80 border border-gray-700 text-white focus:border-draugr-600 focus:ring-1 focus:ring-draugr-600 transition-colors" 
              required 
            />
            <div className="absolute left-3 top-5 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
          </div>
          {touchedFields.address && !formData.address && (
            <p className="mt-1 text-xs text-draugr-500">لطفاً آدرس خود را وارد کنید</p>
          )}
          <div className="absolute -bottom-0.5 left-3 right-3 h-px bg-gradient-to-r from-draugr-900/0 via-draugr-600/30 to-draugr-900/0 group-focus-within:via-draugr-500/60 transition-all duration-300"></div>
        </div>
        
        <div className="relative group">
          <label className="block text-sm font-medium mb-1.5 text-gray-300" htmlFor="postalCode">
            کد پستی <span className="text-draugr-500">*</span>
          </label>
          <div className="relative">
            <input 
              type="text" 
              id="postalCode" 
              value={formData.postalCode} 
              onChange={(e) => updateFormData('postalCode', e.target.value)}
              onBlur={() => markTouched('postalCode')}
              className="w-full p-3 pl-10 rounded-lg bg-midnight/80 border border-gray-700 text-white focus:border-draugr-600 focus:ring-1 focus:ring-draugr-600 transition-colors" 
              required 
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {touchedFields.postalCode && !formData.postalCode && (
            <p className="mt-1 text-xs text-draugr-500">لطفاً کد پستی خود را وارد کنید</p>
          )}
          <div className="absolute -bottom-0.5 left-3 right-3 h-px bg-gradient-to-r from-draugr-900/0 via-draugr-600/30 to-draugr-900/0 group-focus-within:via-draugr-500/60 transition-all duration-300"></div>
        </div>
        
        <div className="pt-4 mt-3">
          <motion.button
            whileHover={isMobile ? {} : { scale: 1.01 }}
            whileTap={isMobile ? {} : { scale: 0.99 }}
            onClick={goToNext}
            disabled={!isFormValid}
            className={`w-full py-3.5 rounded-lg font-medium text-white flex items-center justify-center relative overflow-hidden ${
              isFormValid 
                ? 'bg-gradient-to-r from-draugr-800 to-draugr-600 hover:from-draugr-700 hover:to-draugr-500 shadow-lg shadow-draugr-900/30' 
                : 'bg-gray-700 cursor-not-allowed opacity-70'
            }`}
          >
            <span className="relative z-10 flex items-center">
              ادامه به پرداخت
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
            {isFormValid && !isMobile && (
              <span className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const PaymentForm = ({ formData, updateFormData, goToNext, goToPrevious }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="backdrop-blur-sm bg-gradient-to-b from-black/60 to-vampire-dark/80 p-6 sm:p-8 rounded-xl shadow-horror border border-draugr-900/40"
    >
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-draugr-900 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-draugr-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">
          <span className="text-draugr-400">روش</span> پرداخت
        </h2>
      </div>
      
      <div className="space-y-6">
        <div className="p-5 rounded-lg bg-midnight/60 border border-gray-800">
          <h3 className="text-lg font-medium mb-4 text-white">انتخاب روش پرداخت</h3>
          
          <div className="space-y-4">
            <div 
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                formData.paymentMethod === 'online' 
                ? 'border-draugr-500 bg-draugr-900/40 shadow-sm shadow-draugr-500/20' 
                : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => updateFormData('paymentMethod', 'online')}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                formData.paymentMethod === 'online' ? 'border-draugr-500' : 'border-gray-500'
              }`}>
                {formData.paymentMethod === 'online' && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2.5 h-2.5 rounded-full bg-draugr-500"
                  />
                )}
              </div>
              <div className="mr-3 flex-1">
                <label htmlFor="online" className="font-medium text-white cursor-pointer">پرداخت آنلاین</label>
                <p className="text-xs text-gray-400 mt-1">پرداخت امن و آنی از طریق درگاه‌های بانکی</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            
            <div 
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                formData.paymentMethod === 'cod' 
                ? 'border-draugr-500 bg-draugr-900/40 shadow-sm shadow-draugr-500/20' 
                : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => updateFormData('paymentMethod', 'cod')}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                formData.paymentMethod === 'cod' ? 'border-draugr-500' : 'border-gray-500'
              }`}>
                {formData.paymentMethod === 'cod' && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2.5 h-2.5 rounded-full bg-draugr-500"
                  />
                )}
              </div>
              <div className="mr-3 flex-1">
                <label htmlFor="cod" className="font-medium text-white cursor-pointer">پرداخت در محل</label>
                <p className="text-xs text-gray-400 mt-1">پرداخت وجه هنگام تحویل سفارش</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {formData.paymentMethod === 'online' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5 rounded-lg bg-gradient-to-br from-vampire-dark/80 to-midnight/70 border border-gray-800"
            >
              <h3 className="text-lg font-medium mb-4 text-white">انتخاب درگاه پرداخت</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-all duration-300 ${
                    formData.gateway === 'shaparak' 
                    ? 'border-draugr-500 bg-black/40 shadow-sm shadow-draugr-500/20' 
                    : 'border-gray-700 hover:border-gray-600 bg-black/20'
                  }`}
                  onClick={() => updateFormData('gateway', 'shaparak')}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-800 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-draugr-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-white">شاپرک</span>
                  {formData.gateway === 'shaparak' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 w-6 h-6 rounded-full flex items-center justify-center bg-draugr-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-draugr-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-all duration-300 ${
                    formData.gateway === 'zarinpal' 
                    ? 'border-draugr-500 bg-black/40 shadow-sm shadow-draugr-500/20' 
                    : 'border-gray-700 hover:border-gray-600 bg-black/20'
                  }`}
                  onClick={() => updateFormData('gateway', 'zarinpal')}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-800 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-white">زرین‌پال</span>
                  {formData.gateway === 'zarinpal' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 w-6 h-6 rounded-full flex items-center justify-center bg-draugr-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-draugr-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-all duration-300 ${
                    formData.gateway === 'sadad' 
                    ? 'border-draugr-500 bg-black/40 shadow-sm shadow-draugr-500/20' 
                    : 'border-gray-700 hover:border-gray-600 bg-black/20'
                  }`}
                  onClick={() => updateFormData('gateway', 'sadad')}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-800 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-white">سداد</span>
                  {formData.gateway === 'sadad' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 w-6 h-6 rounded-full flex items-center justify-center bg-draugr-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-draugr-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-all duration-300 ${
                    formData.gateway === 'sep' 
                    ? 'border-draugr-500 bg-black/40 shadow-sm shadow-draugr-500/20' 
                    : 'border-gray-700 hover:border-gray-600 bg-black/20'
                  }`}
                  onClick={() => updateFormData('gateway', 'sep')}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-800 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-white">سپ</span>
                  {formData.gateway === 'sep' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 w-6 h-6 rounded-full flex items-center justify-center bg-draugr-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-draugr-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center pt-6 space-x-4 rtl:space-x-reverse">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={goToPrevious}
            className="w-1/2 py-3.5 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-300 flex justify-center items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 11H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            بازگشت
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={goToNext}
            disabled={!formData.paymentMethod || (formData.paymentMethod === 'online' && !formData.gateway)}
            className={`w-1/2 py-3.5 rounded-lg font-medium text-white flex items-center justify-center relative overflow-hidden ${
              (formData.paymentMethod && !(formData.paymentMethod === 'online' && !formData.gateway))
                ? 'bg-gradient-to-r from-draugr-800 to-draugr-600 hover:from-draugr-700 hover:to-draugr-500 shadow-lg shadow-draugr-900/30' 
                : 'bg-gray-700 cursor-not-allowed opacity-70'
            }`}
          >
            <span className="relative z-10 flex items-center">
              مرور سفارش
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
            {(formData.paymentMethod && !(formData.paymentMethod === 'online' && !formData.gateway)) && (
              <span className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const ReviewOrder = ({ formData, cartItems, totalPrice, goToPrevious, placeOrder }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="backdrop-blur-sm bg-gradient-to-b from-black/60 to-vampire-dark/80 p-6 sm:p-8 rounded-xl shadow-horror border border-draugr-900/40"
    >
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-draugr-900 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-draugr-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">
          <span className="text-draugr-400">مرور</span> سفارش
        </h2>
      </div>
      
      <div className="space-y-6">
        <motion.div 
          className="p-5 rounded-lg bg-gradient-to-br from-midnight/90 to-vampire-dark/60 border border-gray-800"
          whileHover={{ boxShadow: "0 0 15px rgba(0,0,0,0.3)" }}
        >
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-draugr-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium text-white">اطلاعات شخصی</h3>
          </div>
          
          <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">نام و نام خانوادگی:</span>
                <span className="font-medium">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">شماره تماس:</span>
                <span className="font-medium">{formData.phone}</span>
              </div>
              {formData.email && (
                <div className="flex justify-between">
                  <span className="text-gray-400">ایمیل:</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="p-5 rounded-lg bg-gradient-to-br from-midnight/90 to-vampire-dark/60 border border-gray-800"
          whileHover={{ boxShadow: "0 0 15px rgba(0,0,0,0.3)" }}
        >
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-draugr-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium text-white">آدرس تحویل</h3>
          </div>
          
          <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
            <p className="mb-2 whitespace-pre-line">{formData.address}</p>
            <div className="flex justify-between items-center pt-2 border-t border-gray-800">
              <span className="text-gray-400">کد پستی:</span>
              <span className="font-medium">{formData.postalCode}</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="p-5 rounded-lg bg-gradient-to-br from-midnight/90 to-vampire-dark/60 border border-gray-800"
          whileHover={{ boxShadow: "0 0 15px rgba(0,0,0,0.3)" }}
        >
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-draugr-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium text-white">روش پرداخت</h3>
          </div>
          
          <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-draugr-800 to-draugr-900 mr-3">
                {formData.paymentMethod === 'online' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-draugr-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-draugr-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium">{formData.paymentMethod === 'online' ? 'پرداخت آنلاین' : 'پرداخت در محل'}</p>
                {formData.paymentMethod === 'online' && (
                  <p className="text-sm text-gray-400 mt-1">
                    درگاه: {formData.gateway === 'shaparak' ? 'شاپرک' : 
                           formData.gateway === 'zarinpal' ? 'زرین‌پال' : 
                           formData.gateway === 'sadad' ? 'سداد' : 'سپ'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="p-5 rounded-lg bg-gradient-to-br from-midnight/90 to-vampire-dark/60 border border-gray-800"
          whileHover={{ boxShadow: "0 0 15px rgba(0,0,0,0.3)" }}
        >
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-draugr-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            <h3 className="text-lg font-medium text-white">اقلام سفارش</h3>
          </div>
          
          <div className="bg-black/40 rounded-lg border border-gray-800">
            <div className="max-h-[300px] overflow-y-auto horror-scrollbar">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-4 border-b border-gray-800">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-md overflow-hidden mr-3 border border-gray-800 relative">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-1 right-1 bg-draugr-900 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-400">{item.quantity} × {item.price.toLocaleString('fa-IR')} تومان</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{(item.price * item.quantity).toLocaleString('fa-IR')}</p>
                    <p className="text-xs text-gray-400">تومان</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 flex justify-between items-center font-bold border-t border-gray-700 bg-gradient-to-r from-vampire-dark/50 to-black/40">
              <p className="text-white">مجموع</p>
              <div className="flex items-baseline">
                <p className="text-xl text-draugr-500">{totalPrice.toLocaleString('fa-IR')}</p>
                <p className="text-xs mr-1 text-draugr-400/80">تومان</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="flex items-center pt-4 space-x-4 rtl:space-x-reverse">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={goToPrevious}
            className="w-1/2 py-3.5 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-300 flex justify-center items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            بازگشت
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={placeOrder}
            className="w-1/2 py-3.5 rounded-lg font-medium text-white flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-draugr-800 to-draugr-600 hover:from-draugr-700 hover:to-draugr-500 shadow-lg shadow-draugr-900/30"
          >
            <span className="relative z-10 flex items-center">
              تکمیل خرید و پرداخت
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const OrderConfirmation = ({ orderNumber, navigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="backdrop-blur-sm bg-gradient-to-b from-black/60 to-vampire-dark/80 p-8 rounded-xl shadow-horror border border-draugr-900/40 relative overflow-hidden"
    >
      {/* Decorative corner accents */}
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-draugr-500/40 rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-draugr-500/40 rounded-bl-xl" />
      
      {/* Subtle animated background */}
      <motion.div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 15,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 2000 2000\' fill=\'none\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
          backgroundSize: '200% 200%'
        }}
      />
      
      <div className="text-center relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-24 h-24 bg-gradient-to-br from-draugr-900/80 to-draugr-700/40 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg relative"
        >
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-full blur-md bg-draugr-500/20"></div>
          
          {/* Pulsing animation */}
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 0 0px rgba(239, 35, 60, 0.2)",
                "0 0 0 10px rgba(239, 35, 60, 0)",
                "0 0 0 0px rgba(239, 35, 60, 0.2)"
              ],
              scale: [0.95, 1.05, 0.95]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full"
          />
          
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-draugr-500 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold mb-4 text-white"
        >
          <span className="text-draugr-400">سفارش شما</span> با موفقیت ثبت شد
        </motion.h2>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-midnight/90 to-vampire-dark/60 border border-gray-800 rounded-lg inline-block px-6 py-3">
            <p className="text-gray-400 text-sm">شماره سفارش</p>
            <p className="font-mono text-xl font-bold tracking-wide text-white mt-1">{orderNumber}</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="max-w-lg mx-auto bg-black/40 p-5 rounded-lg mb-8 border border-gray-800 relative"
          whileHover={{ boxShadow: "0 0 15px rgba(0,0,0,0.3)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-draugr-900/0 via-draugr-500/30 to-draugr-900/0"></div>
          
          <h3 className="text-lg font-medium mb-3 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-draugr-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>اطلاعات</span>
          </h3>
          
          <p className="mb-3 text-white">از خرید شما متشکریم!</p>
          <p className="text-sm text-gray-400">اطلاعات سفارش به ایمیل شما ارسال خواهد شد. در صورت نیاز به پشتیبانی با ما تماس بگیرید.</p>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-draugr-900/0 via-draugr-500/30 to-draugr-900/0"></div>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-4 rtl:space-x-reverse justify-center"
        >
          <motion.button
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 0 15px rgba(0,0,0,0.3)"
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            بازگشت به خانه
          </motion.button>
          
          <motion.button
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 0 15px rgba(239, 35, 60, 0.2)"
            }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 rounded-lg font-medium text-white flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-draugr-900 to-draugr-700 hover:from-draugr-800 hover:to-draugr-600 shadow-lg shadow-draugr-900/30"
          >
            <span className="relative z-10 flex items-center">
              پیگیری سفارش
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Checkout progress indicator with reduced animations for mobile
const CheckoutProgress = ({ currentStep }) => {
  const steps = [
    { num: 1, title: 'اطلاعات ارسال' },
    { num: 2, title: 'پرداخت' },
    { num: 3, title: 'مرور سفارش' },
    { num: 4, title: 'تایید' }
  ];
  
  const isMobile = isMobileDevice();
  
  return (
    <div className="mb-10">
      <div className="flex justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.num;
          const isActive = currentStep === step.num;
          
          return (
            <div key={step.num} className="flex flex-col items-center relative z-10">
              <motion.div 
                initial={isMobile ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
                animate={isMobile ? 
                  { opacity: 1 } : 
                  { scale: 1, opacity: 1 }
                }
                transition={{ 
                  delay: isMobile ? 0 : index * 0.1,
                  duration: isMobile ? 0.2 : 0.4, 
                  ease: "backOut" 
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold relative ${
                  isCompleted 
                    ? 'bg-gradient-to-br from-draugr-700 to-draugr-900' 
                    : isActive 
                    ? 'bg-gradient-to-br from-draugr-800 to-draugr-900 ring-2 ring-draugr-500 ring-opacity-70'
                    : 'bg-gradient-to-br from-gray-700 to-gray-900'
                }`}
              >
                {/* Glow effect for active step - simplified for mobile */}
                {isActive && !isMobile && (
                  <motion.div 
                    className="absolute inset-0 rounded-full blur-md"
                    animate={{ 
                      boxShadow: [
                        "0 0 4px 2px rgba(239, 35, 60, 0.3)",
                        "0 0 8px 4px rgba(239, 35, 60, 0.2)",
                        "0 0 4px 2px rgba(239, 35, 60, 0.3)"
                      ] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                  />
                )}
                
                {isCompleted ? (
                  <motion.div
                    initial={isMobile ? { opacity: 0 } : { scale: 0 }}
                    animate={isMobile ? { opacity: 1 } : { scale: 1 }}
                    transition={isMobile ? 
                      { duration: 0.2 } : 
                      { type: "spring", stiffness: 400, damping: 15 }
                    }
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                ) : (
                  <span className="relative">{step.num}</span>
                )}
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  color: isActive || isCompleted ? '#ffffff' : 'rgba(156, 163, 175, 0.8)'
                }}
                transition={{ 
                  delay: isMobile ? 0 : index * 0.1 + 0.1,
                  duration: isMobile ? 0.2 : 0.4
                }}
                className="mt-3 text-sm whitespace-nowrap font-medium"
              >
                {step.title}
              </motion.div>
            </div>
          );
        })}
        
        {/* Progress line - decorative line connecting the steps */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 -translate-y-1/2 z-0 rounded-full"></div>
        
        {/* Animated progress overlay - simplified for mobile */}
        <motion.div 
          className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-draugr-700 via-draugr-500 to-draugr-700 -translate-y-1/2 z-0 rounded-full overflow-hidden"
          style={{ 
            width: `${(currentStep - 1) / (steps.length - 1) * 100}%`,
          }}
          initial={{ width: 0 }}
          animate={{ 
            width: `${(currentStep - 1) / (steps.length - 1) * 100}%`,
          }}
          transition={{ 
            duration: isMobile ? 0.3 : 0.5,
            ease: "easeInOut"
          }}
        >
          {/* Animated shimmer effect - only on desktop */}
          {!isMobile && (
            <motion.div 
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-draugr-300/30 to-transparent"
              animate={{ 
                x: ['-100%', '100%'] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "linear"
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Checkout Side Summary
const CheckoutSummary = ({ cartItems }) => {
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);
  
  const shipping = subtotal > 1000000 ? 0 : 50000;
  const total = subtotal + shipping;
  
  const isMobile = isMobileDevice();
  
  return (
    <div className="space-y-6">
      {cartItems.length > 0 ? (
        <div className="bg-black/40 rounded-lg border border-gray-800 overflow-hidden">
          {/* Scrollable items container */}
          <div className="max-h-60 overflow-y-auto horror-scrollbar">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-4 border-b border-gray-800 hover:bg-black/20 transition duration-200">
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border border-gray-800 shadow-md relative">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-1 right-1 bg-draugr-900 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                    {item.quantity || 1}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 pr-1">
                  <h4 className="font-medium text-white truncate">{item.name}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-400">{item.quantity || 1} × {item.price.toLocaleString('fa-IR')}</span>
                    <span className="font-bold text-white">{((item.price) * (item.quantity || 1)).toLocaleString('fa-IR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Cart totals */}
          <div className="border-t border-gray-800 divide-y divide-gray-800/70">
            {/* Subtotal */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-black/20 to-transparent">
              <span className="text-gray-300">جمع جزء</span>
              <span className="font-medium text-white">{subtotal.toLocaleString('fa-IR')} تومان</span>
            </div>
            
            {/* Shipping */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-black/20 to-transparent">
              <span className="text-gray-300">هزینه ارسال</span>
              <span>
                {shipping === 0 
                  ? <span className="text-green-500 font-medium">رایگان</span> 
                  : <span className="text-white font-medium">{shipping.toLocaleString('fa-IR')} تومان</span>
                }
              </span>
            </div>
            
            {/* Total */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-vampire-dark/50 to-black/40">
              <span className="font-bold text-white">مجموع</span>
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-draugr-500">{total.toLocaleString('fa-IR')}</span>
                <span className="text-xs text-draugr-400 mr-1">تومان</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-black/40 rounded-lg border border-gray-800 p-5 text-center">
          <p className="text-gray-400">سبد خرید شما خالی است</p>
        </div>
      )}
      
      {/* Security notes */}
      <div className="bg-gradient-to-br from-midnight/70 to-black/50 rounded-lg p-4 border border-gray-800">
        <div className="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-draugr-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944A11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h4 className="font-medium text-white">پرداخت امن</h4>
        </div>
        <p className="text-xs text-gray-400">تمامی تراکنش‌های شما از طریق درگاه‌های معتبر و با پروتکل‌های امنیتی انجام می‌شود.</p>
      </div>
    </div>
  );
};

// Main checkout page component with optimizations
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useOutletContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    postalCode: '',
    paymentMethod: 'online',
    gateway: 'shaparak'
  });
  const [orderNumber, setOrderNumber] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Detect mobile device on mount and window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    
    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);
  
  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Navigation functions
  const goToNext = () => {
    // Scroll to top on mobile when changing steps
    if (isMobile && !hasScrolled) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setHasScrolled(true);
    }
    setCurrentStep(prev => prev + 1);
  };
  
  const goToPrevious = () => {
    // Scroll to top on mobile when changing steps
    if (isMobile && !hasScrolled) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setHasScrolled(true);
    }
    setCurrentStep(prev => prev - 1);
  };
  
  // Handle order placement
  const placeOrder = () => {
    // In a real app, we would send the order to a backend
    // For now, we'll just generate a random order number
    const randomOrderNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
    setOrderNumber(randomOrderNumber);
    setCurrentStep(4); // Move to confirmation step
    
    // Scroll to top on mobile
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && currentStep !== 4) {
      navigate('/shop');
    }
  }, [cartItems, navigate, currentStep]);
  
  // Reset scroll detection on step change
  useEffect(() => {
    setHasScrolled(false);
  }, [currentStep]);
  
  // Import components conditionally based on current step to reduce initial load
  let StepComponent;
  
  if (currentStep === 1) {
    StepComponent = (
      <ShippingForm 
        key="shipping"
        formData={formData} 
        updateFormData={updateFormData} 
        goToNext={goToNext} 
      />
    );
  } else if (currentStep === 2) {
    StepComponent = (
      <PaymentForm 
        key="payment"
        formData={formData} 
        updateFormData={updateFormData} 
        goToNext={goToNext} 
        goToPrevious={goToPrevious} 
      />
    );
  } else if (currentStep === 3) {
    StepComponent = (
      <ReviewOrder 
        key="review"
        formData={formData} 
        cartItems={cartItems} 
        totalPrice={totalPrice}
        goToPrevious={goToPrevious} 
        placeOrder={placeOrder} 
      />
    );
  } else {
    StepComponent = (
      <OrderConfirmation 
        orderNumber={orderNumber} 
        navigate={navigate} 
      />
    );
  }
  
  return (
    <div 
      className="min-h-screen py-8 md:py-16 relative"
      style={{
        background: 'linear-gradient(to bottom, #0c0c0c, #0a0a0a)'
      }}
    >
      {/* Add shimmer animation keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        /* Optimized scrollbar for checkout page */
        .horror-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .horror-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .horror-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(239, 35, 60, 0.3);
          border-radius: 10px;
        }
        .horror-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(239, 35, 60, 0.5);
        }
      `}</style>
      
      {/* Atmospheric background effects - simplified for mobile */}
      {!isMobile && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Noise texture background */}
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-5"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '24px 24px',
              backdropFilter: 'blur(100px)'
            }}
          />
          
          {/* Subtle fog effect */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{
              duration: 40,
              ease: "linear",
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 2000 2000\' fill=\'none\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
              backgroundSize: '200% 200%'
            }}
          />
        </div>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.2 : 0.4 }}
        >
          <Link to="/shop" className="inline-flex items-center text-draugr-500 hover:text-draugr-400 mb-8 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            بازگشت به فروشگاه
          </Link>
        
          <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center text-shadow-horror flex items-center justify-center">
            <span className="text-white">تکمیل</span>
            <span className="text-draugr-500 mx-3">سفارش</span>
          </h1>
        </motion.div>
        
        {currentStep < 4 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0.2 : 0.4, delay: isMobile ? 0 : 0.2 }}
            className="mx-auto max-w-4xl mb-6 md:mb-10"
          >
            <CheckoutProgress currentStep={currentStep} />
          </motion.div>
        )}
        
        <div className="mx-auto max-w-6xl">
          {currentStep < 4 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {StepComponent}
                </AnimatePresence>
              </div>
              
              <div className={`${isMobile ? 'mt-6' : ''}`}>
                {/* Custom loading state for summary component */}
                <div className="backdrop-blur-sm bg-gradient-to-b from-black/60 to-vampire-dark/80 p-6 rounded-xl shadow-horror border border-draugr-900/40 h-fit relative">
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-draugr-500/30 rounded-tr-lg opacity-80" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-draugr-500/30 rounded-bl-lg opacity-80" />
                  
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-draugr-900 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-draugr-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      <span className="text-draugr-400">خلاصه</span> سفارش
                    </h3>
                  </div>
                  
                  {/* Cart summary content */}
                  <CheckoutSummary cartItems={cartItems} />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {StepComponent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 