import { useStore } from "@/store/useStore";
import { Navigate, Outlet } from "react-router";

const ProtectedPage = () => {
  const {
    user,
    token,
  } = useStore();
  if (!user || !token) return <Navigate to="/get-started" replace />;
  return <Outlet />;
};

export default ProtectedPage;
