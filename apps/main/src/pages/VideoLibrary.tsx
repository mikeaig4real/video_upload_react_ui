import { useEffect, useState } from "react";
import Carousel from "@/components/ui/carousel";
import { useStore } from "@/store/useStore";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconHome, IconLayoutDashboard, IconLogout } from "@tabler/icons-react";
import CustomHeader from "@/components/ui/custom-header";
import * as API from "@/api";
import { log } from "@/utils/logger";
import type Player from "video.js/dist/types/player";
import VideoPlayer from "@/components/VideoPlayer";
import type { UploadedVideo } from "@shared/types/uploaded_video";
import { notify } from "@/utils/notify";

const withFile = <P extends object>(
  PlayerComponent: React.ComponentType<P>,
  props: P
) => {
  return (file: UploadedVideo) => {
    log({file})
    return (
      <div>
        <PlayerComponent {...props} />
      </div>
    );
  };
};

const VideoLibrary = () => {
  const [showPlayer, setShowPlayer] = useState(false);
  const {
    user,
    logOut,
    playerState,
    setPlayerState,
    playerOptions,
    setActiveVideo,
    setActiveVideoFile,
    setActiveSources,
    isLoadingLibrary,
    setIsLoadingLibrary,
    setPlayerOptions,
    videoFilters,
    setLibraryList,
    libraryList,
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
  useEffect(() => {
    if (isLoadingLibrary) return;
    setIsLoadingLibrary(true);
    notify(API.LibraryAPI.getLibraryList(videoFilters), {
      success: ({ data }: { data: UploadedVideo[] }) => {
        log(data);
        setLibraryList(data);
        return data.length ? "Done" : "No videos...";
      },
      loading: "Loading..",
      error: "Could not load",
      finally: () => {
        setIsLoadingLibrary(false);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="relative overflow-hidden w-full h-full py-20">
        {libraryList.length > 0 ? (
          <Carousel
            slides={libraryList}
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
