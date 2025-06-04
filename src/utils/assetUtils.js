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
  return `${API_BASE_URL}/api/assets/${assetName}`;
};

export default {
  getAssetUrl
}; 