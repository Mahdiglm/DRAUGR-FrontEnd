import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const SpecialOffersMenu = ({ offers }) => {
  // Group offers by category
  const categories = [...new Set(offers.map(offer => offer.category))];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  
  // Select the first offer from the selected category by default
  useEffect(() => {
    const firstOfferInCategory = offers.find(offer => offer.category === selectedCategory);
    setSelectedOffer(firstOfferInCategory || null);
  }, [selectedCategory, offers]);

  // Filter offers by the selected category
  const filteredOffers = offers.filter(offer => offer.category === selectedCategory);

  // Format price with comma separators and add Toman
  const formatPrice = (price) => {
    return `${price.toLocaleString()} تومان`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-24"
    >
      {/* Section Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl blood-text mb-2">مشاهده همه پیشنهادات ویژه</h2>
        <p className="text-gray-400 text-sm md:text-base">دسته‌بندی مورد نظر خود را انتخاب کنید</p>
      </div>
      
      {/* Category Navigation - Redesigned */}
      <div className="bg-black/30 rounded-xl p-4 mb-8 border border-draugr-800/50">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-center">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              className={`py-3 rounded-lg text-sm transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-draugr-700 to-draugr-500 text-white shadow-[0_0_15px_rgba(255,0,0,0.3)]'
                  : 'bg-black/40 text-gray-300 hover:bg-draugr-900/60 hover:text-white border border-draugr-900/30'
              }`}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Offers Grid and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Offers Grid */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-gradient-to-b from-black/40 to-black/20 rounded-lg p-5 h-full border border-draugr-900/30 shadow-lg backdrop-blur-sm">
            <h3 className="text-xl text-white mb-5 flex items-center border-b border-draugr-900/30 pb-3">
              <span className="inline-block w-3 h-3 bg-draugr-500 rounded-full mr-2"></span>
              {selectedCategory}
            </h3>
            
            <div className="space-y-4">
              {filteredOffers.map((offer) => (
                <motion.div
                  key={offer.id}
                  className={`rounded-lg cursor-pointer transition-all duration-300 overflow-hidden ${
                    selectedOffer?.id === offer.id
                      ? 'ring-2 ring-draugr-500 shadow-[0_0_15px_rgba(255,0,0,0.2)]'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedOffer(offer)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col">
                    <div className="w-full h-24 overflow-hidden">
                      <img 
                        src={offer.image} 
                        alt={offer.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-3 bg-black/40 relative">
                      {selectedOffer?.id === offer.id && (
                        <div className="absolute -top-2 right-2 w-4 h-4 bg-draugr-500 rotate-45 transform"></div>
                      )}
                      <h4 className="text-white text-sm font-medium">{offer.title}</h4>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">{offer.description}</p>
                      <div className="mt-2 inline-block bg-draugr-500/20 px-2 py-1 rounded text-draugr-400 text-xs font-bold">
                        تخفیف {offer.discount}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Side: Selected Offer Details */}
        <div className="lg:col-span-2 order-1 lg:order-2 mb-6 lg:mb-0">
          <AnimatePresence mode="wait">
            {selectedOffer && (
              <motion.div
                key={selectedOffer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-br from-black/40 to-black/20 rounded-lg overflow-hidden border border-draugr-900/30 shadow-[0_5px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm h-full"
              >
                {/* Header */}
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <img 
                    src={selectedOffer.image} 
                    alt={selectedOffer.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl md:text-3xl text-white font-bold drop-shadow-lg">{selectedOffer.title}</h2>
                      <div className="bg-gradient-to-r from-draugr-600 to-draugr-500 text-white px-4 py-1.5 rounded text-sm font-bold shadow-lg transform -rotate-3">
                        تخفیف {selectedOffer.discount}
                      </div>
                    </div>
                    <p className="text-gray-300 mt-2 text-sm md:text-base max-w-2xl">{selectedOffer.description}</p>
                  </div>
                </div>
                
                {/* Products in this offer */}
                <div className="p-5">
                  <h3 className="text-xl text-white mb-4 flex items-center">
                    <span className="inline-block w-1.5 h-5 bg-draugr-500 mr-2 rounded-sm"></span>
                    محصولات این پیشنهاد
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedOffer.items.map((item) => (
                      <motion.div
                        key={item.id}
                        className="bg-gradient-to-b from-black/40 to-black/20 rounded-md overflow-hidden border border-draugr-900/20 group"
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="h-32 overflow-hidden relative">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-2 right-2 bg-draugr-500 text-white text-xs py-0.5 px-2 rounded-sm">
                            جدید
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="text-white text-sm font-medium group-hover:text-draugr-300 transition-colors">{item.name}</h4>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-gray-400 text-xs line-through">{formatPrice(item.price * 1.2)}</div>
                            <div className="text-draugr-400 text-sm font-bold">{formatPrice(item.price)}</div>
                          </div>
                        </div>
                        <Link 
                          to={`/product/${item.id}`} 
                          className="block text-center py-2 bg-black/50 text-xs text-white hover:bg-draugr-900/50 transition-colors group-hover:bg-draugr-800/50"
                        >
                          مشاهده محصول
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* CTA button */}
                  <div className="mt-8 text-center">
                    <Link 
                      to={`/special-offers/${selectedOffer.id}`}
                      className="inline-block bg-gradient-to-r from-draugr-700 to-draugr-500 text-white px-8 py-3 rounded-lg text-sm transition-all duration-300 hover:from-draugr-600 hover:to-draugr-400 hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] relative overflow-hidden group"
                    >
                      <span className="relative z-10">خرید این پیشنهاد ویژه</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-draugr-600 to-draugr-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SpecialOffersMenu; 