import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateProfile, loading, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'نام الزامی است';
    if (!formData.lastName) newErrors.lastName = 'نام خانوادگی الزامی است';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      
      setSuccess('پروفایل شما با موفقیت بروزرسانی شد');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setErrors({
        general: 'خطا در بروزرسانی پروفایل'
      });
    }
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = 'رمز عبور فعلی الزامی است';
    if (!formData.newPassword) newErrors.newPassword = 'رمز عبور جدید الزامی است';
    else if (formData.newPassword.length < 8) newErrors.newPassword = 'حداقل ۸ کاراکتر';
    
    if (!formData.confirmNewPassword) newErrors.confirmNewPassword = 'تایید رمز عبور الزامی است';
    else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'رمز عبور و تایید آن مطابقت ندارند';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await updateProfile({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
      
      setSuccess('رمز عبور شما با موفقیت تغییر یافت');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setErrors({
        general: 'خطا در تغییر رمز عبور. لطفا رمز عبور فعلی را بررسی کنید.'
      });
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900/80 backdrop-blur-md shadow-xl border border-draugr-900/40 rounded-lg overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">پروفایل کاربری</h1>
          
          {/* Tabs */}
          <div className="flex border-b border-draugr-900/60 mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 font-medium ${activeTab === 'profile' ? 'text-draugr-500 border-b-2 border-draugr-500' : 'text-gray-400'}`}
            >
              اطلاعات شخصی
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 font-medium ${activeTab === 'security' ? 'text-draugr-500 border-b-2 border-draugr-500' : 'text-gray-400'}`}
            >
              امنیت و رمز عبور
            </button>
          </div>
          
          {/* Success message */}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-900/30 border border-green-700/50 text-green-400 px-4 py-3 rounded-md mb-6"
            >
              {success}
            </motion.div>
          )}
          
          {/* General error message */}
          {errors.general && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-draugr-900/30 border border-draugr-700/50 text-draugr-400 px-4 py-3 rounded-md mb-6"
            >
              {errors.general}
            </motion.div>
          )}
          
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                    نام
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full bg-gray-800/70 border ${errors.firstName ? 'border-draugr-500' : 'border-gray-700'} rounded-md py-2 px-4 text-white focus:outline-none focus:border-draugr-400`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-draugr-500">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                    نام خانوادگی
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full bg-gray-800/70 border ${errors.lastName ? 'border-draugr-500' : 'border-gray-700'} rounded-md py-2 px-4 text-white focus:outline-none focus:border-draugr-400`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-draugr-500">{errors.lastName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full bg-gray-800/30 border border-gray-700 rounded-md py-2 px-4 text-gray-400 focus:outline-none cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">ایمیل قابل تغییر نیست</p>
                </div>
              </div>
              
              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-draugr-900 to-draugr-700 text-white py-2 px-6 rounded-md font-medium hover:from-draugr-800 hover:to-draugr-600 transition-colors focus:outline-none"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'در حال بروزرسانی...' : 'ذخیره تغییرات'}
                </motion.button>
              </div>
            </form>
          )}
          
          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    رمز عبور فعلی
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`w-full bg-gray-800/70 border ${errors.currentPassword ? 'border-draugr-500' : 'border-gray-700'} rounded-md py-2 px-4 text-white focus:outline-none focus:border-draugr-400`}
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-draugr-500">{errors.currentPassword}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    رمز عبور جدید
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full bg-gray-800/70 border ${errors.newPassword ? 'border-draugr-500' : 'border-gray-700'} rounded-md py-2 px-4 text-white focus:outline-none focus:border-draugr-400`}
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-draugr-500">{errors.newPassword}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    تایید رمز عبور جدید
                  </label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className={`w-full bg-gray-800/70 border ${errors.confirmNewPassword ? 'border-draugr-500' : 'border-gray-700'} rounded-md py-2 px-4 text-white focus:outline-none focus:border-draugr-400`}
                  />
                  {errors.confirmNewPassword && (
                    <p className="mt-1 text-sm text-draugr-500">{errors.confirmNewPassword}</p>
                  )}
                </div>
              </div>
              
              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-draugr-900 to-draugr-700 text-white py-2 px-6 rounded-md font-medium hover:from-draugr-800 hover:to-draugr-600 transition-colors focus:outline-none"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'در حال بروزرسانی...' : 'تغییر رمز عبور'}
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage; 