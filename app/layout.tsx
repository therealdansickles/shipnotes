import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shiplog - AI-Powered Changelog Generator",
  description: "Turn your messy Git commits into beautiful, professional changelogs in seconds with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
