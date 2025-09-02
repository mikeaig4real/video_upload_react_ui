import "./App.css";
import { ModeToggle } from "@/components/ModeToggle";
import AppRoutes from "@/routes/AppRoutes";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import { useLocation } from "react-router";
function App() {
  const location = useLocation();
  const hideToggle = location.pathname.startsWith("/embed/");
  return (
    <BackgroundLines>
      <main className="h-dvh safe-top w-screen absolute z-50 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <AppErrorBoundary>
          <AppRoutes />
        </AppErrorBoundary>
      </main>
      {hideToggle ? null : (
        <div className="fixed top-2 right-3 z-96">
          <ModeToggle />
        </div>
      )}
      <Toaster expand={true} closeButton />
      <Analytics />
    </BackgroundLines>
  );
}

export default App;
