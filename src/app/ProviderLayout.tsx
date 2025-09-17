"use client";

import { DialogProvider } from "@/context/DialogProvider";
import { SemesterProvider } from "@/context/SemesterProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function ProviderLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SemesterProvider>
        <DialogProvider>{children}</DialogProvider>
      </SemesterProvider>
    </QueryClientProvider>
  );
}
