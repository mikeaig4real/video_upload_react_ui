import type { UploadedVideo } from "@/types/uploaded_video";
// import hash from "object-hash";
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
export type DP = z.infer<typeof dpSchema>;

export const getVideoPixel = ({
  width,
  height,
}: {
  width: number;
  height: number;
}): DP => {
  if (width >= 3840 || height >= 2160) return "4K";
  if (width >= 1920 || height >= 1080) return "1080p";
  if (width >= 1280 || height >= 720) return "720p";
  if (width >= 854 || height >= 480) return "480p";
  if (width >= 640 || height >= 360) return "360p";
  return "240p";
};

export const dpSchema = z.enum(["240p", "360p", "480p", "720p", "1080p", "4K"]);
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

    video.addEventListener("seeked", async () => {
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
      const upload_hash = await makeVideoHash(file, 128);

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

export async function makeVideoHash(file: File, chunk = 8): Promise<string> {
  const chunkSize = chunk * 1024; // chunk KB slices
  const middle = Math.floor(file.size / 2);

  // Take slices: front, middle, back
  const slices = [
    file.slice(0, chunkSize),
    file.slice(middle - chunkSize / 2, middle + chunkSize / 2),
    file.slice(file.size - chunkSize, file.size),
  ];

  // Read and concatenate slices
  const buffers = await Promise.all(slices.map((slice) => slice.arrayBuffer()));
  const combined = new Blob(buffers);

  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    await combined.arrayBuffer()
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Convert to hex string (64 chars)
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// export function makeVideoHash(file: UploadedVideo): string {
//   return hash({
//     lastModified: file.lastModified,
//     size: file.size,
//     type: file.type,
//     width: file?.width,
//     height: file?.height,
//   });
// }
