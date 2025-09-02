import CustomHeader from "@/components/ui/custom-header";
import VideoCards from "@/components/ui/video-cards";
import { useStore } from "@/store/useStore";
import { notify } from "@/utils/notify";
import * as API from "@/api";
import { filterVideosByStatus } from "@/utils/uploaded_videos";
import { useEffect } from "react";
import { Link } from "react-router";
import type { UploadedVideo } from "@shared/types/uploaded_video";
import { resolveUploadedVideos } from "@/utils/video_file";
import { log } from "@/utils/logger";

const Videos = () => {
  const { uploadedFiles, videoFilters, setUploadedFiles } = useStore();
  const allowedVideos = filterVideosByStatus(uploadedFiles, [
    "completed",
    "processing",
    "uploading",
  ]);
  useEffect(() => {
    notify(API.VideoAPI.getVideos(videoFilters), {
      success: ({ data }: { data: UploadedVideo[] }) => {
        log(data);
        setUploadedFiles(resolveUploadedVideos(uploadedFiles, data));
        return data.length ? "Done" : "No videos...";
      },
      loading: "Loading..",
      error: "Could not load",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoFilters]);
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
