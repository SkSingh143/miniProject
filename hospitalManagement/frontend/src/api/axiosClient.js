import axios from 'axios';

// Create an Axios instance with default configuration
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attaches the JWT token to the Authorization header
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handles global error responses (e.g., 401 Unauthorized)
axiosClient.interceptors.response.use(
  (response) => {
    
    
    return response.data;
  },
  (error) => {
    // Optional: Auto-logout on 401 response
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      // window.location.href = '/login'; // Optional redirect
    }
    return Promise.reject(error);
  }
);

export default axiosClient;