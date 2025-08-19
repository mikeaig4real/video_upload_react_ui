import { VIDEO_SPECS } from "@/assets/constants";
import type { DP } from "@/utils/video_file";
import { z } from "zod";
export type UploadedVideo = File & {
  id?: string | number;
  isGenerating?: boolean;
  editedName?: string;
  path?: string;
  relativePath?: string;
  metadata?: {
    url: string;
    thumbnail: string;
    duration: number;
    durationStr: string;
    width: number;
    height: number;
    label: string | DP;
  };
};


export type OptionalUploadedVideo = Partial<UploadedVideo>;

export type VideoSource = {
    src: string;
    type: string;
}

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




