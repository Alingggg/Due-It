import { LoadingPage } from "@/components";
import { useGetSession, useGetUserWorkspace } from "@/hooks";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

function ProtectedLayout() {
  const { isAuthenticated, isLoading: isSessionLoading } = useGetSession();
  const {
    data: workspace,
    isLoading: workspaceLoading,
    isError,
    error,
    refetch: refetchWorkspace,
  } = useGetUserWorkspace(isAuthenticated);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isSessionLoading) {
      refetchWorkspace();
    }
  }, [isAuthenticated, isSessionLoading, refetchWorkspace]);

  useEffect(() => {
    if (!isSessionLoading && !workspaceLoading) {
      if (!isAuthenticated) {
        setIsRedirecting(true);
        navigate("/sign-in");
      } else if (workspace?.id) {
        // User HAS a workspace - only redirect from get-started, allow profile
        if (pathname === "/get-started") {
          setIsRedirecting(true);
          navigate(`/workspace/${workspace.id}/tasks`);
        } else {
          setIsRedirecting(false);
        }
      } else {
        // User has NO workspace - redirect to get-started ONLY if not already there or on profile
        if (pathname !== "/get-started" && pathname !== "/profile") {
          setIsRedirecting(true);
          navigate("/get-started");
        } else {
          setIsRedirecting(false);
        }
      }
    }
  }, [
    isAuthenticated,
    isSessionLoading,
    workspace,
    workspaceLoading,
    navigate,
    pathname,
    refetchWorkspace,
  ]);

  if (isError) {
    console.error("Failed to load workspace:", error);
    if (!isRedirecting) {
      setIsRedirecting(true);
      navigate("/get-started");
    }
  }

  if (isSessionLoading || workspaceLoading || isRedirecting) {
    return (
      <LoadingPage
        message={
          isSessionLoading
            ? "Loading..."
            : isRedirecting
            ? "Redirecting..."
            : "Loading"
        }
      />
    );
  }

  return <Outlet />;
}

export default ProtectedLayout;
