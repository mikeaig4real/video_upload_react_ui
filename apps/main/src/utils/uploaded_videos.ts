import type { UploadedVideo } from "@shared/types/uploaded_video";

export function filterVideosByStatus(
  videos: UploadedVideo[],
  statusAllowed: UploadedVideo["upload_status"][]
) {
  const allowedVideos = videos.filter(
    (file) => file.upload_status && statusAllowed.includes(file.upload_status)
  );
  return allowedVideos;
}

export function getActiveCount(videos: UploadedVideo[]) {
  const allowedVideos = filterVideosByStatus(videos, ["error", "idle"]);
  const inProgressVideos = filterVideosByStatus(videos, [
    "processing",
    "uploading",
  ]);
  return allowedVideos.length + inProgressVideos.length;
}
