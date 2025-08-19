import { FileUpload } from "@/components/ui/file-upload";
import CustomButton from "@/components/CustomButton";
import { useStore } from "@/store/useStore";
import { log } from "@/utils/logger";

export function VideoUpload() {
  const { uploadedFiles } = useStore();
  const handleUpload = () => {
    log(uploadedFiles);
  };
  return (
    <div className="relative bg-transparent w-full mx-auto border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload />
      {uploadedFiles.length > 0 && (
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
