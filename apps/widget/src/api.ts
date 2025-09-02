import axios from "axios";
// import { type UploadResponse } from "@shared/types/upload";
// import type { APIResponse } from "@shared/types/response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const VITE_ENV = import.meta.env.VITE_ENV;
// const IS_PROD = VITE_ENV === "production";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.description ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    console.log(message);
    return Promise.reject(error);
  }
);

export async function fetchVideo(id: string): Promise<any> {
  const response = await api.get(`/embed/video${id}`);
  return response.data;
}
