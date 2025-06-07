import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import imageOptimizer from '../../utils/imageOptimizer';

const AdminImageManager = () => {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('product');
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    { value: 'product', label: 'محصولات' },
    { value: 'background', label: 'پس‌زمینه‌ها' },
    { value: 'icon', label: 'آیکون‌ها' },
    { value: 'blog', label: 'بلاگ' },
    { value: 'other', label: 'سایر' }
  ];

  useEffect(() => {
    fetchAssets();
  }, [selectedCategory]);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/assets?category=${selectedCategory}`);
      setAssets(response.data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast.error('خطا در بارگذاری تصاویر');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', selectedCategory);
        formData.append('name', file.name.split('.')[0]);
        formData.append('altText', file.name);

        const response = await api.post('/api/assets', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data) {
          setAssets(prev => [response.data, ...prev]);
          toast.success(`تصویر ${file.name} با موفقیت آپلود شد`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`خطا در آپلود ${file.name}`);
      }
    }
    
    setIsUploading(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
  };

  const handleDeleteAsset = async (assetId) => {
    if (!confirm('آیا از حذف این تصویر اطمینان دارید؟')) return;

    try {
      await api.delete(`/api/assets/${assetId}`);
      setAssets(prev => prev.filter(asset => asset._id !== assetId));
      toast.success('تصویر با موفقیت حذف شد');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('خطا در حذف تصویر');
    }
  };

  const copyImageUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('آدرس تصویر کپی شد');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">مدیریت تصاویر و فایل‌ها</h2>
        <div className="flex gap-4 items-center">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragOver 
            ? 'border-draugr-500 bg-draugr-900/20' 
            : 'border-gray-700 bg-black/20'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div>
            <p className="text-lg font-medium">فایل‌ها را اینجا بکشید یا کلیک کنید</p>
            <p className="text-gray-400 text-sm">فرمت‌های مجاز: JPG, PNG, GIF, WEBP</p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-6 py-3 bg-draugr-700 hover:bg-draugr-600 rounded-lg transition-colors cursor-pointer"
            disabled={isUploading}
          >
            {isUploading ? 'در حال آپلود...' : 'انتخاب فایل‌ها'}
          </label>
        </div>
      </div>

      {/* Assets Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-draugr-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {assets.map(asset => (
            <div key={asset._id} className="bg-black bg-opacity-40 rounded-xl overflow-hidden border border-gray-800 group">
              <div className="aspect-square bg-gray-800 relative">
                <img
                  src={asset.url}
                  alt={asset.altText}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200x200/1a1a1a/666666?text=خطا';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyImageUrl(asset.url)}
                      className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                      title="کپی آدرس"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteAsset(asset._id)}
                      className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{asset.name}</p>
                <p className="text-xs text-gray-400">{asset.type}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {assets.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-400">
          <p>هیچ تصویری در این دسته‌بندی موجود نیست</p>
        </div>
      )}
    </div>
  );
};

export default AdminImageManager; 