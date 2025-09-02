import VideoPlayer from "@/components/VideoPlayer";
import type { UploadedVideo } from "@shared/types/uploaded_video";
import { useEffect, useState } from "react";
import * as API from "@/api";
import { useParams } from "react-router";
import { log } from "@/utils/logger";

export default function EmbedPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState<UploadedVideo | null>(null);
  useEffect(() => {
    if (id) {
      API.VideoAPI.getVideoById(id).then(({ data }) => {
        if (!data) return;
        log(data);
        setVideo(data);
      });
    }
  }, [id]);

  if (!video) return <p>Loading...</p>;

  return (
    <div style={{ width: "100%", height: "100%", background: "black" }}>
      <VideoPlayer
        options={{
          autoplay: false,
          controls: true,
          responsive: true,
          fluid: true,
          sources: [
            {
              src: video.playback_url!,
              type: "application/x-mpegURL",
            },
          ],
        }}
      />
    </div>
  );
}
