import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, Play, FileVideo, Film, Check, XIcon, Edit3 } from "lucide-react";
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

export interface VideoCardProps {
  file: UploadedVideo;
  idx: string | number;
}

export default function VideoCard({ file, idx }: VideoCardProps) {
  const {
    setActiveVideo,
    setActiveSources,
    uploadedFiles,
    setUploadedFiles,
    playerOptions,
    setPlayerOptions,
    setIsDialogOpen,
  } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(file.editedName);
  const [fileName, setFileName] = useState(file.editedName);
  const handleSave = () =>
  {
    if ( !editedName )
    {
      toast.error("File must have a name")
      return;
    };
    const modifiedUploadedFiles = uploadedFiles.map((upload) => {
      if (upload.id === file.id) {
        upload.editedName = editedName;
      }
      return upload;
    });
    setUploadedFiles(modifiedUploadedFiles);
    setFileName(editedName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(fileName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };
  const onPlay = () => {
    const videoObject: OptionalUploadedVideo = {
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      metadata: file.metadata,
    };
    const sources = [
      { src: videoObject.metadata!.url, type: videoObject.type! },
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
  return (
    <motion.div layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}>
      <Card
        onClick={(e) => e.stopPropagation()}
        className="@container/card relative w-full max-w-sm bg-transparent"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-[-0.5rem] right-[-0.5rem] z-50 h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white cursor-pointer flex-shrink-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardHeader className="pb-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Film className="h-3 w-3" />
            {file.metadata?.label}
          </Badge>
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
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
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
              </motion.div>
            )}
          </div>
        </CardHeader>
        <motion.div
          initial={{ opacity: 0 }}
          exit={{ scale: 0 }}
          animate={{ opacity: 1 }}
          layout
          className="relative mx-4 mb-4 rounded-lg overflow-hidden bg-muted"
        >
          <motion.img
            initial={{ opacity: 0 }}
            exit={{ scale: 0 }}
            animate={{ opacity: 1 }}
            layout
            src={file.metadata!.thumbnail || "/placeholder.svg"}
            alt="Video thumbnail"
            className="w-full h-48 object-cover"
          />
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

          <Badge
            variant="secondary"
            className="absolute bottom-2 right-2 bg-black/70 text-white hover:bg-black/70"
          >
            {file.metadata!.durationStr}
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
  );
}
