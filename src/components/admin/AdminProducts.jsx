import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    countInStock: 0,
    features: [],
    sale: {
      isSale: false,
      salePrice: 0
    }
  });
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [featureInput, setFeatureInput] = useState('');
  
  // Fetch products and categories
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/products');
        setProducts(response.data || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setIsLoading(false);
      }
    };
    
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        setCategories(response.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    fetchProducts();
    fetchCategories();
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
        features: [...currentProduct.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };
  
  // Handle feature deletion
  const handleRemoveFeature = (index) => {
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
      imageUrl: '',
      category: categories.length > 0 ? categories[0]._id : '',
      countInStock: 0,
      features: [],
      sale: {
        isSale: false,
        salePrice: 0
      }
    });
    setIsCreateMode(true);
    setIsModalOpen(true);
  };
  
  // Handle opening the edit modal
  const handleEditClick = (product) => {
    setCurrentProduct({
      ...product,
      sale: product.sale || { isSale: false, salePrice: 0 }
    });
    setIsCreateMode(false);
    setIsModalOpen(true);
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
      let response;
      
      if (isCreateMode) {
        response = await api.post('/api/admin/products', currentProduct);
        setProducts([response.data.data, ...products]);
      } else {
        response = await api.put(`/api/admin/products/${currentProduct._id}`, currentProduct);
        setProducts(products.map(product => 
          product._id === currentProduct._id ? response.data.data : product
        ));
      }
      
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving product:', err);
      alert(`Failed to ${isCreateMode ? 'create' : 'update'} product. Please try again.`);
    }
  };
  
  // Handle product deletion
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/admin/products/${productToDelete._id}`);
      setProducts(products.filter(product => product._id !== productToDelete._id));
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };
  
  // Filter products based on search term and category filter
  const filteredProducts = products && products.length > 0 
    ? products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
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
        <h2 className="text-2xl font-bold">مدیریت محصولات</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-draugr-700 hover:bg-draugr-600 rounded-lg transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            افزودن محصول جدید
          </button>
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              placeholder="جستجوی محصول..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
            >
              <option value="all">همه دسته‌ها</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="bg-black bg-opacity-40 rounded-xl border border-gray-800 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <p className="text-gray-400">محصولی یافت نشد. برای افزودن محصول جدید روی دکمه "افزودن محصول جدید" کلیک کنید.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-black bg-opacity-40 rounded-xl border border-gray-800">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="py-3 px-4 text-right">تصویر</th>
                <th className="py-3 px-4 text-right">نام محصول</th>
                <th className="py-3 px-4 text-right">قیمت</th>
                <th className="py-3 px-4 text-right">موجودی</th>
                <th className="py-3 px-4 text-right">دسته</th>
                <th className="py-3 px-4 text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id} className="border-b border-gray-800 hover:bg-gray-900/30">
                  <td className="py-3 px-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden">
                      <img 
                        src={product.imageUrl} 
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
                    <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs">
                      {categories.find(c => c._id === product.category)?.name || 'نامشخص'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
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
            <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
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
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
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
                  <label className="block text-gray-400 mb-1 text-sm">آدرس تصویر</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={currentProduct.imageUrl}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                    required
                  />
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
                    {currentProduct.features.map((feature, index) => (
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
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-draugr-700 hover:bg-draugr-600 rounded-lg transition-colors"
                >
                  {isCreateMode ? 'افزودن محصول' : 'بروزرسانی محصول'}
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
              <h3 className="text-xl font-bold text-red-500">حذف محصول</h3>
            </div>
            <div className="p-6">
              <p className="mb-6">آیا از حذف محصول <span className="font-bold">{productToDelete.name}</span> اطمینان دارید؟ این عملیات غیرقابل بازگشت است.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg transition-colors"
                >
                  حذف محصول
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts; 