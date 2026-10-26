import { LoadingPage } from "@/components";
import { useGetProfile, useGetUserWorkspace } from "@/hooks";
import { Navigate, Outlet, useLocation } from "react-router";

function ProtectedLayout() {
  const { data: user, isLoading: isSessionLoading } = useGetProfile();
  const {
    data: workspace,
    isLoading: workspaceLoading,
    isError,
    error,
  } = useGetUserWorkspace();
  const { pathname } = useLocation();

  if (isSessionLoading || workspaceLoading) {
    return <LoadingPage message="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (isError) {
    console.error("Failed to load workspace:", error);
  }

  if (workspace?.id) {
    // User HAS a workspace - only redirect from get-started, allow profile
    if (pathname === "/get-started") {
      return <Navigate to={`/workspace/${workspace.id}/tasks`} replace />;
    }
  } else if (pathname !== "/get-started" && pathname !== "/profile") {
    // User has NO workspace (or it failed to load) - only allow get-started and profile
    return <Navigate to="/get-started" replace />;
  }

  return <Outlet />;
}

export default ProtectedLayout;
