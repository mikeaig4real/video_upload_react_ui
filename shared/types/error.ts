export type AxiosError<T = unknown> = {
  message: string;
  config?: unknown;
  status?: number;
  response?: {
    data?: T;
    status: number;
    statusText: string;
    headers?: Record<string, string>;
    config?: unknown;
  };
  cause?: unknown;
  isAxiosError: true;
  toJSON: () => object;
};
