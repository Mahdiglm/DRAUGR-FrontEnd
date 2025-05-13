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
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      
      <div className="w-full max-w-7xl mx-auto px-4 relative z-10 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-12 mb-12">
          <div className="col-span-2 sm:col-span-2 md:col-span-1 mb-8 md:mb-0">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-draugr-400">فروشگاه DRAUGR</h3>
            <p className="text-gray-300 text-sm sm:text-base">منبع شما برای اقلام فوق‌العاده و آثار افسانه‌ای.</p>
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
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <h4 className="font-bold mb-4 text-sm sm:text-base text-draugr-400">عضویت در خبرنامه</h4>
            <p className="text-gray-300 mb-4 sm:mb-6 text-xs sm:text-sm">از محصولات جدید و تخفیف‌های ویژه مطلع شوید.</p>
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
        <div className="border-t border-gray-800 mt-12 sm:mt-16 pt-8 sm:pt-10 text-center text-gray-400">
          <p className="text-xs sm:text-sm">© {new Date().getFullYear()} فروشگاه DRAUGR. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 