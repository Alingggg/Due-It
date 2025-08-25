"use client";
import { ModalProvider } from "@/context";

function ClientLayout({ children }: { children: React.ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
}

export default ClientLayout;
