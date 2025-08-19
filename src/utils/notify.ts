import { toast } from "sonner";

export function notify<T>(
  promise: Promise<T>,
  messages: {
    loading: string | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    success: (data: any) => string | undefined;
    error?: string | undefined;
  }
) {
  return toast.promise(promise, messages);
}
