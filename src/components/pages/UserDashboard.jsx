import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import orderService from '../../services/orderService';
import authService from '../../services/authService';

// Dashboard Sections
import DashboardOrders from '../user/DashboardOrders';
import DashboardProfile from '../user/DashboardProfile';
import DashboardWishlist from '../user/DashboardWishlist';
import DashboardAddresses from '../user/DashboardAddresses';
import DashboardReviews from '../user/DashboardReviews';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for tab in URL path (for direct links to specific tabs)
  useEffect(() => {
    const path = location.pathname;
    const tabNames = {
      '/dashboard/orders': 'orders',
      '/dashboard/profile': 'profile',
      '/dashboard/wishlist': 'wishlist',
      '/dashboard/addresses': 'addresses',
      '/dashboard/reviews': 'reviews'
    };
    
    if (tabNames[path]) {
      setActiveTab(tabNames[path]);
    }
  }, [location.pathname]);
  
  // Fetch user's orders when component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await orderService.getOrders();
        setOrders(response);
        setRecentOrders(response.slice(0, 3)); // Get 3 most recent orders
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
        setIsLoading(false);
        console.error('Error fetching orders:', err);
      }
    };
    
    fetchOrders();
  }, [isAuthenticated, navigate]);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Overview tab content
  const renderOverview = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
        {/* Welcome Section */}
        <div className="bg-black bg-opacity-50 rounded-2xl p-6 shadow-xl border border-draugr-900/30">
          <h3 className="text-xl font-bold mb-2">خوش آمدید، {user?.name || 'کاربر'}!</h3>
          <p className="text-gray-300 mb-4">
            سفارشات خود را مدیریت کنید، پروفایل خود را بروزرسانی کنید و فعالیت‌های اخیر خود را پیگیری کنید.
          </p>
          <div className="flex flex-wrap gap-3 mt-4 justify-end">
            <button 
              onClick={() => handleTabChange('profile')}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
            >
              ویرایش پروفایل
            </button>
            <button 
              onClick={() => handleTabChange('orders')}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              مشاهده سفارشات
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black bg-opacity-50 rounded-2xl p-6 shadow-xl text-center border border-draugr-900/30">
            <div className="text-3xl font-bold text-red-500 mb-2">{orders.length}</div>
            <div className="text-gray-300">سفارشات کل</div>
          </div>
          <div className="bg-black bg-opacity-50 rounded-2xl p-6 shadow-xl text-center border border-draugr-900/30">
            <div className="text-3xl font-bold text-red-500 mb-2">
              {orders.filter(order => order.status === 'تحویل شده').length}
            </div>
            <div className="text-gray-300">تکمیل شده</div>
          </div>
          <div className="bg-black bg-opacity-50 rounded-2xl p-6 shadow-xl text-center col-span-2 border border-draugr-900/30">
            <div className="text-3xl font-bold text-red-500 mb-2">
              {orders.filter(order => order.status === 'در حال پردازش' || order.status === 'ارسال شده').length}
            </div>
            <div className="text-gray-300">سفارشات فعال</div>
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="md:col-span-2 bg-black bg-opacity-50 rounded-2xl p-6 shadow-xl border border-draugr-900/30">
          <h3 className="text-xl font-bold mb-4 text-right">سفارشات اخیر</h3>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-400">شناسه</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-400">تاریخ</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-400">وضعیت</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-400">مبلغ کل</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-700">
                      <td className="py-3 px-2 text-sm">#{order._id.substring(0, 8)}</td>
                      <td className="py-3 px-2 text-sm" dir="ltr">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</td>
                      <td className="py-3 px-2 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs 
                          ${order.status === 'تحویل شده' ? 'bg-green-900 text-green-200' : 
                            order.status === 'در حال پردازش' ? 'bg-blue-900 text-blue-200' :
                            order.status === 'ارسال شده' ? 'bg-purple-900 text-purple-200' :
                            'bg-red-900 text-red-200'
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm" dir="ltr">{order.totalPrice.toLocaleString()} تومان</td>
                      <td className="py-3 px-2 text-sm text-left">
                        <button
                          onClick={() => navigate(`/order/${order._id}`)}
                          className="text-red-500 hover:text-red-400"
                        >
                          مشاهده
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length > 3 && (
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => handleTabChange('orders')}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    مشاهده همه سفارشات
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 py-3 text-center">هنوز سفارشی ثبت نکرده‌اید.</p>
          )}
        </div>
      </div>
    );
  };
  
  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'orders':
        return <DashboardOrders orders={orders} isLoading={isLoading} error={error} />;
      case 'profile':
        return <DashboardProfile />;
      case 'wishlist':
        return <DashboardWishlist />;
      case 'addresses':
        return <DashboardAddresses />;
      case 'reviews':
        return <DashboardReviews />;
      default:
        return renderOverview();
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen" dir="rtl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">حساب کاربری من</h1>
        <div className="mt-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-red-500">خانه</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">داشبورد</span>
        </div>
      </div>
      
      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-black bg-opacity-50 rounded-2xl p-4 shadow-xl border border-draugr-900/30">
            <div className="p-4 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-2 flex items-center justify-center text-2xl font-bold">
                {user?.name?.charAt(0) || 'ک'}
              </div>
              <h3 className="font-medium">{user?.name || 'کاربر'}</h3>
              <p className="text-sm text-gray-400">{user?.email || ''}</p>
            </div>
            
            <nav className="mt-4">
              <ul>
                <li>
                  <button
                    onClick={() => handleTabChange('overview')}
                    className={`w-full text-right px-4 py-2 mb-1 rounded-lg flex items-center justify-end
                      ${activeTab === 'overview' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}
                  >
                    <span className="ml-2">نمای کلی</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange('orders')}
                    className={`w-full text-right px-4 py-2 mb-1 rounded-lg flex items-center justify-end
                      ${activeTab === 'orders' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}
                  >
                    <span className="ml-2">سفارشات</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange('wishlist')}
                    className={`w-full text-right px-4 py-2 mb-1 rounded-lg flex items-center justify-end
                      ${activeTab === 'wishlist' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}
                  >
                    <span className="ml-2">علاقه‌مندی‌ها</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange('addresses')}
                    className={`w-full text-right px-4 py-2 mb-1 rounded-lg flex items-center justify-end
                      ${activeTab === 'addresses' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}
                  >
                    <span className="ml-2">آدرس‌ها</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange('reviews')}
                    className={`w-full text-right px-4 py-2 mb-1 rounded-lg flex items-center justify-end
                      ${activeTab === 'reviews' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}
                  >
                    <span className="ml-2">نظرات</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange('profile')}
                    className={`w-full text-right px-4 py-2 mb-1 rounded-lg flex items-center justify-end
                      ${activeTab === 'profile' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}
                  >
                    <span className="ml-2">پروفایل</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
            
            <div className="mt-6 p-4 border-t border-gray-700">
              <button
                onClick={() => {
                  authService.logout();
                  navigate('/');
                }}
                className="w-full py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition flex items-center justify-center"
              >
                <span className="ml-2">خروج از حساب</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-black bg-opacity-50 rounded-2xl p-6 shadow-xl border border-draugr-900/30">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 