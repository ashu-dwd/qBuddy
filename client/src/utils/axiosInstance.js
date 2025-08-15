import axios from "axios";
import { BACKEND_API_URL } from "../config/config";
export const axiosInstance = axios.create({
  baseURL: BACKEND_API_URL,
});
