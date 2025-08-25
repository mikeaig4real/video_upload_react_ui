import type { UploadedVideo } from "@/types/uploaded_video";
import hash from "object-hash";
import z from "zod";

export function formatDuration(seconds: number): string {
  if (!seconds) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const paddedMins = `${mins}`.padStart(2, "0");
  const paddedSecs = `${secs}`.padStart(2, "0");
  return `${paddedMins}:${paddedSecs}`;
}

export function extractFileNameAndExt(filename: string): [string, string] {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) {
    return [filename, ""];
  }

  const name = filename.slice(0, lastDot);
  const ext = filename.slice(lastDot + 1);
  return [name, ext];
}

export const getVideoPixel = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  let label = `${height}p`;
  if (width >= 3840) label = "4K";
  if (width >= 1920) label = "1080p";
  if (width >= 1280) label = "720p";
  return label;
};

export const dpSchema = z.enum(["240p", "360p", "480p", "720p", "1080p", "4K"]);
export type DP = z.infer<typeof dpSchema>;
export function generateVideoMetadata(
  file: UploadedVideo,
  captureTime: number = 1
): Promise<UploadedVideo> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file as Blob);
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");

    video.preload = "metadata";
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    let duration = 0;
    let width = 0;
    let height = 0;

    video.addEventListener("loadeddata", () => {
      const time = Math.min(captureTime, Math.floor(video.duration / 5));
      width = video.videoWidth;
      height = video.videoHeight;
      duration = video.duration;
      video.currentTime = time;
    });

    video.addEventListener("seeked", () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Canvas context not available");
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const thumbnail_url = canvas.toDataURL("image/png");
      const [title, ] = extractFileNameAndExt(file.name);
      const upload_hash = makeVideoHash( file );

      // attach ui/file metadata
      file.upload_status = "idle";
      file.title = title;
      file.upload_hash = upload_hash;
      file.id = upload_hash;
      file.description = "";
      file.is_public = true;

      // attach video metadata
      file.playback_url = url;
      file.upload_url = url;
      file.thumbnail_url = thumbnail_url;
      file.duration = duration;
      file.width = width;
      file.height = height;
      // URL.revokeObjectURL(url);
      video.remove();
      canvas.remove();
      resolve(file);
    });

    video.addEventListener("error", (err) => {
      // URL.revokeObjectURL(url);
      video.remove();
      canvas.remove();
      reject(err);
    });
  });
}

export const checkVideoDuplicate = (
  uploaded: UploadedVideo,
  existing: UploadedVideo[]
) => {
  if (existing.some((video) => video.id === uploaded.id)) return true;
  return false;
};

export function makeVideoHash(file: UploadedVideo): string {
  return hash({
    lastModified: file.lastModified,
    size: file.size,
    type: file.type,
    width: file?.width,
    height: file?.height,
  });
}
