import api from './axios';

export const getUserProfile = (id) =>
  api.get(`/api/users/${id}`).then((r) => r.data);

export const getUserRecipes = (id, params) =>
  api.get(`/api/users/${id}/recipes`, { params }).then((r) => r.data);

export const followUser = (id) =>
  api.post(`/api/users/${id}/follow`).then((r) => r.data);

export const unfollowUser = (id) =>
  api.delete(`/api/users/${id}/follow`).then((r) => r.data);
