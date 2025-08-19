import type { UploadedVideo } from "@/types/uploaded_video";
import hash from "object-hash"

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const paddedMins = `${mins}`.padStart(2, "0");
  const paddedSecs = `${secs}`.padStart(2, "0");
  return `${paddedMins}:${paddedSecs}`;
}

export const getVideoPixel = ( { width, height } : {
  width: number;
  height: number;
} ) =>
{
  let label = `${height}p`;
  if (width >= 3840) label = "4K";
  if (width >= 1920) label = "1080p";
  if ( width >= 1280 ) label = "720p";
  return label;
}

export type DP = "240p" | "360p" | "480p" | "720p" | "1080p" | "4K";
export function generateVideoThumbnail(
  file: UploadedVideo,
  captureTime: number = 1
): Promise<{
  url: string;
  thumbnail: string;
  duration: number;
  durationStr: string;
  width: number;
  height: number;
  label: string | DP;
}> {
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
    let label = "";

    video.addEventListener("loadeddata", () => {
      const time = Math.min(captureTime, video.duration - 0.5);
      width = video.videoWidth;
      height = video.videoHeight;
      duration = video.duration;
      label = getVideoPixel({ width, height });
      if (width >= 3840) label = "4K";
      if (width >= 1920) label = "1080p";
      if (width >= 1280) label = "720p";
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

      const thumbnail = canvas.toDataURL("image/png");

      // URL.revokeObjectURL(url);
      video.remove();
      canvas.remove();
      resolve({
        url,
        thumbnail,
        duration,
        durationStr: formatDuration(duration),
        width,
        height,
        label,
      });
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
) =>
{
  if (existing.some((video) => video.id === uploaded.id)) return true;
  return false;
};

export const makeVideoHash = (
  file: UploadedVideo
): string => {
  return hash({
    name: file.name,
    lastModified: file.lastModified,
    size: file.size,
    type: file.type,
    width: file.metadata?.width,
    height: file.metadata?.height,
  });
};
