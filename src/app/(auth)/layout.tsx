"use client";

import { useSession } from "@/hooks/Auth";
import supabase from "@/lib/supabase";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPage from "@/components/LoadingPage";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (!isLoading && isAuthenticated) {
        setIsRedirecting(true);

        const { data, error } = await supabase
          .from("workspace_members")
          .select("workspace_id")
          .maybeSingle();

        if (data?.workspace_id && !error) {
          redirect(`/workspace/${data.workspace_id}/tasks`);
        } else {
          redirect("/get-started");
        }
      }
    };

    checkAuthAndRedirect();
  }, [isAuthenticated, isLoading]);

  if (isLoading || isRedirecting) {
    return (
      <LoadingPage
        message={isLoading ? "Loading..." : "Redirecting to workspace..."}
        size="lg"
      />
    );
  }

  return <>{children}</>;
}

export default RootLayout;
