import { VIDEO_SPECS } from "../assets/constants";
import { z } from "zod";
export const dpSchema = z.enum(["240p", "360p", "480p", "720p", "1080p", "4K"]);
export type DP = z.infer<typeof dpSchema>;

export const idType = z.union([z.string(), z.number()]);
export const isGeneratingType = z.boolean();
export const titleType = z.string();
export const pathType = z.string();
export const relativePathType = z.string();
export const uploadStatusType = z.enum([
  "idle",
  "uploading",
  "processing",
  "completed",
  "error",
]);
export const uploadProgressType = z.number().min(0).max(100);
export const uploadDetailsType = z.unknown();
export const uploadUrlType = z.string().url();
export const descriptionType = z.string();
export const isPublicType = z.boolean();
export const createdAtType = z.date();
export const updatedAtType = z.date();
export const uploadHashType = z.string();
export const uploadProviderType = z.string();
export const assetIdType = z.string();
export const thumbnailUrlType = z.string().url();
export const playbackUrlType = z.string().url();
export const durationType = z.number();
export const widthType = z.number();
export const heightType = z.number();
export const labelType = dpSchema;

export const fileSchema = z.instanceof(File);

export const uploadedVideoSchema = z.intersection(
  fileSchema,
  z.object({
    id: idType.optional(),
    is_generating: isGeneratingType.optional(),
    title: titleType.optional(),
    path: pathType.optional(),
    relativePath: relativePathType.optional(),
    upload_status: uploadStatusType.optional(),
    upload_progress: uploadProgressType.optional(),
    upload_details: uploadDetailsType.optional(),
    upload_url: uploadUrlType.optional(),
    description: descriptionType.optional(),
    is_public: isPublicType.optional(),
    created_at: createdAtType.optional(),
    updated_at: updatedAtType.optional(),
    upload_hash: uploadHashType.optional(),
    upload_provider: uploadProviderType.optional(),
    asset_id: assetIdType.optional(),
    thumbnail_url: thumbnailUrlType.optional(),
    playback_url: playbackUrlType.optional(),
    duration: durationType.optional(),
    width: widthType.optional(),
    height: heightType.optional(),
    label: labelType.optional(),
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
