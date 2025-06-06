// Asset service - maps frontend assets to backend static URLs
// This centralizes all asset references so they can be updated in one place

import axios from 'axios';

// Base URL for backend static assets
const STATIC_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/static` 
  : 'http://localhost:5000/static';

// Default asset map with initial values (while loading from API)
let assetMap = {
  productImages: {
    product1: `${STATIC_URL}/images/products/Product_1.jpg`,
    product2: `${STATIC_URL}/images/products/Product_2.jpg`,
    product3: `${STATIC_URL}/images/products/Product_3.jpg`,
    product4: `${STATIC_URL}/images/products/Product_4.jpg`,
    product5: `${STATIC_URL}/images/products/Product_5.jpg`,
    product6: `${STATIC_URL}/images/products/Product_6.jpg`,
    product7: `${STATIC_URL}/images/products/Product_7.jpg`,
    product8: `${STATIC_URL}/images/products/Product_8.jpg`,
    product9: `${STATIC_URL}/images/products/Product_9.jpg`,
    product10: `${STATIC_URL}/images/products/Product_10.jpg`,
    product11: `${STATIC_URL}/images/products/Product_11.jpg`,
    product12: `${STATIC_URL}/images/products/Product_12.jpg`,
    product13: `${STATIC_URL}/images/products/Product_13.jpg`,
    product14: `${STATIC_URL}/images/products/Product_14.jpg`,
    product15: `${STATIC_URL}/images/products/Product_15.jpg`,
    skull: `${STATIC_URL}/images/products/skull.jpg`,
    darkRitual: `${STATIC_URL}/images/products/darksat.png`,
    halloweenPack: `${STATIC_URL}/images/products/halovinpack.png`,
    spellPack: `${STATIC_URL}/images/products/mahlolha.png`,
  },
  backgroundImages: {
    hero: `${STATIC_URL}/images/backgrounds/Background-Hero.jpg`,
    login: `${STATIC_URL}/images/backgrounds/BackGround-Login.jpg`,
    main: `${STATIC_URL}/images/backgrounds/BackGround-Main.jpg`,
    product: `${STATIC_URL}/images/backgrounds/BackGround-Product.jpg`,
    footer: `${STATIC_URL}/images/backgrounds/Background-Footer.png`,
  },
  iconImages: {
    profile: `${STATIC_URL}/images/icons/pfp-icon.png`,
    accessories: `${STATIC_URL}/images/icons/accessories-icon.png`,
  },
  models: {
    skull: `${STATIC_URL}/models/gltf/Skull.glb`,
  }
};

// Fetch the asset map from the API
const fetchAssetMap = async () => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await axios.get(`${API_URL}/api/assets/frontend/map`);
    
    if (response.data) {
      // Merge with default maps to ensure all keys exist
      assetMap = {
        productImages: { ...assetMap.productImages, ...response.data.productImages },
        backgroundImages: { ...assetMap.backgroundImages, ...response.data.backgroundImages },
        iconImages: { ...assetMap.iconImages, ...response.data.iconImages },
        models: { ...assetMap.models, ...response.data.models },
      };
      console.log('Asset map loaded from API');
    }
  } catch (error) {
    // Only log once to avoid spam
    if (!window.assetServiceErrorLogged) {
      console.error('Asset service: Using fallback URLs (backend not available)');
      window.assetServiceErrorLogged = true;
    }
  }
};

// Initialize by fetching assets when the module is loaded
fetchAssetMap();

// Export accessors to get the current values from the asset map
export const productImages = assetMap.productImages;
export const backgroundImages = assetMap.backgroundImages;
export const iconImages = assetMap.iconImages;
export const models = assetMap.models;

// Helper function to get product image by index (1-15)
export const getProductImageByIndex = (index) => {
  if (index < 1 || index > 15) return null;
  return assetMap.productImages[`product${index}`];
};

// Force refresh of asset map (can be called after admin changes assets)
export const refreshAssetMap = async () => {
  await fetchAssetMap();
  return assetMap;
};

export default {
  productImages,
  backgroundImages,
  iconImages,
  models,
  getProductImageByIndex,
  refreshAssetMap
}; 