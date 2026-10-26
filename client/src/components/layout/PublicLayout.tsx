import { LoadingPage } from "@/components";
import { useGetProfile } from "@/hooks";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

function PublicLayout() {
  const { data: user, isLoading: isSessionLoading } = useGetProfile();
  const isAuthenticated = !!user;
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSessionLoading && isAuthenticated) {
      setIsRedirecting(true);
      navigate("/");
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
