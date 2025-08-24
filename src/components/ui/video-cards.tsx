import VideoCard from "@/components/ui/video-card";
import type { UploadedVideo } from "@/types/uploaded_video";

export interface VideoCardsProps {
  videos: UploadedVideo[];
}

export default function VideoCards({ videos }: VideoCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr w-full h-full">
      {videos.map((video, index) => (
        <VideoCard key={video.id} file={video} idx={index} />
      ))}
    </div>
  );
}
