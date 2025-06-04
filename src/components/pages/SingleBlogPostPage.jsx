import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
// Import the styles for proper content rendering
import '../../styles/quill-dark.css';

const SingleBlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch blog post by slug
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use the slug endpoint to get blog post
        const response = await api.get(`/api/blogs/slug/${slug}`);
        console.log('Blog post response:', response.data);
        
        if (response.data) {
          setPost(response.data);
        } else {
          setError('مقاله مورد نظر یافت نشد');
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('خطا در بارگذاری مقاله');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlogPost();
  }, [slug]);
  
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-draugr-dark to-draugr-deepcharcoal text-draugr-light p-8 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
        <p className="mt-4 text-gray-400">در حال بارگذاری مقاله...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-b from-draugr-dark to-draugr-deepcharcoal text-draugr-light p-8 flex flex-col items-center justify-center text-center"
      >
        <motion.h1 
          className="text-4xl font-bold text-red-500 mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
        >
          خطا: ۴۰۴
        </motion.h1>
        <p className="text-xl text-gray-300 mb-8">
          {error || `مقاله مورد نظر با آدرس ${slug} یافت نشد.`}
        </p>
        <Link
          to="/blog"
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-red-700/50 transition-all duration-300 transform hover:scale-105"
        >
          بازگشت به لیست مقالات
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto max-w-4xl bg-gradient-to-b from-draugr-dark via-draugr-deepcharcoal to-draugr-deepcharcoal text-draugr-light p-4 sm:p-6 md:p-8 rounded-lg shadow-2xl shadow-red-900/20 my-8" 
    >
      {/* Post Header */}
      <header className="mb-8 text-center">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-4 text-red-400 hover:text-red-500 transition-all duration-300 text-shadow-horror hover:scale-[1.02] hover:text-shadow-[0_0_12px_rgba(255,0,0,0.7)]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {post.title}
        </motion.h1>
        <motion.div 
          className="text-sm text-gray-400"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            نویسنده: {post.author?.name || 'نویسنده Draugr'}
          </span>
          <span className="mx-2 text-red-700 opacity-50">|</span>
          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {formatDate(post.createdAt)}
          </span>
          {post.views !== undefined && (
            <>
              <span className="mx-2 text-red-700 opacity-50">|</span>
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {post.views} بازدید
              </span>
            </>
          )}
        </motion.div>
      </header>

      {/* Featured Image */}
      {post.image && (
        <motion.div 
          className="mb-8 rounded-lg overflow-hidden shadow-xl shadow-red-900/40 hover:shadow-red-700/60 transition-all duration-300"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7, type: 'spring', stiffness:100 }}
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto object-cover max-h-[500px]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/1200x600/1a1a1a/666666?text=Draugr+Blog';
            }}
          />
        </motion.div>
      )}

      {/* Post Content */}
      <motion.article
        className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl prose-invert max-w-none leading-loose preview-container" 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        style={{ 
          textAlign: 'justify', 
          '--tw-prose-bullets': 'var(--draugr-accent, #ff3333)',
          '--tw-prose-links': 'var(--draugr-primary, #ff0000)',
          '--tw-prose-bold': 'var(--draugr-light, #e0e0e0)',
          '--tw-prose-headings': 'var(--draugr-accent, #ff3333)',
        }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags Section */}
      {post.tags && post.tags.length > 0 && (
        <motion.div
          className="mt-8 pt-4 border-t border-draugr-700/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-block bg-draugr-700/60 hover:bg-draugr-700/80 text-gray-300 px-3 py-1 text-sm rounded-full transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Comments Section Placeholder */}
      <motion.div
        className="mt-12 pt-8 border-t border-draugr-700/50 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-red-400">بخش نظرات</h2>
        <div className="max-w-2xl mx-auto bg-draugr-charcoal/40 p-6 sm:p-8 rounded-xl shadow-xl border border-draugr-700/30">
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment, index) => (
                <div key={index} className="bg-draugr-dark/60 p-4 rounded-lg border border-draugr-700/30">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-300">{comment.name || 'ناشناس'}</span>
                    <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-400">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mb-4 text-sm sm:text-base">
              بخش نظرات به زودی فعال خواهد شد. مشتاقانه منتظر دیدگاه‌های ارزشمند و مخوف شما هستیم!
            </p>
          )}
          
          <div className="mt-6 p-4 bg-draugr-dark/50 rounded-lg shadow-inner border border-draugr-700/50">
            <p className="italic text-gray-500 text-xs sm:text-sm">فرم ارسال نظر در اینجا قرار خواهد گرفت...</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SingleBlogPostPage;
