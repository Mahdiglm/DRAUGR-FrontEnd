import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import productService from '../../services/productService';
import productBackground from '../../assets/BackGround-Product.jpg';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, showTemporaryMessage } = useOutletContext();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch product details from API
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        const productData = await productService.getProductById(id);
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('خطا در دریافت اطلاعات محصول');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-t-2 border-r-2 border-draugr-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-center mb-4">
          {error || 'محصول مورد نظر یافت نشد'}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-draugr-800 to-draugr-600 text-white font-medium px-6 py-2 rounded-md"
        >
          بازگشت به صفحه اصلی
        </motion.button>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    // Create a copy of the product with the selected quantity
    const productWithQuantity = { ...product, quantity: quantity };
    
    // Add to cart with the specified quantity
    addToCart(productWithQuantity);
    
    // Show confirmation message
    showTemporaryMessage(`${quantity} عدد ${product.name} به سبد خرید اضافه شد`);
  };
  
  // Ensure imageUrl is properly formatted
  const formattedImageUrl = product.imageUrl?.startsWith('http') 
    ? product.imageUrl 
    : `${import.meta.env.VITE_API_URL}${product.imageUrl}`;
  
  return (
    <div 
      className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-charcoal to-midnight min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${productBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-0"></div>
      
      {/* Bottom gradient overlay for smooth transition to footer */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 z-0" 
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.95))',
          pointerEvents: 'none'
        }}
      ></div>
      
      {/* Subtle fog animations in background */}
      <div className="absolute inset-0 z-[1] opacity-20">
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{ 
            duration: 60, 
            ease: "linear", 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 2000 2000\' fill=\'none\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
            backgroundSize: '200% 200%'
          }}
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="bg-black bg-opacity-50 rounded-lg overflow-hidden shadow-horror p-4 sm:p-6 md:p-8">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center text-draugr-500 hover:text-draugr-400 mb-4 sm:mb-6"
          >
            <span className="ml-1">↩</span>
            بازگشت
          </motion.button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Product Image */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative aspect-square rounded-lg overflow-hidden shadow-horror"
            >
              <img 
                src={formattedImageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
            </motion.div>
            
            {/* Product Info */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col"
            >
              {/* Category Badge */}
              <span className="text-sm bg-draugr-900 text-draugr-400 px-3 py-1 rounded-full w-fit mb-2">
                {product.category?.name || 'دسته‌بندی نشده'}
              </span>
              
              {/* Product Name */}
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-shadow-horror">{product.name}</h1>
              
              {/* Price */}
              <div className="text-2xl font-bold mb-4 text-draugr-500">{product.price.toFixed(2)} تومان</div>
              
              {/* Description */}
              <p className="text-gray-300 mb-6">{product.description}</p>
              
              {/* Features or Specifications - example */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">ویژگی‌های محصول</h3>
                <ul className="list-disc text-gray-300 pr-5 space-y-1">
                  <li>ساخته شده با مواد با کیفیت</li>
                  <li>طراحی بی‌نظیر</li>
                  <li>مناسب برای ماجراجویی</li>
                  <li>محدود در نوع خود</li>
                </ul>
              </div>
              
              {/* Quantity Selector and Add to Cart */}
              <div className="mt-auto">
                <div className="flex items-center mb-4">
                  <span className="ml-4">تعداد:</span>
                  <div className="flex items-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-l"
                    >
                      -
                    </motion.button>
                    <span className="w-12 h-8 flex items-center justify-center bg-gray-700">
                      {quantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-r"
                    >
                      +
                    </motion.button>
                  </div>
                </div>
                
                {/* Add to Cart Button */}
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 0 15px rgba(255, 0, 0, 0.7)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-draugr-800 to-draugr-600 text-white font-medium px-6 py-3 rounded-md flex items-center justify-center"
                >
                  <span className="ml-2">🛒</span>
                  افزودن به سبد خرید
                </motion.button>
              </div>
            </motion.div>
          </div>
          
          {/* Product Specifications */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 bg-black bg-opacity-30 rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">جزئیات محصول</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">مشخصات</h3>
                <table className="w-full text-right">
                  <tbody>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 font-semibold">دسته‌بندی</td>
                      <td className="py-2">{product.category?.name || 'دسته‌بندی نشده'}</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 font-semibold">شناسه محصول</td>
                      <td className="py-2">{product.id}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">قابلیت بازگشت</td>
                      <td className="py-2">7 روز ضمانت بازگشت</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">روش‌های پرداخت</h3>
                <ul className="list-disc text-gray-300 pr-5 space-y-1">
                  <li>پرداخت آنلاین</li>
                  <li>پرداخت در محل</li>
                  <li>کارت به کارت</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail; 