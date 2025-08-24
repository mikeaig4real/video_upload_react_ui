export type APIResponse<T> = {
  success: boolean;
  data?: T;
  description?: string;
};
