import { API_BASE_URL, REDIRECT_URL } from "@/assets/constants";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { toast } from "sonner";
import { warn, log } from "@/utils/logger";
import { normalizeError } from "@/utils/error";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config?.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    log({
      error,
    });
    const message = normalizeError(error);
    toast.error(message, {
      duration: 4000,
    });
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      // todo: implement refresh token
      warn("Unauthorized - redirecting and clearing session");
      useAuthStore.getState().logOut();
      window.location.href = REDIRECT_URL;
    }
    return Promise.reject(error);
  }
);

export default api;
