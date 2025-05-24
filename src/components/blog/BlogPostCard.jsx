import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BlogPostCard = ({ title, snippet, author, date, imageUrl }) => {
  // Add state to track if card is flipped
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Function to toggle card flip
  const toggleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="h-full perspective-1000">
      <motion.div
        className="horror-card card-3d rounded-lg overflow-hidden flex flex-col h-full group relative w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          backgroundColor: 'var(--draugr-dark, #121212)',
          borderColor: 'var(--draugr-primary, #ff0000)', 
          color: 'var(--draugr-light, #e0e0e0)',
        }}
        onClick={toggleFlip}
      >
        {/* Front of Card */}
        <div 
          className="absolute inset-0 backface-hidden w-full h-full"
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden"
          }}
        >
          {/* Image Section with fallback */}
          <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-gray-900 to-red-900 flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title || 'Blog Post Image'}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.classList.add('fallback-active');
                }}
              />
            ) : (
              <div className="text-center p-4">
                <div className="text-red-500 font-bold text-lg">{title || 'عنوان پست وبلاگ'}</div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-75 group-hover:opacity-50 transition-opacity duration-300"></div>
          </div>

          {/* Content Section */}
          <div className="p-4 flex-grow flex flex-col">
            <h3 className="text-xl font-bold mb-2 text-red-100 group-hover:text-red-400 transition-colors duration-300">
              {title || 'عنوان پست وبلاگ'}
            </h3>
            <p className="text-sm text-gray-300 mb-3 flex-grow line-clamp-3">
              {snippet || 'این یک توضیح کوتاه برای پست وبلاگ است. این متن به عنوان یک پیش‌نمایش عمل می‌کند و خواننده را به خواندن ادامه مطلب ترغیب می‌کند.'}
            </p>
            
            {/* Footer Section for Author and Date */}
            <div className="mt-auto pt-3 border-t border-gray-700 group-hover:border-red-700 transition-colors duration-300">
              <div className="flex justify-between items-center text-xs text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                <span>
                  نویسنده: {author || 'ناشناس'}
                </span>
                <span>
                  تاریخ: {date || '۱۴۰۳/۰۱/۰۱'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div 
          className="absolute inset-0 backface-hidden w-full h-full rounded-lg overflow-hidden flex flex-col"
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundColor: 'var(--draugr-dark, #121212)',
            backgroundImage: 'radial-gradient(circle at center, rgba(255,0,0,0.2) 0%, rgba(0,0,0,0) 70%)',
          }}
        >
          <div className="p-6 flex flex-col justify-center items-center h-full text-center">
            <div className="animate-pulse mb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="w-16 h-16 rounded-full bg-red-800 bg-opacity-30 flex items-center justify-center mx-auto mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </motion.div>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-red-400">مشاهده مقاله کامل</h3>
            <p className="text-gray-300 mb-6">برای خواندن متن کامل مقاله "{title}" کلیک کنید</p>
            
            <div className="border-t border-gray-700 pt-4 w-full">
              <p className="text-sm text-gray-400">
                نوشته شده توسط <span className="text-red-300">{author || 'ناشناس'}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{date || '۱۴۰۳/۰۱/۰۱'}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogPostCard;
