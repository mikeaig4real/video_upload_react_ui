import type { APIResponse } from "@shared/types/response";
import type { AxiosError } from "@shared/types/error";

export const normalizeError = (error: unknown): string => {
  const axiosError = error as AxiosError<APIResponse<unknown>>;

  const message =
    axiosError?.response?.data?.description ||
    (axiosError?.message ?? (error as Error)?.message) ||
    "Something went wrong";

  return message;
};
