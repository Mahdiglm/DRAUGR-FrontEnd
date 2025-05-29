import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Fake order data for demonstration
const demoOrders = [
  {
    id: 'ORD-12345',
    date: '1403/03/15',
    total: 1250000,
    status: 'تحویل شده',
    items: [
      { id: 1, name: 'گردنبند پنتاگرام', price: 850000, quantity: 1 },
      { id: 2, name: 'کتاب آیین شیطانی', price: 400000, quantity: 1 }
    ]
  },
  {
    id: 'ORD-12346',
    date: '1403/02/20',
    total: 1450000,
    status: 'در حال ارسال',
    items: [
      { id: 3, name: 'دستبند چرم مشکی', price: 550000, quantity: 1 },
      { id: 4, name: 'ویجا بورد سنتی', price: 900000, quantity: 1 }
    ]
  },
  {
    id: 'ORD-12347',
    date: '1403/01/05',
    total: 750000,
    status: 'پردازش شده',
    items: [
      { id: 5, name: 'شمع آیینی مشکی', price: 250000, quantity: 3 }
    ]
  }
];

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  // Simulate fetching orders from an API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use demo data
        setOrders(demoOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Toggle order details expansion
  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  
  // Function to format price in Persian
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };
  
  // Get status color based on order status
  const getStatusColor = (status) => {
    switch (status) {
      case 'تحویل شده':
        return 'bg-green-900/50 text-green-300 border-green-800';
      case 'در حال ارسال':
        return 'bg-blue-900/50 text-blue-300 border-blue-800';
      case 'پردازش شده':
        return 'bg-yellow-900/50 text-yellow-300 border-yellow-800';
      case 'لغو شده':
        return 'bg-draugr-900/50 text-draugr-300 border-draugr-800';
      default:
        return 'bg-gray-900/50 text-gray-300 border-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="border-b border-gray-800 pb-3">
        <h1 className="text-2xl font-bold text-white">سفارشات من</h1>
        <p className="text-gray-400 mt-1">تاریخچه و وضعیت سفارشات شما</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <svg className="animate-spin h-10 w-10 text-draugr-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-medium text-gray-300">هنوز سفارشی ثبت نکرده‌اید</h3>
          <p className="text-gray-500 mt-2">از فروشگاه ما محصولات مورد علاقه خود را پیدا کنید</p>
          <Link to="/shop" className="mt-4 inline-block px-5 py-2.5 bg-gradient-to-r from-draugr-900 to-draugr-700 text-white rounded-lg hover:from-draugr-800 hover:to-draugr-600 focus:outline-none">
            مشاهده محصولات
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className="bg-gray-800/50 rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className="flex flex-wrap items-center justify-between p-4 cursor-pointer hover:bg-gray-800/70 transition-colors"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="p-2 bg-gray-900 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{order.id}</h3>
                    <p className="text-gray-400 text-sm">{order.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center flex-wrap gap-4 mt-2 sm:mt-0">
                  <div className="text-white text-right">
                    <div className="font-medium">{formatPrice(order.total)}</div>
                    <div className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                  </div>
                  
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-gray-400 transition-transform ${expandedOrderId === order.id ? 'transform rotate-180' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Order details */}
              {expandedOrderId === order.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-700"
                >
                  <div className="p-4 space-y-3">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">آیتم‌های سفارش</h4>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center text-xs font-medium text-white">
                            {item.quantity}
                          </div>
                          <span className="mx-3 text-white">{item.name}</span>
                        </div>
                        <div className="text-gray-300">{formatPrice(item.price * item.quantity)}</div>
                      </div>
                    ))}
                    
                    <div className="border-t border-gray-700 mt-4 pt-4 flex justify-end">
                      <Link 
                        to={`/order/${order.id}`} 
                        className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-850 transition-colors"
                      >
                        مشاهده جزئیات
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default OrdersList; 