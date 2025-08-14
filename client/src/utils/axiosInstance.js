import axios from "axios";
import { BACKEND_API_URL } from "../config/config";

console.log(BACKEND_API_URL);

export const axiosInstance = axios.create({
  baseURL: BACKEND_API_URL,
});
