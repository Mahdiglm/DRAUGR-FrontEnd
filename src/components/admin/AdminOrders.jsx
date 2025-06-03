import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isOrderDetailsLoading, setIsOrderDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  
  // Status options
  const statusOptions = [
    'در انتظار پرداخت',
    'در حال پردازش',
    'ارسال شده',
    'تحویل شده',
    'لغو شده'
  ];
  
  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // This should be replaced with the actual admin orders endpoint
        const response = await api.get('/api/admin/orders');
        setOrders(response.data.data || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
        setIsLoading(false);
        
        // For development - sample data
        if (process.env.NODE_ENV === 'development') {
          const sampleOrders = Array(10).fill().map((_, i) => ({
            _id: `order${i+1}`,
            user: { name: `کاربر ${i+1}`, email: `user${i+1}@example.com`, _id: `user${i+1}` },
            totalPrice: Math.floor(Math.random() * 500000) + 100000,
            items: Array(Math.floor(Math.random() * 4) + 1).fill().map((_, j) => ({
              _id: `product${j+1}`,
              name: `محصول ${j+1}`,
              price: Math.floor(Math.random() * 100000) + 10000,
              quantity: Math.floor(Math.random() * 3) + 1
            })),
            status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
            shippingAddress: {
              address: `آدرس ${i+1}`,
              city: 'تهران',
              postalCode: `1${i}${i+1}${i+2}${i+3}${i+4}`
            }
          }));
          
          setOrders(sampleOrders);
          setIsLoading(false);
        }
      }
    };
    
    fetchOrders();
  }, []);
  
  // Fetch order details
  const fetchOrderDetails = async (orderId) => {
    try {
      setIsOrderDetailsLoading(true);
      // This should be replaced with the actual API endpoint
      const response = await api.get(`/api/admin/orders/${orderId}`);
      setOrderDetails(response.data.data);
      setIsOrderDetailsLoading(false);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setIsOrderDetailsLoading(false);
      
      // For development - find the order in the current list
      if (process.env.NODE_ENV === 'development') {
        const order = orders.find(o => o._id === orderId);
        if (order) {
          setOrderDetails(order);
        }
        setIsOrderDetailsLoading(false);
      }
    }
  };
  
  // Handle order selection
  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    fetchOrderDetails(order._id);
  };
  
  // Handle status update modal
  const handleUpdateStatusClick = (orderId, currentStatus) => {
    setCurrentOrderId(orderId);
    setNewStatus(currentStatus);
    setIsUpdateModalOpen(true);
  };
  
  // Handle status update
  const handleUpdateStatus = async () => {
    try {
      // This should be replaced with the actual API endpoint
      await api.put(`/api/admin/orders/${currentOrderId}/status`, { status: newStatus });
      
      // Update orders in state
      setOrders(orders.map(order => 
        order._id === currentOrderId ? { ...order, status: newStatus } : order
      ));
      
      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder._id === currentOrderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
        setOrderDetails({ ...orderDetails, status: newStatus });
      }
      
      setIsUpdateModalOpen(false);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
      
      // For development
      if (process.env.NODE_ENV === 'development') {
        // Update orders in state
        setOrders(orders.map(order => 
          order._id === currentOrderId ? { ...order, status: newStatus } : order
        ));
        
        // Update selected order if it's the one being updated
        if (selectedOrder && selectedOrder._id === currentOrderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
          setOrderDetails({ ...orderDetails, status: newStatus });
        }
        
        setIsUpdateModalOpen(false);
      }
    }
  };
  
  // Filter orders based on search term and status filter
  const filteredOrders = orders && orders.length > 0 
    ? orders.filter(order => {
        const matchesSearch = (
          order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.user?.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.user?.email && order.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
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
        <h2 className="text-2xl font-bold">مدیریت سفارشات</h2>
        <div className="w-full md:w-1/2 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="جستجوی سفارش..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
          >
            <option value="all">همه وضعیت‌ها</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-1 bg-black bg-opacity-40 rounded-xl p-4 border border-gray-800 h-[calc(100vh-250px)] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4 px-2">لیست سفارشات</h3>
          
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>سفارشی یافت نشد</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredOrders.map(order => (
                <div 
                  key={order._id} 
                  className={`flex flex-col p-3 rounded-lg cursor-pointer transition-colors
                    ${selectedOrder && selectedOrder._id === order._id 
                      ? 'bg-draugr-900 border border-draugr-700' 
                      : 'hover:bg-gray-900 border border-gray-800'}`}
                  onClick={() => handleOrderSelect(order)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium"># {typeof order._id === 'string' ? order._id.substring(0, 6) : order._id}</p>
                      <p className="text-gray-400 text-xs">{order.user?.name || 'کاربر ناشناس'}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${order.status === 'تحویل شده' ? 'bg-green-900/40 text-green-200 border border-green-700' : 
                        order.status === 'در حال پردازش' ? 'bg-blue-900/40 text-blue-200 border border-blue-700' :
                        order.status === 'ارسال شده' ? 'bg-purple-900/40 text-purple-200 border border-purple-700' :
                        order.status === 'لغو شده' ? 'bg-red-900/40 text-red-200 border border-red-700' :
                        'bg-yellow-900/40 text-yellow-200 border border-yellow-700'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</p>
                    <p className="text-xs" dir="ltr">{(order.totalPrice || 0).toLocaleString()} تومان</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Order Details */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            isOrderDetailsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-draugr-500"></div>
              </div>
            ) : orderDetails ? (
              <div className="bg-black bg-opacity-40 rounded-xl border border-gray-800 overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-xl font-bold">سفارش #{typeof orderDetails._id === 'string' ? orderDetails._id.substring(0, 6) : orderDetails._id}</h3>
                        <span className={`mr-3 px-2 py-1 rounded-full text-xs font-medium
                          ${orderDetails.status === 'تحویل شده' ? 'bg-green-900/40 text-green-200 border border-green-700' : 
                            orderDetails.status === 'در حال پردازش' ? 'bg-blue-900/40 text-blue-200 border border-blue-700' :
                            orderDetails.status === 'ارسال شده' ? 'bg-purple-900/40 text-purple-200 border border-purple-700' :
                            orderDetails.status === 'لغو شده' ? 'bg-red-900/40 text-red-200 border border-red-700' :
                            'bg-yellow-900/40 text-yellow-200 border border-yellow-700'
                          }`}>
                          {orderDetails.status}
                        </span>
                      </div>
                      <p className="text-gray-400 mt-1">تاریخ سفارش: {new Date(orderDetails.createdAt).toLocaleDateString('fa-IR')}</p>
                    </div>
                    <button
                      onClick={() => handleUpdateStatusClick(orderDetails._id, orderDetails.status)}
                      className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 rounded-lg text-sm transition-colors"
                    >
                      تغییر وضعیت
                    </button>
                  </div>
                </div>
                
                {/* Customer Info */}
                <div className="p-6 border-b border-gray-800">
                  <h4 className="text-lg font-bold mb-3">اطلاعات مشتری</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-900/30 p-3 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">نام</p>
                      <p>{orderDetails.user?.name || 'نامشخص'}</p>
                    </div>
                    <div className="bg-gray-900/30 p-3 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">ایمیل</p>
                      <p>{orderDetails.user?.email || 'نامشخص'}</p>
                    </div>
                    <div className="bg-gray-900/30 p-3 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">آدرس</p>
                      <p>{orderDetails.shippingAddress?.address || 'نامشخص'}</p>
                    </div>
                    <div className="bg-gray-900/30 p-3 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">کدپستی</p>
                      <p dir="ltr">{orderDetails.shippingAddress?.postalCode || 'نامشخص'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="p-6 border-b border-gray-800">
                  <h4 className="text-lg font-bold mb-3">اقلام سفارش</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800 text-gray-400">
                          <th className="text-right py-3 px-2 text-sm">محصول</th>
                          <th className="text-right py-3 px-2 text-sm">قیمت واحد</th>
                          <th className="text-right py-3 px-2 text-sm">تعداد</th>
                          <th className="text-right py-3 px-2 text-sm">جمع</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetails.items && orderDetails.items.map((item, index) => (
                          <tr key={index} className="border-b border-gray-800 hover:bg-gray-900">
                            <td className="py-3 px-2">
                              <span className="font-medium">{item.name}</span>
                            </td>
                            <td className="py-3 px-2" dir="ltr">
                              <span>{item.price.toLocaleString()} تومان</span>
                            </td>
                            <td className="py-3 px-2">
                              <span>{item.quantity}</span>
                            </td>
                            <td className="py-3 px-2" dir="ltr">
                              <span>{(item.price * item.quantity).toLocaleString()} تومان</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="p-6">
                  <h4 className="text-lg font-bold mb-3">خلاصه سفارش</h4>
                  <div className="bg-gray-900/30 p-4 rounded-lg">
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span>مجموع اقلام</span>
                      <span dir="ltr">{orderDetails.totalPrice.toLocaleString()} تومان</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span>هزینه ارسال</span>
                      <span>رایگان</span>
                    </div>
                    <div className="flex justify-between py-2 text-lg font-bold">
                      <span>مبلغ قابل پرداخت</span>
                      <span dir="ltr">{orderDetails.totalPrice.toLocaleString()} تومان</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-black bg-opacity-40 rounded-xl border border-gray-800 p-8 text-center">
                <p className="text-gray-400">اطلاعات سفارش در دسترس نیست</p>
              </div>
            )
          ) : (
            <div className="bg-black bg-opacity-40 rounded-xl border border-gray-800 p-8 text-center">
              <p className="text-gray-400">برای مشاهده جزئیات، یک سفارش را انتخاب کنید</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Update Status Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-xl max-w-md w-full" dir="rtl">
            <div className="border-b border-gray-800 p-4">
              <h3 className="text-xl font-bold">تغییر وضعیت سفارش</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">وضعیت جدید</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 bg-draugr-700 hover:bg-draugr-600 rounded-lg transition-colors"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders; 