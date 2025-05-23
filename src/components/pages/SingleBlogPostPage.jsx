import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../../utils/mockData';

const SingleBlogPostPage = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
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
          مقاله مورد نظر با آدرس <span className="font-mono text-red-400">{slug}</span> یافت نشد.
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

  // Use post data if found
  const postTitle = post.title;
  const postAuthor = post.author;
  const postDate = post.date;
  const postContent = post.content;
  const postFeaturedImageUrl = post.featuredImageUrl;

  // Example of placeholder content that would be used for reference
  /* 
  Template content example:
  <p>این پاراگراف اول متن کامل مقاله است. می‌تواند شامل چندین جمله باشد و به معرفی موضوع بپردازد. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.</p>
  <br />
  <h2>زیرعنوان بخش اول</h2>
  <p>چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
  <br />
  <p>در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.</p>
  <br />
  <h3>زیرعنوان بخش دوم: جزئیات بیشتر</h3>
  <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
  <ul>
    <li>نکته اول: توضیحات مربوط به این نکته.</li>
    <li>نکته دوم: جزئیات بیشتر در مورد این مسئله.</li>
    <li>نکته سوم: بررسی عمیق‌تر این موضوع.</li>
  </ul>
  <br />
  <p>امید است که این مطلب برای خوانندگان مفید واقع شود و بتواند به سوالات آن‌ها پاسخ دهد. نظرات و پیشنهادات خود را با ما در میان بگذارید.</p>
  */

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
          {postTitle}
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
            نویسنده: {postAuthor}
          </span>
          <span className="mx-2 text-red-700 opacity-50">|</span>
          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {postDate}
          </span>
        </motion.div>
      </header>

      {/* Featured Image */}
      {postFeaturedImageUrl && (
        <motion.div 
          className="mb-8 rounded-lg overflow-hidden shadow-xl shadow-red-900/40 hover:shadow-red-700/60 transition-all duration-300"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7, type: 'spring', stiffness:100 }}
        >
          <img
            src={postFeaturedImageUrl}
            alt={postTitle}
            className="w-full h-auto object-cover max-h-[500px]" // Added max-h for large images
          />
        </motion.div>
      )}

      {/* Post Content */}
      <motion.article
        className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl prose-invert max-w-none leading-loose" 
        // Adjusted prose classes for responsiveness and leading-loose for more spacing
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        style={{ 
            textAlign: 'justify', 
            // lineHeight: '1.9', // Using prose leading-loose now
            // fontSize: '1.1rem', // Controlled by prose classes
            '--tw-prose-bullets': 'var(--draugr-accent, #ff3333)', // Customize bullet color
            '--tw-prose-links': 'var(--draugr-primary, #ff0000)',
            '--tw-prose-bold': 'var(--draugr-light, #e0e0e0)',
            '--tw-prose-headings': 'var(--draugr-accent, #ff3333)',
        }}
        dangerouslySetInnerHTML={{ __html: postContent }}
      />

      {/* Comments Section Placeholder */}
      <motion.div
        className="mt-12 pt-8 border-t border-draugr-700/50 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-red-400">بخش نظرات</h2>
        <div className="max-w-2xl mx-auto bg-draugr-charcoal/40 p-6 sm:p-8 rounded-xl shadow-xl border border-draugr-700/30">
          <p className="text-gray-400 mb-4 text-sm sm:text-base">
            بخش نظرات به زودی فعال خواهد شد. مشتاقانه منتظر دیدگاه‌های ارزشمند و مخوف شما هستیم!
          </p>
          <div className="mt-6 p-4 bg-draugr-dark/50 rounded-lg shadow-inner border border-draugr-700/50">
              <p className="italic text-gray-500 text-xs sm:text-sm">فرم ارسال نظر در اینجا قرار خواهد گرفت...</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SingleBlogPostPage;
