import axios from "axios";
import { Platform } from "react-native";

const isAndroid = Platform.OS === "android";
// If you're using Android Emulator, use 10.0.2.2 instead of localhost
const localhost ="192.168.1.111" ;

export const API_BASE_URL = `http://${localhost}:8091`;
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // increased timeout to 15 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.log('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
