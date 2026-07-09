import axios from 'axios';
import toast from 'react-hot-toast';

const baseURL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1`;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer Token if present
axiosInstance.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for generic error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data; // Directly return response body data (typical generalResponse wrapped format)
  },
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response?.data?.status?.message || error.response?.data?.message || error.message || 'Something went wrong';

    if (status === 401) {
      // Clear localStorage info upon unauthorized token expiry
      localStorage.removeItem('userInfo');
      // Redirect or let auth context handles it
    } else if (status === 403) {
      toast.error('Permission denied: ' + message);
    } else if (status === 404) {
      // Not found - let page handle it
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;
