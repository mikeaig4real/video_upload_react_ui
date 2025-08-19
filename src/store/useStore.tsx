import { create } from "zustand";
import { persist } from "zustand/middleware";
import hero_asset from "@/assets/hero";
import appSettings from "@/assets/settings";
import type { HeroStateType } from "@/types/hero";
import type { Theme, ThemeStateType } from "@/types/themes";
import { immer } from "zustand/middleware/immer";
import type { GettingStartedState } from "@/types/getting-started";
import type { TokenStateType } from "@/types/tokens";
import type { UserStateType } from "@/types/user";
import {
  DEFAULT_FORM_TYPE,
  DEFAULT_THEME,
  PERSIST_KEY,
} from "@/assets/constants";
import type { NavType } from "@/types/nav";
import { navMain, navSecondary, navUserDropDown } from "@/assets/nav";
import type {
  OptionalUploadedVideo,
  UploadedVideo,
  VideoSource,
} from "@/types/uploaded_video";
import type {
  VideoPlayerOptions,
  VideoPlayerState,
} from "@/types/video_player";
import type { SettingItem } from "@/types/settings";
interface State {
  hero: HeroStateType;
  theme: ThemeStateType["theme"];
  formType: GettingStartedState["formType"];
  token: TokenStateType["token"];
  user: UserStateType["user"];
  navMain: NavType;
  navMainActive: NavType[number]["id"];
  navSecondary: NavType;
  navUserDropDown: NavType;
  siteHeaderText: NavType[number]["description"];
  uploadedFiles: UploadedVideo[];
  isDialogOpen: boolean;
  activeVideo: OptionalUploadedVideo | null;
  activeSources: VideoSource[];
  playerOptions: VideoPlayerOptions;
  playerState: VideoPlayerState;
  appSettings: SettingItem[];
}

interface Actions {
  setTheme: ThemeStateType["setTheme"];
  setFormType: GettingStartedState["setFormType"];
  setToken: TokenStateType["setToken"];
  clearToken: TokenStateType["clearToken"];
  setUser: UserStateType["setUser"];
  clearUser: UserStateType["clearUser"];
  logOut: () => void;
  setNavMainActive: (id: string | number) => void;
  setSiteHeaderText: (description: NavType[number]["description"]) => void;
  setUploadedFiles: (files: UploadedVideo[]) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
  setActiveVideo: (video: OptionalUploadedVideo) => void;
  setActiveSources: (sources: VideoSource[]) => void;
  setPlayerOptions: (options: VideoPlayerOptions) => void;
  setPlayerState: (playerState: VideoPlayerState) => void;
  setAppSettings: (settings: SettingItem[]) => void;
}

export const useStore = create<State & Actions>()(
  persist(
    immer((set, get) => ({
      setTheme: (theme: Theme) =>
        set((state) => {
          state.theme = theme;
        }),
      setFormType(type) {
        set((state) => {
          state.formType = type;
        });
      },
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
      setNavMainActive(id) {
        set((state) => {
          state.navMainActive = id;
        });
      },
      setSiteHeaderText(description) {
        set((state) => {
          state.siteHeaderText = description;
        });
      },
      setUploadedFiles(files) {
        set((state) => {
          state.uploadedFiles = files;
        });
      },
      setIsDialogOpen(isOpen) {
        set((state) => {
          state.isDialogOpen = isOpen;
        });
      },
      setActiveSources(sources) {
        set((state) => {
          state.activeSources = sources;
        });
      },
      setActiveVideo(video) {
        set((state) => {
          state.activeVideo = video;
        });
      },
      setPlayerOptions(options) {
        set((state) => {
          state.playerOptions = options;
        });
      },
      setPlayerState(playerState) {
        set((state) => {
          state.playerState = playerState as VideoPlayerState;
        });
      },
      setAppSettings(settings) {
        set((state) => {
          state.appSettings = settings;
        });
      },
      hero: hero_asset,
      theme: get()?.theme || DEFAULT_THEME,
      formType: DEFAULT_FORM_TYPE,
      token: get()?.token || null,
      user: get()?.user || null,
      navMain,
      navMainActive: 1,
      navSecondary,
      navUserDropDown,
      siteHeaderText: navMain[0].description,
      uploadedFiles: [],
      isDialogOpen: false,
      activeSources: [],
      activeVideo: null,
      playerOptions: {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [],
      },
      playerState: {
        status: null,
        player: null,
      },
      appSettings,
    })),
    {
      name: PERSIST_KEY,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        theme: state.theme,
        // appSettings: state.appSettings,
      }),
    }
  )
);
