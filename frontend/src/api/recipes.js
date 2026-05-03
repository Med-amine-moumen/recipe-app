import api from './axios';

export const getRecipes = (params) =>
  api.get('/api/recipes', { params }).then((r) => r.data);

export const searchRecipes = (q) =>
  api.get('/api/recipes/search', { params: { q } }).then((r) => r.data);

export const getRecipe = (id) =>
  api.get(`/api/recipes/${id}`).then((r) => r.data);

export const createRecipe = (formData) =>
  api.post('/api/recipes', formData).then((r) => r.data);

export const updateRecipe = (id, formData) =>
  api.put(`/api/recipes/${id}`, formData).then((r) => r.data);

export const deleteRecipe = (id) =>
  api.delete(`/api/recipes/${id}`).then((r) => r.data);
