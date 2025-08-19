
export type Theme = "dark" | "light" | "system";

export type ThemeStateType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};