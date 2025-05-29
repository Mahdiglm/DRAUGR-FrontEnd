import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import orderService from '../../services/orderService';

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Fetch orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await orderService.getOrders();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('خطا در دریافت سفارشات');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fa-IR', options);
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-900/50 text-yellow-400 border-yellow-700/50';
      case 'Processing':
        return 'bg-blue-900/50 text-blue-400 border-blue-700/50';
      case 'Shipped':
        return 'bg-purple-900/50 text-purple-400 border-purple-700/50';
      case 'Delivered':
        return 'bg-green-900/50 text-green-400 border-green-700/50';
      case 'Cancelled':
        return 'bg-draugr-900/50 text-draugr-400 border-draugr-700/50';
      default:
        return 'bg-gray-900/50 text-gray-400 border-gray-700/50';
    }
  };
  
  // Translate status to Persian
  const translateStatus = (status) => {
    switch (status) {
      case 'Pending':
        return 'در انتظار تأیید';
      case 'Processing':
        return 'در حال پردازش';
      case 'Shipped':
        return 'ارسال شده';
      case 'Delivered':
        return 'تحویل داده شده';
      case 'Cancelled':
        return 'لغو شده';
      default:
        return status;
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">سفارشات من</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-draugr-600"></div>
            <p className="mr-4 text-lg text-gray-300">در حال بارگذاری سفارشات...</p>
          </div>
        ) : error ? (
          <div className="bg-draugr-900/30 border border-draugr-700/50 text-draugr-400 px-6 py-5 rounded-lg shadow-lg text-center">
            <p className="text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-draugr-700 hover:bg-draugr-600 text-white py-2 px-4 rounded transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-gray-900/80 backdrop-blur-md border border-draugr-900/40 rounded-lg shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-300 mb-3">هنوز سفارشی ثبت نکرده‌اید</h2>
              <p className="text-gray-400 mb-6">محصولات مورد علاقه خود را در فروشگاه ما پیدا کنید و اولین خرید خود را انجام دهید.</p>
              <Link 
                to="/shop"
                className="bg-gradient-to-r from-draugr-900 to-draugr-700 text-white py-2 px-6 rounded-md font-medium hover:from-draugr-800 hover:to-draugr-600 transition-colors"
              >
                مشاهده محصولات
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-900/80 backdrop-blur-md border border-draugr-900/40 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-5 sm:p-6 border-b border-gray-800">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <span className="text-gray-400 text-sm">شماره سفارش:</span>
                      <span className="text-white font-mono ml-2">{order.id}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-gray-400 text-sm">تاریخ:</span>
                        <span className="text-white ml-2">{formatDate(order.orderDate)}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                        {translateStatus(order.status)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 sm:p-6">
                  <div className="space-y-4">
                    {/* Order Items */}
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center">
                          <div className="h-16 w-16 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                            {item.product.imageUrl && (
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.name} 
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="mr-4">
                            <h3 className="text-white font-medium">{item.product.name}</h3>
                            <p className="text-gray-400 text-sm">تعداد: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-white font-medium">
                          {(item.product.price * item.quantity).toLocaleString('fa-IR')} تومان
                        </div>
                      </div>
                    ))}
                    
                    {/* Order Summary */}
                    <div className="border-t border-gray-800 pt-4 mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">جمع سبد خرید:</span>
                        <span className="text-white">{order.subtotal.toLocaleString('fa-IR')} تومان</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">هزینه ارسال:</span>
                        <span className="text-white">{order.shipping.toLocaleString('fa-IR')} تومان</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">مالیات:</span>
                        <span className="text-white">{order.tax.toLocaleString('fa-IR')} تومان</span>
                      </div>
                      <div className="flex justify-between items-center font-bold text-lg mt-4 pt-2 border-t border-gray-800">
                        <span className="text-white">جمع کل:</span>
                        <span className="text-draugr-400">{order.total.toLocaleString('fa-IR')} تومان</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-end mt-6 gap-3">
                      <Link
                        to={`/orders/${order.id}`}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm transition-colors"
                      >
                        مشاهده جزئیات
                      </Link>
                      
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => orderService.cancelOrder(order.id)}
                          className="bg-draugr-700 hover:bg-draugr-600 text-white py-2 px-4 rounded-md text-sm transition-colors"
                        >
                          لغو سفارش
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OrdersPage; 