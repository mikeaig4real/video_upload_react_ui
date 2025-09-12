import { create } from "zustand";
import hero_asset from "@/assets/landing";
import type { HeroStateType } from "@shared/types/hero";
import { immer } from "zustand/middleware/immer";
import type { NavType } from "@shared/types/nav";
import { navMain } from "@/assets/nav";
interface State {
  hero: HeroStateType;
  siteHeaderText: NavType[number]["description"];
  isDialogOpen: boolean;
}

interface Actions {
  setSiteHeaderText: (description: NavType[number]["description"]) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
}

export const useStore = create<State & Actions>()(
    immer((set) => ({
      setSiteHeaderText(description) {
        set((state) => {
          state.siteHeaderText = description;
        });
      },
      setIsDialogOpen(isOpen) {
        set((state) => {
          state.isDialogOpen = isOpen;
        });
      },
      hero: hero_asset,
      siteHeaderText: navMain[0].description,
      isDialogOpen: false,
    })),
);
