import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';

const DashboardProfile = () => {
  const { user, updateUserContext } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      // Try to split the name into first and last name
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(user.email || '');
    }
  }, [user]);
  
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // Reset states
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      // Combine first and last name
      const name = `${firstName} ${lastName}`.trim();
      
      // Create update object
      const updateData = {
        name,
        email
      };
      
      // Update profile
      const response = await authService.updateProfile(updateData);
      
      // Update context
      if (response.user) {
        updateUserContext(response.user);
      }
      
      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'خطا در بروزرسانی پروفایل');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('رمز عبور جدید با تکرار آن مطابقت ندارد');
      return;
    }
    
    // Reset states
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      // Change password
      await authService.changePassword(currentPassword, newPassword);
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'خطا در تغییر رمز عبور');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="text-right" dir="rtl">
      <h2 className="text-2xl font-bold mb-6">تنظیمات پروفایل</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-white">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg text-white">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            پروفایل با موفقیت بروزرسانی شد!
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div>
          <h3 className="text-xl font-medium mb-4">اطلاعات شخصی</h3>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="firstName">
                  نام
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="lastName">
                  نام خانوادگی
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1" htmlFor="email">
                آدرس ایمیل
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                required
                dir="ltr"
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'در حال بروزرسانی...' : 'بروزرسانی پروفایل'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Change Password */}
        <div>
          <h3 className="text-xl font-medium mb-4">تغییر رمز عبور</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1" htmlFor="currentPassword">
                رمز عبور فعلی
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                required
                dir="ltr"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1" htmlFor="newPassword">
                رمز عبور جدید
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                required
                minLength={6}
                dir="ltr"
              />
              <p className="text-xs text-gray-400 mt-1">رمز عبور باید حداقل ۶ کاراکتر باشد</p>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1" htmlFor="confirmPassword">
                تکرار رمز عبور جدید
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                required
                dir="ltr"
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Delete Account - Add with caution */}
      <div className="mt-12 pt-6 border-t border-gray-700">
        <h3 className="text-xl font-medium text-red-500 mb-4">منطقه خطر</h3>
        <p className="text-gray-400 mb-4">
          بعد از حذف حساب کاربری، امکان بازگرداندن آن وجود ندارد. لطفاً مطمئن شوید.
        </p>
        <button
          type="button"
          className="px-6 py-2 bg-red-900/50 border border-red-500 text-white rounded-lg hover:bg-red-900 transition focus:outline-none"
          // Add delete account functionality here
          onClick={() => alert('قابلیت حذف حساب کاربری هنوز اضافه نشده است')}
        >
          حذف حساب کاربری
        </button>
      </div>
    </div>
  );
};

export default DashboardProfile; 