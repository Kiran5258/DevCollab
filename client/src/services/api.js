import axios from 'axios';

const isProduction = import.meta.env.MODE === 'production';

const API = axios.create({
  baseURL: isProduction ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api'),
});

// Add a request interceptor to include JWT token
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
