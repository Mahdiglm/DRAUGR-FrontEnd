import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import productService from '../../services/productService';
import ProductCard from '../product/ProductCard';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-toastify';

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [filterPrice, setFilterPrice] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
  const [pageLoaded, setPageLoaded] = useState(false);

  // Page entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch category and products
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch category details
        const categoryResponse = await productService.getCategoryBySlug(slug);
        setCategory(categoryResponse);

        // Fetch products in this category
        const productsResponse = await productService.getProducts({ 
          category: categoryResponse._id 
        });
        
        let productsData = [];
        if (productsResponse && productsResponse.data) {
          productsData = productsResponse.data;
        } else if (Array.isArray(productsResponse)) {
          productsData = productsResponse;
        }
        
        setProducts(productsData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('دسته‌بندی مورد نظر یافت نشد');
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setBackgroundPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sort products
  const getSortedProducts = () => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default: // newest
        return sorted;
    }
  };

  // Filter products by price
  const getFilteredProducts = () => {
    const sorted = getSortedProducts();
    switch (filterPrice) {
      case 'under-100':
        return sorted.filter(p => p.price < 100000);
      case '100-500':
        return sorted.filter(p => p.price >= 100000 && p.price <= 500000);
      case 'over-500':
        return sorted.filter(p => p.price > 500000);
      default:
        return sorted;
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product._id);
    toast.success(`${product.name} به سبد خرید اضافه شد`);
  };

  // Loading state with skeleton animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-red-900/10 rounded-full blur-3xl animate-pulse top-20 -left-48"></div>
          <div className="absolute w-96 h-96 bg-purple-900/10 rounded-full blur-3xl animate-pulse bottom-20 -right-48"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="h-12 bg-gray-800/50 rounded-lg w-64 mx-auto mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">💀</div>
          <h2 className="text-2xl font-bold text-red-500 mb-2">{error}</h2>
          <p className="text-gray-400 mb-6">صفحه مورد نظر شما یافت نشد</p>
          <Link 
            to="/shop" 
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg inline-block transition-colors"
          >
            بازگشت به فروشگاه
          </Link>
        </motion.div>
      </div>
    );
  }

  const filteredProducts = getFilteredProducts();

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: pageLoaded ? 1 : 0, scale: pageLoaded ? 1 : 0.95 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Dynamic background with parallax effect */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{
          x: backgroundPosition.x,
          y: backgroundPosition.y,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-purple-950/20"></div>
        {/* Animated orbs */}
        <motion.div 
          className="absolute w-96 h-96 bg-red-900/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: '10%', left: '-10%' }}
        />
        <motion.div 
          className="absolute w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: '10%', right: '-10%' }}
        />
      </motion.div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Animated header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          {/* Breadcrumb */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-6"
          >
            <Link to="/" className="hover:text-red-500 transition-colors">خانه</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-red-500 transition-colors">فروشگاه</Link>
            <span>/</span>
            <span className="text-red-500">{category?.name}</span>
          </motion.div>

          {/* Category title with horror effect */}
          <div className="relative inline-block">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-4 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                {category?.name}
              </span>
              {/* Glowing effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-50 blur-xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.h1>
            
            {/* Blood drip effect */}
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
              initial={{ height: 0 }}
              animate={{ height: 20 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="w-1 h-full bg-gradient-to-b from-red-600 to-transparent rounded-full"></div>
            </motion.div>
          </div>

          {category?.description && (
            <motion.p 
              className="text-gray-400 mt-8 max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {category.description}
            </motion.p>
          )}
        </motion.div>

        {/* Filters and sorting */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-black/50 backdrop-blur-md rounded-2xl p-6 mb-8 border border-gray-800"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">مرتب‌سازی:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
              >
                <option value="newest">جدیدترین</option>
                <option value="price-low">قیمت - کم به زیاد</option>
                <option value="price-high">قیمت - زیاد به کم</option>
                <option value="name">نام محصول</option>
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-400">فیلتر قیمت:</span>
              <select 
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
              >
                <option value="all">همه قیمت‌ها</option>
                <option value="under-100">زیر ۱۰۰ هزار تومان</option>
                <option value="100-500">۱۰۰ تا ۵۰۰ هزار تومان</option>
                <option value="over-500">بالای ۵۰۰ هزار تومان</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Products grid with staggered animation */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.4,
                    layout: { duration: 0.3 }
                  }}
                  whileHover={{ y: -10 }}
                  onHoverStart={() => setHoveredCard(product._id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="relative"
                >
                  {/* Glow effect on hover */}
                  <AnimatePresence>
                    {hoveredCard === product._id && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 rounded-xl blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  <ProductCard 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    isHighlighted={hoveredCard === product._id}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="col-span-full text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-6xl mb-4">🦇</div>
                <p className="text-gray-400 text-xl">هیچ محصولی در این دسته‌بندی موجود نیست</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Back to shop button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            بازگشت به فروشگاه
          </Link>
        </motion.div>
      </div>

      {/* Atmospheric overlay */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
      </div>
    </div>
  );
};

export default CategoryPage; 