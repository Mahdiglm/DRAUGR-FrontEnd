/**
 * Utility functions for working with assets
 */

// Get the API base URL from environment variables or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Map of known assets to their appropriate folders
const assetMap = {
  // Background images
  'BackGround-Login.jpg': 'backgrounds',
  'Background-Hero.jpg': 'backgrounds',
  'BackGround-Main.jpg': 'backgrounds',
  'Background-Footer.png': 'backgrounds',
  'BackGround-Product.jpg': 'backgrounds',
  
  // Icons
  'pfp-icon.png': 'icons',
  'accessories-icon.png': 'icons',
  
  // Products have consistent naming pattern Product_X.jpg
  // will be handled by logic
  
  // Special case
  'skull.jpg': 'products'
};

/**
 * Get the URL for an asset from the backend
 * @param {string} assetName - The filename of the asset
 * @returns {string} - The full URL to the asset
 */
export const getAssetUrl = (assetName) => {
  // Check if we have a mapping for this asset
  let folder = assetMap[assetName];
  
  // If no direct mapping, try to determine the type
  if (!folder) {
    if (assetName.startsWith('Product_')) {
      folder = 'products';
    } else {
      // Default to backgrounds for unknown assets
      folder = 'backgrounds';
    }
  }
  
  // Return the full URL to the static asset
  return `${API_BASE_URL}/static/images/${folder}/${assetName}`;
};

/**
 * Alias functions for specific asset types
 */
export const getProductImageUrl = (assetName) => {
  return `${API_BASE_URL}/static/images/products/${assetName}`;
};

export const getIconUrl = (assetName) => {
  return `${API_BASE_URL}/static/images/icons/${assetName}`;
};

export const getBackgroundUrl = (assetName) => {
  return `${API_BASE_URL}/static/images/backgrounds/${assetName}`;
};

export default {
  getAssetUrl,
  getProductImageUrl,
  getIconUrl,
  getBackgroundUrl
}; 