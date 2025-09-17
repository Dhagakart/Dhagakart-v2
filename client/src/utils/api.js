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
  console.log("Axios request interceptor. Cookies stored: ", document.cookie)
  config.withCredentials = true;
  const token = getCookie('token')
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

// Fix: Read token from the cookie instead of Localstorage
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export default api;

// import axios from 'axios';

// // Create an axios instance with the new relative baseURL
// const api = axios.create({
//   baseURL: '/api/v1', // This now points to the Vercel proxy
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default api;