import axios from 'axios';

/**
 * Axios Instance Configuration
 * 
 * BACKEND INTEGRATION NOTE:
 * Update the baseURL to your PHP backend URL (e.g., 'http://localhost:8000/api')
 * The interceptors will automatically attach JWT tokens from localStorage.
 */

const api = axios.create({
  baseURL: '/api', // TODO: Replace with actual backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
