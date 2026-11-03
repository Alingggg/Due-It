import { LoadingPage } from "@/components";
import { useGetProfile } from "@/hooks";
import { Navigate, Outlet } from "react-router";

function PublicLayout() {
  const { data: user, isLoading: isSessionLoading } = useGetProfile();

  if (isSessionLoading) {
    return <LoadingPage message="Loading..." size="lg" />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PublicLayout;
