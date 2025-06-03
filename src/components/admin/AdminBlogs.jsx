import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    tags: '',
    isPublished: true
  });
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  
  // Fetch all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        // This should be replaced with the actual API endpoint for blogs
        const response = await api.get('/api/blogs');
        setBlogs(response.data || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentBlog({
      ...currentBlog,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle opening the create modal
  const handleCreateClick = () => {
    setCurrentBlog({
      title: '',
      content: '',
      excerpt: '',
      image: '',
      tags: '',
      isPublished: true
    });
    setIsCreateMode(true);
    setIsModalOpen(true);
  };
  
  // Handle opening the edit modal
  const handleEditClick = (blog) => {
    setCurrentBlog({
      ...blog,
      tags: blog.tags.join(', ')
    });
    setIsCreateMode(false);
    setIsModalOpen(true);
  };
  
  // Handle delete confirmation
  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setDeleteConfirmOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const blogData = {
        ...currentBlog,
        tags: currentBlog.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      let response;
      
      if (isCreateMode) {
        response = await api.post('/api/admin/blogs', blogData);
        setBlogs([response.data.data, ...blogs]);
      } else {
        response = await api.put(`/api/admin/blogs/${currentBlog._id}`, blogData);
        setBlogs(blogs.map(blog => 
          blog._id === currentBlog._id ? response.data.data : blog
        ));
      }
      
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving blog:', err);
      alert(`Failed to ${isCreateMode ? 'create' : 'update'} blog. Please try again.`);
    }
  };
  
  // Handle blog deletion
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/admin/blogs/${blogToDelete._id}`);
      setBlogs(blogs.filter(blog => blog._id !== blogToDelete._id));
      setDeleteConfirmOpen(false);
      setBlogToDelete(null);
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog. Please try again.');
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">مدیریت بلاگ</h2>
        <button
          onClick={handleCreateClick}
          className="px-4 py-2 bg-draugr-700 hover:bg-draugr-600 rounded-lg transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          ایجاد مقاله جدید
        </button>
      </div>
      
      {blogs.length === 0 ? (
        <div className="bg-black bg-opacity-40 rounded-xl border border-gray-800 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5m14 6a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2z" />
          </svg>
          <p className="text-gray-400">هنوز مقاله‌ای منتشر نشده است. برای ایجاد اولین مقاله روی دکمه "ایجاد مقاله جدید" کلیک کنید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <div key={blog._id} className="bg-black bg-opacity-40 rounded-xl overflow-hidden border border-gray-800 flex flex-col">
              <div className="h-48 bg-gray-800 relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x200/1a1a1a/666666?text=Draugr+Blog';
                  }}
                />
                {!blog.isPublished && (
                  <div className="absolute top-2 right-2 bg-gray-900/80 text-gray-300 px-2 py-1 rounded-lg text-xs">
                    پیش‌نویس
                  </div>
                )}
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-bold mb-2 line-clamp-1">{blog.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {blog.tags && blog.tags.map ? blog.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                      {tag}
                    </span>
                  )) : null}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString('fa-IR')} | {blog.views} بازدید
                </div>
              </div>
              <div className="p-3 border-t border-gray-800 flex justify-between">
                <button
                  onClick={() => handleEditClick(blog)}
                  className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded-lg text-sm transition-colors"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => handleDeleteClick(blog)}
                  className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded-lg text-sm transition-colors"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full" dir="rtl">
            <div className="border-b border-gray-800 p-4">
              <h3 className="text-xl font-bold">
                {isCreateMode ? 'ایجاد مقاله جدید' : 'ویرایش مقاله'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="mb-4">
                <label className="block text-gray-400 mb-1 text-sm">عنوان</label>
                <input
                  type="text"
                  name="title"
                  value={currentBlog.title}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-400 mb-1 text-sm">چکیده</label>
                <textarea
                  name="excerpt"
                  value={currentBlog.excerpt}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500 h-20"
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-400 mb-1 text-sm">محتوا</label>
                <textarea
                  name="content"
                  value={currentBlog.content}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500 h-32"
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-400 mb-1 text-sm">آدرس تصویر</label>
                <input
                  type="text"
                  name="image"
                  value={currentBlog.image}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-400 mb-1 text-sm">برچسب‌ها (با کاما جدا کنید)</label>
                <input
                  type="text"
                  name="tags"
                  value={currentBlog.tags}
                  onChange={handleInputChange}
                  placeholder="مثال: گیمینگ, تکنولوژی, راهنما"
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                />
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={currentBlog.isPublished}
                    onChange={handleInputChange}
                    className="rounded text-draugr-500 focus:ring-draugr-500 h-5 w-5 bg-gray-800 border-gray-700"
                  />
                  <span className="mr-2">انتشار مقاله</span>
                </label>
              </div>
              
              <div className="flex justify-end gap-3">
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
                  {isCreateMode ? 'ایجاد مقاله' : 'بروزرسانی مقاله'}
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
              <h3 className="text-xl font-bold text-red-500">حذف مقاله</h3>
            </div>
            <div className="p-6">
              <p className="mb-6">آیا از حذف مقاله <span className="font-bold">{blogToDelete.title}</span> اطمینان دارید؟ این عملیات غیرقابل بازگشت است.</p>
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
                  حذف مقاله
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs; 