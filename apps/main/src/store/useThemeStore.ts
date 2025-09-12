import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme, ThemeStateType } from "@shared/types/themes";
import { immer } from "zustand/middleware/immer";
import {
  DEFAULT_THEME,
  THEME_KEY,
} from "@/assets/constants";
interface State {
  theme: ThemeStateType["theme"];
  currTheme: ThemeStateType["theme"];
}

interface Actions {
  setTheme: ThemeStateType["setTheme"];
  setCurrTheme: ThemeStateType["setTheme"];
}

export const useThemeStore = create<State & Actions>()(
  persist(
    immer((set, get) => ({
      setTheme: (theme: Theme) =>
        set((state) => {
          state.theme = theme;
        }),
      setCurrTheme: (currTheme: Theme) =>
        set((state) => {
          state.currTheme = currTheme;
        }),
      theme: get()?.theme || DEFAULT_THEME,
      currTheme: get()?.currTheme || DEFAULT_THEME,
    })),
    {
      name: THEME_KEY,
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);
