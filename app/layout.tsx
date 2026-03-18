import type { Metadata } from "next";
import { Bebas_Neue, JetBrains_Mono, Manrope } from "next/font/google";

import { SiteHeader } from "@/components/site-header";

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
  title: "Tournament Portal",
  description: "Responsive college tournament portal with public and admin areas."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
        <div className="bg-orb bg-orb-one" />
        <div className="bg-orb bg-orb-two" />
        <SiteHeader />
        <main className="page-shell">{children}</main>
      </body>
    </html>
  );
}
