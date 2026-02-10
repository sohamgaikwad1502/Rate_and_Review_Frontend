import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (passwords) => api.put('/auth/change-password', passwords),
};

export const storesAPI = {
  getAll: (params) => api.get('/stores/all', { params }),
  getById: (id) => api.get(`/stores/${id}`),
  create: (storeData) => api.post('/stores/create', storeData),
  getMy: () => api.get('/stores/my-stores'),
  update: (id, storeData) => api.put(`/stores/${id}`, storeData),
  delete: (id) => api.delete(`/stores/${id}`),
};

export const ratingsAPI = {
  getByStore: (storeId) => api.get(`/ratings/store/${storeId}`),
  getById: (id) => api.get(`/ratings/${id}`),
  submit: (ratingData) => api.post('/ratings/submit', ratingData),
  getMy: () => api.get('/ratings/my-ratings'),
  update: (id, ratingData) => api.put(`/ratings/${id}`, ratingData),
  delete: (id) => api.delete(`/ratings/${id}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  createUser: (userData) => api.post('/admin/users/create', userData),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  createStore: (storeData) => api.post('/admin/stores/create', storeData),
  getStores: (params) => api.get('/admin/stores', { params }),
};

export const storeOwnerAPI = {
  getDashboard: () => api.get('/store-owner/dashboard'),
  getRatingsUsers: (storeId) => 
    storeId ? api.get(`/store-owner/ratings/users/${storeId}`) : api.get('/store-owner/ratings/users'),
  getStoreStats: (storeId) => api.get(`/store-owner/store/${storeId}/stats`),
};

export default api;