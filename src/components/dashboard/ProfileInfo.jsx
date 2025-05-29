import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const ProfileInfo = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || '',
  });
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'نام الزامی است';
    if (!formData.lastName) newErrors.lastName = 'نام خانوادگی الزامی است';
    if (!formData.email) newErrors.email = 'ایمیل الزامی است';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'فرمت ایمیل نامعتبر است';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setLoading(true);
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errMsg = err.message || '';
      if (errMsg.toLowerCase().includes('email')) {
        setErrors(prev => ({ ...prev, email: 'این ایمیل قبلاً استفاده شده است' }));
      } else {
        setErrors(prev => ({ ...prev, general: 'خطا در بروزرسانی اطلاعات' }));
      }
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  // File input change handler for profile image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profileImage: 'حجم فایل نباید بیشتر از 2 مگابایت باشد' }));
      return;
    }
    
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setErrors(prev => ({ ...prev, profileImage: 'فرمت فایل باید JPG، PNG یا GIF باشد' }));
      return;
    }
    
    // Convert to data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({ ...prev, profileImage: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="border-b border-gray-800 pb-3">
        <h1 className="text-2xl font-bold text-white">اطلاعات شخصی</h1>
        <p className="text-gray-400 mt-1">اطلاعات حساب کاربری خود را مدیریت کنید</p>
      </div>
      
      {/* Success message */}
      {success && (
        <motion.div
          className="bg-green-900/50 border border-green-800 text-green-300 px-4 py-3 rounded-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          اطلاعات حساب شما با موفقیت بروزرسانی شد!
        </motion.div>
      )}
      
      {/* General error message */}
      {errors.general && (
        <motion.div
          className="bg-draugr-900/50 border border-draugr-800 text-draugr-300 px-4 py-3 rounded-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {errors.general}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile image upload */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src={formData.profileImage || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-28 h-28 rounded-full border-2 border-draugr-600 object-cover group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <label htmlFor="profileImage" className="bg-black/70 text-white rounded-full p-2.5 cursor-pointer hover:bg-draugr-900/90">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
          {errors.profileImage && (
            <p className="mt-1 text-sm text-draugr-500">{errors.profileImage}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">برای تغییر تصویر پروفایل، روی تصویر کلیک کنید.</p>
        </div>
        
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">نام</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full bg-gray-800 border ${errors.firstName ? 'border-draugr-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-draugr-600`}
            />
            {errors.firstName && <p className="mt-1 text-sm text-draugr-500">{errors.firstName}</p>}
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">نام خانوادگی</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full bg-gray-800 border ${errors.lastName ? 'border-draugr-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-draugr-600`}
            />
            {errors.lastName && <p className="mt-1 text-sm text-draugr-500">{errors.lastName}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">ایمیل</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-gray-800 border ${errors.email ? 'border-draugr-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-draugr-600`}
            />
            {errors.email && <p className="mt-1 text-sm text-draugr-500">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">شماره موبایل (اختیاری)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full bg-gray-800 border ${errors.phone ? 'border-draugr-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-draugr-600`}
            />
            {errors.phone && <p className="mt-1 text-sm text-draugr-500">{errors.phone}</p>}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-gradient-to-r from-draugr-900 to-draugr-700 text-white rounded-lg hover:from-draugr-800 hover:to-draugr-600 focus:outline-none focus:ring-2 focus:ring-draugr-600 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                در حال بروزرسانی...
              </div>
            ) : 'ذخیره تغییرات'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProfileInfo; 