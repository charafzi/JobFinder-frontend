import axios from "axios";
import { Platform } from "react-native";

const localhost = "192.168.1.111";

export const API_BASE_URL = `http://${localhost}:8091`;
export const WEBSOCKETIO_URL = `http://${localhost}:8092`;
export const ENTREPRISE_IMAGE_URL = `http://${localhost}:8091/api/entreprise/profile-picture/`;
export const CANDIDAT_IMAGE_URL = `http://${localhost}:8091/api/candidat/profile-picture/`;
export const DOCUMENT_URL = `http://${localhost}:8091/api/candidat/document`;

// Create a function to get store that can be set later
let getStore = () => null;
export const setStore = (store) => {
  getStore = () => store;
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  webSocketURL: WEBSOCKETIO_URL,
  timeout: 15000, // Increased to 15 seconds
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
    const store = getStore();
    if (!store) return config;
    
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error('Response error:', error);
    
    const store = getStore();
    if (!store) return Promise.reject(error);

    const originalRequest = error.config;
    const state = store.getState();

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry && state.auth.refreshToken) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {
          refreshToken: state.auth.refreshToken
        });

        const { token } = response.data;
        
        // Update the token in Redux store
        store.dispatch({ type: 'auth/refreshToken', payload: token });
        
        // Update the token in the original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // If refresh fails, redirect to login
        store.dispatch({ type: 'auth/logout' });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
