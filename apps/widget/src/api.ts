import { type APIResponse } from "@shared/types/response";
import { type UploadedVideo } from "@shared/types/uploaded_video";
import axios from "axios";
import { logger } from "./utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.description ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    logger.log(message);
    return Promise.reject(error);
  }
);

export async function fetchVideo(id: string) {
  const response = await api.get<APIResponse<UploadedVideo>>(`/library/${id}`);
  return response.data;
}
