import { create } from "zustand";
import { persist } from "zustand/middleware";
import hero_asset from "@/assets/hero";
import appSettings from "@/assets/settings";
import type { HeroStateType } from "@shared/types/hero";
import type { Theme, ThemeStateType } from "@shared/types/themes";
import { immer } from "zustand/middleware/immer";
import type { GettingStartedState } from "@shared/types/getting_started";
import type { TokenStateType } from "@shared/types/tokens";
import type { UserStateType } from "@shared/types/user";
import {
  DEFAULT_FORM_TYPE,
  DEFAULT_THEME,
  PERSIST_KEY,
} from "@/assets/constants";
import type { NavType } from "@shared/types/nav";
import { navMain, navSecondary, navUserDropDown } from "@/assets/nav";
import type {
  OptionalUploadedVideo,
  UploadedVideo,
  VideoSource,
} from "@shared/types/uploaded_video";
import type {
  VideoPlayerOptions,
  VideoPlayerState,
} from "@shared/types/video_player";
import type { SettingItem } from "@shared/types/settings";
import type { UploadResponse } from "@shared/types/upload";
import { VIDEO_FILTER_DEFAULTS } from "@/assets/filters";
import type { VideoFilters } from "@shared/types/video_filters";
interface State {
  hero: HeroStateType;
  theme: ThemeStateType["theme"];
  currTheme: ThemeStateType["theme"];
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
  isLoadingVideos: boolean;
  isLoadingLibrary: boolean;
  isUploadingFiles: boolean;
  libraryList: UploadedVideo[];
}

interface Actions {
  setTheme: ThemeStateType["setTheme"];
  setCurrTheme: ThemeStateType["setTheme"];
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
  setActiveVideo: (video: OptionalUploadedVideo | null) => void;
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
  setIsLoadingVideos: (loading: boolean) => void;
  setIsLoadingLibrary: (loading: boolean) => void;
  setIsUploadingFiles: (uploading: boolean) => void;
  setActiveVideoFile: (file: UploadedVideo) => void;
  setLibraryList: (files: UploadedVideo[]) => void;
}

export const useStore = create<State & Actions>()(
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
          state.uploadedFiles = newArr;
        });
      },
      setVideoProgress: (file, progress) => {
        set((state) => {
          const newArr = state.uploadedFiles.map((v) => {
            if (v.id === file.id) v.upload_progress = progress;
            return v;
          });
          state.uploadedFiles = newArr;
        });
      },
      finalizeUpload: (file, upload_details) => {
        set((state) => {
          const newArr = state.uploadedFiles.map((v) => {
            if (v.id === file.id) {
              // update ui/file metadata
              v.upload_details = upload_details; // just for safe keeping incase something changes
              v.upload_progress = 100;
              v.upload_status = "processing";

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
          state.uploadedFiles = newArr;
        });
      },
      setUploadedVideoTitle: (file, title) => {
        set((state) => {
          const newArr = state.uploadedFiles.map((v) => {
            if (v.id === file.id) v.title = title;
            return v;
          });
          state.uploadedFiles = newArr;
        });
      },
      setVideoFilters: (filters) => {
        set((state) => {
          state.videoFilters = filters;
        });
      },
      setActiveVideoFile: (file: UploadedVideo) => {
        set((state) => {
          const videoObject: OptionalUploadedVideo = {
            id: file.id,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            title: file.title,
            upload_url: file.upload_url,
            playback_url: file.playback_url,
          };
          const sources = [
            {
              src: videoObject.upload_url!,
              type: videoObject.type!,
            },
          ];
          state.activeVideo = videoObject;
          state.activeSources = sources;
          state.playerOptions = {
            ...state.playerOptions,
            autoplay: true,
            sources,
          };
        });
      },
      hero: hero_asset,
      theme: get()?.theme || DEFAULT_THEME,
      currTheme: get()?.currTheme || DEFAULT_THEME,
      formType: DEFAULT_FORM_TYPE,
      token: get()?.token,
      user: get()?.user,
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
      isLoadingVideos: false,
      libraryList: [],
      setIsLoadingVideos: (loading) => {
        set((state) => {
          state.isLoadingVideos = loading;
        });
      },
      isLoadingLibrary: false,
      setIsLoadingLibrary: (loading) => {
        set((state) => {
          state.isLoadingLibrary = loading;
        });
      },
      isUploadingFiles: false,
      setIsUploadingFiles: (uploading) => {
        set((state) => {
          state.isUploadingFiles = uploading;
        });
      },
      setLibraryList: (files) => {
        set((state) => {
          state.libraryList = files;
        });
      },
    })),
    {
      name: PERSIST_KEY,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        theme: state.theme,
        appSettings: state.appSettings,
      }),
    }
  )
);
