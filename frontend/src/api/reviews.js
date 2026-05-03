import api from './axios';

export const getReviews = (recipeId, params) =>
  api.get(`/api/recipes/${recipeId}/reviews`, { params }).then((r) => r.data);

export const addReview = (recipeId, data) =>
  api.post(`/api/recipes/${recipeId}/reviews`, data).then((r) => r.data);

export const deleteReview = (id) =>
  api.delete(`/api/reviews/${id}`).then((r) => r.data);
