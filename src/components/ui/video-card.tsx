import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  X,
  Play,
  FileVideo,
  Film,
  Check,
  XIcon,
  Edit3,
  Loader2,
  AlertCircle,
  CheckCircle,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  OptionalUploadedVideo,
  UploadedVideo,
} from "@/types/uploaded_video";
import { useStore } from "@/store/useStore";
import { convertSize } from "@/utils/conversions";
import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { formatDuration, getVideoPixel } from "@/utils/video_file";
import VideoForm, { type VideoFormProps } from "@/components/ui/video-form";

export interface VideoCardProps {
  file: UploadedVideo;
  idx: string | number;
  showSettingsBtn?: boolean;
  showTitleEditBtn?: boolean;
}

const formFields: VideoFormProps["fields"] = [
  {
    name: "title",
    label: "Title",
    placeholder: "Enter video title",
    description: "",
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Enter video description",
    description: "",
  },
  {
    name: "is_public",
    label: "Public",
    placeholder: "Change visibility",
    description: "",
    type: "checkbox",
  },
];

export default function VideoCard({
  file,
  idx,
  showSettingsBtn = ["completed"].includes(file.upload_status!),
  showTitleEditBtn = ["idle", "error"].includes(file.upload_status!),
}: VideoCardProps) {
  const {
    setActiveVideo,
    setActiveSources,
    uploadedFiles,
    setUploadedFiles,
    setUploadedVideoTitle,
    playerOptions,
    setPlayerOptions,
    setIsDialogOpen,
  } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(file.title);
  const [fileName, setFileName] = useState(file.title);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const getStatusInfo = () => {
    switch (file.upload_status) {
      case "uploading":
        return {
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          label: "Uploading",
          variant: "secondary" as const,
          color: "text-blue-600",
        };
      case "processing":
        return {
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          label: "Processing",
          variant: "secondary" as const,
          color: "text-yellow-600",
        };
      case "completed":
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          label: "Ready",
          variant: "secondary" as const,
          color: "text-green-600",
        };
      case "error":
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          label: "Error",
          variant: "destructive" as const,
          color: "text-red-300",
        };
      default:
        return null;
    }
  };

  const handleSave = () => {
    if (!title) {
      toast.error("File must have a title");
      return;
    }
    setUploadedVideoTitle(file, title);
    setFileName(title);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(fileName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleFormSave = () => {};

  const onPlay = () => {
    // if (file.upload_status !== "completed" && file.upload_status !== "idle") {
    //   toast.error("Video is not ready for playback");
    //   return;
    // }

    const videoObject: OptionalUploadedVideo = {
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      title: file.title,
      upload_url: file.upload_url,
      playback_url: file.playback_url,
    };
    const sources = [
      {
        src: videoObject.upload_url!,
        type: videoObject.type!,
      },
    ];
    setActiveVideo(videoObject);
    setActiveSources(sources);
    setPlayerOptions({
      ...playerOptions,
      autoplay: true,
      sources,
    });
    setIsDialogOpen(true);
  };

  const onClose = () => {
    const modifiedUploadedFiles = uploadedFiles.filter(
      (upload) => upload.id !== file.id
    );
    setUploadedFiles(modifiedUploadedFiles);
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <motion.div layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}>
        <Card
          onClick={(e) => e.stopPropagation()}
          className="@container/card relative w-full max-w-sm bg-transparent"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-[-0.5rem] right-[-0.5rem] z-50 h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white cursor-pointer flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
          {showSettingsBtn && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-[-0.5rem] left-[-0.5rem] z-50 h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white cursor-pointer flex-shrink-0"
              onClick={() => setIsFormOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Film className="h-3 w-3" />
                {getVideoPixel({
                  width: file.width!,
                  height: file.height!,
                })}
              </Badge>
              {statusInfo && (
                <Badge
                  variant={statusInfo.variant}
                  className={cn("flex items-center gap-1", statusInfo.color)}
                >
                  {statusInfo.icon}
                  {statusInfo.label}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 group min-w-0">
              {isEditing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  exit={{ scale: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                  className="flex items-center gap-1 flex-1"
                >
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="text-lg font-semibold h-8 px-2"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-green-600 hover:text-green-700 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave();
                    }}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-600 hover:text-red-700 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancel();
                    }}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  exit={{ scale: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                  className="flex items-center gap-1 flex-1 min-w-0"
                >
                  <CardTitle className="text-lg font-semibold truncate @[250px]/card:text-xl">
                    {fileName}
                  </CardTitle>
                  {showTitleEditBtn && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 h-6 w-6 transition-opacity text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                      }}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  )}
                </motion.div>
              )}
            </div>

            {file.upload_status === "uploading" &&
              typeof file.upload_progress === "number" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Uploading...</span>
                    <span>{Math.round(file.upload_progress)}%</span>
                  </div>
                  <Progress value={file.upload_progress} className="h-2" />
                </motion.div>
              )}
          </CardHeader>

          <motion.div
            initial={{ opacity: 0 }}
            exit={{ scale: 0 }}
            animate={{ opacity: 1 }}
            layout
            className="relative mx-4 mb-4 rounded-lg overflow-hidden bg-muted"
          >
            {file.upload_status !== "completed" &&
              file.upload_status !== "idle" && (
                <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                  {file.upload_status === "uploading" && (
                    <div className="text-white text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm">Uploading...</p>
                    </div>
                  )}
                  {file.upload_status === "processing" && (
                    <div className="text-white text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm">Processing...</p>
                    </div>
                  )}
                  {file.upload_status === "error" && (
                    <div className="text-white text-center">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
                      <p className="text-sm">Upload failed</p>
                    </div>
                  )}
                </div>
              )}

            <motion.img
              initial={{ opacity: 0 }}
              exit={{ scale: 0 }}
              animate={{ opacity: 1 }}
              layout
              src={file?.thumbnail_url || "/placeholder.svg"}
              alt="Video thumbnail_url"
              className="w-full h-48 object-cover"
            />

            {(file.upload_status === "completed" ||
              file.upload_status === "idle") && (
              <Button
                variant="secondary"
                size="icon"
                className={cn(
                  "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex-shrink-0",
                  "h-16 w-16 rounded-full bg-white/60 hover:bg-white text-black shadow-lg",
                  "transition-all duration-200 hover:scale-110"
                )}
                onClick={onPlay}
              >
                <Play className="h-6 w-6 ml-1 cursor-pointer" />
              </Button>
            )}

            <Badge
              variant="secondary"
              className="absolute bottom-2 right-2 bg-black/70 text-white hover:bg-black/70"
            >
              {formatDuration(file?.duration || 0)}
            </Badge>
          </motion.div>

          <CardFooter className="flex-col items-start gap-2 text-sm pt-0">
            <motion.div
              initial={{ opacity: 0 }}
              exit={{ scale: 0 }}
              animate={{ opacity: 1 }}
              layout
              className="flex justify-between w-full items-center"
            >
              <Badge variant="outline" className="flex items-center gap-1">
                <FileVideo className="h-3 w-3" />
                {file.type}
              </Badge>
              <motion.span
                initial={{ opacity: 0 }}
                exit={{ scale: 0 }}
                animate={{ opacity: 1 }}
                layout
                className="text-muted-foreground font-medium"
              >
                {convertSize(file.size, "B", "MB").toFixed(1)} MB
              </motion.span>
            </motion.div>
            <motion.div className="text-muted-foreground w-full">
              Modified {new Date(file.lastModified).toLocaleDateString()}
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
      <VideoForm
        video={file}
        fields={formFields}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleFormSave}
      />
    </>
  );
}
