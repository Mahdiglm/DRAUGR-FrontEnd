// Base API configuration for the Draugr Shop frontend

// API Base URL - use environment variable in production, fallback to local dev server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://draugr-backend.onrender.com';

// Flag to track backend availability
let isBackendAvailable = true;
let lastCheckTime = 0;
const AVAILABILITY_CHECK_INTERVAL = 60000; // Check backend availability every minute

// Initialize global state
if (!window.draugr) {
  window.draugr = {};
}
window.draugr.usingMockData = false;

// Helper for handling API responses and errors consistently
const handleResponse = async (response) => {
  try {
    // First check for unauthorized response
    if (response.status === 401) {
      throw new Error('عدم دسترسی: نیاز به ورود مجدد به سیستم دارید');
    }
    
    // Try to parse JSON response
    const text = await response.text();
    let data = {};
    
    // Only try to parse if there's actual content
    if (text && text.trim()) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing API response:', parseError);
        throw new Error('خطا در دریافت پاسخ از سرور');
      }
    }
    
    if (!response.ok) {
      // Translate common error messages to Persian
      let errorMessage = data.message || data.error || response.statusText;
      
      // Common error message translations
      const errorTranslations = {
        'Email is already registered': 'این ایمیل قبلاً در سیستم ثبت شده است',
        'Email already registered': 'این ایمیل قبلاً در سیستم ثبت شده است',
        'Invalid credentials': 'نام کاربری یا رمز عبور نادرست است',
        'User not found': 'کاربر یافت نشد',
        'Invalid password': 'رمز عبور نادرست است',
        'Email is required': 'ایمیل الزامی است',
        'Password is required': 'رمز عبور الزامی است',
        'Unauthorized': 'عدم دسترسی: لطفا مجددا وارد شوید',
        'Invalid token': 'نشست شما منقضی شده است، لطفاً دوباره وارد شوید',
        'Password too weak': 'رمز عبور انتخاب شده ضعیف است',
        'Invalid email format': 'فرمت ایمیل نادرست است',
        'Not Found': 'یافت نشد',
        'Internal Server Error': 'خطای داخلی سرور'
      };
      
      // Check for exact matches
      if (errorTranslations[errorMessage]) {
        errorMessage = errorTranslations[errorMessage];
      } else {
        // Check for partial matches
        for (const [engText, persianText] of Object.entries(errorTranslations)) {
          if (errorMessage.toLowerCase().includes(engText.toLowerCase())) {
            errorMessage = persianText;
            break;
          }
        }
      }
      
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    // Re-throw the error with the original message
    throw error;
  }
};

// Get JWT token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper function to update app status (online/offline)
const updateMockDataStatus = (isMockData) => {
  if (window.draugr.usingMockData !== isMockData) {
    window.draugr.usingMockData = isMockData;
    
    // Dispatch custom event
    const event = new CustomEvent('draugr-api-status', {
      detail: { usingMockData: isMockData }
    });
    
    window.dispatchEvent(event);
  }
};

// Check if backend is available
const checkBackendAvailability = async () => {
  // Only check occasionally to avoid excessive requests
  const now = Date.now();
  if (now - lastCheckTime < AVAILABILITY_CHECK_INTERVAL) {
    return isBackendAvailable;
  }
  
  lastCheckTime = now;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    isBackendAvailable = response.ok;
    
    // Update global mock data status
    updateMockDataStatus(!isBackendAvailable);
    
    return isBackendAvailable;
  } catch (error) {
    console.warn('Backend health check failed:', error.message);
    isBackendAvailable = false;
    
    // Update global mock data status
    updateMockDataStatus(true);
    
    return false;
  }
};

// Get mock data for offline development/when backend is down
const getMockData = (endpoint) => {
  // Set global status to indicate we're using mock data
  updateMockDataStatus(true);
  
  // Extract the resource type from the endpoint
  const path = endpoint.split('?')[0];
  
  if (path === '/api/products' || path === '/api/products/featured') {
    // Return data in the same structure as the backend API
    // Check if it's a featured products request
    if (path === '/api/products/featured') {
      return [
        { id: 1, name: 'شمشیر جادویی (داده محلی)', price: 250, category: { id: 1, name: 'سلاح‌ها', slug: 'weapons' }, imageUrl: '/images/placeholder-product.jpg', featured: true, discount: 10 },
        { id: 3, name: 'معجون سلامتی (داده محلی)', price: 100, category: { id: 3, name: 'معجون‌ها', slug: 'potions' }, imageUrl: '/images/placeholder-product.jpg', featured: true, discount: 15 }
      ];
    }
    
    // Regular product list with pagination support
    return [
      { id: 1, name: 'شمشیر جادویی (داده محلی)', price: 250, category: { id: 1, name: 'سلاح‌ها', slug: 'weapons' }, imageUrl: '/images/placeholder-product.jpg' },
      { id: 2, name: 'زره الماس (داده محلی)', price: 500, category: { id: 2, name: 'زره‌ها', slug: 'armor' }, imageUrl: '/images/placeholder-product.jpg' },
      { id: 3, name: 'معجون سلامتی (داده محلی)', price: 100, category: { id: 3, name: 'معجون‌ها', slug: 'potions' }, imageUrl: '/images/placeholder-product.jpg' },
      { id: 4, name: 'کتاب جادویی (داده محلی)', price: 300, category: { id: 4, name: 'اقلام جادویی', slug: 'magic' }, imageUrl: '/images/placeholder-product.jpg' },
      { id: 5, name: 'تبر جنگی (داده محلی)', price: 280, category: { id: 1, name: 'سلاح‌ها', slug: 'weapons' }, imageUrl: '/images/placeholder-product.jpg' },
      { id: 6, name: 'زره چرمی (داده محلی)', price: 220, category: { id: 2, name: 'زره‌ها', slug: 'armor' }, imageUrl: '/images/placeholder-product.jpg' },
      { id: 7, name: 'معجون قدرت (داده محلی)', price: 120, category: { id: 3, name: 'معجون‌ها', slug: 'potions' }, imageUrl: '/images/placeholder-product.jpg' },
      { id: 8, name: 'سنگ جادویی (داده محلی)', price: 350, category: { id: 4, name: 'اقلام جادویی', slug: 'magic' }, imageUrl: '/images/placeholder-product.jpg' }
    ];
  }
  
  if (path.startsWith('/api/products/')) {
    const id = parseInt(path.split('/').pop());
    return {
      id,
      name: `محصول شماره ${id} (داده محلی)`,
      price: 100 + (id * 50),
      description: 'توضیحات موقت برای زمانی که سرور در دسترس نیست',
      category: { id: 1, name: 'دسته‌بندی نامشخص' },
      imageUrl: '/images/placeholder-product.jpg'
    };
  }
  
  if (path === '/api/categories') {
    return [
      { id: 1, name: 'سلاح‌ها', slug: 'weapons' },
      { id: 2, name: 'زره‌ها', slug: 'armor' },
      { id: 3, name: 'معجون‌ها', slug: 'potions' },
      { id: 4, name: 'اقلام جادویی', slug: 'magic' }
    ];
  }
  
  if (path === '/api/cart') {
    return { items: [] };
  }
  
  // Default fallback for other endpoints
  return { message: 'داده موقت - سرور در دسترس نیست' };
};

// API request methods with authentication handling
export const api = {
  // GET request
  async get(endpoint) {
    try {
      // Check if backend is available
      const backendAvailable = await checkBackendAvailability();
      
      if (!backendAvailable) {
        console.warn(`Backend unavailable, using mock data for: ${endpoint}`);
        return getMockData(endpoint);
      }
      
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });
      
      // Update status to indicate we're using real data
      updateMockDataStatus(false);
      
      return handleResponse(response);
    } catch (error) {
      // For network errors or CORS issues, use mock data
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.warn(`Network error accessing API, using mock data for: ${endpoint}`);
        return getMockData(endpoint);
      }
      throw error;
    }
  },
  
  // POST request
  async post(endpoint, body) {
    try {
      // Check if backend is available
      const backendAvailable = await checkBackendAvailability();
      
      if (!backendAvailable) {
        console.warn(`Backend unavailable, using mock response for: ${endpoint}`);
        
        // For cart operations, we can't mock completely but can return empty success
        if (endpoint.includes('/api/cart')) {
          return { items: [], message: 'سرور در دسترس نیست، عملیات به صورت محلی انجام شد' };
        }
        
        return { success: true, message: 'عملیات به صورت آزمایشی انجام شد - سرور در دسترس نیست' };
      }
      
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      
      // Update status to indicate we're using real data
      updateMockDataStatus(false);
      
      return handleResponse(response);
    } catch (error) {
      // For network errors or CORS issues, use mock response
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.warn(`Network error accessing API, using mock response for: ${endpoint}`);
        
        // For cart operations, return empty success
        if (endpoint.includes('/api/cart')) {
          return { items: [], message: 'سرور در دسترس نیست، عملیات به صورت محلی انجام شد' };
        }
        
        return { success: true, message: 'عملیات به صورت آزمایشی انجام شد - سرور در دسترس نیست' };
      }
      throw error;
    }
  },
  
  // PUT request
  async put(endpoint, body) {
    try {
      // Check if backend is available
      const backendAvailable = await checkBackendAvailability();
      
      if (!backendAvailable) {
        console.warn(`Backend unavailable, using mock response for: ${endpoint}`);
        
        // For cart operations, we can't mock completely but can return empty success
        if (endpoint.includes('/api/cart')) {
          return { items: [], message: 'سرور در دسترس نیست، عملیات به صورت محلی انجام شد' };
        }
        
        return { success: true, message: 'عملیات به صورت آزمایشی انجام شد - سرور در دسترس نیست' };
      }
      
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });
      
      // Update status to indicate we're using real data
      updateMockDataStatus(false);
      
      return handleResponse(response);
    } catch (error) {
      // For network errors or CORS issues, use mock response
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.warn(`Network error accessing API, using mock response for: ${endpoint}`);
        
        // For cart operations, return empty success
        if (endpoint.includes('/api/cart')) {
          return { items: [], message: 'سرور در دسترس نیست، عملیات به صورت محلی انجام شد' };
        }
        
        return { success: true, message: 'عملیات به صورت آزمایشی انجام شد - سرور در دسترس نیست' };
      }
      throw error;
    }
  },
  
  // DELETE request
  async delete(endpoint) {
    try {
      // Check if backend is available
      const backendAvailable = await checkBackendAvailability();
      
      if (!backendAvailable) {
        console.warn(`Backend unavailable, using mock response for: ${endpoint}`);
        
        // For cart operations, we can't mock completely but can return empty success
        if (endpoint.includes('/api/cart')) {
          return { items: [], message: 'سرور در دسترس نیست، عملیات به صورت محلی انجام شد' };
        }
        
        return { success: true, message: 'عملیات به صورت آزمایشی انجام شد - سرور در دسترس نیست' };
      }
      
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });
      
      // Update status to indicate we're using real data
      updateMockDataStatus(false);
      
      return handleResponse(response);
    } catch (error) {
      // For network errors or CORS issues, use mock response
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.warn(`Network error accessing API, using mock response for: ${endpoint}`);
        
        // For cart operations, return empty success
        if (endpoint.includes('/api/cart')) {
          return { items: [], message: 'سرور در دسترس نیست، عملیات به صورت محلی انجام شد' };
        }
        
        return { success: true, message: 'عملیات به صورت آزمایشی انجام شد - سرور در دسترس نیست' };
      }
      throw error;
    }
  }
};

export default api; 