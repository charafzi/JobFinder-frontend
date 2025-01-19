import axios from "axios";
import { Platform } from "react-native";
import store from '../redux/store';

const isAndroid = Platform.OS === "android";
const localhost ="192.168.1.111";

export const API_BASE_URL = `http://${localhost}:8091`;
export const WEBSOCKETIO_URL = `http://${localhost}:8092`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  webSocketURL: WEBSOCKETIO_URL,
  timeout: 15000, // augmenté à 15 secondes
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
