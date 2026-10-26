import { LoadingPage } from "@/components";
import { useGetProfile } from "@/hooks";
import { Navigate, Outlet } from "react-router";

function ProtectedLayout() {
  const { data: user, isLoading: isSessionLoading } = useGetProfile();

  if (isSessionLoading) {
    return <LoadingPage message="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}

export default ProtectedLayout;
