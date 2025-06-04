// Asset service - maps frontend assets to backend static URLs
// This centralizes all asset references so they can be updated in one place

// Base URL for backend static assets
const STATIC_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/static` 
  : 'http://localhost:5000/static';

// Product images 
export const productImages = {
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
};

// Background images
export const backgroundImages = {
  hero: `${STATIC_URL}/images/backgrounds/Background-Hero.jpg`,
  login: `${STATIC_URL}/images/backgrounds/BackGround-Login.jpg`,
  main: `${STATIC_URL}/images/backgrounds/BackGround-Main.jpg`,
  product: `${STATIC_URL}/images/backgrounds/BackGround-Product.jpg`,
  footer: `${STATIC_URL}/images/backgrounds/Background-Footer.png`,
};

// Icon images
export const iconImages = {
  profile: `${STATIC_URL}/images/icons/pfp-icon.png`,
  accessories: `${STATIC_URL}/images/icons/accessories-icon.png`,
};

// 3D Models
export const models = {
  skull: `${STATIC_URL}/models/gltf/Skull.glb`,
};

// Helper function to get product image by index (1-15)
export const getProductImageByIndex = (index) => {
  if (index < 1 || index > 15) return null;
  return productImages[`product${index}`];
};

export default {
  productImages,
  backgroundImages,
  iconImages,
  models,
  getProductImageByIndex
}; 