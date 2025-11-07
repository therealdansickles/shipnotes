import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "@/components/footer";
import { CookieBanner } from "@/components/cookie-banner";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShipNotes - Team Translation Layer for Git Commits",
  description: "Translate git commits into updates everyone understands. From developers to designers, executives to investors—one source of truth, infinite translations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
