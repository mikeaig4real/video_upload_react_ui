import { IS_PROD } from "@/assets/constants";

export const log = (...args: unknown[]) => {
  if (!IS_PROD) {
    const stack = new Error().stack;
    const callerLine = stack?.split("\n")[2]?.trim();
    console.log("[LOG]", callerLine, ...args);
  }
};
export const warn = (...args: unknown[]) => {
  if (!IS_PROD) {
    const stack = new Error().stack;
    const callerLine = stack?.split("\n")[2]?.trim();
    console.warn("[WARN]", callerLine, ...args);
  }
};

export const error = (...args: unknown[]) => {
  if (!IS_PROD) {
    const stack = new Error().stack;
    const callerLine = stack?.split("\n")[2]?.trim();
    console.error("[ERROR]", callerLine, ...args);
  }
};

export default {
  log,
  warn,
  error
}