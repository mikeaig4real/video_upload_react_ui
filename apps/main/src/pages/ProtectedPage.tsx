import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, Outlet } from "react-router";

const ProtectedPage = () => {
  const {
    user,
    token,
  } = useAuthStore();
  if (!user || !token) return <Navigate to="/get-started" replace />;
  return <Outlet />;
};

export default ProtectedPage;
