import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://dhagakart.onrender.com/api/v1',
  // baseURL: 'http://localhost:4000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Authorization header
api.interceptors.request.use((config) => {
  config.withCredentials = true;
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       // Clear local token
//       localStorage.removeItem('token');

//       // Redirect to login page
//       window.location.href = 'https://dhagakart-jfaj.vercel.app/login';
//     }

//     return Promise.reject(error);
//   }
// );

// Optional helper to manually attach headers (e.g., fetch calls)
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default api;
