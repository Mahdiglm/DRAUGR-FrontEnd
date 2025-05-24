import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { blogPosts } from '../../utils/mockData';
import BlogPostCard from '../blog/BlogPostCard';

// Animation variants for the container and items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 14,
    },
  },
};

const BlogPage = () => {
  const navigate = useNavigate();
  
  // Handle navigation after card flip
  const handleCardClick = (slug) => {
    // Add a small delay to allow the flip animation to complete
    setTimeout(() => {
      navigate(`/blog/${slug}`);
    }, 800); // Slightly longer than the flip animation duration
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-draugr-dark to-draugr-deepcharcoal text-draugr-light p-4 sm:p-6 md:p-8"
    >
      <div className="container mx-auto">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-10 md:mb-16 text-red-400 hover:text-red-500 transition-colors duration-300 text-shadow-horror"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6, type: 'spring', stiffness: 100, damping: 15 }}
        >
          بلاگ / مقالات
        </motion.h1>

        {blogPosts && blogPosts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={containerVariants}
          >
            {blogPosts.map((post) => (
              <motion.div key={post.id} variants={itemVariants} className="h-full">
                <BlogPostCard
                  title={post.title}
                  snippet={post.snippet}
                  author={post.author}
                  date={post.date}
                  imageUrl={post.featuredImageUrl}
                  onFlipComplete={() => handleCardClick(post.slug)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xl text-gray-400">
              در حال حاضر مقاله‌ای برای نمایش وجود ندارد. به زودی با مطالب جدید باز خواهیم گشت!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BlogPage;
