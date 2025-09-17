"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/sign-in");
  }, [router]);

  return null;
}

export default LandingPage;
