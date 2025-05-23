import React from 'react';
import { motion } from 'framer-motion';

const BlogPostCard = ({ title, snippet, author, date, imageUrl }) => {
  const placeholderImageUrl = imageUrl || 'https://via.placeholder.com/400x250/1a1a1a/ff0000?text=Blog+Post+Image';

  return (
    <motion.div
      className="horror-card card-3d rounded-lg overflow-hidden flex flex-col h-full group" // Added group for group-hover utilities
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // Applying 3D hover effect directly via framer-motion for more control
      whileHover={{
        scale: 1.03,
        // Replicating parts of card-3d hover effect, Framer Motion handles perspective
        // rotateY: 3, 
        // rotateX: 3,
        // translateZ: 5, // Framer motion handles z-transform differently, scale is often enough
        boxShadow: "0px 10px 20px rgba(0,0,0,0.4), inset 0 0 10px rgba(255,0,0,0.5)",
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      style={{
        backgroundColor: 'var(--draugr-dark, #121212)', // Using theme variable
        borderColor: 'var(--draugr-primary, #ff0000)', // Using theme variable
        color: 'var(--draugr-light, #e0e0e0)',
      }}
    >
      {/* Image Section */}
      <div className="relative w-full h-48 sm:h-56 overflow-hidden">
        <img
          src={placeholderImageUrl}
          alt={title || 'Blog Post Image'}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" // Scale image on hover
        />
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
    </motion.div>
  );
};

export default BlogPostCard;
