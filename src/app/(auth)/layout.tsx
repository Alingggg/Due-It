"use client";

import { useSession } from "@/hooks/Auth";
import supabase from "@/lib/supabase";
import { redirect } from "next/navigation";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useSession();

  if (isLoading) return null;

  if (isAuthenticated) {
    supabase
      .from("workspace_members")
      .select("workspace_id")
      .single()
      .then(({ data }) => {
        if (data?.workspace_id) {
          redirect(`/workspace/${data.workspace_id}/tasks`);
        } else {
          redirect("/get-started");
        }
      });
  }

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

export default RootLayout;
