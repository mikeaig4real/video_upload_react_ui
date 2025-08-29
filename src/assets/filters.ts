import type { VideoFilters } from "@/types/video_filters";

export const VIDEO_FILTER_DEFAULTS: VideoFilters = {
  limit: 100,
  page: 1,
  order_by: "created_at",
  order: "asc",
  title: undefined,
  type: undefined,
  upload_status: undefined,
  label: undefined,
  is_public: undefined,
};