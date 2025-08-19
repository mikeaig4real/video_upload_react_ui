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
