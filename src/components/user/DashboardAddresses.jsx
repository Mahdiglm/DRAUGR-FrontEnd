import { useState } from 'react';

const DashboardAddresses = () => {
  // In a real app, these addresses would come from a service
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'home',
      name: 'آدرس خانه',
      address: 'خیابان ولیعصر، خیابان بهار شیراز، پلاک 142',
      city: 'تهران',
      state: 'تهران',
      postalCode: '1541854187',
      country: 'ایران',
      isDefault: true,
      phone: '09121234567'
    },
    {
      id: '2',
      type: 'work',
      name: 'آدرس محل کار',
      address: 'میدان آرژانتین، خیابان الوند، پلاک 37',
      city: 'تهران',
      state: 'تهران',
      postalCode: '1516846133',
      country: 'ایران',
      isDefault: false,
      phone: '09361234567'
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'home',
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'ایران',
    phone: '',
    isDefault: false
  });
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Initialize edit form
  const handleEdit = (address) => {
    setFormData(address);
    setEditingAddress(address.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingAddress) {
      // Update existing address
      const updatedAddresses = addresses.map(address => 
        address.id === editingAddress ? { ...formData, id: editingAddress } : address
      );
      
      setAddresses(updatedAddresses);
      setEditingAddress(null);
    } else {
      // Add new address
      const newAddress = {
        ...formData,
        id: Date.now().toString()
      };
      
      setAddresses([...addresses, newAddress]);
    }
    
    // Reset form and hide it
    setFormData({
      type: 'home',
      name: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'ایران',
      phone: '',
      isDefault: false
    });
    setShowAddForm(false);
  };
  
  // Delete address
  const handleDelete = (id) => {
    if (confirm('آیا از حذف این آدرس اطمینان دارید؟')) {
      setAddresses(addresses.filter(address => address.id !== id));
    }
  };
  
  // Set address as default
  const handleSetDefault = (id) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
  };
  
  return (
    <div className="text-right" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">آدرس‌های من</h2>
          <p className="text-gray-400 text-sm">مدیریت آدرس‌های تحویل سفارش</p>
        </div>
        
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 md:mt-0 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            افزودن آدرس جدید
          </button>
        )}
      </div>
      
      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-black bg-opacity-50 rounded-xl p-6 mb-8 border border-draugr-900/30">
          <h3 className="text-xl font-bold mb-4">
            {editingAddress ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="name">
                  نام آدرس
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                  placeholder="خانه، محل کار و ..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="type">
                  نوع آدرس
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                  required
                >
                  <option value="home">خانه</option>
                  <option value="work">محل کار</option>
                  <option value="other">سایر</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1" htmlFor="address">
                آدرس پستی
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                placeholder="آدرس کامل را وارد کنید"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="city">
                  شهر
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                  placeholder="شهر"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="state">
                  استان
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                  placeholder="استان"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="postalCode">
                  کد پستی
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                  placeholder="کد پستی ۱۰ رقمی"
                  required
                  dir="ltr"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="country">
                  کشور
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                  placeholder="کشور"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="phone">
                  شماره تماس
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                  placeholder="09123456789"
                  required
                  dir="ltr"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="rounded text-red-500 focus:ring-2 focus:ring-red-500 bg-gray-700 border-gray-600"
                />
                <span className="mr-2 text-sm text-gray-300">تنظیم به عنوان آدرس پیش‌فرض</span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-4 space-x-reverse">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingAddress(null);
                  setFormData({
                    type: 'home',
                    name: '',
                    address: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: 'ایران',
                    phone: '',
                    isDefault: false
                  });
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                {editingAddress ? 'بروزرسانی آدرس' : 'ذخیره آدرس'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-300">آدرسی یافت نشد</h3>
            <p className="text-gray-400 mt-2">
              برای تسریع در فرآیند خرید، آدرس‌های خود را اضافه کنید.
            </p>
          </div>
        ) : (
          addresses.map(address => (
            <div 
              key={address.id} 
              className={`bg-black bg-opacity-50 rounded-xl p-6 border ${address.isDefault ? 'border-red-500' : 'border-gray-700'}`}
            >
              {address.isDefault && (
                <div className="flex items-center text-red-500 text-sm mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  آدرس پیش‌فرض
                </div>
              )}
              
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-medium">{address.name}</h3>
                <span className="px-3 py-1 rounded-full bg-gray-700 text-xs">
                  {address.type === 'home' ? 'خانه' : address.type === 'work' ? 'محل کار' : 'سایر'}
                </span>
              </div>
              
              <div className="text-gray-300 space-y-1 mb-4">
                <p>{address.address}</p>
                <p>{address.city}، {address.state}، کد پستی: {address.postalCode}</p>
                <p>{address.country}</p>
                <p className="mt-2" dir="ltr">{address.phone}</p>
              </div>
              
              <div className="flex justify-between">
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => handleEdit(address)}
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-sm"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-sm"
                  >
                    حذف
                  </button>
                </div>
                
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="px-3 py-1 bg-transparent text-red-500 border border-red-500 rounded hover:bg-red-900/20 transition text-sm"
                  >
                    انتخاب به عنوان پیش‌فرض
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardAddresses; 