import type { UploadedVideo } from "@/types/uploaded_video";
import type { FileRejection } from "react-dropzone";

export function formatGroupedErrors(data: FileRejection[]): string {
  const grouped: Record<string, string[]> = {};

  for (const item of data) {
    const fileName = item.file?.path?.split("/").pop() || item.file?.path;

    for (const err of item.errors) {
      if (!grouped[err.message]) {
        grouped[err.message] = [];
      }
      grouped[err.message].push(fileName || "unknown");
    }
  }

  return Object.entries(grouped)
    .map(([message, files]) => {
      return `Error: ${message} for files '${files.join(", ")}'`;
    })
    .join("\n");
}

export function makeFinalUploadMessage(
  resolvedUploads: PromiseSettledResult<UploadedVideo>[]
): string {
  const total = resolvedUploads.length;
  const succeeded = resolvedUploads.filter(
    (r) => r.status === "fulfilled"
  ).length;
  const failed = resolvedUploads.filter((r) => r.status === "rejected").length;
  let message = `Upload completed: ${succeeded} succeeded, ${failed} failed, out of ${total} files.`;
  if (succeeded === total) {
    message = `All ${total} files uploaded successfully!`;
  } else if (failed === total) {
    message = `All ${total} files failed to upload. Please try again.`;
  } else if (failed > 0) {
    message +=
      " Some files failed to upload. Please check /upload to retry if needed.";
  }
  return message;
}
