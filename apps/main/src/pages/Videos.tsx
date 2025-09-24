/* eslint-disable react-hooks/exhaustive-deps */
import CustomHeader from "@/components/ui/custom-header";
import VideoCards from "@/components/ui/video-cards";
import { filterVideosByStatus } from "@/utils/uploaded_videos";
import { Link } from "react-router";
import { useVideoStore } from "@/store/useVideoStore";
import { LoaderThree } from "@/components/ui/loader";
import { useVideos } from "@/hooks/query/useVideos";
import { normalizeError } from "@/utils/error";
import { log } from "@/utils/logger";
import { resolveUploadedVideos } from "@/utils/video_file";
import { useEffect } from "react";

const Videos = () => {
  const { uploadedFiles, videoFilters, setUploadedFiles } = useVideoStore();
  const {
    data: { data: videos } = { data: [] },
    isLoading,
    error,
  } = useVideos( videoFilters );
  
  log({
    videos,
    isLoading,
    error,
    uploadedFiles,
    videoFilters,
  });

  useEffect(() => {
    if (videos?.length) {
      setUploadedFiles(resolveUploadedVideos(uploadedFiles, videos));
    }
  }, [videos]);


  const allowedVideos = filterVideosByStatus(uploadedFiles, [
    "completed",
    "processing",
    "uploading",
  ]);

  if (isLoading) {
    return <CustomHeader header={<LoaderThree />} />;
  }

  if (error) {
    return <CustomHeader header="Error" description={normalizeError(error)} />;
  }

  if (allowedVideos.length) {
    return <VideoCards videos={allowedVideos} />;
  }

  return (
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
