import type { Metadata } from "next";
import "./globals.css";
import { DialogProvider } from "@/context/DialogProvider";

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
        <DialogProvider>{children}</DialogProvider>
      </body>
    </html>
  );
}
