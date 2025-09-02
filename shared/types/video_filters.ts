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
  title?: UploadedVideo["title"];
  type?: UploadedVideo["type"];
  upload_status?: UploadedVideo["upload_status"];
  label?: UploadedVideo["label"];
  is_public?: UploadedVideo["is_public"];
}
