import React from 'react';
import footerBackground from '../../assets/Background-Footer.png';

const Footer = () => {
  return (
    <footer className="text-white py-8 sm:py-12 w-full relative bg-black">
      {/* Background image */}
      <div 
        className="absolute inset-0 w-full h-full z-0 opacity-70" 
        style={{ 
          backgroundImage: `url(${footerBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
      
      <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          <div className="col-span-2 sm:col-span-2 md:col-span-1 mb-6 md:mb-0">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-draugr-400">فروشگاه DRAUGR</h3>
            <p className="text-gray-300 text-sm sm:text-base">منبع شما برای اقلام فوق‌العاده و آثار افسانه‌ای.</p>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm sm:text-base text-draugr-400">فروشگاه</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-draugr-500 text-xs sm:text-sm transition-colors duration-200">همه محصولات</a></li>
              <li><a href="#" className="text-gray-300 hover:text-draugr-500 text-xs sm:text-sm transition-colors duration-200">محصولات ویژه</a></li>
              <li><a href="#" className="text-gray-300 hover:text-draugr-500 text-xs sm:text-sm transition-colors duration-200">محصولات جدید</a></li>
              <li><a href="#" className="text-gray-300 hover:text-draugr-500 text-xs sm:text-sm transition-colors duration-200">پیشنهادات ویژه</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm sm:text-base text-draugr-400">شرکت</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-draugr-500 text-xs sm:text-sm transition-colors duration-200">درباره ما</a></li>
              <li><a href="#" className="text-gray-300 hover:text-draugr-500 text-xs sm:text-sm transition-colors duration-200">تماس با ما</a></li>
              <li><a href="#" className="text-gray-300 hover:text-draugr-500 text-xs sm:text-sm transition-colors duration-200">فرصت‌های شغلی</a></li>
              <li><a href="#" className="text-gray-300 hover:text-draugr-500 text-xs sm:text-sm transition-colors duration-200">قوانین و مقررات</a></li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <h4 className="font-bold mb-3 text-sm sm:text-base text-draugr-400">عضویت در خبرنامه</h4>
            <p className="text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm">از محصولات جدید و تخفیف‌های ویژه مطلع شوید.</p>
            <div className="flex flex-col sm:flex-row">
              <input 
                type="email" 
                placeholder="ایمیل شما" 
                className="bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-md sm:rounded-l-md sm:rounded-r-none w-full mb-2 sm:mb-0 text-xs sm:text-sm focus:outline-none border border-gray-700 focus:border-draugr-500"
              />
              <button className="bg-gradient-to-r from-draugr-800 to-draugr-600 text-white px-3 sm:px-4 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md text-xs sm:text-sm hover:from-draugr-700 hover:to-draugr-500 transition-all duration-300">
                عضویت
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400">
          <p className="text-xs sm:text-sm">© {new Date().getFullYear()} فروشگاه DRAUGR. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 