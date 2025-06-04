import api from './api';

// Category management service for the admin panel

// Get all categories
export const getAllCategories = async () => {
  return api.get('/api/categories');
};

// Get category by slug
export const getCategoryBySlug = async (slug) => {
  return api.get(`/api/categories/${slug}`);
};

// Create category
export const createCategory = async (categoryData) => {
  return api.post('/api/categories', categoryData);
};

// Update category
export const updateCategory = async (categoryId, categoryData) => {
  return api.put(`/api/categories/${categoryId}`, categoryData);
};

// Delete category
export const deleteCategory = async (categoryId) => {
  return api.delete(`/api/categories/${categoryId}`);
};

export default {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
}; 