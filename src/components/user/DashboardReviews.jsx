import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Simulate fetching reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data - in a real app this would come from an API
        const mockReviews = [
          {
            id: '1',
            productId: '101',
            productName: 'گردنبند پنتاگرام نقره‌ای',
            productImage: 'https://via.placeholder.com/150',
            rating: 5,
            comment: 'کیفیت ساخت این گردنبند فوق‌العاده است. طراحی بسیار زیبایی دارد و جنس نقره آن عالی است. من برای هدیه تولد خریدم و گیرنده بسیار راضی بود.',
            date: '1402-07-23T14:56:00Z',
            helpful: 12
          },
          {
            id: '2',
            productId: '102',
            productName: 'کتاب آیین های تاریک - نسخه چرمی محدود',
            productImage: 'https://via.placeholder.com/150',
            rating: 4,
            comment: 'کتاب بسیار با کیفیتی است و چاپ و صحافی فوق‌العاده‌ای دارد. تنها دلیلی که ۵ ستاره ندادم این بود که در حمل و نقل کمی آسیب دیده بود.',
            date: '1402-06-31T09:30:00Z',
            helpful: 5
          },
          {
            id: '3',
            productId: '103',
            productName: 'مجموعه شمع‌های آیینی طرح جمجمه',
            productImage: 'https://via.placeholder.com/150',
            rating: 5,
            comment: 'این مجموعه شمع بسیار با کیفیت و زیباست. طراحی جمجمه‌ها بسیار دقیق و باورنکردنی است. هنگام سوختن بوی خوشی هم دارند. خرید این محصول را به همه توصیه می‌کنم.',
            date: '1402-08-14T16:20:00Z',
            helpful: 20
          }
        ];
        
        setReviews(mockReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviews();
  }, []);
  
  // Delete review
  const handleDeleteReview = (id) => {
    if (confirm('آیا از حذف این نظر اطمینان دارید؟')) {
      setReviews(reviews.filter(review => review.id !== id));
    }
  };
  
  // Edit review
  const handleEditReview = (reviewId) => {
    // In a real app, this would navigate to a review edit page or open a modal
    alert(`ویرایش نظر ${reviewId} در نسخه بعدی اضافه خواهد شد`);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fa-IR', options);
  };
  
  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i}
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 ${i <= rating ? 'text-yellow-500' : 'text-gray-600'}`}
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    }
    return stars;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }
  
  return (
    <div className="text-right" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">نظرات من</h2>
          <p className="text-gray-400 text-sm">نظراتی که برای محصولات ثبت کرده‌اید</p>
        </div>
        
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 md:mt-0 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          مشاهده محصولات بیشتر
        </button>
      </div>
      
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-300">هنوز نظری ثبت نکرده‌اید</h3>
          <p className="text-gray-400 mt-2 mb-6">
            با ثبت نظر برای محصولات، به دیگر خریداران در انتخاب محصول مناسب کمک کنید.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            مشاهده محصولات
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-black bg-opacity-50 rounded-xl p-6 border border-draugr-900/30">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex">
                  <div className="ml-4">
                    <img 
                      src={review.productImage} 
                      alt={review.productName} 
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg line-clamp-1">{review.productName}</h3>
                    <div className="flex items-center mt-1 mb-3">
                      <div className="flex ml-2">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-400">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-reverse space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => handleEditReview(review.id)}
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-sm"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-300">{review.comment}</p>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {review.helpful} نفر این نظر را مفید دانسته‌اند
                </div>
                <button
                  onClick={() => navigate(`/product/${review.productId}`)}
                  className="text-red-500 hover:text-red-400 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>مشاهده محصول</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardReviews; 