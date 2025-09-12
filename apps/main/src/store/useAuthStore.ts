import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { TokenStateType } from "@shared/types/tokens";
import type { UserStateType } from "@shared/types/user";
import {
  AUTH_KEY,
} from "@/assets/constants";
interface State {
  token: TokenStateType["token"];
  user: UserStateType["user"];
}

interface Actions {
  setToken: TokenStateType["setToken"];
  clearToken: TokenStateType["clearToken"];
  setUser: UserStateType["setUser"];
  clearUser: UserStateType["clearUser"];
  logOut: () => void;
}


export const useAuthStore = create<State & Actions>()(
    persist(
      
    immer((set, get) => ({
      setToken(token) {
        set((state) => {
          state.token = token;
        });
      },
      clearToken() {
        set((state) => {
          state.token = null;
        });
      },
      setUser(user) {
        set((state) => {
          state.user = user;
        });
      },
      clearUser() {
        set((state) => {
          state.user = null;
        });
      },
      logOut() {
        set((state) => {
          state.user = null;
          state.token = null;
        });
      },
      token: get()?.token,
      user: get()?.user,
    })),
    {
      name: AUTH_KEY,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
