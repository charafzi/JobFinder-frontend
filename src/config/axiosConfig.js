import axios from "axios";
import { Platform } from "react-native";

const isAndroid = Platform.OS === "android";
const localhost = isAndroid ? "192.168.1.2" : "localhost";

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
  }
});

export default axiosInstance;
