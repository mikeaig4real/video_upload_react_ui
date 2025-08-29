import api from "@/utils/axios";
import type {
  UploadedVideo,
  OptionalUploadedVideo,
} from "@/types/uploaded_video";
import { log } from "@/utils/logger";
import type { VideoFilters } from "@/types/video_filters";

export async function getVideos(filter: VideoFilters) {
  const res = await api.get<UploadedVideo[]>("/video", {
    params: filter,
  });
  return res.data;
}

export async function getVideoById(id: string) {
  const res = await api.get<UploadedVideo | null>(`/video/${id}`);
  return res.data;
}

export async function createVideo(uploadedVideo: UploadedVideo) {
  try {
    const videoFile: OptionalUploadedVideo = {
      title: uploadedVideo.title,
      description: uploadedVideo.description,
      is_public: uploadedVideo.is_public,
      size: uploadedVideo.size,
      label: uploadedVideo.label,
      upload_hash: uploadedVideo.upload_hash,
      upload_provider: uploadedVideo.upload_provider,
      asset_id: uploadedVideo.asset_id,
      thumbnail_url: uploadedVideo.thumbnail_url,
      playback_url: uploadedVideo.playback_url,
      type: uploadedVideo.type,
      upload_status: "completed",
      upload_url: uploadedVideo.upload_url,
      duration: uploadedVideo.duration,
    };
    const res = await api.put<UploadedVideo>("/video", videoFile);
    return res.data;
  } catch (error) {
    log({
      error,
    });
    throw new Error("Failed to create video record");
  }
}
