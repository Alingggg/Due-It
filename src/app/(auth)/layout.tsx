"use client";

import { useGetSession } from "@/hooks/Auth";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPage from "@/components/LoadingPage";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: isSessionLoading } = useGetSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isSessionLoading && isAuthenticated) {
      setIsRedirecting(true);
      redirect("/get-started");
    }
  }, [isAuthenticated, isSessionLoading]);

  if (isSessionLoading || isRedirecting) {
    return (
      <LoadingPage
        message={isSessionLoading ? "Loading..." : "Redirecting..."}
        size="lg"
      />
    );
  }

  return <>{children}</>;
}

export default RootLayout;
