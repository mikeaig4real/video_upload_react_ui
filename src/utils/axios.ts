import { API_BASE_URL, REDIRECT_URL } from "@/assets/constants";
import { useStore } from "@/store/useStore";
import axios from "axios";
import { toast } from "sonner";
import { warn } from "@/utils/logger";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useStore.getState().token;
  if (token && config?.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const {
      response: { status, data },
    } = error;
    const message =
      data?.description || data?.message || "Something went wrong";
    toast.error(message, {
      duration: 4000,
    });
    if (status === 401 || status === 403) {
      // todo: implement refresh token
      warn("Unauthorized - redirecting and clearing session");
      useStore.getState().logOut();
      window.location.href = REDIRECT_URL;
    }
    return Promise.reject(error);
  }
);

export default api;
