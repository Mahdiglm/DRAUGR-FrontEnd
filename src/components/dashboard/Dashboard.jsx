import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import ProfileInfo from './ProfileInfo';
import OrdersList from './OrdersList';
import FavoritesList from './FavoritesList';

// Placeholder components for other dashboard sections
const AddressesList = () => (
  <div className="space-y-6">
    <div className="border-b border-gray-800 pb-3">
      <h1 className="text-2xl font-bold text-white">آدرس‌های من</h1>
      <p className="text-gray-400 mt-1">مدیریت آدرس‌های تحویل سفارش</p>
    </div>
    <div className="py-8 text-center text-gray-400">
      <p>این بخش در حال توسعه است و به زودی در دسترس قرار خواهد گرفت.</p>
    </div>
  </div>
);

const ChangePassword = () => (
  <div className="space-y-6">
    <div className="border-b border-gray-800 pb-3">
      <h1 className="text-2xl font-bold text-white">تغییر رمز عبور</h1>
      <p className="text-gray-400 mt-1">رمز عبور حساب کاربری خود را تغییر دهید</p>
    </div>
    <div className="py-8 text-center text-gray-400">
      <p>این بخش در حال توسعه است و به زودی در دسترس قرار خواهد گرفت.</p>
    </div>
  </div>
);

const Notifications = () => (
  <div className="space-y-6">
    <div className="border-b border-gray-800 pb-3">
      <h1 className="text-2xl font-bold text-white">اعلان‌ها</h1>
      <p className="text-gray-400 mt-1">اعلان‌ها و پیام‌های سیستم</p>
    </div>
    <div className="py-8 text-center text-gray-400">
      <p>این بخش در حال توسعه است و به زودی در دسترس قرار خواهد گرفت.</p>
    </div>
  </div>
);

const Support = () => (
  <div className="space-y-6">
    <div className="border-b border-gray-800 pb-3">
      <h1 className="text-2xl font-bold text-white">پشتیبانی</h1>
      <p className="text-gray-400 mt-1">ارتباط با پشتیبانی و مشاهده تیکت‌ها</p>
    </div>
    <div className="py-8 text-center text-gray-400">
      <p>این بخش در حال توسعه است و به زودی در دسترس قرار خواهد گرفت.</p>
    </div>
  </div>
);

const Dashboard = () => {
  const location = useLocation();
  
  // Determine which dashboard section to show based on the URL
  const renderDashboardContent = () => {
    const path = location.pathname;
    
    // Redirect to profile if no specific section is requested
    if (path === '/dashboard' || path === '/dashboard/') {
      return <Navigate to="/dashboard/profile" replace />;
    }
    
    return (
      <Routes>
        <Route path="/profile" element={<ProfileInfo />} />
        <Route path="/orders" element={<OrdersList />} />
        <Route path="/favorites" element={<FavoritesList />} />
        <Route path="/addresses" element={<AddressesList />} />
        <Route path="/password" element={<ChangePassword />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<Navigate to="/dashboard/profile" replace />} />
      </Routes>
    );
  };
  
  return (
    <DashboardLayout>
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

export default Dashboard; 