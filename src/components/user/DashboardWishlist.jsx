import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

// This is a placeholder implementation since we don't have actual wishlist functionality in the backend
const DashboardWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Simulate fetching wishlist - In a real app, this would come from a service
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, this would come from a wishlist service
        // For now, we'll use localStorage to simulate wishlist functionality
        const storedWishlist = localStorage.getItem('wishlist');
        const parsedWishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
        
        setWishlist(parsedWishlist);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWishlist();
  }, []);
  
  // Remove from wishlist
  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(item => item._id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };
  
  // Add item to cart from wishlist
  const handleAddToCart = (product) => {
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || '/placeholder.jpg',
      qty: 1
    });
    
    // Optional: Remove from wishlist after adding to cart
    // removeFromWishlist(product._id);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold mb-2">My Wishlist</h2>
        
        {wishlist.length > 0 && (
          <button
            onClick={() => {
              // Add all items to cart
              wishlist.forEach(product => handleAddToCart(product));
              // Clear wishlist
              setWishlist([]);
              localStorage.removeItem('wishlist');
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition mt-2 md:mt-0"
          >
            Add All to Cart
          </button>
        )}
      </div>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-300">Your wishlist is empty</h3>
          <p className="text-gray-400 mt-2 mb-6">
            Find products you love and add them to your wishlist to save them for later.
          </p>
          <button 
            onClick={() => navigate('/shop')} 
            className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Explore Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(product => (
            <div key={product._id} className="bg-gray-750 rounded-xl overflow-hidden">
              <div className="relative">
                <img
                  src={product.images[0]?.url || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-red-600 transition"
                  aria-label="Remove from wishlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.name}</h3>
                <div className="flex items-center mb-3">
                  <span className="text-red-500 font-bold">${product.price.toFixed(2)}</span>
                  {product.discountPrice > 0 && (
                    <span className="text-gray-400 text-sm line-through ml-2">
                      ${product.discountPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                  </button>
                  <button
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="py-2 px-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                    aria-label="View details"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardWishlist; 