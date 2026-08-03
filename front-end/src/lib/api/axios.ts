import axios from 'axios';

// Get base URL from env or use default localhost (NestJS default)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // We will handle tokens from cookies/localStorage here later if needed.
    // In Next.js App Router we often pass tokens differently, but for now we'll 
    // try to get from localStorage if it's running in browser.
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g. redirect to login or refresh token)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
