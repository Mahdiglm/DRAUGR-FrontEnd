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
      
      {/* Category Navigation */}
      <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide">
        <div className="flex space-x-2 rtl:space-x-reverse mx-auto">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              className={`px-4 py-2 rounded-md text-sm whitespace-nowrap transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-draugr-500 text-white shadow-[0_0_10px_rgba(255,0,0,0.4)]'
                  : 'bg-black/50 text-gray-300 hover:bg-draugr-900/60 hover:text-white'
              }`}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
          <div className="bg-black/20 rounded-lg p-4 h-full border border-draugr-900/30">
            <h3 className="text-xl text-white mb-4 flex items-center">
              <span className="inline-block w-2 h-2 bg-draugr-500 rounded-full mr-2"></span>
              {selectedCategory}
            </h3>
            
            <div className="space-y-3">
              {filteredOffers.map((offer) => (
                <motion.div
                  key={offer.id}
                  className={`p-3 rounded-md cursor-pointer transition-all duration-300 ${
                    selectedOffer?.id === offer.id
                      ? 'bg-draugr-900/50 border-r-2 border-draugr-500'
                      : 'bg-black/30 hover:bg-black/50'
                  }`}
                  onClick={() => setSelectedOffer(offer)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 border border-draugr-900/50">
                      <img 
                        src={offer.image} 
                        alt={offer.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-grow">
                      <h4 className="text-white text-sm font-medium">{offer.title}</h4>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-1">{offer.description}</p>
                      <div className="mt-1 text-draugr-400 text-xs font-bold">تخفیف {offer.discount}</div>
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
                className="bg-black/20 rounded-lg overflow-hidden border border-draugr-900/30 h-full"
              >
                {/* Header */}
                <div className="relative h-48 md:h-60 overflow-hidden">
                  <img 
                    src={selectedOffer.image} 
                    alt={selectedOffer.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl md:text-3xl text-white font-bold">{selectedOffer.title}</h2>
                      <div className="bg-draugr-500 text-white px-3 py-1 rounded-sm text-sm font-bold shadow-lg">
                        تخفیف {selectedOffer.discount}
                      </div>
                    </div>
                    <p className="text-gray-300 mt-2 text-sm md:text-base">{selectedOffer.description}</p>
                  </div>
                </div>
                
                {/* Products in this offer */}
                <div className="p-5">
                  <h3 className="text-xl text-white mb-4">محصولات این پیشنهاد</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedOffer.items.map((item) => (
                      <motion.div
                        key={item.id}
                        className="bg-black/30 rounded-md overflow-hidden border border-draugr-900/30 group"
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="h-32 overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="text-white text-sm font-medium group-hover:text-draugr-300 transition-colors">{item.name}</h4>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-gray-400 text-xs line-through">{(item.price * 1.2).toLocaleString()} تومان</div>
                            <div className="text-draugr-400 text-sm font-bold">{item.price.toLocaleString()} تومان</div>
                          </div>
                        </div>
                        <Link 
                          to={`/product/${item.id}`} 
                          className="block text-center py-2 bg-black/50 text-xs text-white hover:bg-draugr-900/50 transition-colors"
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
                      className="inline-block bg-gradient-to-r from-draugr-700 to-draugr-500 text-white px-6 py-3 rounded text-sm transition-all duration-300 hover:from-draugr-600 hover:to-draugr-400 hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]"
                    >
                      خرید این پیشنهاد ویژه
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