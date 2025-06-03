import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState({
    name: '',
    email: '',
    isAdmin: false
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Fetch all users
  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/admin/users');
        
        if (isMounted) {
          setUsers(response.data?.data || []);
          setIsLoading(false);
          setError(null); // Clear any previous errors
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        
        if (isMounted) {
          if (err.message === 'Too many requests to admin routes, please try again later.') {
            setError('تعداد درخواست‌های ارسالی بیش از حد مجاز است. لطفاً چند دقیقه صبر کنید و دوباره تلاش کنید.');
          } else {
            setError('خطا در بارگذاری کاربران. لطفاً دوباره تلاش کنید.');
          }
          setIsLoading(false);
        }
      }
    };
    
    fetchUsers();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Fetch user details
  const fetchUserDetails = async (userId) => {
    try {
      setIsDetailsLoading(true);
      const response = await api.get(`/api/admin/users/${userId}`);
      setUserDetails(response.data.data);
      setIsDetailsLoading(false);
    } catch (err) {
      console.error('Error fetching user details:', err);
      setIsDetailsLoading(false);
    }
  };
  
  // Handle user selection for details view
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchUserDetails(user._id);
  };
  
  // Handle opening edit modal
  const handleEditClick = (user) => {
    setEditUser({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });
    setIsEditModalOpen(true);
  };
  
  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditUser({
      ...editUser,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle user update
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.put(`/api/admin/users/${editUser._id}`, {
        name: editUser.name,
        email: editUser.email,
        isAdmin: editUser.isAdmin
      });
      
      // Update users list
      setUsers(users.map(user => 
        user._id === editUser._id ? { ...user, ...response.data.data } : user
      ));
      
      // Update selected user if it's the one being edited
      if (selectedUser && selectedUser._id === editUser._id) {
        setSelectedUser({ ...selectedUser, ...response.data.data });
      }
      
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user. Please try again.');
    }
  };
  
  // Handle delete confirmation
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };
  
  // Handle user deletion
  const handleDeleteUser = async () => {
    try {
      await api.delete(`/api/admin/users/${userToDelete._id}`);
      
      // Remove from users list
      setUsers(users.filter(user => user._id !== userToDelete._id));
      
      // Clear selected user if it's the one being deleted
      if (selectedUser && selectedUser._id === userToDelete._id) {
        setSelectedUser(null);
        setUserDetails(null);
      }
      
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user. Please try again.');
    }
  };
  
  // Filter users based on search term
  const filteredUsers = users && users.length > 0 
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">مدیریت کاربران</h2>
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="جستجوی کاربر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="lg:col-span-1 bg-black bg-opacity-40 rounded-xl p-4 border border-gray-800 h-[calc(100vh-250px)] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4 px-2">لیست کاربران</h3>
          
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>کاربری یافت نشد</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map(user => (
                <div 
                  key={user._id} 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                    ${selectedUser && selectedUser._id === user._id 
                      ? 'bg-draugr-900 border border-draugr-700' 
                      : 'hover:bg-gray-900 border border-gray-800'}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-md font-bold ml-3">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-400 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <div>
                    {user.isAdmin && (
                      <span className="bg-draugr-800 text-xs text-draugr-200 px-2 py-1 rounded-full">
                        مدیر
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* User Details */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            isDetailsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-draugr-500"></div>
              </div>
            ) : userDetails ? (
              <div className="bg-black bg-opacity-40 rounded-xl border border-gray-800 overflow-hidden">
                {/* User Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-14 h-14 rounded-full bg-draugr-700 flex items-center justify-center text-xl font-bold ml-4">
                      {selectedUser.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                      <p className="text-gray-400">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(selectedUser)}
                      className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 rounded-lg text-sm transition-colors"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDeleteClick(selectedUser)}
                      className="px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded-lg text-sm transition-colors"
                    >
                      حذف
                    </button>
                  </div>
                </div>
                
                {/* User Info */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-900/30 p-4 rounded-lg">
                      <h4 className="text-gray-400 text-sm mb-1">شناسه کاربر</h4>
                      <p dir="ltr" className="font-mono text-sm">{selectedUser._id}</p>
                    </div>
                    <div className="bg-gray-900/30 p-4 rounded-lg">
                      <h4 className="text-gray-400 text-sm mb-1">تاریخ عضویت</h4>
                      <p>{new Date(selectedUser.createdAt).toLocaleDateString('fa-IR')}</p>
                    </div>
                    <div className="bg-gray-900/30 p-4 rounded-lg">
                      <h4 className="text-gray-400 text-sm mb-1">وضعیت</h4>
                      <p>
                        {selectedUser.isAdmin ? (
                          <span className="text-draugr-500 font-medium">مدیر سیستم</span>
                        ) : (
                          <span className="text-green-500 font-medium">کاربر عادی</span>
                        )}
                      </p>
                    </div>
                    <div className="bg-gray-900/30 p-4 rounded-lg">
                      <h4 className="text-gray-400 text-sm mb-1">تعداد سفارشات</h4>
                      <p>{userDetails.orders.length} سفارش</p>
                    </div>
                  </div>
                  
                  {/* Orders */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3">سفارشات اخیر</h3>
                    {userDetails.orders.length === 0 ? (
                      <div className="text-center py-4 bg-gray-900/30 rounded-lg">
                        <p className="text-gray-400">این کاربر هنوز سفارشی ثبت نکرده است</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-800 text-gray-400">
                              <th className="text-right py-3 px-2 text-sm">شناسه</th>
                              <th className="text-right py-3 px-2 text-sm">تاریخ</th>
                              <th className="text-right py-3 px-2 text-sm">وضعیت</th>
                              <th className="text-right py-3 px-2 text-sm">مبلغ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userDetails.orders.slice(0, 5).map(order => (
                              <tr key={order._id} className="border-b border-gray-800 hover:bg-gray-900">
                                <td className="py-3 px-2">
                                  <span className="text-sm">#{order._id.substring(0, 6)}</span>
                                </td>
                                <td className="py-3 px-2">
                                  <span className="text-sm">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</span>
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
                                  <span className="text-sm">{order.totalPrice.toLocaleString()} تومان</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  
                  {/* Wishlist */}
                  <div>
                    <h3 className="text-lg font-bold mb-3">علاقه‌مندی‌ها</h3>
                    {userDetails.wishlist.length === 0 ? (
                      <div className="text-center py-4 bg-gray-900/30 rounded-lg">
                        <p className="text-gray-400">این کاربر هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده است</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userDetails.wishlist.map(product => (
                          <div key={product._id} className="bg-gray-900/30 rounded-lg p-3 flex items-center">
                            <div className="w-12 h-12 bg-gray-800 rounded-lg mr-3 flex-shrink-0"></div>
                            <div className="overflow-hidden">
                              <p className="font-medium truncate">{product.name}</p>
                              <p className="text-gray-400 text-sm" dir="ltr">{product.price.toLocaleString()} تومان</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-black bg-opacity-40 rounded-xl border border-gray-800 p-8 text-center">
                <p className="text-gray-400">اطلاعات کاربر در دسترس نیست</p>
              </div>
            )
          ) : (
            <div className="bg-black bg-opacity-40 rounded-xl border border-gray-800 p-8 text-center">
              <p className="text-gray-400">برای مشاهده جزئیات، یک کاربر را انتخاب کنید</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-xl max-w-md w-full" dir="rtl">
            <div className="border-b border-gray-800 p-4">
              <h3 className="text-xl font-bold">ویرایش کاربر</h3>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6">
              <div className="mb-4">
                <label className="block text-gray-400 mb-1 text-sm">نام کاربر</label>
                <input
                  type="text"
                  name="name"
                  value={editUser.name}
                  onChange={handleEditChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 mb-1 text-sm">ایمیل</label>
                <input
                  type="email"
                  name="email"
                  value={editUser.email}
                  onChange={handleEditChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAdmin"
                    checked={editUser.isAdmin}
                    onChange={handleEditChange}
                    className="rounded text-draugr-500 focus:ring-draugr-500 h-5 w-5 bg-gray-800 border-gray-700"
                  />
                  <span className="mr-2">دسترسی مدیر سیستم</span>
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-draugr-700 hover:bg-draugr-600 rounded-lg transition-colors"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-xl max-w-md w-full" dir="rtl">
            <div className="border-b border-gray-800 p-4">
              <h3 className="text-xl font-bold text-red-500">حذف کاربر</h3>
            </div>
            <div className="p-6">
              <p className="mb-6">آیا از حذف کاربر <span className="font-bold">{userToDelete.name}</span> اطمینان دارید؟ این عملیات غیرقابل بازگشت است.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg transition-colors"
                >
                  حذف کاربر
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers; 