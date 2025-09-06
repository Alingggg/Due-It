"use client";

import LoadingPage from "@/components/LoadingPage";
import { useSession } from "@/hooks/Auth";
import { useUserWorkspace } from "@/hooks/Workspace";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: isSessionLoading } = useSession();
  const {
    data: workspace,
    isLoading: workspaceLoading,
    isError,
    error,
  } = useUserWorkspace(isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isSessionLoading && !workspaceLoading) {
      if (!isAuthenticated) {
        setIsRedirecting(true);
        router.push("/sign-in");
      } else if (workspace?.workspace_id) {
        // User HAS a workspace - redirect to it ONLY if not already there
        if (!pathname.startsWith(`/workspace/${workspace.workspace_id}`)) {
          setIsRedirecting(true);
          router.push(`/workspace/${workspace.workspace_id}/tasks`);
        } else {
          setIsRedirecting(false); // Reset if already at correct workspace
        }
      } else {
        // User has NO workspace - redirect to get-started ONLY if not already there
        if (pathname !== "/get-started") {
          setIsRedirecting(true);
          router.push("/get-started");
        } else {
          setIsRedirecting(false); // Reset if already at get-started
        }
      }
    }
  }, [
    isAuthenticated,
    isSessionLoading,
    workspace,
    workspaceLoading,
    router,
    pathname,
  ]);

  if (isError) {
    console.error("Failed to load workspace:", error);
    if (!isRedirecting) {
      setIsRedirecting(true);
      router.push("/get-started");
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
            : "Loading workspace..."
        }
      />
    );
  }

  return <>{children}</>;
}

export default RootLayout;
