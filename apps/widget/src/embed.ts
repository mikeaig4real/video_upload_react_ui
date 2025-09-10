import videojs from "video.js";
import "video.js/dist/video-js.css";
import { fetchVideo } from "./api";
import { inject } from "@vercel/analytics";
inject()
async function initEmbed() {
  const id = window.location.pathname.split("/").pop();
  const videoElement = document.getElementById(
    "video-player"
  ) as HTMLVideoElement;

  if (!videoElement) return;

  let player = videojs.getPlayer(videoElement);

  if (!player) {
    player = videojs(videoElement, {
      controls: true,
      autoplay: false,
      preload: "auto",
      responsive: true,
      fluid: true,
    });
  }

  try {
    if (id) {
      const { data: video } = await fetchVideo(id);
      player.src({
        src: video?.upload_url,
        type: video?.type,
      });
    } else {
      const fallbackSources = [
        {
          src: "https://vjs.zencdn.net/v/oceans.mp4",
          type: "video/mp4",
        },
        {
          src: "https://vjs.zencdn.net/v/oceans.webm",
          type: "video/webm",
        },
      ];

      player.src(fallbackSources);
    }
  } catch (err) {
    console.error("Error loading video:", err);
  }
}

initEmbed();
