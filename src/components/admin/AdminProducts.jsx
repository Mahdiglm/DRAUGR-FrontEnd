import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import { getProductImageUrl } from '../../utils/assetUtils';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [shopFilter, setShopFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    price: 0,
    images: [],
    category: '',
    countInStock: 0,
    features: [],
    customPageContent: '',
    sale: {
      isSale: false,
      salePrice: 0
    },
    isShopConnected: true
  });
  const [featureInput, setFeatureInput] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // New function to check existing product format
  const checkExistingProductFormat = () => {
    if (products && products.length > 0) {
      console.log('Existing product format:', products[0]);
      return products[0];
    }
    return null;
  };
  
  // Function to check if categories are loaded before using them
  const getCategoryName = (categoryId) => {
    if (!categories || categories.length === 0) {
      return 'نامشخص';
    }
    const category = categories.find(c => c._id === categoryId);
    return category?.name || 'نامشخص';
  };
  
  // Fetch products and categories
  useEffect(() => {
    // Fetch categories first to avoid undefined error
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        setCategories(response.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]); // Set as empty array instead of undefined
      }
    };

    fetchCategories();
    
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        // Try direct call to public product API to see all products
        try {
          const response = await fetch('http://localhost:5000/api/products?limit=100');
          const data = await response.json();
          
          // Extract products based on response structure
          let productsData = [];
          if (data && data.data) {
            productsData = data.data;
          } else if (Array.isArray(data)) {
            productsData = data;
          }
          
          if (productsData.length > 0) {
            setProducts(productsData);
            setIsLoading(false);
            return;
          }
        } catch (publicError) {
          console.error('Error with public API:', publicError);
        }
        
        // If public API fails, try the admin endpoint
        const adminResponse = await adminService.getAllProducts(1, 1000);
        
        // Check the structure of the response and extract the correct data
        let productsData = [];
        
        if (adminResponse.data && adminResponse.data.data) {
          // Structure: { data: { data: [...] } }
          productsData = adminResponse.data.data;
        } else if (Array.isArray(adminResponse.data)) {
          // Structure: { data: [...] }
          productsData = adminResponse.data;
        } else if (adminResponse.data) {
          // Structure: { data: { ... } } - check if it's an object with product fields
          if (adminResponse.data._id) {
            productsData = [adminResponse.data];
          }
        }
        
        console.log(`Found ${productsData.length} products from admin API`);
        setProducts(productsData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(`Failed to load products: ${err.message}. Please try again later.`);
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'price' || name === 'countInStock') {
      setCurrentProduct({
        ...currentProduct,
        [name]: parseFloat(value) || 0
      });
    } else if (name === 'salePrice') {
      setCurrentProduct({
        ...currentProduct,
        sale: {
          ...currentProduct.sale,
          salePrice: parseFloat(value) || 0
        }
      });
    } else if (name === 'isSale') {
      setCurrentProduct({
        ...currentProduct,
        sale: {
          ...currentProduct.sale,
          isSale: checked
        }
      });
    } else if (name === 'isShopConnected') {
      setCurrentProduct({
        ...currentProduct,
        isShopConnected: checked
      });
    } else {
      setCurrentProduct({
        ...currentProduct,
        [name]: value
      });
    }
  };
  
  // Handle feature addition
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setCurrentProduct({
        ...currentProduct,
        features: [...(currentProduct.features || []), featureInput.trim()]
      });
      setFeatureInput('');
    }
  };
  
  // Handle feature deletion
  const handleRemoveFeature = (index) => {
    if (!currentProduct.features) return;
    
    setCurrentProduct({
      ...currentProduct,
      features: currentProduct.features.filter((_, i) => i !== index)
    });
  };
  
  // Handle opening the create modal
  const handleCreateClick = () => {
    setCurrentProduct({
      name: '',
      description: '',
      price: 0,
      images: [],
      category: categories && categories.length > 0 ? categories[0]._id : '',
      countInStock: 0,
      features: [],
      customPageContent: '',
      sale: {
        isSale: false,
        salePrice: 0
      },
      isShopConnected: true
    });
    setIsCreateMode(true);
    setIsModalOpen(true);
  };
  
  // Refresh categories and products
  const refreshData = async () => {
    try {
      // First fetch categories
      const categoriesResponse = await api.get('/api/categories');
      setCategories(categoriesResponse.data || []);
      
      // Then fetch products
      const adminResponse = await adminService.getAllProducts(1, 1000);
      console.log('Admin products API response:', adminResponse);
      
      let productsData = [];
      if (adminResponse.data && adminResponse.data.data) {
        productsData = adminResponse.data.data;
      } else if (Array.isArray(adminResponse.data)) {
        productsData = adminResponse.data;
      } else if (adminResponse.data && adminResponse.data._id) {
        productsData = [adminResponse.data];
      }
      
      setProducts(productsData);
    } catch (err) {
      console.error('Error refreshing data:', err);
      toast.error(`خطا در بارگذاری اطلاعات: ${err.message}`);
    }
  };
  
  // Handle opening the edit modal
  const handleEditClick = (product) => {
    // Ensure categories are loaded
    if (!categories || categories.length === 0) {
      refreshData().then(() => {
        setCurrentProduct({
          ...product,
          features: product.features || [],
          images: product.images || [],
          category: product.category || '',
          customPageContent: product.customPageContent || '',
          sale: product.sale || { isSale: false, salePrice: 0 },
          isShopConnected: product.isShopConnected || true
        });
        setIsCreateMode(false);
        setIsModalOpen(true);
      });
    } else {
      setCurrentProduct({
        ...product,
        features: product.features || [],
        images: product.images || [],
        category: product.category || '',
        customPageContent: product.customPageContent || '',
        sale: product.sale || { isSale: false, salePrice: 0 },
        isShopConnected: product.isShopConnected || true
      });
      setIsCreateMode(false);
      setIsModalOpen(true);
    }
  };
  
  // Handle delete confirmation
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Make sure category is included
      if (!currentProduct.category && categories && categories.length > 0) {
        setCurrentProduct({
          ...currentProduct,
          category: categories[0]._id
        });
      }
      
      // Prepare the product data for submission
      const productData = {
        ...currentProduct,
        // Ensure category is properly set
        category: currentProduct.category || (categories && categories.length > 0 ? categories[0]._id : '')
      };
      
      let response;
      
      if (isCreateMode) {
        response = await adminService.createProduct(productData);
        setProducts([response.data.data, ...products]);
      } else {
        response = await adminService.updateProduct(currentProduct._id, productData);
        setProducts(products.map(product => 
          product._id === currentProduct._id ? response.data.data : product
        ));
      }
      
      toast.success(`محصول با موفقیت ${isCreateMode ? 'ایجاد' : 'ویرایش'} شد.`);
      setIsModalOpen(false);
      
      // Notify other components that product data with categories has changed
      notifyCategoryChanges();
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error(`خطا در ${isCreateMode ? 'ایجاد' : 'ویرایش'} محصول`);
    }
  };
  
  // Handle product deletion
  const handleDeleteConfirm = async () => {
    try {
      await adminService.deleteProduct(productToDelete._id);
      setProducts(products.filter(product => product._id !== productToDelete._id));
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
      toast.success('محصول با موفقیت حذف شد.');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('خطا در حذف محصول');
    }
  };
  
  // Filter products based on search term, category filter, and shop connection filter
  const filteredProducts = products && products.length > 0 
    ? products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = categoryFilter === 'all' || 
                               product.category === categoryFilter ||
                               (product.category?._id && product.category._id === categoryFilter);
        
        const matchesShopFilter = 
          shopFilter === 'all' || 
          (shopFilter === 'connected' && product.isShopConnected) || 
          (shopFilter === 'disconnected' && !product.isShopConnected);
        
        return matchesSearch && matchesCategory && matchesShopFilter;
      })
    : [];
  
  // Handle adding new image
  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setCurrentProduct({
        ...currentProduct,
        images: [
          ...(currentProduct.images || []),
          { url: newImageUrl.trim(), alt: currentProduct.name }
        ]
      });
      setNewImageUrl('');
    }
  };
  
  // Handle removing image
  const handleRemoveImage = (index) => {
    if (!currentProduct.images) return;
    
    setCurrentProduct({
      ...currentProduct,
      images: currentProduct.images.filter((_, i) => i !== index)
    });
  };
  
  // Function to get product image URL
  const getProductImage = (product) => {
    try {
    
      // First check for images array
      if (product.images && product.images.length > 0) {
        if (typeof product.images[0] === 'object' && product.images[0].url) {
          return product.images[0].url;
        } else if (typeof product.images[0] === 'string') {
          return product.images[0];
        }
      }
      
      // Then check for imageUrl field
      if (product.imageUrl) {
        return product.imageUrl;
      }
      
      // If product name is available, try to generate a URL based on name
      if (product.name) {
        const imageName = product.name.toLowerCase().replace(/\s+/g, '_');
        return getProductImageUrl(`${imageName}.jpg`);
      }
      
      // Fallback to a placeholder
      return "https://via.placeholder.com/100x100/1a1a1a/666666?text=تصویر";
    } catch (error) {
      console.error('Error getting product image:', error);
      return "https://via.placeholder.com/100x100/1a1a1a/666666?text=خطا";
    }
  };
  
  // Watch for category updates from other admin sections
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'categoriesUpdated') {
        console.log('Categories were updated in another component, refreshing data');
        refreshData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Store successful changes to localStorage to trigger updates in other components
  const notifyCategoryChanges = () => {
    localStorage.setItem('categoriesUpdated', Date.now().toString());
  };
  
  // Handle shop connection toggle
  const handleToggleShopConnection = async (product) => {
    try {
      const updatedProduct = {
        ...product,
        isShopConnected: !product.isShopConnected
      };
      
      const response = await adminService.updateProduct(product._id, updatedProduct);
      
      if (response.data && response.data.data) {
        // Update product in the list
        setProducts(products.map(p => 
          p._id === product._id ? response.data.data : p
        ));
        
        toast.success(`محصول ${updatedProduct.isShopConnected ? 'به فروشگاه اضافه' : 'از فروشگاه حذف'} شد.`);
      }
    } catch (err) {
      console.error('Error toggling shop connection:', err);
      toast.error('خطا در تغییر وضعیت نمایش محصول');
    }
  };
  
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">مدیریت محصولات</h2>
        <div className="flex gap-2">
          <Link 
            to="/admin/categories" 
            className="px-4 py-2 bg-purple-800 hover:bg-purple-700 rounded-lg shadow-sm transition-colors"
          >
            مدیریت دسته‌بندی‌ها
          </Link>
          <Link 
            to="/shop" 
            target="_blank" 
            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg shadow-sm transition-colors"
          >
            مشاهده فروشگاه
          </Link>
          <button 
            onClick={refreshData}
            className="px-4 py-2 bg-green-800 hover:bg-green-700 rounded-lg shadow-sm transition-colors"
            title="بارگذاری مجدد اطلاعات"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button 
            onClick={async () => {
              try {
                setIsLoading(true);
                
                // Try all possible product APIs to get the actual count
                const apis = [
                  'http://localhost:5000/api/products?limit=1000',
                  'http://localhost:5000/api/admin/products?page=1&pageSize=1000',
                  'http://localhost:5000/api/products/all'
                ];
                
                let maxProducts = [];
                
                for (const apiUrl of apis) {
                  try {
                    const response = await fetch(apiUrl, {
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                      }
                    });
                    const data = await response.json();
                    console.log(`API ${apiUrl} response:`, data);
                    
                    let productsFromApi = [];
                    if (data && data.data) {
                      productsFromApi = data.data;
                    } else if (Array.isArray(data)) {
                      productsFromApi = data;
                    }
                    
                    if (productsFromApi.length > maxProducts.length) {
                      maxProducts = productsFromApi;
                      console.log(`Found ${productsFromApi.length} products from ${apiUrl}`);
                    }
                  } catch (apiError) {
                    console.error(`Error with ${apiUrl}:`, apiError);
                  }
                }
                
                if (maxProducts.length > 0) {
                  setProducts(maxProducts);
                  toast.success(`نمایش ${maxProducts.length} محصول`);
                } else {
                  toast.error("هیچ محصولی یافت نشد");
                }
              } catch (error) {
                console.error('Error:', error);
                toast.error(`خطا: ${error.message}`);
              } finally {
                setIsLoading(false);
              }
            }}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg shadow-sm transition-colors"
          >
            نمایش همه محصولات
          </button>
          <button 
            onClick={handleCreateClick}
            className="px-4 py-2 bg-draugr-600 hover:bg-draugr-500 rounded-lg shadow-sm transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            افزودن محصول جدید
          </button>
          <button 
            onClick={async () => {
              try {
                setIsLoading(true);
                
                // Check if categories exist
                let categoryId;
                if (!categories || categories.length === 0) {
                  // Create a new category first
                  try {
                    const token = localStorage.getItem('token');
                    const timestamp = Date.now();
                    
                    const categoryData = {
                      name: `دسته‌بندی تست ${timestamp}`,
                      description: "دسته‌بندی آزمایشی برای محصولات تست",
                      image: "http://localhost:5000/static/images/products/category_default.jpg"
                    };
                    
                    const catResponse = await fetch('http://localhost:5000/api/categories', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify(categoryData)
                    });
                    
                    if (!catResponse.ok) {
                      throw new Error("خطا در ایجاد دسته‌بندی");
                    }
                    
                    const newCategory = await catResponse.json();
                    categoryId = newCategory._id;
                    
                    // Update categories state
                    setCategories([newCategory]);
                    
                    toast.success("دسته‌بندی تست ایجاد شد");
                  } catch (catError) {
                    console.error("Error creating category:", catError);
                    toast.error(`خطا در ایجاد دسته‌بندی: ${catError.message}`);
                    setIsLoading(false);
                    return;
                  }
                } else {
                  categoryId = categories[0]._id;
                }
                
                // Timestamp to make the product unique
                const timestamp = Date.now();
                
                // Create a product with EXACTLY the fields the backend route uses
                const testProduct = {
                  name: `محصول تست ${timestamp}`,
                  slug: `test-product-${timestamp}`,
                  description: "این یک محصول تست است",
                  price: 150,
                  category: categoryId,
                  countInStock: 50,
                  stock: 50,
                  imageUrl: "http://localhost:5000/static/images/products/Product_1.jpg",
                  images: [
                    {
                      url: "http://localhost:5000/static/images/products/Product_1.jpg",
                      alt: "تصویر محصول تست"
                    }
                  ],
                  features: ["ویژگی تست ۱", "ویژگی تست ۲"],
                  sale: {
                    isSale: false,
                    salePrice: 0
                  },
                  isShopConnected: true
                };
                
                // Log the exact product we're sending
                console.log("Trying to create product with:", JSON.stringify(testProduct, null, 2));
                
                try {
                  // Modify the createProduct method to use fetch directly just for this test
                  const token = localStorage.getItem('token');
                  if (!token) {
                    toast.error("شما مجوز لازم را ندارید");
                    setIsLoading(false);
                    return;
                  }

                  const response = await fetch('http://localhost:5000/api/admin/products', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(testProduct)
                  });
                  
                  const data = await response.json();
                  console.log("Raw API response:", data);
                  
                  if (!response.ok) {
                    throw new Error(data.message || "خطا در ایجاد محصول");
                  }
                  
                  toast.success("محصول تست با موفقیت ایجاد شد");
                  
                  // Refresh product list
                  await refreshData();
                } catch (err) {
                  console.error("Error in product creation:", err);
                  toast.error(`خطا در ایجاد محصول: ${err.message}`);
                }
                
              } catch (error) {
                console.error('Error in test flow:', error);
                toast.error(`خطا: ${error.message}`);
              } finally {
                setIsLoading(false);
              }
            }}
            className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg shadow-sm transition-colors"
          >
            ایجاد محصول آزمایشی
          </button>
        </div>
      </div>
      
      <div className="bg-black bg-opacity-40 rounded-xl border border-gray-800 p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="w-full md:w-1/3 mb-2 md:mb-0">
            <label className="block text-gray-400 mb-1 text-sm">جستجو</label>
            <input 
              type="text"
              placeholder="جستجوی محصول..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500 mb-2"
            />
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center flex-1">
                <label className="block text-gray-400 mr-2 text-sm">دسته‌بندی:</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500 flex-grow"
                >
                  <option value="all">همه دسته‌ها</option>
                  {categories && categories.length > 0 && categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <label className="block text-gray-400 mr-2 text-sm">نمایش:</label>
                <select
                  value={shopFilter}
                  onChange={(e) => setShopFilter(e.target.value)}
                  className="bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                >
                  <option value="all">همه محصولات</option>
                  <option value="connected">فقط محصولات فروشگاه</option>
                  <option value="disconnected">محصولات خارج از فروشگاه</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {products.length === 0 ? (
        <div className="bg-black bg-opacity-40 rounded-xl border border-gray-800 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <p className="text-gray-400">محصولی یافت نشد. برای افزودن محصول جدید روی دکمه "افزودن محصول جدید" کلیک کنید.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-black bg-opacity-40 rounded-xl border border-gray-800 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-400">محصولی با معیارهای جستجوی شما یافت نشد.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="bg-gray-900 text-gray-300 p-3 mb-4 rounded-lg">
            <p>تعداد محصولات یافت شده: {filteredProducts.length}</p>
            <p>تعداد محصولات کل: {products.length}</p>
          </div>
          <table className="w-full bg-black bg-opacity-40 rounded-xl border border-gray-800">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="py-3 px-4 text-right">تصویر</th>
                <th className="py-3 px-4 text-right">نام محصول</th>
                <th className="py-3 px-4 text-right">قیمت</th>
                <th className="py-3 px-4 text-right">موجودی</th>
                <th className="py-3 px-4 text-right">دسته و وضعیت</th>
                <th className="py-3 px-4 text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts && filteredProducts.map(product => (
                <tr key={product._id} className="border-b border-gray-800 hover:bg-gray-900/30">
                  <td className="py-3 px-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden">
                      <img 
                        src={getProductImage(product)}
                        alt={product.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/100x100/1a1a1a/666666?text=تصویر";
                        }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-gray-400 max-w-xs truncate">{product.description}</div>
                    {product._id && <div className="text-xs text-gray-500">ID: {product._id}</div>}
                  </td>
                  <td className="py-3 px-4" dir="ltr">
                    {product.sale && product.sale.isSale ? (
                      <div>
                        <span className="line-through text-gray-500 text-sm">{product.price.toLocaleString()} تومان</span>
                        <span className="block text-draugr-500 font-medium">{product.sale.salePrice.toLocaleString()} تومان</span>
                      </div>
                    ) : (
                      <span>{product.price.toLocaleString()} تومان</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`${product.countInStock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {product.countInStock > 0 ? product.countInStock : 'ناموجود'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs">
                        {getCategoryName(product.category)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${product.isShopConnected ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                        {product.isShopConnected ? 'در فروشگاه' : 'خارج از فروشگاه'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleShopConnection(product)}
                        className={`p-1.5 ${product.isShopConnected ? 'bg-purple-700 hover:bg-purple-600' : 'bg-green-700 hover:bg-green-600'} rounded-lg text-sm transition-colors`}
                        title={product.isShopConnected ? 'حذف از فروشگاه' : 'افزودن به فروشگاه'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={product.isShopConnected ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-1.5 bg-blue-700 hover:bg-blue-600 rounded-lg text-sm transition-colors"
                        title="ویرایش"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="p-1.5 bg-red-700 hover:bg-red-600 rounded-lg text-sm transition-colors"
                        title="حذف"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full" dir="rtl">
            <div className="border-b border-gray-800 p-4">
              <h3 className="text-xl font-bold">
                {isCreateMode ? 'افزودن محصول جدید' : 'ویرایش محصول'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto" id="product-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-400 mb-1 text-sm">نام محصول</label>
                  <input
                    type="text"
                    name="name"
                    value={currentProduct.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-1 text-sm">دسته بندی</label>
                  <select
                    name="category"
                    value={currentProduct.category}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                    required
                  >
                    {categories && categories.length > 0 ? categories.map(category => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    )) : (
                      <option value="">دسته‌بندی‌ها در حال بارگذاری...</option>
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-1 text-sm">قیمت (تومان)</label>
                  <input
                    type="number"
                    name="price"
                    value={currentProduct.price}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-1 text-sm">موجودی</label>
                  <input
                    type="number"
                    name="countInStock"
                    value={currentProduct.countInStock}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-1 text-sm">تصاویر محصول</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="آدرس تصویر را وارد کنید..."
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2 bg-draugr-700 hover:bg-draugr-600 rounded-lg transition-colors"
                    >
                      افزودن
                    </button>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    {currentProduct.images && currentProduct.images.map((image, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded overflow-hidden mr-2">
                            <img 
                              src={image.url}
                              alt={image.alt || "تصویر محصول"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/100x100/1a1a1a/666666?text=تصویر";
                              }}
                            />
                          </div>
                          <span className="truncate max-w-sm">{image.url}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
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
                
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-1 text-sm">توضیحات</label>
                  <textarea
                    name="description"
                    value={currentProduct.description}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500 h-32"
                    required
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="isShopConnected"
                      checked={currentProduct.isShopConnected}
                      onChange={handleInputChange}
                      className="rounded text-green-500 focus:ring-green-500 h-5 w-5 bg-gray-800 border-gray-700 ml-2"
                    />
                    <label className="text-gray-300 font-medium">نمایش در فروشگاه</label>
                    <div className="mr-4 bg-gray-800 px-3 py-1 rounded-lg text-xs text-gray-400">
                      {currentProduct.isShopConnected ? 
                        'این محصول در فروشگاه نمایش داده می‌شود' : 
                        'این محصول در فروشگاه نمایش داده نمی‌شود'}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isSale"
                      checked={currentProduct.sale.isSale}
                      onChange={handleInputChange}
                      className="rounded text-draugr-500 focus:ring-draugr-500 h-5 w-5 bg-gray-800 border-gray-700 ml-2"
                    />
                    <label className="text-gray-400">تخفیف دارد</label>
                    
                    {currentProduct.sale.isSale && (
                      <div className="mr-4">
                        <label className="text-gray-400 mr-2">قیمت با تخفیف (تومان):</label>
                        <input
                          type="number"
                          name="salePrice"
                          value={currentProduct.sale.salePrice}
                          onChange={handleInputChange}
                          className="bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500 w-32"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-1 text-sm">ویژگی‌ها</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="ویژگی جدید را وارد کنید..."
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2 bg-draugr-700 hover:bg-draugr-600 rounded-lg transition-colors"
                    >
                      افزودن
                    </button>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    {currentProduct.features && currentProduct.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
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
                
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-1 text-sm">محتوای اختصاصی صفحه محصول</label>
                  <div className="bg-gray-900 rounded-lg p-2 mb-2">
                    <p className="text-xs text-gray-400 mb-2">
                      در این قسمت می‌توانید متن اختصاصی برای نمایش در صفحه محصول وارد کنید. این متن در بخش "درباره این محصول" نمایش داده خواهد شد.
                    </p>
                  </div>
                  <textarea
                    name="customPageContent"
                    value={currentProduct.customPageContent || ''}
                    onChange={handleInputChange}
                    placeholder="محتوای اختصاصی صفحه محصول را وارد کنید..."
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500 h-40"
                  ></textarea>
                </div>
              </div>
            </form>
            <div className="border-t border-gray-800 p-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg shadow-sm transition-colors ml-2"
              >
                انصراف
              </button>
              <button
                form="product-form"
                type="submit"
                className="px-4 py-2 bg-draugr-600 hover:bg-draugr-500 rounded-lg shadow-sm transition-colors"
              >
                {isCreateMode ? 'ایجاد' : 'ذخیره تغییرات'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6" dir="rtl">
            <h3 className="text-xl font-bold mb-4">تأیید حذف</h3>
            <p className="text-gray-300 mb-6">
              آیا از حذف محصول "{productToDelete?.name}" اطمینان دارید؟ این عملیات قابل بازگشت نیست.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg shadow-sm transition-colors ml-2"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg shadow-sm transition-colors"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts; 