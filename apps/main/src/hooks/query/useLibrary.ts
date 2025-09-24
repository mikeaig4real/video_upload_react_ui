import { useQuery } from "@tanstack/react-query";
import { LibraryAPI } from "@/api";
import type { VideoFilters } from "@shared/types/video_filters";

export function useLibraryList(filter: VideoFilters) {
  return useQuery({
    queryKey: ["library", filter],
    queryFn: () => LibraryAPI.getLibraryList(filter),
    staleTime: 1000 * 60,
  });
}
