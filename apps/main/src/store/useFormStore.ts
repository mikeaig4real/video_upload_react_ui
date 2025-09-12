import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { GettingStartedState } from "@shared/types/getting_started";
import {
  DEFAULT_FORM_TYPE,
} from "@/assets/constants";
interface State {
  formType: GettingStartedState["formType"];
}

interface Actions {
  setFormType: GettingStartedState["setFormType"];
}

export const useFormStore = create<State & Actions>()(
    immer((set) => ({
      setFormType(type) {
        set((state) => {
          state.formType = type;
        });
      },
      formType: DEFAULT_FORM_TYPE,
    })),
);
