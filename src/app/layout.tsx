import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
