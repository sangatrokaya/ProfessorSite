import axios from "axios";
import { store } from "@/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

api.interceptors.request.use((config) => {
  const { adminInfo } = store.getState().auth;

  if (adminInfo?.token) {
    config.headers.Authorization = `Bearer ${adminInfo.token}`;
  }
  return config;
});

export default api;
