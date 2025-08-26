import api from '@/utils/axios';
import { type FilterParams, type Video } from '@/types/video';
import type { UploadedVideo } from "@/types/uploaded_video";

export async function getVideos(filter: FilterParams) {
  const res = await api.get<Video[]>("/video", {
    params: filter,
  });
  return res.data;
}

export async function getVideoById(id: string) {
  const res = await api.get<Video | null>(`/video/${id}`);
  return res.data;
}

export async function createVideo(uploadedVideo: UploadedVideo) {
  const res = await api.put<Video>("/video", uploadedVideo);
  return res.data;
}
