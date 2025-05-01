import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); 
    if (token) {  
      config.headers.Authorization = `Bearer `+`${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    // Manejo global de errores
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
