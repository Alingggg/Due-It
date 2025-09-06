"use client";

import { useSession } from "@/hooks/Auth";
import { useUserWorkspace } from "@/hooks/Workspace";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPage from "@/components/LoadingPage";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: isSessionLoading } = useSession();
  const {
    data: workspace,
    isLoading: workspaceLoading,
    isError,
    error,
  } = useUserWorkspace(isAuthenticated);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isSessionLoading && isAuthenticated && !workspaceLoading) {
      setIsRedirecting(true);

      if (workspace?.workspace_id) {
        redirect(`/workspace/${workspace.workspace_id}/tasks`);
      } else {
        redirect("/get-started");
      }
    }
  }, [isAuthenticated, isSessionLoading, workspace, workspaceLoading]);

  if (isError) {
    console.error("Failed to load workspace:", error);
  }

  if (
    isSessionLoading ||
    (isAuthenticated && workspaceLoading) ||
    isRedirecting
  ) {
    return (
      <LoadingPage
        message={
          isSessionLoading
            ? "Loading..."
            : isRedirecting
            ? "Redirecting to workspace..."
            : "Loading workspace..."
        }
        size="lg"
      />
    );
  }

  return <>{children}</>;
}

export default RootLayout;
