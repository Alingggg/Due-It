import { LoadingPage } from "@/components";
import { useGetSession } from "@/hooks";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

function PublicLayout() {
  const { isAuthenticated, isLoading: isSessionLoading } = useGetSession();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSessionLoading && isAuthenticated) {
      setIsRedirecting(true);
      navigate("/get-started");
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

  return <Outlet />;
}

export default PublicLayout;
