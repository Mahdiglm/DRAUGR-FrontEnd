import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import AdminUsers from '../admin/AdminUsers';
import AdminOrders from '../admin/AdminOrders';
import AdminProducts from '../admin/AdminProducts';
import AdminBlogs from '../admin/AdminBlogs';
import AdminSettings from '../admin/AdminSettings';
import AdminCategories from '../admin/AdminCategories';
import AdminContentManager from '../admin/AdminContentManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // Protect the admin route - check if user is admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=hidden');
      return;
    }
    
    if (!user.isAdmin) {
      navigate('/');
      return;
    }
    
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching dashboard data...');
        const token = localStorage.getItem('token');
        console.log('Current auth token:', token ? 'Token exists' : 'No token');
        console.log('User data:', user);
        
        const response = await api.get('/api/admin/dashboard');
        console.log('Dashboard API response:', response);
        setDashboardData(response);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        console.error('Error details:', err.message);
        setError('Failed to load dashboard data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [isAuthenticated, user, navigate]);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Dashboard overview content
  const renderOverview = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-draugr-500"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-900/20 text-red-200 p-4 rounded-lg border border-red-800">
          <p>{error}</p>
        </div>
      );
    }
    
    if (!dashboardData) {
      console.error('Dashboard data is undefined or null');
      return (
        <div className="bg-yellow-900/20 text-yellow-200 p-4 rounded-lg border border-yellow-800">
          <p>اطلاعات داشبورد در دسترس نیست. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.</p>
        </div>
      );
    }
    
    // Use default empty objects/arrays if data is missing
    const { 
      counts = { users: 0, orders: 0, products: 0, blogs: 0, revenue: 0 }, 
      recentOrders = [], 
      recentUsers = [] 
    } = dashboardData;
    
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">داشبورد مدیریت</h2>
          <span className="bg-draugr-700 text-white px-3 py-1 rounded-full text-sm font-medium">
            مدیر سیستم
          </span>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-gray-800">
            <div className="flex items-center">
              <div className="p-3 bg-draugr-900/50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-draugr-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="mr-4">
                <h3 className="text-gray-400 text-sm">کاربران</h3>
                <p className="text-2xl font-bold">{counts.users}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-gray-800">
            <div className="flex items-center">
              <div className="p-3 bg-draugr-900/50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-draugr-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="mr-4">
                <h3 className="text-gray-400 text-sm">سفارشات</h3>
                <p className="text-2xl font-bold">{counts.orders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-gray-800">
            <div className="flex items-center">
              <div className="p-3 bg-draugr-900/50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-draugr-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div className="mr-4">
                <h3 className="text-gray-400 text-sm">محصولات</h3>
                <p className="text-2xl font-bold">{counts.products}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-gray-800">
            <div className="flex items-center">
              <div className="p-3 bg-draugr-900/50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-draugr-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5m14 6a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2z" />
                </svg>
              </div>
              <div className="mr-4">
                <h3 className="text-gray-400 text-sm">بلاگ</h3>
                <p className="text-2xl font-bold">{counts.blogs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-gray-800">
            <div className="flex items-center">
              <div className="p-3 bg-draugr-900/50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-draugr-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mr-4">
                <h3 className="text-gray-400 text-sm">درآمد</h3>
                <p className="text-2xl font-bold" dir="ltr">{(counts.revenue || 0).toLocaleString()} تومان</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-black bg-opacity-50 rounded-xl p-6 shadow-xl border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">آخرین سفارشات</h3>
              <button 
                onClick={() => handleTabChange('orders')}
                className="text-draugr-500 hover:text-draugr-400 text-sm"
              >
                مشاهده همه
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400">
                    <th className="text-right py-3 px-2 text-sm">شناسه</th>
                    <th className="text-right py-3 px-2 text-sm">کاربر</th>
                    <th className="text-right py-3 px-2 text-sm">وضعیت</th>
                    <th className="text-right py-3 px-2 text-sm">مبلغ</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders && recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-800 hover:bg-gray-900/30">
                        <td className="py-3 px-2">
                          <span className="text-sm font-medium">#{order._id.substring(0, 6)}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm">{order.user?.name || 'کاربر ناشناس'}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${order.status === 'تحویل شده' ? 'bg-green-900/40 text-green-200 border border-green-700' : 
                              order.status === 'در حال پردازش' ? 'bg-blue-900/40 text-blue-200 border border-blue-700' :
                              order.status === 'ارسال شده' ? 'bg-purple-900/40 text-purple-200 border border-purple-700' :
                              'bg-red-900/40 text-red-200 border border-red-700'
                            }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-2" dir="ltr">
                          <span className="text-sm font-medium">{order.totalPrice.toLocaleString()} تومان</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-3 px-2 text-center">
                        <p>هیچ سفارشی یافت نشد.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Recent Users */}
          <div className="bg-black bg-opacity-50 rounded-xl p-6 shadow-xl border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">کاربران جدید</h3>
              <button 
                onClick={() => handleTabChange('users')}
                className="text-draugr-500 hover:text-draugr-400 text-sm"
              >
                مشاهده همه
              </button>
            </div>
            
            <div className="space-y-4">
              {recentUsers && recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/30 hover:bg-gray-900/50">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-md font-bold mr-3">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500" dir="ltr">
                        {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p>هیچ کاربر جدیدی یافت نشد.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return <AdminUsers />;
      case 'orders':
        return <AdminOrders />;
      case 'products':
        return <AdminProducts />;
      case 'blogs':
        return <AdminBlogs />;
      case 'settings':
        return <AdminSettings />;
      case 'categories':
        return <AdminCategories />;
      case 'content':
        return <AdminContentManager />;
      default:
        return renderOverview();
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen" dir="rtl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">پنل مدیریت</h1>
        <div className="mt-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-draugr-500">خانه</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">مدیریت</span>
        </div>
      </div>
      
      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-black bg-opacity-50 rounded-2xl p-4 shadow-xl border border-draugr-900/30">
            <div className="p-4 text-center">
              <div className="w-20 h-20 rounded-full bg-draugr-700 mx-auto mb-2 flex items-center justify-center text-2xl font-bold">
                {user?.name?.charAt(0) || 'ا'}
              </div>
              <h3 className="font-medium">{user?.name || 'ادمین'}</h3>
              <p className="text-sm text-gray-400">{user?.email || ''}</p>
              <div className="mt-2">
                <span className="inline-block bg-draugr-800 text-draugr-200 text-xs px-2 py-1 rounded-full">
                  مدیر سیستم
                </span>
              </div>
            </div>
            
            <nav className="mt-4">
              <ul className="space-y-1">
                <li>
                  <button
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-draugr-900 text-draugr-400' : 'hover:bg-gray-900 text-gray-400 hover:text-white'}`}
                    onClick={() => handleTabChange('overview')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>داشبورد</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-draugr-900 text-draugr-400' : 'hover:bg-gray-900 text-gray-400 hover:text-white'}`}
                    onClick={() => handleTabChange('users')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>کاربران</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-draugr-900 text-draugr-400' : 'hover:bg-gray-900 text-gray-400 hover:text-white'}`}
                    onClick={() => handleTabChange('orders')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>سفارشات</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-draugr-900 text-draugr-400' : 'hover:bg-gray-900 text-gray-400 hover:text-white'}`}
                    onClick={() => handleTabChange('products')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <span>محصولات</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'categories' ? 'bg-draugr-900 text-draugr-400' : 'hover:bg-gray-900 text-gray-400 hover:text-white'}`}
                    onClick={() => handleTabChange('categories')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>دسته‌بندی‌ها</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'blogs' ? 'bg-draugr-900 text-draugr-400' : 'hover:bg-gray-900 text-gray-400 hover:text-white'}`}
                    onClick={() => handleTabChange('blogs')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5m14 6a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2z" />
                    </svg>
                    <span>بلاگ</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'content' ? 'bg-draugr-900 text-draugr-400' : 'hover:bg-gray-900 text-gray-400 hover:text-white'}`}
                    onClick={() => handleTabChange('content')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>محتوای سایت</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-draugr-900 text-draugr-400' : 'hover:bg-gray-900 text-gray-400 hover:text-white'}`}
                    onClick={() => handleTabChange('settings')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>تنظیمات</span>
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

export default AdminDashboard; 