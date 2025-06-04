import { useState, useEffect } from 'react';
import contentService from '../../services/contentService';

const AdminContentManager = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Hero section state
  const [heroContent, setHeroContent] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    backgroundImage: ''
  });
  
  // Fetch hero content
  useEffect(() => {
    fetchHeroContent();
  }, []);
  
  const fetchHeroContent = async () => {
    try {
      setIsLoading(true);
      const response = await contentService.getHeroContent();
      const data = response.data || response;
      
      setHeroContent({
        title: data.title || '',
        subtitle: data.subtitle || '',
        buttonText: data.buttonText || '',
        buttonLink: data.buttonLink || '',
        backgroundImage: data.backgroundImage || ''
      });
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching hero content:', err);
      setError(err.message || 'خطا در بارگذاری محتوا');
      setIsLoading(false);
    }
  };
  
  // Handle hero content input changes
  const handleHeroInputChange = (e) => {
    const { name, value } = e.target;
    setHeroContent({
      ...heroContent,
      [name]: value
    });
  };
  
  // Save hero content
  const handleSaveHeroContent = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await contentService.updateHeroContent(heroContent);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving hero content:', err);
      setError(err.message || 'خطا در ذخیره محتوا');
    }
    
    setIsLoading(false);
  };
  
  if (isLoading && !heroContent.title) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-draugr-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">مدیریت محتوای سایت</h2>
      
      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('hero')}
          className={`py-2 px-4 font-medium transition-colors ${activeTab === 'hero' ? 'text-draugr-500 border-b-2 border-draugr-500' : 'text-gray-400 hover:text-white'}`}
        >
          بخش اصلی (Hero)
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-900/20 text-red-200 p-4 rounded-lg border border-red-800 mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Success message */}
      {saveSuccess && (
        <div className="bg-green-900/20 text-green-200 p-4 rounded-lg border border-green-800 mb-4">
          <p>تغییرات با موفقیت ذخیره شد</p>
        </div>
      )}
      
      {/* Hero section content */}
      {activeTab === 'hero' && (
        <div className="bg-black bg-opacity-40 rounded-xl border border-gray-800 p-6">
          <form onSubmit={handleSaveHeroContent}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-400 mb-1 text-sm">عنوان اصلی</label>
                <input
                  type="text"
                  name="title"
                  value={heroContent.title}
                  onChange={handleHeroInputChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1 text-sm">زیرعنوان</label>
                <input
                  type="text"
                  name="subtitle"
                  value={heroContent.subtitle}
                  onChange={handleHeroInputChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1 text-sm">متن دکمه</label>
                <input
                  type="text"
                  name="buttonText"
                  value={heroContent.buttonText}
                  onChange={handleHeroInputChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1 text-sm">لینک دکمه</label>
                <input
                  type="text"
                  name="buttonLink"
                  value={heroContent.buttonLink}
                  onChange={handleHeroInputChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-1 text-sm">آدرس تصویر پس‌زمینه</label>
                <input
                  type="text"
                  name="backgroundImage"
                  value={heroContent.backgroundImage}
                  onChange={handleHeroInputChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-draugr-500"
                />
              </div>
            </div>
            
            {/* Preview */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">پیش‌نمایش</h3>
              <div 
                className="rounded-lg overflow-hidden relative h-40 flex items-center justify-center"
                style={{
                  backgroundImage: heroContent.backgroundImage ? `url(${heroContent.backgroundImage})` : 'none',
                  backgroundColor: heroContent.backgroundImage ? 'transparent' : '#1f2937',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="relative text-center p-4">
                  <h2 className="text-xl font-bold mb-2">{heroContent.title || 'عنوان اصلی'}</h2>
                  <p className="text-sm mb-3">{heroContent.subtitle || 'زیرعنوان'}</p>
                  <button className="px-4 py-1.5 bg-draugr-700 rounded-lg text-sm">
                    {heroContent.buttonText || 'متن دکمه'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-draugr-700 hover:bg-draugr-600 rounded-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminContentManager; 