import api from "@/utils/axios";
import { type UploadInput, type UploadOutput } from "@/types/upload";

export async function getParams(uploadParams: UploadInput) {
  const res = await api.get<UploadOutput[]>("/upload/params", {
    params: uploadParams,
  });
  return res.data;
}
