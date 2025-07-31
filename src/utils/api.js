// File: src/utils/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 15_000,
  withCredentials: true,
});

// Attach bearer token if present
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  err => Promise.reject(err)
);

// Global response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    const { response, config } = error;

    // 1) Network error (no response at all)
    if (!response) {
      // flag it so downstream catches can detect it
      error.isNetworkError = true;
      error.userMessage    = 'Unable to reach our servers. Please check your network connection and try again.';
      return Promise.reject(error);
    }

    // 2) Unauthorized 401 with token → redirect to login
    const status      = response.status;
    const sentAuth    = Boolean(config.headers?.Authorization);
    const currentPath = window.location.pathname;
    if (
      status === 401 &&
      sentAuth &&
      currentPath !== '/login'
    ) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return; // swallow further propagation
    }

    // 3) Other errors: just reject
    return Promise.reject(error);
  }
);

export default api;
