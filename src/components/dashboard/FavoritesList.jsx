import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Demo favorites data
const demoFavorites = [
  {
    id: 1,
    name: 'گردنبند پنتاگرام',
    price: 850000,
    image: 'https://via.placeholder.com/150x150',
    inStock: true
  },
  {
    id: 2,
    name: 'کتاب آیین شیطانی',
    price: 400000,
    image: 'https://via.placeholder.com/150x150',
    inStock: true
  },
  {
    id: 3,
    name: 'دستبند چرم مشکی',
    price: 550000,
    image: 'https://via.placeholder.com/150x150',
    inStock: false
  },
  {
    id: 4,
    name: 'ویجا بورد سنتی',
    price: 900000,
    image: 'https://via.placeholder.com/150x150',
    inStock: true
  }
];

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching favorites from API
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use demo data
        setFavorites(demoFavorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, []);

  // Function to format price in Persian
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // Handle removing an item from favorites
  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  // Handle adding item to cart
  const handleAddToCart = (id) => {
    alert(`محصول با شناسه ${id} به سبد خرید اضافه شد`);
    // In a real app, you would call a cart service function here
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="border-b border-gray-800 pb-3">
        <h1 className="text-2xl font-bold text-white">لیست علاقه‌مندی‌ها</h1>
        <p className="text-gray-400 mt-1">محصولات مورد علاقه شما</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <svg className="animate-spin h-10 w-10 text-draugr-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : favorites.length === 0 ? (
        <div className="py-20 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-300">هنوز محصولی به لیست علاقه‌مندی‌ها اضافه نکرده‌اید</h3>
          <p className="text-gray-500 mt-2">از فروشگاه ما محصولات مورد علاقه خود را پیدا کنید</p>
          <Link to="/shop" className="mt-4 inline-block px-5 py-2.5 bg-gradient-to-r from-draugr-900 to-draugr-700 text-white rounded-lg hover:from-draugr-800 hover:to-draugr-600 focus:outline-none">
            مشاهده محصولات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((item) => (
            <motion.div
              key={item.id}
              className="bg-gray-800/50 rounded-lg overflow-hidden flex flex-col sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Product image */}
              <div className="sm:w-1/3 aspect-square max-h-32 sm:max-h-full relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <p className="text-white text-sm font-medium">ناموجود</p>
                  </div>
                )}
              </div>
              
              {/* Product details */}
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/product/${item.id}`} className="text-white hover:text-draugr-400 transition-colors">
                    <h3 className="font-medium">{item.name}</h3>
                  </Link>
                  <button 
                    onClick={() => handleRemoveFavorite(item.id)}
                    className="text-gray-400 hover:text-draugr-500 transition-colors"
                    aria-label="حذف از علاقه‌مندی‌ها"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="text-draugr-400 font-medium mb-3">{formatPrice(item.price)}</div>
                
                <div className="mt-auto">
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    disabled={!item.inStock}
                    className={`w-full py-2 rounded-md text-sm ${
                      item.inStock
                        ? 'bg-gray-900 hover:bg-gray-850 text-white'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    } transition-colors`}
                  >
                    {item.inStock ? 'افزودن به سبد خرید' : 'ناموجود'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FavoritesList; 