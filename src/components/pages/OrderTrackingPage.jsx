import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import orderBackground from '../../assets/BackGround-Main.jpg';

// OrderTrackingPage component
const OrderTrackingPage = () => {
  const [trackingId, setTrackingId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showError, setShowError] = useState(false);
  const { showTemporaryMessage } = useOutletContext();
  const navigate = useNavigate();
  
  // Step definitions
  const orderSteps = [
    { id: 'processing', label: 'پردازش سفارش', description: 'سفارش شما در مرحله پردازش اولیه است', icon: '🔄' },
    { id: 'payment', label: 'پرداخت', description: 'پرداخت شما با موفقیت انجام شد', icon: '💰' },
    { id: 'preparing', label: 'آماده‌سازی', description: 'سفارش شما در حال آماده‌سازی است', icon: '📦' },
    { id: 'shipping', label: 'ارسال', description: 'سفارش شما به مرکز پست تحویل داده شد', icon: '🚚' },
    { id: 'delivered', label: 'تحویل', description: 'سفارش شما تحویل داده شده است', icon: '✅' }
  ];

  // Mock data for example orders
  const mockOrders = [
    { 
      id: 'DR-1234',
      customerName: 'علی محمدی',
      date: '1403/04/20',
      status: 'shipping',
      products: [
        { name: 'دستبند اژدها', quantity: 1, price: 850000 },
        { name: 'گردنبند گرگ', quantity: 1, price: 1250000 }
      ],
      trackingCode: 'TRK7654321',
      estimatedDelivery: '1403/04/28',
      currentLocationDetails: 'در مرکز توزیع تهران',
      currentLocationTime: '1403/04/25 14:32',
      shipmentEvents: [
        { status: 'processing', date: '1403/04/20 09:15', description: 'سفارش ثبت شد' },
        { status: 'payment', date: '1403/04/20 09:20', description: 'پرداخت با موفقیت انجام شد' },
        { status: 'preparing', date: '1403/04/22 11:35', description: 'بسته‌بندی و آماده‌سازی سفارش' },
        { status: 'shipping', date: '1403/04/25 14:32', description: 'تحویل به پست' }
      ]
    },
    { 
      id: 'DR-5678',
      customerName: 'سارا احمدی',
      date: '1403/04/15',
      status: 'delivered',
      products: [
        { name: 'کتاب آیین تاریک', quantity: 1, price: 980000 },
        { name: 'زیرسیگاری طرح جمجمه', quantity: 2, price: 750000 }
      ],
      trackingCode: 'TRK9876543',
      estimatedDelivery: '1403/04/23',
      currentLocationDetails: 'تحویل داده شده',
      currentLocationTime: '1403/04/23 16:45',
      shipmentEvents: [
        { status: 'processing', date: '1403/04/15 10:20', description: 'سفارش ثبت شد' },
        { status: 'payment', date: '1403/04/15 10:25', description: 'پرداخت با موفقیت انجام شد' },
        { status: 'preparing', date: '1403/04/17 09:45', description: 'بسته‌بندی و آماده‌سازی سفارش' },
        { status: 'shipping', date: '1403/04/18 11:30', description: 'تحویل به پست' },
        { status: 'delivered', date: '1403/04/23 16:45', description: 'تحویل به مشتری' }
      ]
    },
    { 
      id: 'DR-9012',
      customerName: 'رضا کریمی',
      date: '1403/04/24',
      status: 'preparing',
      products: [
        { name: 'پک آیین تاریک', quantity: 1, price: 2500000 }
      ],
      trackingCode: 'TRK1234567',
      estimatedDelivery: '1403/04/30',
      currentLocationDetails: 'در انبار مرکزی',
      currentLocationTime: '1403/04/25 08:15',
      shipmentEvents: [
        { status: 'processing', date: '1403/04/24 15:40', description: 'سفارش ثبت شد' },
        { status: 'payment', date: '1403/04/24 15:45', description: 'پرداخت با موفقیت انجام شد' },
        { status: 'preparing', date: '1403/04/25 08:15', description: 'بسته‌بندی و آماده‌سازی سفارش' }
      ]
    }
  ];
  
  // Handle tracking ID search
  const handleTrackOrder = () => {
    if (!trackingId.trim()) {
      setShowError(true);
      return;
    }
    
    setIsSearching(true);
    setShowError(false);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const order = mockOrders.find(order => 
        order.id === trackingId.trim() || 
        order.trackingCode === trackingId.trim()
      );
      
      if (order) {
        setOrderDetails(order);
        showTemporaryMessage('اطلاعات سفارش یافت شد');
      } else {
        setOrderDetails(null);
        showTemporaryMessage('سفارش مورد نظر یافت نشد', 'error');
      }
      
      setIsSearching(false);
    }, 1000);
  };

  // Determine current step index based on status
  const getCurrentStepIndex = (status) => {
    return orderSteps.findIndex(step => step.id === status);
  };

  return (
    <div 
      className="py-12 sm:py-16 md:py-20 min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${orderBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-0"></div>
      
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
        <div className="max-w-5xl mx-auto">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-8 text-center text-shadow-horror"
          >
            <span className="text-draugr-500">پیگیری </span>
            <span className="text-white">سفارش</span>
          </motion.h1>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-black bg-opacity-50 rounded-lg shadow-horror p-6 md:p-8 mb-8"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">شماره سفارش یا کد رهگیری خود را وارد کنید</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="مثال: DR-1234 یا TRK1234567"
                  className={`flex-1 bg-gray-800 text-white px-4 py-3 rounded-md border ${
                    showError ? 'border-red-500' : 'border-gray-700'
                  } focus:outline-none focus:border-draugr-500`}
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleTrackOrder}
                  disabled={isSearching}
                  className="bg-gradient-to-r from-draugr-800 to-draugr-600 text-white font-medium px-6 py-3 rounded-md flex items-center justify-center min-w-[120px]"
                >
                  {isSearching ? (
                    <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                  ) : (
                    'پیگیری'
                  )}
                </motion.button>
              </div>
              {showError && (
                <p className="text-red-500 mt-2">لطفا شماره سفارش یا کد رهگیری را وارد کنید.</p>
              )}
            </div>
            
            {/* Example tracking codes */}
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-md">
              <p className="text-sm text-gray-300 mb-2">برای آزمایش سایت می‌توانید از کدهای نمونه زیر استفاده کنید:</p>
              <div className="flex flex-wrap gap-2">
                {mockOrders.map(order => (
                  <motion.button
                    key={order.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTrackingId(order.id)}
                    className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1 rounded"
                  >
                    {order.id}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
          
          <AnimatePresence>
            {orderDetails && (
              <motion.div
                key="order-details"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-black bg-opacity-50 rounded-lg shadow-horror overflow-hidden"
              >
                {/* Order header */}
                <div className="bg-draugr-900 p-4 md:p-6">
                  <div className="flex flex-wrap justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">سفارش {orderDetails.id}</h3>
                      <p className="text-sm text-gray-300">تاریخ ثبت: {orderDetails.date}</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className="bg-draugr-800 text-white px-3 py-1 rounded-md text-sm">
                        کد رهگیری: {orderDetails.trackingCode}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Order timeline */}
                <div className="p-4 md:p-6">
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-6">وضعیت سفارش</h4>
                    
                    {/* Custom animated timeline - UPDATED for RTL and mobile responsiveness */}
                    <div className="my-8 px-4">
                      <div className="relative">
                        {/* Timeline track */}
                        <div className="absolute top-1/2 right-0 left-0 h-1 bg-gray-700 transform -translate-y-1/2 z-0"
                             style={{ top: 'calc(50% + 4px)' }}></div>
                        
                        {/* Completed track - Now starting from right for RTL */}
                        <motion.div 
                          className="absolute top-1/2 right-0 h-1 bg-draugr-500 transform -translate-y-1/2 z-10"
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${(getCurrentStepIndex(orderDetails.status) / (orderSteps.length - 1)) * 100}%` 
                          }}
                          transition={{ duration: 1, ease: "easeInOut" }}
                          style={{ transformOrigin: 'right', top: 'calc(50% + 4px)' }}
                        />
                        
                        {/* Step indicators */}
                        <div className="flex justify-between relative z-20">
                          {orderSteps.map((step, index) => {
                            const isCompleted = getCurrentStepIndex(orderDetails.status) >= index;
                            const isCurrent = orderDetails.status === step.id;
                            
                            return (
                              <div key={step.id} className="flex flex-col items-center px-1">
                                <motion.div 
                                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 ${
                                    isCompleted 
                                      ? 'bg-gradient-to-br from-draugr-700 to-draugr-500 text-white' 
                                      : 'bg-gray-700 text-gray-400'
                                  } ${isCurrent ? 'ring-2 ring-draugr-400 ring-opacity-50 shadow-horror-sm' : ''}`}
                                  initial={{ scale: 0.8 }}
                                  animate={{ 
                                    scale: isCurrent ? 1.05 : 1,
                                    boxShadow: isCurrent ? '0 0 15px rgba(255, 0, 0, 0.3)' : 'none'
                                  }}
                                  transition={{ duration: 0.5 }}
                                  style={{ marginTop: '32px' }}
                                >
                                  <span className="text-base sm:text-xl">{step.icon}</span>
                                </motion.div>
                                <div className={`text-center ${isCompleted ? 'text-white' : 'text-gray-400'}`}>
                                  <div className="font-medium text-xs sm:text-sm">{step.label}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Current status */}
                    <div className="bg-gray-800 bg-opacity-50 p-4 rounded-md">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-draugr-500 rounded-full mr-2 animate-pulse"></div>
                        <h5 className="font-medium">وضعیت فعلی</h5>
                      </div>
                      <p className="text-draugr-400 font-medium">{orderDetails.currentLocationDetails}</p>
                      <p className="text-sm text-gray-400">{orderDetails.currentLocationTime}</p>
                    </div>
                  </div>
                  
                  {/* Shipment events - IMPROVED SECTION */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-4">جزئیات ارسال</h4>
                    
                    {/* Event cards with enhanced styling and animations */}
                    <div className="relative">
                      {/* Vertical line connecting all events - using RIGHT positioning instead of LEFT */}
                      <div className="absolute top-0 bottom-0 right-[51px] w-0.5 bg-gradient-to-b from-draugr-800 to-gray-700 z-0"></div>
                      
                      {/* Timeline events */}
                      <div className="space-y-6">
                        {orderDetails.shipmentEvents.map((event, index) => {
                          // Is this the current/latest event
                          const isCurrent = event.status === orderDetails.status;
                          // Is this a past event
                          const isPast = getCurrentStepIndex(orderDetails.status) > getCurrentStepIndex(event.status);
                          
                          return (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                              <div className="relative flex items-start z-10">
                                {/* Event dot/icon CONTAINER - Positioned absolutely for horizontal centering */}
                                <div className="absolute left-0 transform -translate-x-1/2 flex items-center">
                                  <motion.div 
                                    className={`w-6 h-6 rounded-full flex items-center justify-center 
                                      ${isCurrent 
                                        ? 'bg-draugr-500 ring-4 ring-draugr-500/20' 
                                        : isPast 
                                          ? 'bg-draugr-700' 
                                          : 'bg-gray-700'}`}
                                    animate={isCurrent ? {
                                      scale: [1, 1.2, 1],
                                      boxShadow: ['0 0 0px rgba(255, 0, 0, 0)', '0 0 15px rgba(255, 0, 0, 0.5)', '0 0 0px rgba(255, 0, 0, 0)']
                                    } : {}}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 3,
                                    }}
                                  >
                                    {isCurrent && (
                                      <span className="text-xs">
                                        {orderSteps.find(step => step.id === event.status)?.icon || '•'}
                                      </span>
                                    )}
                                    {!isCurrent && (
                                      <motion.div 
                                        className={`w-2 h-2 rounded-full ${isPast ? 'bg-draugr-400' : 'bg-gray-500'}`} 
                                      />
                                    )}
                                  </motion.div>
                                </div>
                                
                                {/* Event details - Added proper left margin to accommodate circle position */}
                                <div className={`ml-8 flex-1 bg-gray-800 bg-opacity-40 rounded-lg p-4 border 
                                  ${isCurrent 
                                    ? 'border-draugr-500/50 shadow-[0_0_10px_rgba(255,0,0,0.1)]' 
                                    : 'border-gray-700'}`}
                                >
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                    <div className="flex items-center">
                                      <span className={`font-medium ${isCurrent ? 'text-draugr-400' : ''}`}>
                                        {event.description}
                                      </span>
                                      
                                      {/* Status badge for current event */}
                                      {isCurrent && (
                                        <span className="mr-2 bg-draugr-900/70 text-draugr-400 text-xs px-2 py-0.5 rounded-full">
                                          وضعیت فعلی
                                        </span>
                                      )}
                                    </div>
                                    
                                    <div className="text-sm text-gray-400 flex items-center gap-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <span>{event.date}</span>
                                    </div>
                                  </div>
                                  
                                  {/* Additional status details - show only for certain statuses */}
                                  {event.status === 'shipping' && (
                                    <div className="mt-3 pt-3 border-t border-gray-700/50 text-sm text-gray-300">
                                      <div className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-draugr-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>ارسال به مرکز پستی {orderDetails.currentLocationDetails}</span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {event.status === 'delivered' && (
                                    <div className="mt-3 pt-3 border-t border-gray-700/50 text-sm text-green-300">
                                      <div className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>تحویل داده شده به گیرنده</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                        
                        {/* Future delivery estimate - only show if not delivered */}
                        {orderDetails.status !== 'delivered' && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: orderDetails.shipmentEvents.length * 0.1 }}
                          >
                            <div className="relative flex items-start z-10">
                              {/* Icon Container - Positioned absolutely for horizontal centering */}
                              <div className="absolute left-0 transform -translate-x-1/2 flex items-center">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-800 border border-dashed border-gray-600">
                                  <span className="text-gray-400 text-xs">🏁</span>
                                </div>
                              </div>
                              <div className="ml-8 flex-1 bg-gray-800/30 rounded-lg p-4 border border-dashed border-gray-700">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                  <span className="text-gray-300">تحویل پیش‌بینی شده</span>
                                  <span className="text-sm text-draugr-400">{orderDetails.estimatedDelivery}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Order details */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-4">جزئیات سفارش</h4>
                    <div className="bg-gray-800 bg-opacity-30 rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-700 bg-opacity-50">
                          <tr>
                            <th className="py-2 px-4 text-right">محصول</th>
                            <th className="py-2 px-4 text-center">تعداد</th>
                            <th className="py-2 px-4 text-left">قیمت (تومان)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderDetails.products.map((product, index) => (
                            <tr key={index} className="border-b border-gray-700 last:border-none">
                              <td className="py-3 px-4">{product.name}</td>
                              <td className="py-3 px-4 text-center">{product.quantity}</td>
                              <td className="py-3 px-4 text-left">
                                {product.price.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-700 bg-opacity-30">
                          <tr>
                            <td className="py-3 px-4 font-medium" colSpan={2}>مجموع</td>
                            <td className="py-3 px-4 text-left font-medium">
                              {orderDetails.products.reduce((sum, product) => sum + (product.price * product.quantity), 0).toLocaleString()} تومان
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                  
                  {/* Estimated delivery */}
                  <div className="bg-draugr-900 bg-opacity-30 p-4 rounded-md border border-draugr-900">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">🚚</div>
                      <div>
                        <h5 className="font-medium">تاریخ تحویل تخمینی</h5>
                        <p className="text-draugr-400">{orderDetails.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderTrackingPage; 