import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  OptionalUploadedVideo,
  UploadedVideo,
} from "@shared/types/uploaded_video";
import type { UploadResponse } from "@shared/types/upload";
import { VIDEO_FILTER_DEFAULTS } from "@/assets/filters";
import type { VideoFilters } from "@shared/types/video_filters";
interface State {
  uploadedFiles: UploadedVideo[];
  activeVideo: OptionalUploadedVideo | null;
  videoFilters: VideoFilters;
  isLoadingVideos: boolean;
  isUploadingFiles: boolean;
}

interface Actions {
  setUploadedFiles: (files: UploadedVideo[]) => void;
  setActiveVideo: (video: OptionalUploadedVideo | null) => void;
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
  setIsUploadingFiles: (uploading: boolean) => void;
}

export const useVideoStore = create<State & Actions>()(
  immer((set) => ({
    setUploadedFiles(files) {
      set((state) => {
        state.uploadedFiles = files;
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
    setActiveVideo: (file) => {
      set((state) => {
        if (!file) {
          state.activeVideo = file;
          return;
        }
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
        state.activeVideo = videoObject;
      });
    },
    setIsLoadingVideos: (loading) => {
      set((state) => {
        state.isLoadingVideos = loading;
      });
    },
    setIsUploadingFiles: (uploading) => {
      set((state) => {
        state.isUploadingFiles = uploading;
      });
    },
    uploadedFiles: [],
    activeVideo: null,
    videoFilters: VIDEO_FILTER_DEFAULTS,
    isLoadingVideos: false,
    isUploadingFiles: false,
  }))
);
