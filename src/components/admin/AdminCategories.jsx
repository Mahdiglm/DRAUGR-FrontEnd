import { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await categoryService.getAllCategories();
      setCategories(Array.isArray(response) ? response : (response.data || []));
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'خطا در بارگذاری دسته‌بندی‌ها');
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open form for creating new category
  const handleAddClick = () => {
    setFormData({
      name: '',
      description: '',
      image: ''
    });
    setIsEditing(false);
    setIsFormOpen(true);
  };

  // Open form for editing category
  const handleEditClick = (category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || ''
    });
    setSelectedCategory(category);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedCategory) {
        // Update existing category
        const response = await categoryService.updateCategory(selectedCategory._id, formData);
        setCategories(categories.map(cat => 
          cat._id === selectedCategory._id ? response.data || response : cat
        ));
      } else {
        // Create new category
        const response = await categoryService.createCategory(formData);
        setCategories([...(categories || []), response.data || response]);
      }
      
      setIsFormOpen(false);
      setFormData({ name: '', description: '', image: '' });
    } catch (err) {
      console.error('Error saving category:', err);
      setError(err.message || 'خطا در ذخیره دسته‌بندی');
    }
  };

  // Open delete confirmation modal
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  // Handle category deletion
  const handleDeleteConfirm = async () => {
    try {
      await categoryService.deleteCategory(categoryToDelete._id);
      setCategories(categories.filter(cat => cat._id !== categoryToDelete._id));
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
      
      // If the deleted category was selected, clear selection
      if (selectedCategory && selectedCategory._id === categoryToDelete._id) {
        setSelectedCategory(null);
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.message || 'خطا در حذف دسته‌بندی');
      setDeleteConfirmOpen(false);
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
        <button 
          onClick={fetchCategories}
          className="mt-3 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-sm transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h2>
        <button 
          onClick={handleAddClick}
          className="px-4 py-2 bg-draugr-700 hover:bg-draugr-600 rounded-lg text-sm transition-colors flex items-center"
        >
          <span className="ml-1">+</span>
          افزودن دسته‌بندی جدید
        </button>
      </div>

      {categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div 
              key={category._id} 
              className="bg-black bg-opacity-40 rounded-xl border border-gray-800 overflow-hidden"
            >
              <div className="h-40 bg-gray-800 relative">
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    بدون تصویر
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-xl font-bold">{category.name}</h3>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
                  {category.description || 'بدون توضیحات'}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {category.slug}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(category)}
                      className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded-lg text-xs transition-colors"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category)}
                      className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded-lg text-xs transition-colors"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-black bg-opacity-40 rounded-xl border border-gray-800">
          <p className="text-gray-400 mb-4">هیچ دسته‌بندی‌ای موجود نیست</p>
          <button 
            onClick={handleAddClick}
            className="px-4 py-2 bg-draugr-700 hover:bg-draugr-600 rounded-lg text-sm transition-colors"
          >
            افزودن دسته‌بندی جدید
          </button>
        </div>
      )}

      {/* Category Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-xl max-w-md w-full" dir="rtl">
            <div className="border-b border-gray-800 p-4">
              <h3 className="text-xl font-bold">
                {isEditing ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-gray-400 mb-1 text-sm">نام دسته‌بندی</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-400 mb-1 text-sm">توضیحات</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500 h-24"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-400 mb-1 text-sm">آدرس تصویر</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                  placeholder="/images/categories/category-name.jpg"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-draugr-700 hover:bg-draugr-600 rounded-lg transition-colors"
                >
                  {isEditing ? 'ذخیره تغییرات' : 'افزودن دسته‌بندی'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-xl max-w-md w-full" dir="rtl">
            <div className="border-b border-gray-800 p-4">
              <h3 className="text-xl font-bold text-red-500">حذف دسته‌بندی</h3>
            </div>
            
            <div className="p-6">
              <p className="mb-6">
                آیا از حذف دسته‌بندی <span className="font-bold">{categoryToDelete.name}</span> اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
              </p>
              
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
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories; 