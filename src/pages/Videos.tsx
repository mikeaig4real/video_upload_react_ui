import CustomHeader from "@/components/ui/custom-header";
import VideoCards from "@/components/ui/video-cards";
import { useStore } from "@/store/useStore";
import { filterVideosByStatus } from "@/utils/uploaded_videos";
import { Link } from "react-router";

const Videos = () =>
{
  const { uploadedFiles } = useStore()
  const allowedVideos = filterVideosByStatus(uploadedFiles, [
    "completed",
    "processing",
    "uploading",
  ]);
  return allowedVideos.length ? (
    <VideoCards videos={allowedVideos} />
  ) : (
    <CustomHeader
      header="No videos uploaded/in-progress"
      description={
        <span>
          <Link
            className="text-purple-500 hover:underline"
            to="/dashboard/upload"
          >
            Upload
          </Link>{" "}
          videos to see them here
        </span>
      }
    />
  );
};

export default Videos;
