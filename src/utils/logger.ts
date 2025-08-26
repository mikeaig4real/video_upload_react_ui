import { IS_PROD } from "@/assets/constants";

export const log = (...args: unknown[]) => {
  if (!IS_PROD) {
    console.log(...args);
  }
};
export const warn = (...args: unknown[]) => {
  if (!IS_PROD) {
    console.warn(...args);
  }
};

export const error = (...args: unknown[]) => {
  if (!IS_PROD) {
    console.error(...args);
  }
};

export default {
  log,
  warn,
  error
}