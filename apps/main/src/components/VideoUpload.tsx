import { FileUpload } from "@/components/ui/file-upload";
import CustomButton from "@/components/CustomButton";
import { log } from "@/utils/logger";
import { notify } from "@/utils/notify";
import * as API from "@/api";
import { useNavigate } from "react-router";
import { filterVideosByStatus } from "@/utils/uploaded_videos";
import { MAX_UPLOAD_COUNT } from "@shared/assets/constants";
import { useVideoStore } from "@/store/useVideoStore";

export function VideoUpload() {
  const { uploadedFiles } = useVideoStore();
  const navigate = useNavigate();
  const allowedVideos = filterVideosByStatus(uploadedFiles, ["error", "idle"]);
  const inProgressVideos = filterVideosByStatus(uploadedFiles, [
    "processing",
    "uploading",
  ]);
  const activeCount = allowedVideos.length + inProgressVideos.length;
  const handleUpload = () => {
    log({ allowedVideos });
    notify(API.UploadAPI.uploadMultipleFilesToCloudBucket(allowedVideos), {
      loading: "Uploading file...",
    });
    navigate("/dashboard/videos");
  };
  return (
    <div className="relative bg-transparent w-full mx-auto border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload />
      {allowedVideos.length > 0 &&
        activeCount <= MAX_UPLOAD_COUNT && (
          <CustomButton
            onClick={handleUpload}
            className="absolute right-0 bottom-0"
            btnType="outline"
          >
            Upload
          </CustomButton>
        )}
    </div>
  );
}
