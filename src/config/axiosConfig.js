import axios from "axios";
import { Platform } from "react-native";

const isAndroid = Platform.OS === "android";
const localhost = isAndroid ? "192.168.1.2" : "localhost";


export const API_BASE_URL = `http://${localhost}:8091`;
export const WEBSOCKETIO_URL = `http://${localhost}:8092`;
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  webSocketURL: WEBSOCKETIO_URL,
  timeout: 8000, // 8 seconds
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
