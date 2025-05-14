import React from 'react';
import footerBackground from '../../assets/Background-Footer.png';

const Footer = () => {
  return (
    <footer className="text-white py-12 sm:py-16 md:py-24 w-full relative bg-black min-h-[500px] sm:min-h-[600px] md:min-h-[700px] flex flex-col justify-center">
      {/* Background image */}
      <div 
        className="absolute inset-0 w-full h-full z-0 opacity-80" 
        style={{ 
          backgroundImage: `url(${footerBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Top gradient overlay for smooth transition from login/signup pages */}
      <div 
        className="absolute top-0 left-0 right-0 h-32 z-0" 
        style={{
          background: 'linear-gradient(to top, transparent, rgba(0, 0, 0, 0.95))',
          pointerEvents: 'none'
        }}
      ></div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      
      <div className="w-full max-w-7xl mx-auto px-4 relative z-10 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-12 mb-12">
          {/* Redesigned first section */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 mb-8 md:mb-0 relative overflow-hidden flex flex-col items-center text-center">
            <div className="relative z-10">
              <h3 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center justify-center">
                <span className="bg-gradient-to-r from-draugr-500 to-draugr-400 bg-clip-text text-transparent">DRAUGR</span>
                <span className="text-white mx-2">|</span>
                <span className="text-sm text-gray-300">فروشگاه</span>
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed relative">
                منبع شما برای اقلام فوق‌العاده و آثار افسانه‌ای با بیش از ۱۰ سال تجربه در ارائه بهترین محصولات.
              </p>
              <div className="flex mt-6 space-x-4 rtl:space-x-reverse justify-center">
                <a href="#" className="bg-gray-800 bg-opacity-50 hover:bg-draugr-600 p-2 rounded-full transition-all duration-300 transform hover:-translate-y-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 bg-opacity-50 hover:bg-draugr-600 p-2 rounded-full transition-all duration-300 transform hover:-translate-y-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 bg-opacity-50 hover:bg-draugr-600 p-2 rounded-full transition-all duration-300 transform hover:-translate-y-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm sm:text-base text-draugr-400">فروشگاه</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-draugr-500 text-xs sm:text-sm transition-colors duration-200">همه محصولات</a></li>
              <li><a href="#" className="text-gray-300 hover:text-draugr-500 text-xs sm:text-sm transition-colors duration-200">محصولات ویژه</a></li>
              <li><a href="#" className="text-gray-300 hover:text-draugr-500 text-xs sm:text-sm transition-colors duration-200">محصولات جدید</a></li>
              <li><a href="#" className="text-gray-300 hover:text-draugr-500 text-xs sm:text-sm transition-colors duration-200">پیشنهادات ویژه</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm sm:text-base text-draugr-400">شرکت</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-draugr-500 text-xs sm:text-sm transition-colors duration-200">درباره ما</a></li>
              <li><a href="#" className="text-gray-300 hover:text-draugr-500 text-xs sm:text-sm transition-colors duration-200">تماس با ما</a></li>
              <li><a href="#" className="text-gray-300 hover:text-draugr-500 text-xs sm:text-sm transition-colors duration-200">فرصت‌های شغلی</a></li>
              <li><a href="#" className="text-gray-300 hover:text-draugr-500 text-xs sm:text-sm transition-colors duration-200">قوانین و مقررات</a></li>
            </ul>
          </div>
          {/* Redesigned newsletter section */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 flex flex-col items-center text-center">
            <h4 className="font-bold mb-4 text-sm sm:text-base text-draugr-400 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-draugr-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              عضویت در خبرنامه
            </h4>
            <p className="text-gray-300 mb-4 sm:mb-6 text-xs sm:text-sm">از محصولات جدید و تخفیف‌های ویژه مطلع شوید.</p>
            
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg">
              <div className="mb-4">
                <input 
                  type="email" 
                  placeholder="ایمیل شما" 
                  className="bg-gray-800 text-white px-4 py-3 rounded-md w-full text-xs sm:text-sm focus:outline-none border border-gray-700 focus:border-draugr-500 focus:ring-1 focus:ring-draugr-500 transition-all duration-300"
                />
              </div>
              <button className="w-full bg-gradient-to-r from-draugr-800 to-draugr-600 text-white px-4 py-3 rounded-md text-xs sm:text-sm hover:from-draugr-700 hover:to-draugr-500 transition-all duration-300 font-medium flex items-center justify-center group">
                <span>عضویت در خبرنامه</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="mt-4 pt-3 border-t border-gray-700 flex items-center text-xs text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-draugr-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                ما هرگز اطلاعات شما را به اشتراک نمی‌گذاریم
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center w-full">
              <span className="text-xs text-gray-400 ml-2">پرداخت امن:</span>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" alt="Visa" className="h-4" />
                </div>
                <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="h-4" />
                </div>
                <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 sm:mt-16 pt-8 sm:pt-10 text-center text-gray-400">
          <p className="text-xs sm:text-sm">© {new Date().getFullYear()} فروشگاه DRAUGR. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 