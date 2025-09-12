import { create } from "zustand";
import { persist } from "zustand/middleware";
import appSettings from "@/assets/settings";
import { immer } from "zustand/middleware/immer";
import {
  SETTINGS_KEY,
} from "@/assets/constants";
import type { SettingItem } from "@shared/types/settings";
interface State {
  appSettings: SettingItem[];
}

interface Actions {
  setAppSettings: (settings: SettingItem[]) => void;
}

export const useSettingsStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      appSettings,
      setAppSettings(settings) {
        set((state) => {
          state.appSettings = settings;
        });
      },
    })),
    {
      name: SETTINGS_KEY,
      partialize: (state) => ({
        appSettings: state.appSettings,
      }),
    }
  )
);
