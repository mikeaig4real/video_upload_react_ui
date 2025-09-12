import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { UploadedVideo, VideoSource } from "@shared/types/uploaded_video";
import type {
  VideoPlayerOptions,
  VideoPlayerState,
} from "@shared/types/video_player";
interface State {
  activeSources: VideoSource[];
  playerOptions: VideoPlayerOptions;
  playerState: VideoPlayerState;
}

interface Actions {
  setActiveSources: (sources: VideoSource[]) => void;
  setPlayerOptions: (options: VideoPlayerOptions) => void;
  setPlayerState: (playerState: VideoPlayerState) => void;
  playVideo: (video: UploadedVideo) => void;
}

export const usePlayerStore = create<State & Actions>()(
  immer((set) => ({
    setActiveSources(sources) {
      set((state) => {
        state.activeSources = sources;
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
    playVideo(video) {
      set((state) => {
        const sources = [
          {
            src: video.upload_url!,
            type: video.type!,
          },
        ];
        state.activeSources = sources;
        state.playerOptions = {
          ...state.playerOptions,
          autoplay: true,
          sources,
        };
      });
    },
    activeSources: [],
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
  }))
);
