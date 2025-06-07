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
    const mockAssets = [
      {
        _id: 'mock-1',
        name: 'Product Image 1',
        url: 'http://localhost:5000/static/images/products/Product_1.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'Product Image 1',
        size: 245760,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'mock-2',
        name: 'Product Image 2',
        url: 'http://localhost:5000/static/images/products/Product_2.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'Product Image 2',
        size: 198432,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'mock-3',
        name: 'Product Image 3',
        url: 'http://localhost:5000/static/images/products/Product_3.jpg',
        category: 'product',
        type: 'image/jpeg',
        altText: 'Product Image 3',
        size: 276543,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'mock-4',
        name: 'Background 1',
        url: 'http://localhost:5000/static/images/backgrounds/BackGround-Main.jpg',
        category: 'background',
        type: 'image/jpeg',
        altText: 'Background 1',
        size: 512000,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'mock-5',
        name: 'Hero Background',
        url: 'http://localhost:5000/static/images/backgrounds/Background-Hero.jpg',
        category: 'background',
        type: 'image/jpeg',
        altText: 'Hero Background',
        size: 487321,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'mock-6',
        name: 'Profile Icon',
        url: 'http://localhost:5000/static/images/icons/pfp-icon.png',
        category: 'icon',
        type: 'image/png',
        altText: 'Profile Icon',
        size: 4096,
        createdAt: new Date().toISOString()
      }
    ];

    return category 
      ? mockAssets.filter(asset => asset.category === category)
      : mockAssets;
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