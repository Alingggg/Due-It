"use client";
import { DialogProvider } from "@/context/DialogProvider";

function ClientLayout({ children }: { children: React.ReactNode }) {
  return <DialogProvider>{children}</DialogProvider>;
}

export default ClientLayout;
