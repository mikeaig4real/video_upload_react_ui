import { log } from "@/utils/logger";
import { useEffect, useRef } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

interface VideoJSProps {
  options: unknown & {
    autoplay?: boolean;
    controls?: boolean;
    sources?: Array<{ src: string; type: string }>;
  };
  onReady?: (player: Player) => void;
}

export const VideoJS: React.FC<VideoJSProps> = ({ options, onReady }) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!playerRef.current) {
      // Create a <video-js> element dynamically
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");

      videoRef.current?.appendChild(videoElement);

      const player = (playerRef.current = videojs(
        videoElement,
        options,
        function onPlayerReady() {
          log("player is ready");
          onReady?.(player);
        }
      ));
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay ?? false);
      if (options.sources?.length) {
        player.src(options.sources);
      }
    }
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
