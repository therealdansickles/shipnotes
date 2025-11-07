import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "@/components/footer";
import { CookieBanner } from "@/components/cookie-banner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://shipnotes.xyz'),
  title: {
    default: "ShipNotes - Translate Your Code for Every Team",
    template: "%s | ShipNotes"
  },
  description: "Every team speaks a different language. ShipNotes translates your git commits into updates everyone understands - from developers to designers, executives to investors. AI-powered changelog generation for fast-moving teams.",
  keywords: [
    "changelog generator",
    "git commit translator",
    "AI changelog",
    "developer tools",
    "release notes",
    "git to changelog",
    "automated changelog",
    "commit message translator",
    "technical communication",
    "stakeholder updates",
    "developer communication tool"
  ],
  authors: [{ name: "ShipNotes" }],
  creator: "ShipNotes",
  publisher: "ShipNotes",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shipnotes.xyz",
    title: "ShipNotes - Translate Your Code for Every Team",
    description: "Turn git commits into updates everyone understands. From developers to designers, executives to investors. AI-powered translation for fast-moving teams.",
    siteName: "ShipNotes",
    images: [
      {
        url: "/shipnotes-logo.png",
        width: 1200,
        height: 630,
        alt: "ShipNotes - Translate Your Code for Every Team"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@ShipNotesXYZ",
    creator: "@ShipNotesXYZ",
    title: "ShipNotes - Translate Your Code for Every Team",
    description: "Turn git commits into updates everyone understands. AI-powered changelog generation for fast-moving teams.",
    images: ["/shipnotes-logo.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  }
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
