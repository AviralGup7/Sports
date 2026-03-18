import type { Metadata } from "next";
import { Bebas_Neue, JetBrains_Mono, Manrope } from "next/font/google";
import { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import { getGlobalChromeData } from "@/lib/data";

import "./globals.css";

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

export const metadata: Metadata = {
  title: "IASL Arena Portal",
  description: "Broadcast-style college tournament portal with public spectacle and organizer control room."
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
      </body>
    </html>
  );
}
