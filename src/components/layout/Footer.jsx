import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 sm:py-12 w-full">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          <div className="col-span-2 sm:col-span-2 md:col-span-1 mb-6 md:mb-0">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">فروشگاه DRAUGR</h3>
            <p className="text-gray-400 text-sm sm:text-base">منبع شما برای اقلام فوق‌العاده و آثار افسانه‌ای.</p>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm sm:text-base">فروشگاه</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">همه محصولات</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">محصولات ویژه</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">محصولات جدید</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">پیشنهادات ویژه</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm sm:text-base">شرکت</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">درباره ما</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">تماس با ما</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">فرصت‌های شغلی</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">قوانین و مقررات</a></li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <h4 className="font-bold mb-3 text-sm sm:text-base">عضویت در خبرنامه</h4>
            <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">از محصولات جدید و تخفیف‌های ویژه مطلع شوید.</p>
            <div className="flex flex-col sm:flex-row">
              <input 
                type="email" 
                placeholder="ایمیل شما" 
                className="bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-md sm:rounded-l-md sm:rounded-r-none w-full mb-2 sm:mb-0 text-xs sm:text-sm focus:outline-none"
              />
              <button className="bg-white text-black px-3 sm:px-4 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md text-xs sm:text-sm">
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