import { useState } from 'react';
import api from '../../services/api';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('site');
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'فروشگاه دراگر',
    siteDescription: 'فروشگاه تخصصی گیمینگ و تکنولوژی',
    logo: '/images/logo.png',
    footerText: 'تمامی حقوق برای فروشگاه دراگر محفوظ است.',
    contactEmail: 'info@draugrshop.com',
    contactPhone: '+98 21 1234 5678',
    address: 'تهران، خیابان ولیعصر، پلاک 123',
    instagram: 'https://instagram.com/draugrshop',
    twitter: 'https://twitter.com/draugrshop',
    telegram: 'https://t.me/draugrshop'
  });
  
  const [orderSettings, setOrderSettings] = useState({
    freeShippingThreshold: 500000,
    shippingCost: 30000,
    tax: 9,
    allowGuestCheckout: true,
    orderStatuses: [
      'در انتظار پرداخت',
      'در حال پردازش',
      'ارسال شده',
      'تحویل شده',
      'لغو شده'
    ]
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newStatusInput, setNewStatusInput] = useState('');
  
  // Handle site settings input changes
  const handleSiteSettingChange = (e) => {
    const { name, value } = e.target;
    setSiteSettings({
      ...siteSettings,
      [name]: value
    });
  };
  
  // Handle order settings input changes
  const handleOrderSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderSettings({
      ...orderSettings,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : value
    });
  };
  
  // Handle adding new order status
  const handleAddStatus = () => {
    if (newStatusInput.trim() && !orderSettings.orderStatuses.includes(newStatusInput.trim())) {
      setOrderSettings({
        ...orderSettings,
        orderStatuses: [...orderSettings.orderStatuses, newStatusInput.trim()]
      });
      setNewStatusInput('');
    }
  };
  
  // Handle removing order status
  const handleRemoveStatus = (status) => {
    setOrderSettings({
      ...orderSettings,
      orderStatuses: orderSettings.orderStatuses.filter(s => s !== status)
    });
  };
  
  // Handle saving settings
  const handleSaveSettings = async () => {
    setIsLoading(true);
    setSaveSuccess(false);
    setErrorMessage('');
    
    try {
      // This should be replaced with the actual API endpoint
      await api.post('/api/admin/settings', {
        site: siteSettings,
        order: orderSettings
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setErrorMessage('خطا در ذخیره تنظیمات. لطفا دوباره تلاش کنید.');
      
      // For development, simulate success
      if (process.env.NODE_ENV === 'development') {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    }
    
    setIsLoading(false);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">تنظیمات سیستم</h2>
      
      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('site')}
          className={`py-2 px-4 font-medium transition-colors ${activeTab === 'site' ? 'text-draugr-500 border-b-2 border-draugr-500' : 'text-gray-400 hover:text-white'}`}
        >
          تنظیمات سایت
        </button>
        <button
          onClick={() => setActiveTab('order')}
          className={`py-2 px-4 font-medium transition-colors ${activeTab === 'order' ? 'text-draugr-500 border-b-2 border-draugr-500' : 'text-gray-400 hover:text-white'}`}
        >
          تنظیمات سفارشات
        </button>
      </div>
      
      {/* Site Settings */}
      {activeTab === 'site' && (
        <div className="space-y-6 bg-black bg-opacity-40 rounded-xl border border-gray-800 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-1 text-sm">نام سایت</label>
              <input
                type="text"
                name="siteName"
                value={siteSettings.siteName}
                onChange={handleSiteSettingChange}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-1 text-sm">توضیحات سایت</label>
              <input
                type="text"
                name="siteDescription"
                value={siteSettings.siteDescription}
                onChange={handleSiteSettingChange}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-1 text-sm">آدرس لوگو</label>
              <input
                type="text"
                name="logo"
                value={siteSettings.logo}
                onChange={handleSiteSettingChange}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-1 text-sm">متن فوتر</label>
              <input
                type="text"
                name="footerText"
                value={siteSettings.footerText}
                onChange={handleSiteSettingChange}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
              />
            </div>
          </div>
          
          <h3 className="text-lg font-bold mt-4">اطلاعات تماس</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-1 text-sm">ایمیل تماس</label>
              <input
                type="email"
                name="contactEmail"
                value={siteSettings.contactEmail}
                onChange={handleSiteSettingChange}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-1 text-sm">شماره تماس</label>
              <input
                type="text"
                name="contactPhone"
                value={siteSettings.contactPhone}
                onChange={handleSiteSettingChange}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-400 mb-1 text-sm">آدرس</label>
              <input
                type="text"
                name="address"
                value={siteSettings.address}
                onChange={handleSiteSettingChange}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
              />
            </div>
          </div>
          
          <h3 className="text-lg font-bold mt-4">شبکه‌های اجتماعی</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-400 mb-1 text-sm">اینستاگرام</label>
              <input
                type="text"
                name="instagram"
                value={siteSettings.instagram}
                onChange={handleSiteSettingChange}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-1 text-sm">توییتر</label>
              <input
                type="text"
                name="twitter"
                value={siteSettings.twitter}
                onChange={handleSiteSettingChange}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-1 text-sm">تلگرام</label>
              <input
                type="text"
                name="telegram"
                value={siteSettings.telegram}
                onChange={handleSiteSettingChange}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Order Settings */}
      {activeTab === 'order' && (
        <div className="space-y-6 bg-black bg-opacity-40 rounded-xl border border-gray-800 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-1 text-sm">حداقل خرید برای ارسال رایگان (تومان)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={orderSettings.freeShippingThreshold}
                onChange={handleOrderSettingChange}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-1 text-sm">هزینه ارسال (تومان)</label>
              <input
                type="number"
                name="shippingCost"
                value={orderSettings.shippingCost}
                onChange={handleOrderSettingChange}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-1 text-sm">مالیات (درصد)</label>
              <input
                type="number"
                name="tax"
                value={orderSettings.tax}
                onChange={handleOrderSettingChange}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="allowGuestCheckout"
                checked={orderSettings.allowGuestCheckout}
                onChange={handleOrderSettingChange}
                className="rounded text-draugr-500 focus:ring-draugr-500 h-5 w-5 bg-gray-800 border-gray-700 ml-2"
              />
              <label className="text-gray-400">اجازه پرداخت مهمان</label>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-3">وضعیت‌های سفارش</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newStatusInput}
                onChange={(e) => setNewStatusInput(e.target.value)}
                placeholder="وضعیت جدید..."
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
              />
              <button
                type="button"
                onClick={handleAddStatus}
                className="px-4 py-2 bg-draugr-700 hover:bg-draugr-600 rounded-lg transition-colors"
              >
                افزودن
              </button>
            </div>
            
            <div className="space-y-2">
              {orderSettings.orderStatuses.map((status, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                  <span>{status}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStatus(status)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Save Button */}
      <div className="flex justify-end mt-6">
        {saveSuccess && (
          <div className="bg-green-900/20 text-green-200 px-4 py-2 rounded-lg mr-4 border border-green-800">
            تنظیمات با موفقیت ذخیره شد
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-red-900/20 text-red-200 px-4 py-2 rounded-lg mr-4 border border-red-800">
            {errorMessage}
          </div>
        )}
        
        <button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className={`px-6 py-2 bg-draugr-700 hover:bg-draugr-600 rounded-lg transition-colors flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              در حال ذخیره...
            </>
          ) : 'ذخیره تنظیمات'}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings; 