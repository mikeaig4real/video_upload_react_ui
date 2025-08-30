import { type UploadedVideo } from "@/types/uploaded_video";
import api from "@/utils/axios";
import {
  type GetUploadParams,
  type GetUploadParamsResponse,
  type UploadResponse,
} from "@/types/upload";
import { log } from "@/utils/logger";
import type { APIResponse } from "@/types/response";
import axios from "axios";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";
import { createVideo } from "./video";
import { withRetry } from "@/utils/retry";
import { makeFinalUploadMessage } from "@/utils/file_upload_errors";

export async function getParams({ file }: { file: UploadedVideo }) {
  try {
    const uploadedInputBody: GetUploadParams | UploadedVideo = {
      type: file.type,
      title: file.title!,
      size: file.size,
      upload_hash: file.upload_hash!,
      description: file.description,
      duration: file.duration,
      is_public: file.is_public,
      label: file.label,
      upload_provider: file.upload_provider,
      asset_id: file.asset_id,
    };
    useStore.getState().setVideoStatus(file, "processing");
    const res = await api.post<APIResponse<GetUploadParamsResponse>>(
      "/uploader/params",
      uploadedInputBody
    );
    return res.data;
  } catch (error) {
    log({
      error,
    });
    useStore.getState().setVideoStatus(file, "error");
    throw new Error("Failed to get upload parameters"); // throws to uploadFileToCloudBucket
  }
}

export async function uploadToCloudBucket({
  file,
  uploadOutputParams,
}: {
  file: UploadedVideo;
  uploadOutputParams: GetUploadParamsResponse;
}) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (uploadOutputParams) {
      Object.entries(uploadOutputParams?.fields).forEach(([key, value]) => {
        formData.append(`${key}`, `${value}`);
      });
    }
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event: ProgressEvent) => {
        if (event.total) {
          const progress = Math.round((event.loaded * 100) / event.total);
          useStore.getState().setVideoProgress(file, progress);
        }
      },
    };
    useStore.getState().setVideoStatus(file, "uploading");
    const res = await axios.post<UploadResponse>(
      uploadOutputParams.upload_url,
      formData,
      config
    );
    return res.data!;
  } catch (e) {
    log({
      error: e,
    });
    const {
      response: {
        data: { error },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = e as any;
    useStore.getState().setVideoStatus(file, "error");
    toast.error(`An error: ${error.message} occurred, retry at uploads`);
    throw new Error(error.message); // throws to uploadFileToCloudBucket
  }
}

export async function uploadFileToCloudBucket(file: UploadedVideo) {
  const { data: signedParams } = await getParams({ file });
  log({
    signedParams,
  });
  const upload_details = await uploadToCloudBucket({
    file,
    uploadOutputParams: signedParams!,
  });
  log({
    upload_details,
  });
  return upload_details!;
} // throws to uploadMultipleFilesToCloudBucket automatically

export async function uploadMultipleFilesToCloudBucket(files: UploadedVideo[]) {
  const promises = files.map(async (file) => {
    const upload_details = await uploadFileToCloudBucket(file); // throws to Promise.all/ rejected in Promise.allSettled
    useStore.getState().finalizeUpload(file, upload_details);
    try
    {
      throw new Error("Failed to upload video");
      await withRetry(
        async () => {
          await createVideo(file);
        },
        undefined,
        5000
      );
      useStore.getState().setVideoStatus(file, "completed");
    } catch (error) {
      useStore.getState().setVideoStatus(file, "processing");
      log({
        error,
      });
      throw new Error("Failed to finalize video upload, will keep trying"); // throws to Promise.all/ rejected reason/status in in Promise.allSettled
    }
    return file;
  });
  const resolvedPromises = await Promise.allSettled(promises); // will not throw to notify rather attach
  log(resolvedPromises);
  const message = makeFinalUploadMessage(resolvedPromises);
  toast.message(message, {
    duration: 5000
  });
  return resolvedPromises;
}
