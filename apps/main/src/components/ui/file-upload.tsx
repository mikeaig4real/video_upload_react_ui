import { cn } from "@/lib/utils";
import { useRef } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { formatGroupedErrors } from "@/utils/file_upload_errors";
import VideoCard from "@/components/ui/video-card";
import { convertSize } from "@/utils/conversions";
import {
  videoFileSchema,
  type UploadedVideo,
} from "@shared/types/uploaded_video";
import { checkVideoDuplicate, generateVideoMetadata } from "@/utils/video_file";
import { log } from "@/utils/logger";
import { filterVideosByStatus } from "@/utils/uploaded_videos";
import { resolveUploadedVideos } from "@/utils/video_file";
import { MAX_UPLOAD_COUNT, VIDEO_SPECS } from "@shared/assets/constants";
import { useVideoStore } from "@/store/useVideoStore";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

const toastId = "FileUpload";
export const FileUpload = () => {
  const { uploadedFiles, setUploadedFiles } = useVideoStore();
  const allowedVideos = filterVideosByStatus(uploadedFiles, ["error", "idle"]);
  const inProgressVideos = filterVideosByStatus(uploadedFiles, [
    "processing",
    "uploading",
  ]);
  const activeCount = allowedVideos.length + inProgressVideos.length;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (newFiles: UploadedVideo[]) => {
    if (!newFiles.length) return;
    if (activeCount + newFiles.length > MAX_UPLOAD_COUNT) {
      toast(
        `You cannot have more than ${MAX_UPLOAD_COUNT} files uploadable (and/or uploading), please discard ${
          activeCount - MAX_UPLOAD_COUNT
        } file(s) or let active uploading/processing videos complete`,
        {
          id: toastId,
        }
      );
      return;
    }
    toast.loading("Processing file(s)...", {
      id: toastId,
    });
    for (const file of newFiles) {
      const result = videoFileSchema.safeParse({ file });
      if (!result.success) {
        toast.error(result.error.issues[0].message, {
          id: toastId,
        });
        return;
      }
      await generateVideoMetadata(file);
      const isDuplicate = !uploadedFiles.length
        ? false
        : checkVideoDuplicate(file, uploadedFiles);
      if (isDuplicate) {
        toast.error(`Duplicate file encountered: ${file.name}`, {
          id: toastId,
        });
        return;
      }
    }
    toast.success("Processed & added files.", {
      id: toastId,
    });
    setUploadedFiles(
      resolveUploadedVideos(uploadedFiles, newFiles) // comment to allow duplication
      // [...uploadedFiles, ...newFiles] // uncomment to test multiple uploadable files
    );
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    ...VIDEO_SPECS,
    onDropRejected: (errors) => {
      log(errors);
      const message = formatGroupedErrors(errors);
      toast.error(message, {
        id: toastId,
      });
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            Upload Video file
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            {`Drag/Drop your files here (${MAX_UPLOAD_COUNT} MAX) or click to upload (size must be ${convertSize(
              VIDEO_SPECS.maxSize,
              "B",
              "MB"
            )}Mb i.e ${VIDEO_SPECS.maxSize} bytes) or less`}
          </p>
          <div
            className={`relative mt-10 mx-auto ${
              allowedVideos.length > 0
                ? "grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr w-full"
                : "w-full"
            }`}
          >
            {allowedVideos.length > 0 &&
              allowedVideos.map((file, idx) => (
                <VideoCard
                  key={`video-card-${idx}-${file.name}`}
                  file={file}
                  idx={idx}
                />
              ))}
            {!allowedVideos.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}
            {!allowedVideos.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
