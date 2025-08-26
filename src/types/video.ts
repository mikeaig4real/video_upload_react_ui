import { dpSchema } from "@/utils/video_file";
import { z } from "zod";
import { uploadStatusSchema } from "@/types/uploaded_video";

const id = z.union([z.string(), z.number()]);
const created_at = z.date();
const updated_at = z.date().optional();
const is_public = z.boolean();
const title = z.string();
const description = z.string();
const upload_url = z.url();
const user_id = z.union([z.string(), z.number()]);

export const videoSchema = z.object({
  id,
  title,
  description,
  created_at,
  updated_at,
  is_public,
  upload_url,
  user_id,
} );
// todo: refactor schema wide repetitions
export type Video = z.infer<typeof videoSchema>;

export const FilterParamsSchema = z
  .object({
    limit: z.number().int().gt(0).lte(100).default(100),
    page: z.number().int().gte(1).default(1),
    order_by: z.enum(["created_at", "updated_at"]).default("created_at"),
    order: z.enum(["desc", "asc"]).default("asc"),
    title: z.string().optional(),
    type: z.string().optional(),
    upload_status: uploadStatusSchema.optional(),
    label: dpSchema.optional(),
    is_public: z.boolean().optional(),
  })
  .strict();

export type FilterParams = z.infer<typeof FilterParamsSchema>;

export type OptionalVideo = Partial<Video>;
