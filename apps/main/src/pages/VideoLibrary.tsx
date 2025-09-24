import { useState } from "react";
import Carousel from "@/components/ui/carousel";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconHome, IconLayoutDashboard, IconLogout } from "@tabler/icons-react";
import CustomHeader from "@/components/ui/custom-header";
import { log } from "@/utils/logger";
import type Player from "video.js/dist/types/player";
import VideoPlayer from "@/components/VideoPlayer";
import type { UploadedVideo } from "@shared/types/uploaded_video";
import { useVideoStore } from "@/store/useVideoStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useLibraryList } from "@/hooks/query/useLibrary";
import { LoaderThree } from "@/components/ui/loader";
import { normalizeError } from "@/utils/error";

const withFile = <P extends object>(
  PlayerComponent: React.ComponentType<P>,
  props: P
) => {
  return (file: UploadedVideo, isMobile: boolean) => {
    const isPortrait = file.height! > file.width!;
    const mobileClassName = isPortrait ? `` : `h-full translate-y-[40%]`;
    const className = isPortrait
      ? `absolute w-[50%] translate-x-[40%]`
      : `w-full translate-y-[40%]`;
    return (
      <div className={isMobile ? mobileClassName : className}>
        <PlayerComponent {...props} />
      </div>
    );
  };
};

const VideoLibrary = () => {
  const [showPlayer, setShowPlayer] = useState(false);
  const { setActiveVideo, videoFilters } = useVideoStore();
  const { user, logOut } = useAuthStore();
  const {
    playerState,
    setPlayerState,
    playerOptions,
    setActiveSources,
    setPlayerOptions,
    playVideo,
  } = usePlayerStore();
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
            url: "/dashboard/upload",
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
    setActiveVideo(file);
    playVideo(file);
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

  const {
    data: { data: videoLibraryList } = { data: [] },
    isLoading,
    error,
  } = useLibraryList(videoFilters);

  return (
    <>
      <div className="relative overflow-hidden w-full h-full py-20">
        {isLoading ? (
          <CustomHeader header={<LoaderThree />} />
        ) : error ? (
          <CustomHeader header={normalizeError(error)} />
        ) : videoLibraryList!.length > 0 ? (
          <Carousel
            slides={videoLibraryList!}
            toTrigger={withFile(VideoPlayer, {
              options: playerOptions,
              onReady: handlePlayerReady,
            })}
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
      <div className="absolute bottom-[1rem] left-[50%] translate-x-[-50%]">
        <FloatingDock items={links} />
      </div>
    </>
  );
};

export default VideoLibrary;
