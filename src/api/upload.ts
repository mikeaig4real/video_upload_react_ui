import { type UploadedVideo } from "@/types/uploaded_video";
import api from "@/utils/axios";
import {
  type UploadInput,
  type UploadOutput,
  type UploadResponse,
} from "@/types/upload";
import { log } from "@/utils/logger";
import type { APIResponse } from "@/types/response";
import axios from "axios";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";
import { API_BASE_URL } from "@/assets/constants";

let fakeProgress = 10;
let fakeInterval: NodeJS.Timeout | null = null;
export async function getParams({ file }: { file: UploadedVideo }) {
  const uploadedInputParams: UploadInput = {
    type: file.type,
    title: file.title!,
    size: file.size,
  };
  useStore.getState().setVideoStatus(file, "processing");
  if (!API_BASE_URL) return { data: null };
  const res = await api.get<APIResponse<UploadOutput>>("/upload/params", {
    params: uploadedInputParams,
  });
  return res.data!;
}

export async function uploadToCloudBucket({
  file,
  uploadOutputParams,
}: {
  file: UploadedVideo;
  uploadOutputParams: UploadOutput;
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
    fakeInterval = setInterval(() => {
      fakeProgress += 10;
      useStore.getState().setVideoProgress(file, fakeProgress);
    }, 1000);
    setTimeout(() => {
      clearInterval(fakeInterval!);
      toast.error(
        "Nothing went wrong, this is a simulation, you can retry at uploads"
      );
      useStore.getState().setVideoStatus(file, "error");
      fakeProgress = 10;
    }, 7000);
    if (!API_BASE_URL) return null;
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
    throw new Error(error.message);
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
}

export async function uploadMultipleFilesToCloudBucket(files: UploadedVideo[]) {
  const promises = files.map(async (file) => {
    const upload_details = await uploadFileToCloudBucket(file);
    if (!API_BASE_URL) return file;
    useStore.getState().finalizeUpload(file, upload_details);
    return file;
  });
  const resolvedPromises = await Promise.all(promises);
  log(resolvedPromises);
  return resolvedPromises;
}
