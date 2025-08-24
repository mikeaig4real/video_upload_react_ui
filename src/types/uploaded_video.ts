import { VIDEO_SPECS } from "@/assets/constants";
import { dpSchema } from "@/utils/video_file";
import { z } from "zod";

export const fileSchema = z.instanceof(File);

export const uploadedVideoSchema = z.intersection(
  fileSchema,
  z.object({
    id: z.union([z.string(), z.number()]).optional(),
    is_generating: z.boolean().optional(),
    title: z.string().optional(),
    path: z.string().optional(),
    relativePath: z.string().optional(),
    upload_status: z
      .enum(["idle", "uploading", "processing", "completed", "error"])
      .optional(),
    upload_progress: z.number().min(0).max(100).optional(),
    upload_details: z.unknown().optional(),
    upload_url: z.url().optional(),
    description: z.string().optional(),
    is_public: z.boolean().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    upload_hash: z.string().optional(),
    upload_provider: z.string().optional(),
    asset_id: z.string().optional(),
    thumbnail_url: z.url().optional(),
    playback_url: z.url().optional(),
    duration: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    label: dpSchema.optional(),
  })
);

export type UploadedVideo = z.infer<typeof uploadedVideoSchema>;

export type OptionalUploadedVideo = Partial<UploadedVideo>;

export type VideoSource = {
  src: string;
  type: string;
};

export const videoFileSchema = z.object({
  file: z
    .custom<File>()
    .refine((file) => /^video\/.*/.test(file.type), {
      message: "File type must be video/*",
    })
    .refine((file) => file.size <= VIDEO_SPECS.maxSize, {
      message: `File is larger than ${VIDEO_SPECS.maxSize} bytes`,
    }),
});
