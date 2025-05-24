import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Mock special offers data
const SPECIAL_OFFERS = [
  {
    id: 1,
    title: 'تخفیف خون‌آشامی',
    description: 'تخفیف ۵۰٪ روی همه محصولات مخصوص خون‌آشام‌ها',
    image: '/src/assets/Product_7.jpg',
    expiry: '۲۴ ساعت دیگر',
    discount: '۵۰٪',
    category: 'خون‌آشامی'
  },
  {
    id: 2,
    title: 'پیشنهاد نیمه‌شب',
    description: 'از ساعت ۱۲ شب تا ۳ صبح، تخفیف ویژه روی همه محصولات سیاه',
    image: '/src/assets/Product_5.jpg',
    expiry: 'هر شب',
    discount: '۳۵٪',
    category: 'شبانه'
  },
  {
    id: 3,
    title: 'کالکشن محدود انگشت اسکلت',
    description: 'دستبندهای انگشت اسکلت با تعداد محدود و طراحی منحصر به فرد',
    image: '/src/assets/Product_3.jpg',
    expiry: 'تا اتمام موجودی',
    discount: '۲۰٪',
    category: 'محدود'
  },
  {
    id: 4,
    title: 'ست هالووین ۲۰۲۴',
    description: 'مجموعه کامل اکسسوری مخصوص هالووین با طراحی‌های ویژه',
    image: '/src/assets/Product_11.jpg',
    expiry: 'تا ۱۰ روز دیگر',
    discount: '۳۰٪',
    category: 'خون‌آشامی'
  },
  {
    id: 5,
    title: 'خرید ۲ عدد یکی مهمان ما',
    description: 'با خرید دو عدد از محصولات نقره‌ای، یک محصول رایگان دریافت کنید',
    image: '/src/assets/Product_9.jpg',
    expiry: 'محدود',
    discount: 'رایگان',
    category: 'محدود'
  },
  {
    id: 6,
    title: 'آخرین موجودی‌های ویجا بورد',
    description: 'آخرین فرصت برای خرید ویجا بوردهای اصل با تخفیف',
    image: '/src/assets/Product_4.jpg',
    expiry: 'تا اتمام موجودی',
    discount: '۴۰٪',
    category: 'محدود'
  }
];

const SpecialOffersPage = () => {
  const [activeFilter, setActiveFilter] = useState('همه');
  const [displayedOffers, setDisplayedOffers] = useState(SPECIAL_OFFERS);
  const [isBloodDropVisible, setIsBloodDropVisible] = useState(false);
  
  // Filter options
  const filters = ['همه', 'خون‌آشامی', 'محدود', 'شبانه'];
  
  // Handle filter change
  useEffect(() => {
    if (activeFilter === 'همه') {
      setDisplayedOffers(SPECIAL_OFFERS);
    } else {
      setDisplayedOffers(SPECIAL_OFFERS.filter(offer => offer.category === activeFilter));
    }
  }, [activeFilter]);
  
  // Animate blood drop on filter change
  useEffect(() => {
    setIsBloodDropVisible(true);
    const timer = setTimeout(() => {
      setIsBloodDropVisible(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [activeFilter]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: "url('/src/assets/BackGround-Product.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Blood overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-0"></div>
      
      {/* Page content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Page Header with animated blood drip */}
        <div className="text-center mb-16 relative">
          <h1 className="text-5xl md:text-6xl font-bold blood-text mb-4 glow-pulse">پیشنهادات ویژه</h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">پیشنهادات منحصر به فرد و محدود برای روح‌های تاریک</p>
          
          {/* Animated blood drip */}
          {isBloodDropVisible && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '60px', opacity: 0.9 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute left-1/2 transform -translate-x-1/2 top-full w-1 bg-draugr-500 rounded-b-full"
              style={{ 
                filter: 'blur(1px)',
                boxShadow: '0 0 8px rgba(255, 0, 0, 0.8)'
              }}
            />
          )}
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map(filter => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-md font-medium text-lg transition-all duration-300 ${
                activeFilter === filter 
                  ? 'bg-draugr-600 text-white shadow-[0_0_15px_rgba(255,0,0,0.5)]' 
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </motion.button>
          ))}
        </div>
        
        {/* Special Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {displayedOffers.map((offer) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              whileHover={{ 
                y: -10,
                boxShadow: '0 10px 25px -5px rgba(255, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
              }}
              className="relative overflow-hidden rounded-lg horror-card card-3d"
            >
              {/* Discount Badge */}
              <div className="absolute top-4 right-4 z-10 bg-draugr-600 text-white px-3 py-1 rounded-full font-bold text-lg shadow-[0_0_10px_rgba(255,0,0,0.6)]">
                {offer.discount}
              </div>
              
              {/* Expiry Badge */}
              <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-80 text-white px-3 py-1 rounded-full text-sm">
                {offer.expiry}
              </div>
              
              {/* Image */}
              <div className="h-64 overflow-hidden">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                />
              </div>
              
              {/* Content with blood-like gradient overlay */}
              <div className="p-6 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2 blood-text">{offer.title}</h3>
                  <p className="text-gray-300 mb-4">{offer.description}</p>
                  <Link to="/shop">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-3 bg-gradient-to-r from-draugr-900 to-draugr-700 hover:from-draugr-800 hover:to-draugr-600 text-white rounded-md font-medium transition-all duration-300 shadow-horror"
                    >
                      مشاهده پیشنهاد
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Newsletter Signup */}
        <div className="max-w-4xl mx-auto bg-midnight p-8 rounded-lg shadow-horror border border-draugr-900">
          <h2 className="text-3xl font-bold mb-4 blood-text text-center">از تخفیف‌های ویژه شبانه باخبر شوید</h2>
          <p className="text-gray-300 mb-6 text-center">ایمیل خود را وارد کنید تا از آخرین پیشنهادات ویژه نیمه‌شب مطلع شوید</p>
          
          <form className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="ایمیل شما" 
              className="flex-1 bg-charcoal border border-gray-800 text-white rounded-md px-4 py-3 focus:border-draugr-500 focus:ring-1 focus:ring-draugr-500 transition-all duration-300"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-gradient-to-r from-draugr-900 to-draugr-700 hover:from-draugr-800 hover:to-draugr-600 text-white px-6 py-3 rounded-md font-medium transition-all duration-300 shadow-horror"
            >
              عضویت
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default SpecialOffersPage; 