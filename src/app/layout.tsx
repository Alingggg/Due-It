import type { Metadata } from "next";
import "./globals.css";
import { ProviderLayout } from "./ProviderLayout";

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
        <ProviderLayout>{children}</ProviderLayout>
      </body>
    </html>
  );
}
