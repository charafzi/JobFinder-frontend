import axios from "axios";
import { Platform } from "react-native";

const isAndroid = Platform.OS === "android";
const localhost = isAndroid ? "192.168.1.2" : "localhost";

export const API_BASE_URL = `http://${localhost}:8091`;
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000 // 8 seconds
});

export default axiosInstance;
