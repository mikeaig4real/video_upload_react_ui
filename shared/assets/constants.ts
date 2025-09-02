import { convertSize } from "../utils/conversions";
export const VIDEO_SPECS = {
  accept: {
    "video/*": [],
  },
  maxSize: convertSize(10, "MB", "B"),
};
export const VIDEO_FORMAT_REGEX = /video\/(mp4|mov|wmv|flv|avi|avchd|webm|mkv|mpeg-2|3gp)$/i;
export const MAX_VIDEO_SIZE = convertSize(10, "MB", "B"); // 10MB in bytes
export const MAX_UPLOAD_COUNT = 5;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
export const FORM_INPUT_MIN = 10;
export const FORM_INPUT_MAX = 50;