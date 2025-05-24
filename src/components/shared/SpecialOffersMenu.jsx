import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../product/ProductCard';

const SpecialOffersMenu = ({ isOpen, onClose }) => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  
  // Sample special offers data - in a real app, this would come from an API
  const specialOffers = [
    {
      id: 1,
      title: "پیشنهاد هالووین",
      description: "تخفیف ویژه برای جشن هالووین",
      discount: "۳۰٪",
      badge: "محبوب‌ترین",
      theme: "vampire",
      items: [
        {
          id: 101,
          name: "ماسک هالووین",
          description: "ماسک ترسناک برای جشن هالووین",
          price: 250000,
          imageUrl: "https://images.unsplash.com/photo-1572043238979-62b2625d2b23?q=80&w=300&auto=format"
        },
        {
          id: 102,
          name: "لباس خون‌آشام",
          description: "لباس خون‌آشام با جزئیات واقعی",
          price: 850000,
          imageUrl: "https://images.unsplash.com/photo-1613378254203-9230bf868527?q=80&w=300&auto=format"
        }
      ]
    },
    {
      id: 2,
      title: "مجموعه کتاب‌های نایاب",
      description: "کتاب‌های نایاب و کمیاب با تخفیف ویژه",
      discount: "۲۰٪",
      badge: "محدود",
      theme: "witch",
      items: [
        {
          id: 201,
          name: "انجیل شیطانی",
          description: "نسخه کمیاب و اصل انجیل شیطانی",
          price: 1500000,
          imageUrl: "https://images.unsplash.com/photo-1601309455875-d4916e027887?q=80&w=300&auto=format"
        },
        {
          id: 202,
          name: "کتاب جادوگران",
          description: "کتاب کمیاب درباره جادوگری قرون وسطی",
          price: 950000,
          imageUrl: "https://images.unsplash.com/photo-1584474263348-d0d99ef125b5?q=80&w=300&auto=format"
        }
      ]
    },
    {
      id: 3,
      title: "اکسسوری‌های خاص",
      description: "مجموعه کامل اکسسوری‌های منحصر به فرد",
      discount: "۱۵٪",
      badge: "جدید",
      theme: "werewolf",
      items: [
        {
          id: 301,
          name: "گردنبند گرگینه",
          description: "گردنبند دست‌ساز با طرح گرگینه",
          price: 450000,
          imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=300&auto=format"
        },
        {
          id: 302,
          name: "چوب بیسبال خونین",
          description: "چوب بیسبال تزئینی با طرح خون",
          price: 650000,
          imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=300&auto=format"
        }
      ]
    }
  ];

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.07
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const handleOfferClick = (offerId) => {
    if (selectedOffer === offerId) {
      setSelectedOffer(null);
    } else {
      setSelectedOffer(offerId);
    }
  };

  // Get selected offer details
  const selectedOfferDetails = specialOffers.find(offer => offer.id === selectedOffer);

  // Background theme styles based on selected offer
  const getThemeStyles = (theme) => {
    switch(theme) {
      case 'vampire':
        return 'from-vampire-dark to-vampire-primary';
      case 'witch':
        return 'from-witch-dark to-witch-primary';
      case 'werewolf':
        return 'from-werewolf-dark to-werewolf-primary';
      default:
        return 'from-midnight to-draugr-900';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 overflow-hidden"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80" />

          {/* Menu container - stop propagation to prevent closing when clicking inside */}
          <div 
            className="absolute inset-0 overflow-auto flex items-start justify-center pt-20 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-gradient-to-b from-midnight to-black rounded-lg shadow-horror border border-draugr-900 w-full max-w-4xl overflow-hidden"
            >
              <div className="p-4 border-b border-draugr-900 flex justify-between items-center">
                <h2 className="text-xl font-bold text-draugr-500">پیشنهادات ویژه</h2>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                {/* Offers List */}
                <div className="md:border-l border-draugr-900">
                  <ul className="divide-y divide-draugr-900">
                    {specialOffers.map((offer) => (
                      <motion.li 
                        key={offer.id}
                        variants={itemVariants}
                        className={`${
                          selectedOffer === offer.id 
                            ? 'bg-gradient-to-r from-draugr-900/50 to-transparent'
                            : 'hover:bg-draugr-900/30'
                        } cursor-pointer transition-all duration-300`}
                        onClick={() => handleOfferClick(offer.id)}
                      >
                        <div className="p-4 flex items-center gap-3">
                          <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${getThemeStyles(offer.theme)} flex items-center justify-center shadow-lg`}>
                            <span className="text-white font-bold">{offer.discount}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-white">{offer.title}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full bg-${offer.theme}-primary/70 text-white`}>
                                {offer.badge}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400">{offer.description}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Products Panel */}
                <div className="col-span-2 bg-black/30">
                  <AnimatePresence mode="wait">
                    {selectedOfferDetails ? (
                      <motion.div
                        key={selectedOfferDetails.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`h-full bg-gradient-to-br ${getThemeStyles(selectedOfferDetails.theme)}/10 p-4`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">محصولات {selectedOfferDetails.title}</h3>
                          <Link 
                            to="/shop" 
                            className={`text-${selectedOfferDetails.theme}-secondary hover:text-${selectedOfferDetails.theme}-accent text-sm flex items-center gap-1`}
                          >
                            <span>مشاهده همه</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedOfferDetails.items.map((product) => (
                            <div key={product.id} className="h-full">
                              <ProductCard product={product} isHighlighted={true} inSlider={true} />
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 flex justify-center">
                          <Link 
                            to="/special-offers" 
                            className={`px-4 py-2 bg-gradient-to-r from-${selectedOfferDetails.theme}-primary to-${selectedOfferDetails.theme}-secondary text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300`}
                            onClick={onClose}
                          >
                            مشاهده همه پیشنهادات {selectedOfferDetails.title}
                          </Link>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center p-8 text-center"
                      >
                        <div className="text-draugr-500 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H8.8a4 4 0 00-3.6 2.3L1 12l4.2 7.7A4 4 0 008.8 22H12a4 4 0 004-4v-1.8A4 4 0 0020 12V9" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">یک پیشنهاد را انتخاب کنید</h3>
                        <p className="text-gray-400 text-sm max-w-md">برای مشاهده محصولات هر پیشنهاد، روی عنوان آن در سمت راست کلیک کنید.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpecialOffersMenu; 