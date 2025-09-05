const VITE_ENV = import.meta.env.VITE_ENV;
const IS_PROD = VITE_ENV === "production";

export const logger = {
  log: (...args: any[]) => {
    if (IS_PROD) return;
    return console.log(...args);
  },
};
