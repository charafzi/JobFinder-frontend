import axios from "axios";
import { Platform } from "react-native";

const isAndroid = Platform.OS === "android";
const localhost = isAndroid ? "192.168.1.7" : "localhost";

export const API_BASE_URL = `http://${localhost}:8020/api/v1`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export default axiosInstance;
