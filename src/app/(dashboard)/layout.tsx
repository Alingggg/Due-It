"use client";

import LoadingPage from "@/components/LoadingPage";
import { useSession } from "@/hooks/Auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setIsRedirecting(true);
      router.push("/sign-in");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingPage message="Loading..." />;
  }

  if (!isAuthenticated || isRedirecting) {
    return <LoadingPage message="Redirecting to sign in..." />;
  }

  return <>{children}</>;
}

export default RootLayout;
