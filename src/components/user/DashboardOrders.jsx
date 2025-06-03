import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardOrders = ({ orders, isLoading, error }) => {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  
  // Sample example orders to show when no real orders exist
  const exampleOrders = [
    {
      _id: 'example1',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      status: 'در حال پردازش',
      orderItems: Array(3).fill({}),
      totalPrice: 785000,
      isExample: true
    },
    {
      _id: 'example2',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      status: 'ارسال شده',
      orderItems: Array(2).fill({}),
      totalPrice: 450000,
      isExample: true
    },
    {
      _id: 'example3',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      status: 'تحویل شده',
      orderItems: Array(4).fill({}),
      totalPrice: 1250000,
      isExample: true
    },
    {
      _id: 'example4',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      status: 'لغو شده',
      orderItems: Array(1).fill({}),
      totalPrice: 320000,
      isExample: true
    },
    {
      _id: 'example5',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      status: 'در انتظار پرداخت',
      orderItems: Array(2).fill({}),
      totalPrice: 560000,
      isExample: true
    }
  ];
  
  // Determine if we should show example orders
  const showExamples = orders.length === 0;
  
  // Use real orders or example orders based on the condition
  const displayOrders = showExamples ? exampleOrders : orders;
  
  // Filter orders based on selected filter
  const filteredOrders = filter === 'all' 
    ? displayOrders 
    : displayOrders.filter(order => order.status.toLowerCase() === filter);
    
  // Sort orders by date (newest first)
  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  // Get order status style
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'تحویل شده':
        return 'bg-green-900/40 text-green-200 border border-green-700';
      case 'در حال پردازش':
        return 'bg-blue-900/40 text-blue-200 border border-blue-700';
      case 'ارسال شده':
        return 'bg-purple-900/40 text-purple-200 border border-purple-700';
      case 'لغو شده':
        return 'bg-red-900/40 text-red-200 border border-red-700';
      case 'در انتظار پرداخت':
        return 'bg-yellow-900/40 text-yellow-200 border border-yellow-700';
      default:
        return 'bg-gray-700/40 text-gray-200 border border-gray-600';
    }
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-draugr-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-8 text-red-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="text-right">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">سفارشات من</h2>
          <p className="text-gray-400 text-sm">
            {(sortedOrders.length > 0 && sortedOrders[0].isExample) 
              ? 'نمونه سفارشات برای نمایش (دسترسی API مخصوص ادمین است)' 
              : 'مشاهده و پیگیری تمام سفارشات'}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <select
            value={filter}
            onChange={handleFilterChange}
            className="bg-gray-800 text-gray-200 rounded-lg px-4 py-2 border border-gray-700 focus:ring-2 focus:ring-draugr-500 focus:border-transparent"
          >
            <option value="all">همه سفارشات</option>
            <option value="در حال پردازش">در حال پردازش</option>
            <option value="ارسال شده">ارسال شده</option>
            <option value="تحویل شده">تحویل شده</option>
            <option value="لغو شده">لغو شده</option>
            <option value="در انتظار پرداخت">در انتظار پرداخت</option>
          </select>
        </div>
      </div>
      
      {sortedOrders.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-300">سفارشی یافت نشد</h3>
          {filter !== 'all' ? (
            <p className="text-gray-400 mt-2">سفارشی با وضعیت {filter} یافت نشد. فیلتر دیگری را امتحان کنید.</p>
          ) : (
            <div>
              <p className="text-gray-400 mt-2">شما هنوز سفارشی ثبت نکرده‌اید.</p>
              <button 
                onClick={() => navigate('/shop')} 
                className="mt-4 px-6 py-2 bg-gradient-to-r from-draugr-800 to-draugr-600 hover:from-draugr-700 hover:to-draugr-500 rounded-lg transition-all duration-200"
              >
                شروع خرید
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          {sortedOrders[0].isExample && (
            <div className="mb-4 bg-black/30 border border-draugr-900/50 rounded-lg p-4 text-gray-300 text-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-draugr-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">نمونه سفارشات</p>
                  <p className="text-gray-400 text-xs mt-1">این سفارشات فقط برای نمایش هستند. دسترسی به API سفارشات نیازمند مجوز مدیریت است.</p>
                </div>
              </div>
            </div>
          )}
          
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">شناسه سفارش</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">تاریخ</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">وضعیت</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">تعداد محصول</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">مبلغ کل</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map(order => (
                <tr key={order._id} className={`border-b border-gray-800 hover:bg-black/20 transition-colors ${order.isExample ? 'opacity-90' : ''}`}>
                  <td className="py-4 px-4">#{order._id.substring(0, 8)}</td>
                  <td className="py-4 px-4" dir="ltr">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">{order.orderItems.length} محصول</td>
                  <td className="py-4 px-4" dir="ltr">{order.totalPrice.toLocaleString()} تومان</td>
                  <td className="py-4 px-4 text-left">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => !order.isExample && navigate(`/order/${order._id}`)}
                        className={`px-3 py-1 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 transition-colors mr-2 ${order.isExample ? 'cursor-default opacity-80' : ''}`}
                      >
                        جزئیات
                      </button>
                      {(order.status !== 'تحویل شده' && order.status !== 'لغو شده') && (
                        <button
                          onClick={() => !order.isExample && navigate(`/order-tracking?id=${order._id}`)}
                          className={`px-3 py-1 bg-gradient-to-r from-draugr-800 to-draugr-600 text-white rounded hover:from-draugr-700 hover:to-draugr-500 transition-all ${order.isExample ? 'cursor-default opacity-80' : ''}`}
                        >
                          پیگیری
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardOrders; 