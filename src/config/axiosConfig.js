import axios from "axios";
import { Platform } from "react-native";
import store from "../redux/store";
import {logout} from "../redux/actions/authAction";

const localhost = "192.168.1.20";

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

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging
    console.log(`🚀 [API Call] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('Headers:', config.headers);
    if (config.params) {
      console.log('Query Params:', config.params);
    }
    if (config.data) {
      console.log('Request Body:', config.data);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if ((error.response?.status === 403 || error.response?.status === 401) && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;
        
        if (!refreshToken) {
          // No refresh token available, trigger logout
          store.dispatch(logout());
          return Promise.reject(error);
        }

        // Call refresh token endpoint with token in header
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {}, {
          headers: {
            'Authorization': `Bearer ${refreshToken}`
          }
        });
        
        // Get new access token from response
        const newToken = response.data.accessToken;
        
        // Update the token in Redux store
        store.dispatch({ 
          type: "REFRESH_TOKEN_SUCCESS", 
          payload: { token: newToken } 
        });

        console.log("NEW TOKEN AFTER REFRESH :-----------------------------------------------------> ",newToken);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("Refresh token failed :-----------------------------------------------------> ", refreshError);
        // If refresh token fails, logout user
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    
    // If error is 403 after a refresh attempt, ensure logout
    if (error.response?.status === 403 && originalRequest._retry) {
      store.dispatch(logout());
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;