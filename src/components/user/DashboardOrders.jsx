import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardOrders = ({ orders, isLoading, error }) => {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  
  // Filter orders based on selected filter
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filter);
    
  // Sort orders by date (newest first)
  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  // Get order status style
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'تحویل شده':
        return 'bg-green-900 text-green-200';
      case 'در حال پردازش':
        return 'bg-blue-900 text-blue-200';
      case 'ارسال شده':
        return 'bg-purple-900 text-purple-200';
      case 'لغو شده':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
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
          <p className="text-gray-400 text-sm">مشاهده و پیگیری تمام سفارشات</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <select
            value={filter}
            onChange={handleFilterChange}
            className="bg-gray-700 text-gray-200 rounded-lg px-4 py-2 border border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">همه سفارشات</option>
            <option value="در حال پردازش">در حال پردازش</option>
            <option value="ارسال شده">ارسال شده</option>
            <option value="تحویل شده">تحویل شده</option>
            <option value="لغو شده">لغو شده</option>
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
                className="mt-4 px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                شروع خرید
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-700">
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
                <tr key={order._id} className="border-b border-gray-700 hover:bg-black/20">
                  <td className="py-4 px-4">#{order._id.substring(0, 8)}</td>
                  <td className="py-4 px-4" dir="ltr">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">{order.orderItems.length} محصول</td>
                  <td className="py-4 px-4" dir="ltr">{order.totalPrice.toLocaleString()} تومان</td>
                  <td className="py-4 px-4 text-left">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/order/${order._id}`)}
                        className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition mr-2"
                      >
                        جزئیات
                      </button>
                      {order.status !== 'تحویل شده' && order.status !== 'لغو شده' && (
                        <button
                          onClick={() => navigate(`/order-tracking?id=${order._id}`)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
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