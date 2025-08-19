import { z } from "zod";

const id = z.union([z.string(), z.number()]);
const created_at = z.date()
const updated_at = z.date().optional();
const is_public = z.boolean()
const title = z.string();
const description = z.string();
const upload_url = z.url()
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
});
export type Video = z.infer<typeof videoSchema>;

export type OptionalVideo = Partial<Video>;