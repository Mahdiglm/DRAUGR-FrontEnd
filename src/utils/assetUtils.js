/**
 * Utility functions for working with assets
 */

// Get the API base URL from environment variables or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get the URL for an asset from the backend
 * @param {string} assetName - The filename of the asset
 * @returns {string} - The full URL to the asset
 */
export const getAssetUrl = (assetName) => {
  // Use the /static path directly for more reliable access
  return `${API_BASE_URL}/static/images/backgrounds/${assetName}`;
};

/**
 * Get the URL for a product image from the backend
 * @param {string} assetName - The filename of the asset
 * @returns {string} - The full URL to the asset
 */
export const getProductImageUrl = (assetName) => {
  return `${API_BASE_URL}/static/images/products/${assetName}`;
};

/**
 * Get the URL for an icon from the backend
 * @param {string} assetName - The filename of the asset
 * @returns {string} - The full URL to the asset
 */
export const getIconUrl = (assetName) => {
  return `${API_BASE_URL}/static/images/icons/${assetName}`;
};

export default {
  getAssetUrl,
  getProductImageUrl,
  getIconUrl
}; 