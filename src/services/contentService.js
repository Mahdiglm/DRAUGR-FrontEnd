import api from './api';

// Content management service for the admin panel

// Get all site content
export const getAllContent = async () => {
  return api.get('/api/content');
};

// Get hero section content
export const getHeroContent = async () => {
  return api.get('/api/content/hero');
};

// Update hero section content
export const updateHeroContent = async (heroData) => {
  return api.put('/api/content/hero', heroData);
};

// Get about section content
export const getAboutContent = async () => {
  return api.get('/api/content/about');
};

// Update about section content
export const updateAboutContent = async (aboutData) => {
  return api.put('/api/content/about', aboutData);
};

// Get features
export const getFeatures = async () => {
  return api.get('/api/content/features');
};

// Add a feature
export const addFeature = async (featureData) => {
  return api.post('/api/content/features', featureData);
};

// Update a feature
export const updateFeature = async (featureId, featureData) => {
  return api.put(`/api/content/features/${featureId}`, featureData);
};

// Delete a feature
export const deleteFeature = async (featureId) => {
  return api.delete(`/api/content/features/${featureId}`);
};

// Get banners
export const getBanners = async () => {
  return api.get('/api/content/banners');
};

// Add a banner
export const addBanner = async (bannerData) => {
  return api.post('/api/content/banners', bannerData);
};

// Update a banner
export const updateBanner = async (bannerId, bannerData) => {
  return api.put(`/api/content/banners/${bannerId}`, bannerData);
};

// Delete a banner
export const deleteBanner = async (bannerId) => {
  return api.delete(`/api/content/banners/${bannerId}`);
};

export default {
  getAllContent,
  getHeroContent,
  updateHeroContent,
  getAboutContent,
  updateAboutContent,
  getFeatures,
  addFeature,
  updateFeature,
  deleteFeature,
  getBanners,
  addBanner,
  updateBanner,
  deleteBanner
}; 