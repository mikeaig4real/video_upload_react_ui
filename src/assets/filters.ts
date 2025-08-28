import type { FilterParams } from "@/types/video";

export const VIDEO_FILTER_DEFAULTS: FilterParams = {
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