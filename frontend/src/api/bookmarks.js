import api from './axios';

export const getBookmarks = () =>
  api.get('/api/bookmarks').then((r) => r.data);

export const addBookmark = (recipeId) =>
  api.post(`/api/bookmarks/${recipeId}`).then((r) => r.data);

export const removeBookmark = (recipeId) =>
  api.delete(`/api/bookmarks/${recipeId}`).then((r) => r.data);
