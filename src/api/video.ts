import api from '@/utils/axios';
import { type Video } from '@/types/video';

export async function getVideos() {
  const res = await api.get<Video[]>('/video');
  return res.data;
}

export async function getVideoById(id: string) {
  const res = await api.get<Video | null>(`/video/${id}`);
  return res.data;
}

export async function createVideo(text: string) {
  const res = await api.post<Video>('/video', { text });
  return res.data;
}
