/**
 * Image Optimization Utilities
 * Handles image compression, resizing, and format conversion
 */

class ImageOptimizer {
  constructor() {
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.maxWidth = 1920;
    this.maxHeight = 1080;
    this.quality = 0.8; // 80% quality
    this.supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
  }

  /**
   * Check if file is a valid image
   */
  isValidImage(file) {
    return this.supportedFormats.includes(file.type);
  }

  /**
   * Check if file size is acceptable
   */
  isValidSize(file) {
    return file.size <= this.maxFileSize;
  }

  /**
   * Compress and resize image
   */
  async optimizeImage(file, options = {}) {
    const {
      maxWidth = this.maxWidth,
      maxHeight = this.maxHeight,
      quality = this.quality,
      outputFormat = 'image/jpeg'
    } = options;

    return new Promise((resolve, reject) => {
      // Create file reader
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        
        img.onload = () => {
          try {
            // Calculate new dimensions
            const { width, height } = this.calculateDimensions(
              img.width, 
              img.height, 
              maxWidth, 
              maxHeight
            );

            // Create canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = width;
            canvas.height = height;

            // Enable image smoothing for better quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to blob
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  // Create new file with optimized blob
                  const optimizedFile = new File(
                    [blob], 
                    this.generateOptimizedFileName(file.name, outputFormat),
                    { 
                      type: outputFormat,
                      lastModified: Date.now()
                    }
                  );
                  
                  resolve({
                    file: optimizedFile,
                    originalSize: file.size,
                    optimizedSize: blob.size,
                    compressionRatio: ((file.size - blob.size) / file.size * 100).toFixed(1),
                    dimensions: { width, height },
                    originalDimensions: { width: img.width, height: img.height }
                  });
                } else {
                  reject(new Error('Failed to compress image'));
                }
              },
              outputFormat,
              quality
            );
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = event.target.result;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Calculate optimal dimensions while maintaining aspect ratio
   */
  calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
    let { width, height } = { width: originalWidth, height: originalHeight };

    // If image is smaller than max dimensions, keep original size
    if (width <= maxWidth && height <= maxHeight) {
      return { width, height };
    }

    // Calculate scaling factor
    const aspectRatio = width / height;

    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return {
      width: Math.round(width),
      height: Math.round(height)
    };
  }

  /**
   * Generate optimized filename
   */
  generateOptimizedFileName(originalName, outputFormat) {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const extension = outputFormat.split('/')[1];
    const timestamp = Date.now();
    
    return `${nameWithoutExt}_optimized_${timestamp}.${extension}`;
  }

  /**
   * Create thumbnail version
   */
  async createThumbnail(file, size = 300) {
    return this.optimizeImage(file, {
      maxWidth: size,
      maxHeight: size,
      quality: 0.7,
      outputFormat: 'image/jpeg'
    });
  }

  /**
   * Optimize multiple images
   */
  async optimizeMultipleImages(files, options = {}) {
    const results = [];
    
    for (const file of files) {
      try {
        // Validate file
        if (!this.isValidImage(file)) {
          results.push({
            file: null,
            error: `فرمت فایل ${file.name} پشتیبانی نمی‌شود`,
            originalFile: file
          });
          continue;
        }

        // Optimize if needed
        if (this.needsOptimization(file)) {
          const result = await this.optimizeImage(file, options);
          results.push({
            ...result,
            originalFile: file,
            wasOptimized: true
          });
        } else {
          // File is already optimized
          results.push({
            file: file,
            originalFile: file,
            originalSize: file.size,
            optimizedSize: file.size,
            compressionRatio: '0.0',
            wasOptimized: false
          });
        }
      } catch (error) {
        results.push({
          file: null,
          error: `خطا در پردازش ${file.name}: ${error.message}`,
          originalFile: file
        });
      }
    }

    return results;
  }

  /**
   * Check if image needs optimization
   */
  needsOptimization(file) {
    // Always optimize files larger than 2MB
    if (file.size > 2 * 1024 * 1024) {
      return true;
    }

    // Optimize PNG files (usually larger)
    if (file.type === 'image/png' && file.size > 500 * 1024) {
      return true;
    }

    return false;
  }

  /**
   * Get image preview URL
   */
  getPreviewUrl(file) {
    return URL.createObjectURL(file);
  }

  /**
   * Clean up preview URL
   */
  cleanupPreviewUrl(url) {
    URL.revokeObjectURL(url);
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
   * Validate and prepare images for upload
   */
  async prepareImagesForUpload(files, options = {}) {
    const results = await this.optimizeMultipleImages(files, options);
    
    const prepared = {
      valid: [],
      invalid: [],
      totalOriginalSize: 0,
      totalOptimizedSize: 0,
      totalSaved: 0
    };

    results.forEach(result => {
      if (result.file) {
        prepared.valid.push(result);
        prepared.totalOriginalSize += result.originalSize;
        prepared.totalOptimizedSize += result.optimizedSize;
      } else {
        prepared.invalid.push(result);
      }
    });

    prepared.totalSaved = prepared.totalOriginalSize - prepared.totalOptimizedSize;
    prepared.savingsPercentage = prepared.totalOriginalSize > 0 
      ? ((prepared.totalSaved / prepared.totalOriginalSize) * 100).toFixed(1)
      : 0;

    return prepared;
  }
}

// Create singleton instance
const imageOptimizer = new ImageOptimizer();

export default imageOptimizer; 