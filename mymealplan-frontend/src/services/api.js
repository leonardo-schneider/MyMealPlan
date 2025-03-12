// src/services/api.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Attach token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
      refresh: refreshToken
    });
    localStorage.setItem('access_token', response.data.access);
    return response.data.access;
  } catch (error) {
    // If refresh fails, remove tokens and optionally redirect to login
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    throw error;
  }
};

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        // Update the header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Optionally, redirect to login page here
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
