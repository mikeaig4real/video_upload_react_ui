import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VideoAPI } from "@/api";
import type { VideoFilters } from "@shared/types/video_filters";
import type { UploadedVideo } from "@shared/types/uploaded_video";

export function useVideos(filter: VideoFilters) {
  return useQuery({
    queryKey: ["videos", filter],
    queryFn: () => VideoAPI.getVideos(filter),
    staleTime: 1000 * 60 * 2,
  });
}

export function useVideoById(id: string) {
  return useQuery({
    queryKey: ["video", id],
    queryFn: () => VideoAPI.getVideoById(id),
    enabled: !!id,
  });
}

export function useCreateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uploadedVideo: UploadedVideo) =>
      VideoAPI.createVideo(uploadedVideo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}
