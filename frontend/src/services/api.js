import axios from 'axios';

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

const isLanHost = window.location.hostname === '192.168.1.75';

const API = axios.create({
  baseURL: isLocalhost
    ? 'http://localhost:5000/api'
    : isLanHost
      ? 'http://192.168.1.75:5000/api'
      : (import.meta.env.VITE_API_URL || 'https://student-marketplace-kg2f.onrender.com/api'),
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
