import api from "@/utils/axios";
import type { UploadedVideo } from "@shared/types/uploaded_video";
import type { VideoFilters } from "@shared/types/video_filters";
import type { APIResponse } from "@shared/types/response";

export async function getLibraryList(filter: VideoFilters) {
  const res = await api.get<APIResponse<UploadedVideo[]>>("/library", {
    params: filter,
  });
  return res.data;
}
