import "./App.css";
import { ModeToggle } from "@/components/ModeToggle";
import AppRoutes from "@/routes/AppRoutes";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import AppErrorBoundary from "@/components/AppErrorBoundary";
// TODO: need to enforce DRY with my types, like seriously
function App() {
  return (
    <BackgroundLines>
      <main className="h-dvh safe-top w-screen absolute z-50 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <AppErrorBoundary>
          <AppRoutes />
        </AppErrorBoundary>
      </main>
      <div className="fixed top-2 right-3 z-96">
        <ModeToggle />
      </div>
      <Toaster expand={true} closeButton />
      <Analytics />
    </BackgroundLines>
  );
}

export default App;
