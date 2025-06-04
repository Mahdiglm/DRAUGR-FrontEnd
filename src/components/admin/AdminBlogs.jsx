import { useState, useEffect, useMemo, useRef } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import '../../styles/quill-dark.css'; // Import custom dark theme styles

// Custom CSS for dark-themed editor
const darkEditorStyles = {
  editor: {
    backgroundColor: '#1f2937', // Dark background
    color: '#e5e7eb', // Light text
    minHeight: '250px', // Taller editor
    borderRadius: '0.5rem',
  },
  toolbar: {
    backgroundColor: '#111827', // Darker toolbar
    color: '#e5e7eb', // Light text
    borderRadius: '0.5rem 0.5rem 0 0',
    borderBottom: '1px solid #374151'
  }
};

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
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'
  const quillRef = useRef(null);
  
  // Rich text editor modules and formats configuration
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'], 
      [{'color': []}, {'background': []}],
      [{'align': []}],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{'script': 'sub'}, {'script': 'super'}],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet',
    'script',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  // Handle rich text editor content change
  const handleContentChange = (content) => {
    setCurrentBlog({
      ...currentBlog,
      content
    });
  };
  
  // Check existing blog format
  const checkExistingBlogFormat = () => {
    if (blogs && blogs.length > 0) {
      console.log('Existing blog format:', blogs[0]);
      return blogs[0];
    }
    return null;
  };
  
  // Refresh blogs data
  const refreshBlogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch admin blogs
      const adminResponse = await api.get('/api/admin/blogs');
      console.log('Admin blogs response:', adminResponse);
      
      if (adminResponse.data && (adminResponse.data.data || Array.isArray(adminResponse.data))) {
        const blogsData = adminResponse.data.data || adminResponse.data;
        setBlogs(blogsData);
        console.log(`Found ${blogsData.length} blogs from admin API`);
      } else {
        // Fallback to public blogs API if admin API returns unexpected data
        const publicResponse = await api.get('/api/blogs');
        console.log('Public blogs response:', publicResponse);
        
        if (publicResponse.data && Array.isArray(publicResponse.data)) {
          setBlogs(publicResponse.data);
          console.log(`Found ${publicResponse.data.length} blogs from public API`);
        } else {
          setError('No blogs found or unexpected data format');
        }
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please try again later.');
      setIsLoading(false);
      toast.error('خطا در بارگذاری مقالات');
    }
  };
  
  // Fetch blogs on component mount
  useEffect(() => {
    refreshBlogs();
  }, []);
  
  // Store successful blog changes to localStorage to trigger updates in other components
  const notifyBlogChanges = () => {
    localStorage.setItem('blogsUpdated', Date.now().toString());
  };
  
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
    setActiveTab('edit');
  };
  
  // Handle opening the edit modal
  const handleEditClick = (blog) => {
    // Process tags for edit form - handle array or string formats
    const tags = blog.tags ? 
      (Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags) : '';
    
    setCurrentBlog({
      ...blog,
      tags: tags
    });
    setIsCreateMode(false);
    setIsModalOpen(true);
    setActiveTab('edit');
  };
  
  // Handle modal close with cleanup
  const handleModalClose = () => {
    setIsModalOpen(false);
    setActiveTab('edit');
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
      // Process tags into an array
      const blogData = {
        ...currentBlog,
        tags: currentBlog.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      let response;
      
      if (isCreateMode) {
        response = await api.post('/api/admin/blogs', blogData);
        if (response.data && response.data.data) {
          setBlogs([response.data.data, ...blogs]);
          toast.success('مقاله با موفقیت ایجاد شد');
        }
      } else {
        response = await api.put(`/api/admin/blogs/${currentBlog._id}`, blogData);
        if (response.data && response.data.data) {
          setBlogs(blogs.map(blog => 
            blog._id === currentBlog._id ? response.data.data : blog
          ));
          toast.success('مقاله با موفقیت ویرایش شد');
        }
      }
      
      setIsModalOpen(false);
      notifyBlogChanges();
    } catch (err) {
      console.error('Error saving blog:', err);
      toast.error(`خطا در ${isCreateMode ? 'ایجاد' : 'ویرایش'} مقاله`);
    }
  };
  
  // Handle blog deletion
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/admin/blogs/${blogToDelete._id}`);
      setBlogs(blogs.filter(blog => blog._id !== blogToDelete._id));
      setDeleteConfirmOpen(false);
      setBlogToDelete(null);
      toast.success('مقاله با موفقیت حذف شد');
      notifyBlogChanges();
    } catch (err) {
      console.error('Error deleting blog:', err);
      toast.error('خطا در حذف مقاله');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'تاریخ نامشخص';
    
    try {
      // For Persian date display
      const date = new Date(dateString);
      // Try using toLocaleDateString with Persian options if supported
      return date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString;
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
        <div className="flex gap-2">
          <Link 
            to="/blog" 
            target="_blank" 
            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg transition-colors"
          >
            مشاهده بلاگ
          </Link>
          <button
            onClick={refreshBlogs}
            className="px-4 py-2 bg-green-800 hover:bg-green-700 rounded-lg shadow-sm transition-colors"
            title="بارگذاری مجدد مقالات"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
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
      </div>
      
      <div className="bg-black bg-opacity-40 rounded-xl border border-gray-800 p-4 mb-4">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-300">تعداد مقالات: <span className="text-draugr-500 font-bold">{blogs.length}</span></p>
            <p className="text-gray-400 text-sm">مقالات منتشر شده: <span className="text-green-500 font-bold">{blogs.filter(blog => blog.isPublished).length}</span></p>
            <p className="text-gray-400 text-sm">پیش‌نویس‌ها: <span className="text-yellow-500 font-bold">{blogs.filter(blog => !blog.isPublished).length}</span></p>
          </div>
          <div className="text-right">
            <p className="text-gray-300 text-sm">مقالات به سمت صفحه بلاگ به صورت خودکار همگام‌سازی می‌شوند</p>
            <p className="text-gray-400 text-xs">نکته: فقط مقالات با وضعیت "منتشر شده" در صفحه بلاگ نمایش داده می‌شوند</p>
          </div>
        </div>
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
                  {formatDate(blog.createdAt)} | {blog.views || 0} بازدید
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
            
            <div className="border-b border-gray-800">
              <div className="flex">
                <button
                  className={`px-4 py-2 ${activeTab === 'edit' ? 'bg-draugr-700 text-white' : 'bg-transparent text-gray-400'}`}
                  onClick={() => setActiveTab('edit')}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    ویرایش
                  </span>
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === 'preview' ? 'bg-draugr-700 text-white' : 'bg-transparent text-gray-400'}`}
                  onClick={() => setActiveTab('preview')}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    پیش‌نمایش
                  </span>
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {activeTab === 'edit' ? (
                <form onSubmit={handleSubmit} id="blog-form">
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
                    <div className="quill-editor-dark">
                      <ReactQuill
                        value={currentBlog.content}
                        onChange={handleContentChange}
                        modules={modules}
                        formats={formats}
                        theme="snow"
                        style={darkEditorStyles.editor}
                        className="rounded-lg focus:outline-none focus:ring-2 focus:ring-draugr-500 mb-6"
                        placeholder="محتوای مقاله خود را بنویسید... (متن، تصویر، لینک و...)"
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      <p>از ابزارهای بالا برای قالب‌بندی متن استفاده کنید. شما می‌توانید:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>متن را <strong>پررنگ</strong>، <em>مورب</em> یا <u>زیرخط‌دار</u> کنید</li>
                        <li>تصاویر را به متن اضافه کنید</li>
                        <li>لیست‌های منظم یا نامنظم بسازید</li>
                        <li>لینک اضافه کنید</li>
                        <li>رنگ متن و پس‌زمینه را تغییر دهید</li>
                        <li>ویدیو اضافه کنید</li>
                      </ul>
                    </div>
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
                </form>
              ) : (
                <div className="preview-container">
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h1 className="text-2xl font-bold mb-4 text-red-400">{currentBlog.title || 'عنوان مقاله'}</h1>
                    
                    {currentBlog.image && (
                      <div className="mb-6 rounded-lg overflow-hidden">
                        <img
                          src={currentBlog.image}
                          alt={currentBlog.title}
                          className="w-full h-auto object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/800x400/1a1a1a/666666?text=تصویر+مقاله';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-400 mb-6">
                      <p className="mb-2">{currentBlog.excerpt || 'چکیده مقاله در این قسمت نمایش داده می‌شود...'}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentBlog.tags && currentBlog.tags.split(',').map((tag, index) => (
                          tag.trim() ? (
                            <span key={index} className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                              #{tag.trim()}
                            </span>
                          ) : null
                        ))}
                      </div>
                    </div>
                    
                    <div 
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: currentBlog.content || '<p>محتوای مقاله در این قسمت نمایش داده می‌شود...</p>' }}
                    />
                  </div>
                  
                  <div className="mt-4 text-center p-2 bg-gray-900/50 rounded-lg">
                    <p className="text-sm text-gray-400">این پیش‌نمایش است. برای ویرایش بیشتر به تب "ویرایش" بازگردید.</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-800 p-4 flex justify-end">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors ml-2"
              >
                انصراف
              </button>
              <button
                type="submit"
                form="blog-form"
                className="px-4 py-2 bg-draugr-700 hover:bg-draugr-600 rounded-lg transition-colors"
              >
                {isCreateMode ? 'ایجاد مقاله' : 'بروزرسانی مقاله'}
              </button>
            </div>
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