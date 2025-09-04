/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

export function notify<T = any>(
  promise: Promise<T>,
  messages: {
    loading?: string | undefined;
    success?: string | undefined | ((data?: any) => string | undefined);
    error?: string | undefined | ((data?: any) => string | undefined);
    description?: string | undefined;
    finally?: (() => void | Promise<void>) | undefined;
  }
) {
  return toast.promise(promise, messages);
}
