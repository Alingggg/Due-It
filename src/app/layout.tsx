import type { Metadata } from "next";
import "./globals.css";
import { DialogProvider } from "@/context/DialogProvider";
import { SemesterProvider } from "@/context/SemesterProvider";
import { QueryClientProvider } from "./query-client-provider";

export const metadata: Metadata = {
  title: "Due It",
  description: "A task management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>
          <SemesterProvider>
            <DialogProvider>{children}</DialogProvider>
          </SemesterProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
