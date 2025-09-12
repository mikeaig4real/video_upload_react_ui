import { AppSidebar } from "@/components/AppSideBar";
import { SiteHeader } from "@/components/SiteHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type Player from "video.js/dist/types/player";
import VideoPlayer from "@/components/VideoPlayer";
import { useStore } from "@/store/useStore";
import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { log } from "@/utils/logger";
import { useVideoStore } from "@/store/useVideoStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useNavStore } from "@/store/useNavStore";

const Dashboard = () => {
  const {
    activeVideo,
  } = useVideoStore();
  const {
    isDialogOpen,
    setIsDialogOpen,
    setSiteHeaderText,
  } = useStore();
  const {
    navMain,
    setNavMainActive,
  } = useNavStore();
  const {
    playerOptions,
    playerState,
    setPlayerState,
  } = usePlayerStore();
  const { pathname } = useLocation();
  useEffect( () =>
  {
    const nav = navMain.find((n) => n.url === pathname);
    if (!nav) return;
    setNavMainActive(nav.id);
    setSiteHeaderText(nav.description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
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
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="safe-top flex flex-1 flex-col max-h-dvh scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200 overflow-hidden overflow-y-auto ">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl w-full p-0 dark:bg-black">
            <DialogHeader className="p-3 pb-0">
              <DialogTitle className="text-xl font-semibold">
                {activeVideo?.title || activeVideo?.name || "video"}
              </DialogTitle>
            </DialogHeader>
            <div className="p-3 pt-2">
              {activeVideo && (
                <VideoPlayer
                  options={playerOptions}
                  onReady={handlePlayerReady}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;
