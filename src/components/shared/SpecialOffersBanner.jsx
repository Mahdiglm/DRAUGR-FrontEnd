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
            className="relative group w-full lg:w-1/3 bg-black/90 backdrop-blur-sm border border-gray-800/50 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
            style={{
              borderRadius: '2px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Subtle rune pattern overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <pattern id={`runes-${offer.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M5 5L15 15M15 5L5 15M10 2L10 18M2 10L18 10" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#runes-${offer.id})`} className="text-red-500" />
              </svg>
            </div>

            {/* Main image container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img 
                src={offer.image} 
                alt={offer.title} 
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 filter brightness-75 contrast-110"
              />
              
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              
              {/* Subtle grain texture */}
              <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }}></div>
              
              {/* Discount badge */}
              <div className="absolute top-3 left-3 bg-black/80 border border-red-900/60 text-red-400 px-3 py-1 text-xs font-medium tracking-wide">
                {offer.discount} تخفیف
              </div>
            </div>

            {/* Content section */}
            <div className="p-5 relative">
              {/* Title */}
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-300 transition-colors duration-300">
                {offer.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-2">
                {offer.description}
              </p>
            
              
              {/* CTA button */}
              <Link 
                to={`/special-offers/${offer.id}`}
                className="inline-block w-full text-center py-2.5 bg-black/60 border border-red-900/40 text-red-400 text-sm font-medium transition-all duration-300 hover:bg-red-950/30 hover:border-red-800/60 hover:text-red-300 relative overflow-hidden group"
                style={{ borderRadius: '1px' }}
              >
                <span className="relative z-10">مشاهده پیشنهاد</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Link>
            </div>
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
              boxShadow: 'inset 0 0 20px rgba(255, 0, 0, 0.1), 0 0 20px rgba(255, 0, 0, 0.1)'
            }}></div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SpecialOffersBanner;