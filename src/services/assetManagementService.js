import apiIntegration from './apiIntegration';
import imageOptimizer from '../utils/imageOptimizer';
import { logger } from '../utils/logger';

class AssetManagementService {
  constructor() {
    this.apiUrl = 'http://localhost:5000/api';
  }

  /**
   * Get assets by category
   */
  async getAssets(category = null, page = 1, limit = 50) {
    try {
      const endpoint = `/assets${category ? `?category=${category}` : ''}`;
      const response = await apiIntegration.makeRequest(endpoint, {
        method: 'GET'
      });
      
      return response.data || [];
    } catch (error) {
      logger.error('Failed to fetch assets:', error);
      
      // Return mock assets based on category
      return this.getMockAssets(category);
    }
  }

  /**
   * Upload optimized assets
   */
  async uploadAssets(files, category = 'other', options = {}) {
    try {
      // First optimize images
      const optimizedResults = await imageOptimizer.prepareImagesForUpload(files, {
        maxWidth: category === 'background' ? 1920 : 800,
        maxHeight: category === 'background' ? 1080 : 600,
        quality: category === 'icon' ? 0.9 : 0.8,
        ...options
      });

      const uploadResults = [];

      // Upload each optimized file
      for (const result of optimizedResults.valid) {
        try {
          const formData = new FormData();
          formData.append('file', result.file);
          formData.append('category', category);
          formData.append('name', result.originalFile.name.split('.')[0]);
          formData.append('altText', result.originalFile.name);
          formData.append('originalSize', result.originalSize);
          formData.append('optimizedSize', result.optimizedSize);
          formData.append('compressionRatio', result.compressionRatio);

          const response = await apiIntegration.makeRequest('/assets', {
            method: 'POST',
            body: formData,
            headers: {} // Let browser set Content-Type for FormData
          });

          uploadResults.push({
            success: true,
            asset: response.data,
            optimizationData: result
          });
        } catch (error) {
          uploadResults.push({
            success: false,
            error: error.message,
            fileName: result.originalFile.name
          });
        }
      }

      return {
        optimizationResults: optimizedResults,
        uploadResults,
        successful: uploadResults.filter(r => r.success).length,
        failed: uploadResults.filter(r => !r.success).length
      };
    } catch (error) {
      logger.error('Failed to upload assets:', error);
      throw error;
    }
  }

  /**
   * Delete an asset
   */
  async deleteAsset(assetId) {
    try {
      await apiIntegration.makeRequest(`/assets/${assetId}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      logger.error('Failed to delete asset:', error);
      throw error;
    }
  }

  /**
   * Update asset metadata
   */
  async updateAsset(assetId, updateData) {
    try {
      const response = await apiIntegration.makeRequest(`/assets/${assetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      return response.data;
    } catch (error) {
      logger.error('Failed to update asset:', error);
      throw error;
    }
  }

  /**
   * Get asset by ID
   */
  async getAssetById(assetId) {
    try {
      const response = await apiIntegration.makeRequest(`/assets/${assetId}`, {
        method: 'GET'
      });
      
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch asset:', error);
      return null;
    }
  }

  /**
   * Search assets
   */
  async searchAssets(query, category = null) {
    try {
      const endpoint = `/assets/search?q=${encodeURIComponent(query)}${category ? `&category=${category}` : ''}`;
      const response = await apiIntegration.makeRequest(endpoint, {
        method: 'GET'
      });
      
      return response.data || [];
    } catch (error) {
      logger.error('Failed to search assets:', error);
      return [];
    }
  }

  /**
   * Get asset statistics
   */
  async getAssetStats() {
    try {
      const response = await apiIntegration.makeRequest('/assets/stats', {
        method: 'GET'
      });
      
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch asset stats:', error);
      return {
        totalAssets: 0,
        totalSize: 0,
        categories: {},
        recentUploads: []
      };
    }
  }

  /**
   * Get mock assets for fallback
   */
  getMockAssets(category) {
    const allMockAssets = [
      // Product Images
      {
        _id: 'product-1',
        name: 'Product_1',
        url: 'http://localhost:5000/static/images/products/Product_1.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'شمشیر DRAUGR',
        size: 245760,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'product-2',
        name: 'Product_2',
        url: 'http://localhost:5000/static/images/products/Product_2.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'کلاه‌خود نوردیک',
        size: 198432,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'product-3',
        name: 'Product_3',
        url: 'http://localhost:5000/static/images/products/Product_3.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'معجون شفا',
        size: 276543,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'product-4',
        name: 'Product_4',
        url: 'http://localhost:5000/static/images/products/Product_4.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'طومار باستانی',
        size: 234567,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'product-5',
        name: 'Product_5',
        url: 'http://localhost:5000/static/images/products/Product_5.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'گردنبند مقدس',
        size: 189234,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'product-6',
        name: 'Product_6',
        url: 'http://localhost:5000/static/images/products/Product_6.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'دستبند محافظ',
        size: 212345,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'product-7',
        name: 'Product_7',
        url: 'http://localhost:5000/static/images/products/Product_7.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'فندک اژدها',
        size: 198765,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'product-8',
        name: 'Product_8',
        url: 'http://localhost:5000/static/images/products/Product_8.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'ویجا بورد نفرین شده',
        size: 267890,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'product-9',
        name: 'Product_9',
        url: 'http://localhost:5000/static/images/products/Product_9.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'پیک گیتار استخوانی',
        size: 156789,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'product-10',
        name: 'Product_10',
        url: 'http://localhost:5000/static/images/products/Product_10.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'زیرسیگاری جمجمه',
        size: 223456,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'product-11',
        name: 'Product_11',
        url: 'http://localhost:5000/static/images/products/Product_11.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'ماگ استخوانی',
        size: 201234,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'product-12',
        name: 'Product_12',
        url: 'http://localhost:5000/static/images/products/Product_12.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'کتاب نفرین‌ها',
        size: 289012,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'product-13',
        name: 'Product_13',
        url: 'http://localhost:5000/static/images/products/Product_13.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'چوب بیسبال خون‌آلود',
        size: 245678,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'product-14',
        name: 'Product_14',
        url: 'http://localhost:5000/static/images/products/Product_14.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'وست چرمی',
        size: 267123,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'product-15',
        name: 'Product_15',
        url: 'http://localhost:5000/static/images/products/Product_15.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'کامیک هارور',
        size: 198456,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'product-default',
        name: 'category_default',
        url: 'http://localhost:5000/static/images/products/category_default.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'تصویر پیش‌فرض دسته‌بندی',
        size: 189456,
        createdAt: new Date('2024-01-01').toISOString()
      },

      // Background Images
      {
        _id: 'bg-main',
        name: 'BackGround-Main',
        url: 'http://localhost:5000/static/images/backgrounds/BackGround-Main.jpg',
        category: 'background',
        type: 'image/jpeg',
        altText: 'پس‌زمینه اصلی',
        size: 512000,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'bg-hero',
        name: 'Background-Hero',
        url: 'http://localhost:5000/static/images/backgrounds/Background-Hero.jpg',
        category: 'background',
        type: 'image/jpeg',
        altText: 'پس‌زمینه قهرمان',
        size: 487321,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'bg-login',
        name: 'BackGround-Login',
        url: 'http://localhost:5000/static/images/backgrounds/BackGround-Login.jpg',
        category: 'background',
        type: 'image/jpeg',
        altText: 'پس‌زمینه ورود',
        size: 456789,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'bg-product',
        name: 'BackGround-Product',
        url: 'http://localhost:5000/static/images/backgrounds/BackGround-Product.jpg',
        category: 'background',
        type: 'image/jpeg',
        altText: 'پس‌زمینه محصولات',
        size: 423567,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'bg-footer',
        name: 'Background-Footer',
        url: 'http://localhost:5000/static/images/backgrounds/Background-Footer.png',
        category: 'background',
        type: 'image/png',
        altText: 'پس‌زمینه فوتر',
        size: 234890,
        createdAt: new Date('2024-01-01').toISOString()
      },

      // Icon Images
      {
        _id: 'icon-pfp',
        name: 'pfp-icon',
        url: 'http://localhost:5000/static/images/icons/pfp-icon.png',
        category: 'icon',
        type: 'image/png',
        altText: 'آیکون پروفایل',
        size: 4096,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'icon-logo',
        name: 'logo',
        url: 'http://localhost:5000/static/images/icons/logo.png',
        category: 'icon',
        type: 'image/png',
        altText: 'لوگوی سایت',
        size: 8192,
        createdAt: new Date('2024-01-01').toISOString()
      },

      // Blog Images
      {
        _id: 'blog-jangal',
        name: 'blog-jangal-tarik',
        url: 'http://localhost:5000/static/images/blogs/jangal-tarik.jpg',
        category: 'blog',
        type: 'image/jpeg',
        altText: 'جنگل تاریک',
        size: 345678,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'blog-emarat',
        name: 'blog-emarat-taskhir',
        url: 'http://localhost:5000/static/images/blogs/emarat-taskhir.jpg',
        category: 'blog',
        type: 'image/jpeg',
        altText: 'عمارت تسخیر شده',
        size: 398765,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'blog-moumiaei',
        name: 'blog-nefrin-moumiaei',
        url: 'http://localhost:5000/static/images/blogs/nefrin-moumiaei.jpg',
        category: 'blog',
        type: 'image/jpeg',
        altText: 'نفرین مومیایی',
        size: 376543,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'blog-darya',
        name: 'blog-mojodat-darya',
        url: 'http://localhost:5000/static/images/blogs/mojodat-darya.jpg',
        category: 'blog',
        type: 'image/jpeg',
        altText: 'موجودات دریا',
        size: 412345,
        createdAt: new Date('2024-01-01').toISOString()
      },

      // Other Images
      {
        _id: 'other-skull',
        name: 'skull',
        url: 'http://localhost:5000/static/images/other/skull.jpg',
        category: 'other',
        type: 'image/jpeg',
        altText: 'جمجمه',
        size: 156432,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'other-placeholder',
        name: 'placeholder',
        url: 'http://localhost:5000/static/images/other/placeholder.jpg',
        category: 'other',
        type: 'image/jpeg',
        altText: 'تصویر جایگزین',
        size: 45678,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'other-fog1',
        name: 'fog-texture',
        url: 'http://localhost:5000/static/images/other/fog-texture.png',
        category: 'other',
        type: 'image/png',
        altText: 'بافت مه اول',
        size: 123456,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        _id: 'other-fog2',
        name: 'fog-texture-2',
        url: 'http://localhost:5000/static/images/other/fog-texture-2.png',
        category: 'other',
        type: 'image/png',
        altText: 'بافت مه دوم',
        size: 134567,
        createdAt: new Date('2024-01-01').toISOString()
      }
    ];

    return category 
      ? allMockAssets.filter(asset => asset.category === category)
      : allMockAssets;
  }

  /**
   * Generate optimized image URL
   */
  getOptimizedImageUrl(originalUrl, options = {}) {
    const {
      width,
      height,
      quality = 80,
      format = 'auto'
    } = options;

    // If backend supports image transformation, add query params
    if (originalUrl && (width || height || quality !== 80 || format !== 'auto')) {
      const url = new URL(originalUrl);
      if (width) url.searchParams.set('w', width);
      if (height) url.searchParams.set('h', height);
      if (quality !== 80) url.searchParams.set('q', quality);
      if (format !== 'auto') url.searchParams.set('f', format);
      return url.toString();
    }

    return originalUrl;
  }

  /**
   * Preload critical images
   */
  preloadImages(urls) {
    urls.forEach(url => {
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });
  }

  /**
   * Get image dimensions
   */
  async getImageDimensions(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight
        });
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * Generate responsive image sources
   */
  generateResponsiveSources(baseUrl, sizes = [400, 800, 1200, 1600]) {
    return sizes.map(size => ({
      size,
      url: this.getOptimizedImageUrl(baseUrl, { width: size }),
      media: `(max-width: ${size}px)`
    }));
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * Get asset storage summary
   */
  async getStorageSummary() {
    try {
      const stats = await this.getAssetStats();
      return {
        totalAssets: stats.totalAssets || 0,
        totalSize: this.formatFileSize(stats.totalSize || 0),
        categories: stats.categories || {},
        storageUsed: ((stats.totalSize || 0) / (1024 * 1024 * 1024)).toFixed(2) // GB
      };
    } catch (error) {
      return {
        totalAssets: 0,
        totalSize: '0 B',
        categories: {},
        storageUsed: '0.00'
      };
    }
  }
}

// Create singleton instance
const assetManagementService = new AssetManagementService();

export default assetManagementService; 