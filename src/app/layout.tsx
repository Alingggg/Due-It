import type { Metadata } from "next";
import "./globals.css";
import { DialogProvider } from "@/context/DialogProvider";
import { SemesterProvider } from "@/context/SemesterProvider";

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
        <SemesterProvider>
          <DialogProvider>{children}</DialogProvider>
        </SemesterProvider>
      </body>
    </html>
  );
}
