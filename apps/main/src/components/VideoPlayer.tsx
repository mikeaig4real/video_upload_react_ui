import { log } from "@/utils/logger";
import { useEffect, useRef } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

interface VideoJSProps {
  options: unknown & {
    autoplay?: boolean;
    controls?: boolean;
    responsive?: boolean;
    fluid?: boolean;
    sources?: Array<{ src: string; type: string }>;
  };
  onReady?: (player: Player) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
  onSeeking?: () => void;
  onSeeked?: () => void;
  onVolumeChange?: (volume: number, muted: boolean) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onError?: (e: unknown) => void;
  onLoadedMetadata?: () => void;
  onLoadedData?: () => void;
  onCanPlay?: () => void;
  onCanPlayThrough?: () => void;
  onWaiting?: () => void;
  onPlaying?: () => void;
  onStalled?: () => void;
  onProgress?: () => void;
  onRateChange?: (rate: number) => void;
  onDurationChange?: (duration: number) => void;
}

export const VideoJS: React.FC<VideoJSProps> = ({
  options,
  onReady,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onSeeking,
  onSeeked,
  onVolumeChange,
  onFullscreenChange,
  onError,
  onLoadedMetadata,
  onLoadedData,
  onCanPlay,
  onCanPlayThrough,
  onWaiting,
  onPlaying,
  onStalled,
  onProgress,
  onRateChange,
  onDurationChange,
}) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!playerRef.current) {
      // Create a <video-js> element dynamically
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered", "vjs-fluid");

      videoRef.current?.appendChild(videoElement);

      const player = (playerRef.current = videojs(
        videoElement,
        options,
        function onPlayerReady() {
          log("player is ready");
          onReady?.(player);
        }
      ));

      // 🔗 Attach event listeners
      player.on("play", () => onPlay?.());
      player.on("pause", () => onPause?.());
      player.on("ended", () => onEnded?.());
      player.on("timeupdate", () => onTimeUpdate?.(player.currentTime()!));
      player.on("seeking", () => onSeeking?.());
      player.on("seeked", () => onSeeked?.());
      player.on("volumechange", () =>
        onVolumeChange?.(player.volume()!, player.muted()!)
      );
      player.on("fullscreenchange", () =>
        onFullscreenChange?.(player.isFullscreen()!)
      );
      player.on("error", (e: unknown) => onError?.(e));
      player.on("loadedmetadata", () => onLoadedMetadata?.());
      player.on("loadeddata", () => onLoadedData?.());
      player.on("canplay", () => onCanPlay?.());
      player.on("canplaythrough", () => onCanPlayThrough?.());
      player.on("waiting", () => onWaiting?.());
      player.on("playing", () => onPlaying?.());
      player.on("stalled", () => onStalled?.());
      player.on("progress", () => onProgress?.());
      player.on("ratechange", () => onRateChange?.(player.playbackRate()!));
      player.on("durationchange", () => onDurationChange?.(player.duration()!));
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay ?? false);
      if (options.sources?.length) {
        player.src(options.sources);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, onReady]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;
