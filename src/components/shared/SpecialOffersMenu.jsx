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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-10">
        {categories.map((category, index) => (
          <motion.button
            key={category}
            className={`py-3 rounded-lg text-sm transition-all duration-300 border ${
              selectedCategory === category
                ? 'bg-draugr-500 text-white border-draugr-400 shadow-[0_0_10px_rgba(255,0,0,0.4)]'
                : 'bg-black/50 text-gray-300 border-gray-800 hover:bg-draugr-900/60 hover:text-white'
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
      
      {/* Offers Grid and Details - Fully Redesigned */}
      <div className="grid grid-cols-1 gap-6">
        {/* Selected Offer Details - Moved to Top */}
        <div className="mb-6">
          <AnimatePresence mode="wait">
            {selectedOffer && (
              <motion.div
                key={selectedOffer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-br from-black/40 to-draugr-900/20 rounded-lg overflow-hidden border border-draugr-900/30"
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
                      <div className="bg-draugr-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        تخفیف {selectedOffer.discount}
                      </div>
                    </div>
                    <p className="text-gray-300 mt-2 text-sm md:text-base">{selectedOffer.description}</p>
                  </div>
                </div>
                
                {/* Products in this offer - Redesigned */}
                <div className="p-5">
                  <h3 className="text-xl text-white mb-6 border-r-4 border-draugr-500 pr-3">محصولات این پیشنهاد</h3>
                  
                  <div className="flex flex-wrap justify-center">
                    {selectedOffer.items.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] m-2 bg-black/40 rounded-lg overflow-hidden border-t border-r border-draugr-900/50 group"
                        whileHover={{ y: -5, scale: 1.02 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + (idx * 0.05) }}
                      >
                        <div className="h-40 overflow-hidden relative">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-2 left-2 bg-draugr-500/80 text-white text-xs py-1 px-2 rounded-full">
                            پیشنهاد ویژه
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="text-white text-base font-medium group-hover:text-draugr-300 transition-colors">{item.name}</h4>
                          <div className="flex flex-col mt-2">
                            <div className="text-gray-400 text-xs line-through">{formatPrice(item.price * 1.2)}</div>
                            <div className="text-draugr-400 text-lg font-bold mt-1">{formatPrice(item.price)}</div>
                          </div>
                          <Link 
                            to={`/product/${item.id}`} 
                            className="block text-center py-2.5 mt-3 bg-draugr-900/70 text-white rounded-md hover:bg-draugr-500 transition-colors"
                          >
                            مشاهده محصول
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* CTA button */}
                  <div className="mt-10 text-center">
                    <Link 
                      to={`/special-offers/${selectedOffer.id}`}
                      className="inline-block bg-gradient-to-br from-draugr-700 to-draugr-500 text-white px-8 py-3 rounded-full text-sm transition-all duration-300 hover:from-draugr-600 hover:to-draugr-400 hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]"
                    >
                      خرید این پیشنهاد ویژه
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Offers Grid - Redesigned */}
        <div>
          <div className="bg-gradient-to-br from-black/50 to-draugr-900/10 rounded-lg p-5 border border-draugr-900/30">
            <h3 className="text-xl text-white mb-6 pb-2 border-b border-draugr-900/50 flex items-center">
              <span className="inline-block w-3 h-3 bg-draugr-500 rounded-full mr-2"></span>
              سایر پیشنهادهای {selectedCategory}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOffers.map((offer) => (
                <motion.div
                  key={offer.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedOffer?.id === offer.id
                      ? 'bg-draugr-900/40 border border-draugr-500/50 shadow-[0_0_10px_rgba(255,0,0,0.2)]'
                      : 'bg-black/30 border border-transparent hover:bg-black/50'
                  }`}
                  onClick={() => setSelectedOffer(offer)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-draugr-900/50">
                      <img 
                        src={offer.image} 
                        alt={offer.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mr-4 flex-grow">
                      <h4 className="text-white text-base font-medium">{offer.title}</h4>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{offer.description}</p>
                      <div className="mt-2 bg-draugr-500/20 inline-block px-3 py-1 rounded-full text-draugr-400 text-xs font-bold">تخفیف {offer.discount}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpecialOffersMenu; 