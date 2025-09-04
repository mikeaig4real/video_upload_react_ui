import { useState } from "react";
import Carousel from "@/components/ui/carousel";
import { useStore } from "@/store/useStore";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconHome, IconLayoutDashboard, IconLogout } from "@tabler/icons-react";
import CustomHeader from "@/components/ui/custom-header";
import { log } from "@/utils/logger";
import type Player from "video.js/dist/types/player";
import VideoPlayer from "@/components/VideoPlayer";
import type {
  UploadedVideo,
} from "@shared/types/uploaded_video";

const VideoLibrary = () => {
  const [showPlayer, setShowPlayer] = useState(false);
  const {
    uploadedFiles,
    user,
    logOut,
    playerState,
    setPlayerState,
    playerOptions,
    setActiveVideo,
    setActiveVideoFile,
    setActiveSources,
    setPlayerOptions,
  } = useStore();
  const handlePlayerReady = (player: Player) => {
    log("Player is ready:", player);
    setPlayerState({ ...playerState, player, status: "ready" });
    player.on("waiting", () => {
      log("Player is waiting");
      setPlayerState({ ...playerState, status: "waiting" });
    });
    player.on("dispose", () => {
      log("Player will dispose");
      setPlayerState({ ...playerState, status: "dispose" });
    });
  };
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      url: "/",
    },
    ...(user
      ? [
          {
            title: "Dashboard",
            icon: (
              <IconLayoutDashboard className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            url: "/dashboard",
          },
          {
            title: " Log out",
            icon: (
              <IconLogout className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            onClick: () => {
              logOut();
            },
          },
        ]
      : []),
  ];

  const onPlay = (file: UploadedVideo) => {
    setShowPlayer(true);
    setActiveVideoFile(file);
  };
  const onClose = () => {
    setShowPlayer(false);
    setActiveVideo(null);
    setActiveSources([]);
    setPlayerOptions({
      ...playerOptions,
      autoplay: false,
      sources: [],
    });
  };
  return (
    <>
      <div className="relative overflow-hidden w-full h-full py-20">
        {uploadedFiles.length > 0 ? (
          <Carousel
            slides={uploadedFiles}
            toTrigger={
              <VideoPlayer
                options={playerOptions}
                onReady={handlePlayerReady}
              />
            }
            onTrigger={onPlay}
            triggered={showPlayer}
            offTrigger={onClose}
          />
        ) : (
          <CustomHeader
            header={"No ShowCased Videos"}
            description={"There are no videos currently on showcase..."}
          />
        )}
      </div>
      <div className="absolute bottom-0 right-0">
        <FloatingDock items={links} />
      </div>
    </>
  );
};

export default VideoLibrary;
