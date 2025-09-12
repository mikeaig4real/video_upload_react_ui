import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  UploadedVideo,
} from "@shared/types/uploaded_video";
interface State {
  isLoadingLibrary: boolean;
  libraryList: UploadedVideo[];
}

interface Actions {
  setIsLoadingLibrary: (loading: boolean) => void;
  setLibraryList: (files: UploadedVideo[]) => void;
}

export const useLibraryStore = create<State & Actions>()(
    immer((set) => ({
      libraryList: [],
      isLoadingLibrary: false,
      setIsLoadingLibrary: (loading) => {
        set((state) => {
          state.isLoadingLibrary = loading;
        });
      },
      setLibraryList: (files) => {
        set((state) => {
          state.libraryList = files;
        });
      },
    })),
);
