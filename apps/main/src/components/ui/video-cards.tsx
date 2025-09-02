import { useState, useCallback, useMemo } from "react";
import VideoCard from "./video-card";
import VideoFiltersComponent from "./video-filters";
import type { UploadedVideo } from "@shared/types/uploaded_video";
import type { VideoFilters } from "@shared/types/video_filters";

export interface VideoCardsProps {
  videos: UploadedVideo[];
  onFiltersChange?: (filters: VideoFilters) => void;
  isLoading?: boolean;
}

export default function VideoCards({
  videos,
  onFiltersChange,
  isLoading = false,
}: VideoCardsProps) {
  const [currentFilters, setCurrentFilters] = useState<VideoFilters | null>(
    null
  );

  const handleFiltersChange = useCallback(
    (filters: VideoFilters) => {
      setCurrentFilters(filters);
      onFiltersChange?.(filters);
    },
    [onFiltersChange]
  );

  const filteredVideos = useMemo(() => {
    if (!currentFilters || onFiltersChange) {
      // If external handler exists, assume filtering is done externally
      return videos;
    }

    return videos
      .filter((video) => {
        // Title filter
        if (
          currentFilters.title &&
          !video.title
            ?.toLowerCase()
            .includes(currentFilters.title.toLowerCase())
        ) {
          return false;
        }

        // Type filter
        if (
          currentFilters.type &&
          !video.type?.toLowerCase().includes(currentFilters.type.toLowerCase())
        ) {
          return false;
        }

        // Upload status filter
        if (
          currentFilters.upload_status &&
          video.upload_status !== currentFilters.upload_status
        ) {
          return false;
        }

        // Label filter
        if (currentFilters.label && video.label !== currentFilters.label) {
          return false;
        }

        // Public filter
        if (
          currentFilters.is_public !== undefined &&
          video.is_public !== currentFilters.is_public
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Client-side sorting
        const aValue =
          currentFilters.order_by === "created_at"
            ? a.created_at
            : a.updated_at;
        const bValue =
          currentFilters.order_by === "created_at"
            ? b.created_at
            : b.updated_at;

        if (!aValue || !bValue) return 0;

        const comparison =
          new Date(aValue).getTime() - new Date(bValue).getTime();
        return currentFilters.order === "desc" ? -comparison : comparison;
      })
      .slice(
        (currentFilters.page - 1) * currentFilters.limit,
        currentFilters.page * currentFilters.limit
      );
  }, [videos, currentFilters, onFiltersChange]);

  return (
    <div className="w-full h-full flex flex-col relative">
      <VideoFiltersComponent
        onFiltersChange={handleFiltersChange}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr w-full flex-1 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200">
        {filteredVideos.map((video, index) => (
          <VideoCard key={video.id} file={video} idx={index} />
        ))}
        {filteredVideos.length === 0 && (
          <div className="col-span-full flex items-center justify-center py-12 text-muted-foreground">
            {isLoading
              ? "Loading videos..."
              : "No videos found matching your filters."}
          </div>
        )}
      </div>
    </div>
  );
}
