import { create } from "zustand";
import { persist } from "zustand/middleware";
import hero_asset from "@/assets/hero";
import appSettings from "@/assets/settings";
import type { HeroStateType } from "@/types/hero";
import type { Theme, ThemeStateType } from "@/types/themes";
import { immer } from "zustand/middleware/immer";
import type { GettingStartedState } from "@/types/getting_started";
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
import type { UploadResponse } from "@/types/upload";
import { VIDEO_FILTER_DEFAULTS } from "@/assets/filters";
import type { VideoFilters } from "@/types/video_filters";
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
  videoFilters: VideoFilters;
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
  setVideoStatus: (
    file: UploadedVideo,
    status: UploadedVideo["upload_status"]
  ) => void;
  setVideoProgress: (file: UploadedVideo, progress: number) => void;
  finalizeUpload: (file: UploadedVideo, upload_details: UploadResponse) => void;
  setUploadedVideoTitle: (
    file: UploadedVideo,
    title: UploadedVideo["title"]
  ) => void;
  setVideoFilters: (filters: VideoFilters) => void;
}

export const dummyUser: UserStateType["user"] = {
  id: 1,
  username: "john_doe",
  email: "john_doe@example.com",
};

export const dummyToken = "this_is_the_matrix";

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
      setVideoStatus: (file, status) => {
        set((state) => {
          const newArr = state.uploadedFiles.map((v) => {
            if (v.id === file.id) v.upload_status = status;
            return v;
          });
          get().setUploadedFiles(newArr);
        });
      },
      setVideoProgress: (file, progress) => {
        set((state) => {
          const newArr = state.uploadedFiles.map((v) => {
            if (v.id === file.id) v.upload_progress = progress;
            return v;
          });
          get().setUploadedFiles(newArr);
        });
      },
      finalizeUpload: (file, upload_details) => {
        set((state) => {
          const newArr = state.uploadedFiles.map((v) => {
            if (v.id === file.id) {
              // update ui/file metadata
              v.upload_details = upload_details; // just for safe keeping incase something changes
              v.upload_progress = 100;
              v.upload_status = "processing"
              
              const {
                playback_url,
                secure_url,
                eager = [],
                duration,
                width,
                height,
                public_id,
              } = upload_details;

              // attach video metadata
              v.asset_id = public_id;
              v.playback_url = playback_url;
              v.upload_url = secure_url;
              v.thumbnail_url = eager[0]?.url;
              v.duration = duration;
              v.width = width;
              v.height = height;
            }
            return v;
          });
          get().setUploadedFiles(newArr);
        });
      },
      setUploadedVideoTitle: (file, title) => {
        set((state) => {
          const newArr = state.uploadedFiles.map((v) => {
            if (v.id === file.id) v.title = title;
            return v;
          });
          get().setUploadedFiles(newArr);
        });
      },
      setVideoFilters: (filters) => {
        set((state) => {
          state.videoFilters = filters;
        });
      },
      hero: hero_asset,
      theme: get()?.theme || DEFAULT_THEME,
      formType: DEFAULT_FORM_TYPE,
      token: get()?.token || dummyToken,
      user: get()?.user || dummyUser,
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
      videoFilters: VIDEO_FILTER_DEFAULTS,
    })),
    {
      name: PERSIST_KEY,
      partialize: (state) => ({
        // token: state.token,
        // user: state.user,
        theme: state.theme,
        // appSettings: state.appSettings,
      }),
    }
  )
);
