import videojs from "video.js";
import "video.js/dist/video-js.css";
import { fetchVideo } from "./api";

async function initEmbed() {
  const id = window.location.pathname.split("/").pop();
  
  const videoElement = document.getElementById(
    "video-player"
  ) as HTMLVideoElement;
  console.log("hi")
  if (!videoElement) return;

  let player;


  try {
    if (id) {
      const video = await fetchVideo(id);

      player = videojs(videoElement, {
        controls: true,
        autoplay: false,
        preload: "auto",
        sources: [
          {
            src: video.playbackUrl,
            type: "application/x-mpegURL",
          },
        ],
      });

      console.log(`Loaded video: ${video.title}`, player);
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

      player = videojs(videoElement, {
        controls: true,
        autoplay: false,
        preload: "auto",
        sources: fallbackSources,
      });

      console.log("Loaded fallback preview video", player);
    }
  } catch (err) {
    console.error("Error loading video:", err);
  }
}

initEmbed();
