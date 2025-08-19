import { convertSize } from "@/utils/conversions";
const {
  VITE_APP_NAME = "Video_Hub",
  VITE_DEFAULT_THEME = "system",
  VITE_THEME_KEY = "vite-ui-theme",
  VITE_DEFAULT_FORM_TYPE = "register",
  VITE_API_TOKEN_NAME,
  VITE_PERSIST_KEY,
  VITE_REDIRECT_URL = "/get-started",
  VITE_API_BASE_URL,
  VITE_ENV = "development",
} = import.meta.env;

// todo: implement some validation with zod

export const DEFAULT_THEME = VITE_DEFAULT_THEME;
export const THEME_KEY = VITE_THEME_KEY;
export const DEFAULT_FORM_TYPE = VITE_DEFAULT_FORM_TYPE;
export const API_TOKEN_NAME = VITE_API_TOKEN_NAME;
export const PERSIST_KEY = VITE_PERSIST_KEY;
export const REDIRECT_URL = VITE_REDIRECT_URL;
export const API_BASE_URL = VITE_API_BASE_URL;
export const APP_NAME = VITE_APP_NAME;
export const IS_PROD = VITE_ENV === "production";
export const VIDEO_SPECS = {
  accept: {
    "video/*": [],
  },
  maxSize: convertSize(10, "MB", "B"),
};
