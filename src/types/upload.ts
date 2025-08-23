import { MAX_VIDEO_SIZE, VIDEO_FORMAT_REGEX } from "@/assets/constants";
import { z } from "zod";
export const upload_bucket_enum = z.enum([
  "cloudinary",
  "s3",
  "google_cloud_storage",
]);

export const upload_params = z.object({
  folder: z.string().optional().default("videos"),
  title: z.string(),
  file: z.string().regex(VIDEO_FORMAT_REGEX),
  size: z.number().min(0).max(MAX_VIDEO_SIZE),
});

export const uploadOutputSchema = z.object({
  upload_url: z.url(),
  fields: z.record(z.string(), z.any()),
  asset_id: z.string(),
  upload_provider: upload_bucket_enum,
});

export type UploadInput = z.infer<typeof upload_params>;

export type UploadOutput = z.infer<typeof uploadOutputSchema>;
