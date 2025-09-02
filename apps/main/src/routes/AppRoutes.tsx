import GetStarted from "@/pages/GetStarted";
import Home from "@/pages/Home";
import User from "@/pages/User";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import { Route, Routes } from "react-router";
import ProtectedPage from "@/pages/ProtectedPage";
import VideoLibrary from "@/pages/VideoLibrary";
import Videos from "@/pages/Videos";
import Upload from "@/pages/Upload";
import Settings from "@/pages/Settings";
import EmbedPlayer from "@/pages/EmbedPlayer";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/video-library" element={<VideoLibrary />} />
      <Route path="/embed/:id" element={<EmbedPlayer />} />
      <Route element={<ProtectedPage />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Upload />} />
          <Route path="settings" element={<Settings />} />
          <Route path="videos" element={<Videos />} />
          <Route path="upload" element={<Upload />} />
          <Route path="user" element={<User />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
