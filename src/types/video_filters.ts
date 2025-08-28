import type { UploadedVideo } from "./uploaded_video";

export type OrderBy = "created_at" | "updated_at";
export type Order = "desc" | "asc";

export interface VideoFilters {
  // pagination related
  limit: number;
  page: number;
  order_by: OrderBy;
  order: Order;

  // video related
  title?: string;
  type?: string;
  upload_status?: UploadedVideo["upload_status"];
  label?: UploadedVideo["label"];
  is_public?: boolean;
}

export const DEFAULT_FILTERS: VideoFilters = {
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
