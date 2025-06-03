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
  
  const { user, isAuthenticated, logout } = useAuth();
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
      <div className="space-y-8">
        {/* Welcome Card - Improved with gradient */}
        <div className="bg-gradient-to-br from-black to-draugr-950 rounded-2xl p-6 shadow-xl border border-draugr-900/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-draugr-800/10 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-draugr-800/10 rounded-full -ml-8 -mb-8"></div>
          
          <div className="relative">
            <h3 className="text-2xl font-bold mb-3 text-white">خوش آمدید، {user?.name || 'کاربر'}!</h3>
            <p className="text-gray-300 mb-5 max-w-2xl">
              به پنل کاربری فروشگاه دراوگر خوش آمدید. اینجا می‌توانید سفارشات خود را مدیریت کنید، پروفایل خود را بروزرسانی کنید و فعالیت‌های اخیر خود را پیگیری کنید.
            </p>
            <div className="flex flex-wrap gap-3 mt-6 justify-end">
              <button 
                onClick={() => handleTabChange('profile')}
                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                ویرایش پروفایل
              </button>
              <button 
                onClick={() => handleTabChange('orders')}
                className="px-5 py-2.5 bg-gradient-to-r from-draugr-800 to-draugr-600 hover:from-draugr-700 hover:to-draugr-500 rounded-lg transition duration-200 flex items-center shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                مشاهده سفارشات
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Cards - Improved with better layout and icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-black bg-opacity-60 rounded-2xl p-5 shadow-xl border border-draugr-900/30 flex items-center">
            <div className="h-12 w-12 rounded-full bg-draugr-900/50 flex items-center justify-center mr-4 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-draugr-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{orders.length}</div>
              <div className="text-gray-400 text-sm">سفارشات کل</div>
            </div>
          </div>
          
          <div className="bg-black bg-opacity-60 rounded-2xl p-5 shadow-xl border border-draugr-900/30 flex items-center">
            <div className="h-12 w-12 rounded-full bg-green-900/30 flex items-center justify-center mr-4 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {orders.filter(order => order.status === 'تحویل شده').length}
              </div>
              <div className="text-gray-400 text-sm">تکمیل شده</div>
            </div>
          </div>
          
          <div className="bg-black bg-opacity-60 rounded-2xl p-5 shadow-xl border border-draugr-900/30 flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-4 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {orders.filter(order => order.status === 'در حال پردازش' || order.status === 'ارسال شده').length}
              </div>
              <div className="text-gray-400 text-sm">سفارشات فعال</div>
            </div>
          </div>
          
          <div className="bg-black bg-opacity-60 rounded-2xl p-5 shadow-xl border border-draugr-900/30 flex items-center">
            <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mr-4 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {orders.reduce((total, order) => total + order.totalPrice, 0).toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">مجموع (تومان)</div>
            </div>
          </div>
        </div>
        
        {/* Recent Orders - Improved with better styling */}
        <div className="bg-black bg-opacity-50 rounded-2xl p-6 shadow-xl border border-draugr-900/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-right">سفارشات اخیر</h3>
            {orders.length > 3 && (
              <button 
                onClick={() => handleTabChange('orders')}
                className="text-draugr-500 hover:text-draugr-400 text-sm flex items-center"
              >
                مشاهده همه
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-draugr-500"></div>
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400">
                    <th className="text-right py-3 px-2 text-sm font-medium">شناسه</th>
                    <th className="text-right py-3 px-2 text-sm font-medium">تاریخ</th>
                    <th className="text-right py-3 px-2 text-sm font-medium">وضعیت</th>
                    <th className="text-right py-3 px-2 text-sm font-medium">مبلغ کل</th>
                    <th className="text-left py-3 px-2 text-sm font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-800 hover:bg-black/30 transition-colors">
                      <td className="py-4 px-2">
                        <span className="text-sm font-medium">#{order._id.substring(0, 8)}</span>
                      </td>
                      <td className="py-4 px-2" dir="ltr">
                        <span className="text-sm text-gray-300">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                          ${order.status === 'تحویل شده' ? 'bg-green-900/40 text-green-200 border border-green-700' : 
                            order.status === 'در حال پردازش' ? 'bg-blue-900/40 text-blue-200 border border-blue-700' :
                            order.status === 'ارسال شده' ? 'bg-purple-900/40 text-purple-200 border border-purple-700' :
                            'bg-red-900/40 text-red-200 border border-red-700'
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-2" dir="ltr">
                        <span className="text-sm font-medium text-gray-300">{order.totalPrice.toLocaleString()} تومان</span>
                      </td>
                      <td className="py-4 px-2 text-left">
                        <button
                          onClick={() => navigate(`/order/${order._id}`)}
                          className="text-draugr-500 hover:text-draugr-400 flex items-center justify-end text-sm"
                        >
                          مشاهده
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-black/20 rounded-xl p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <p className="text-gray-400">هنوز سفارشی ثبت نکرده‌اید.</p>
              <Link to="/shop" className="mt-4 inline-block px-4 py-2 bg-draugr-700 hover:bg-draugr-600 rounded-lg transition-colors text-sm">
                مشاهده محصولات
              </Link>
            </div>
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
                    className={`w-full text-center px-4 py-2.5 mb-1 rounded-lg flex items-center justify-center
                      ${activeTab === 'overview' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}
                  >
                    <span>نمای کلی</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange('orders')}
                    className={`w-full text-center px-4 py-2.5 mb-1 rounded-lg flex items-center justify-center
                      ${activeTab === 'orders' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}
                  >
                    <span>سفارشات</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange('wishlist')}
                    className={`w-full text-center px-4 py-2.5 mb-1 rounded-lg flex items-center justify-center
                      ${activeTab === 'wishlist' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}
                  >
                    <span>علاقه‌مندی‌ها</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange('addresses')}
                    className={`w-full text-center px-4 py-2.5 mb-1 rounded-lg flex items-center justify-center
                      ${activeTab === 'addresses' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}
                  >
                    <span>آدرس‌ها</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange('reviews')}
                    className={`w-full text-center px-4 py-2.5 mb-1 rounded-lg flex items-center justify-center
                      ${activeTab === 'reviews' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}
                  >
                    <span>نظرات</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange('profile')}
                    className={`w-full text-center px-4 py-2.5 mb-1 rounded-lg flex items-center justify-center
                      ${activeTab === 'profile' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}
                  >
                    <span>پروفایل</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
            
            <div className="mt-6 p-4 border-t border-gray-700">
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full py-2.5 bg-gradient-to-r from-draugr-900 to-draugr-800 hover:from-draugr-800 hover:to-draugr-700 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <span>خروج از حساب</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-draugr-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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