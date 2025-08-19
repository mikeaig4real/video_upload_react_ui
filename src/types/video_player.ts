import type { VideoSource } from "@/types/uploaded_video";

export type VideoPlayerOptions = {
  autoplay: boolean;
  controls: boolean;
  responsive: boolean;
  fluid: true;
  sources: VideoSource[];
};

export type VideoPlayerState = {
  status: "ready" | "waiting" | "dispose" | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  player: any;
};
