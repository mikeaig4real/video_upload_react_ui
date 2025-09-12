import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { NavType } from "@shared/types/nav";
import { navMain, navSecondary, navUserDropDown } from "@/assets/nav";
interface State {
  navMain: NavType;
  navMainActive: NavType[number]["id"];
  navSecondary: NavType;
  navUserDropDown: NavType;
}

interface Actions {
  setNavMainActive: (id: string | number) => void;
}


export const useNavStore = create<State & Actions>()(
    immer((set) => ({
      setNavMainActive(id) {
        set((state) => {
          state.navMainActive = id;
        });
      },
      navMain,
      navMainActive: 1,
      navSecondary,
      navUserDropDown,
    })),
);
