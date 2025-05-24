import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SpecialOffersBanner = ({ offers }) => {
  return (
    <div className="mb-16">
      <motion.div 
        className="flex flex-col lg:flex-row gap-6 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        {offers.map((offer, index) => (
          <motion.div
            key={offer.id}
            className="relative overflow-hidden group w-full lg:w-1/3 rounded-lg card-3d horror-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Background image with overlay */}
            <div className="relative aspect-[4/3] w-full">
              <img 
                src={offer.image} 
                alt={offer.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-70"></div>
              
              {/* Discount badge */}
              <div className="absolute top-4 left-4 bg-draugr-500 text-white px-3 py-1 rounded-sm text-sm font-bold shadow-lg">
                تخفیف {offer.discount}
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-draugr-300 transition-colors">
                  {offer.title}
                </h3>
                <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                  {offer.description}
                </p>
                
                {/* Items preview */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                  {offer.items.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-12 h-12 bg-black/50 rounded overflow-hidden border border-draugr-900">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                
                {/* CTA button */}
                <Link 
                  to={`/special-offers/${offer.id}`}
                  className="inline-block bg-gradient-to-r from-draugr-700 to-draugr-500 text-white px-5 py-2 rounded text-sm transition-all duration-300 hover:from-draugr-600 hover:to-draugr-400 hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]"
                >
                  مشاهده پیشنهاد
                </Link>
              </div>
            </div>
            
            {/* Animated border effect */}
            <div className="absolute inset-0 border border-draugr-500/0 group-hover:border-draugr-500/50 transition-all duration-500 rounded-lg pointer-events-none"></div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SpecialOffersBanner; 