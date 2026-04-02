import type { Metadata, Viewport } from "next";
import { Bebas_Neue, JetBrains_Mono, Manrope } from "next/font/google";
import { ReactNode } from "react";

import { PublicMotionShell, RuntimeCapabilityFlags } from "@/shared/motion";
import { LiveScoreRefresh } from "@/shared/navigation/live-score-refresh";
import { GlobalSupport, SiteFooter, SiteHeader } from "@/shared/navigation";
import { getDefaultSiteMetadata } from "@/server/data/public/page-metadata";
import { getGlobalChromeData } from "@/server/data/public/global-chrome-query";

import "./globals.css";

export const revalidate = 0;

const headingFont = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "400"
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = getDefaultSiteMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#071019"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const chrome = await getGlobalChromeData();

  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
        <RuntimeCapabilityFlags />
        <PublicMotionShell />
        <LiveScoreRefresh />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="broadcast-backdrop">
          <div className="bg-grid" />
          <div className="bg-beam bg-beam-one" />
          <div className="bg-beam bg-beam-two" />
          <div className="bg-glow bg-glow-gold" />
          <div className="bg-glow bg-glow-cyan" />
        </div>
        <SiteHeader chrome={chrome} />
        <main id="main-content" className="page-shell" tabIndex={-1}>
          {children}
        </main>
        <GlobalSupport tournament={chrome.tournament} />
        <SiteFooter chrome={chrome} />
      </body>
    </html>
  );
}

