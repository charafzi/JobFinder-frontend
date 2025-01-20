import axios from "axios";

const localhost = "192.168.1.30";

export const API_BASE_URL = `http://${localhost}:8091`;
export const WEBSOCKETIO_URL = `http://${localhost}:8092`;
export const ENTREPRISE_IMAGE_URL = `http://${localhost}:8091/api/entreprise/profile-picture/`;
export const CANDIDAT_IMAGE_URL = `http://${localhost}:8091/api/candidat/profile-picture/`;
export const DOCUMENT_URL = `http://${localhost}:8091/api/candidat/document`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  webSocketURL: WEBSOCKETIO_URL,
  timeout: 8000, // 8 seconds
  IMAGES: {
    ENTREPRISE: ENTREPRISE_IMAGE_URL,
    USER: CANDIDAT_IMAGE_URL
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.log('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
