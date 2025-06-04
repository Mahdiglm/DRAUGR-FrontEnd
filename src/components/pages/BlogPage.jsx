import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import BlogPostCard from '../blog/BlogPostCard';
import api from '../../services/api';

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
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch blogs from the API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        // Get only published blogs from the public API
        const response = await api.get('/api/blogs');
        console.log('Blog API response:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          setBlogs(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setBlogs(response.data.data);
        } else {
          setBlogs([]);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchBlogs();
    
    // Listen for blog updates from admin panel
    const handleStorageChange = (event) => {
      if (event.key === 'blogsUpdated') {
        console.log('Blogs were updated in admin panel, refreshing data');
        fetchBlogs();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Handle navigation after card flip - made much faster
  const handleCardClick = (slug) => {
    // Navigate immediately - the flip animation will happen in the card component
    navigate(`/blog/${slug}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'تاریخ نامشخص';
    
    try {
      // For Persian date display
      const date = new Date(dateString);
      return date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString;
    }
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

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-draugr-500"></div>
          </div>
        ) : error ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xl text-red-400">{error}</p>
          </motion.div>
        ) : blogs && blogs.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {blogs.map((post) => (
              <motion.div 
                key={post._id} 
                variants={itemVariants} 
                className="h-full w-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ minHeight: "440px" }}
              >
                <BlogPostCard
                  title={post.title}
                  snippet={post.excerpt}
                  author={post.author?.name || "نویسنده Draugr"}
                  date={formatDate(post.createdAt)}
                  imageUrl={post.image}
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
