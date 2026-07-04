import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const font = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "RICCC — the Rush Interdisciplinary Consortium for Critical Care Trials and Data Science at Rush University, Chicago. Investigators include J.C. Rojas and Kevin Buell. Federated research via the CLIF consortium.",
  keywords: [
    "RICCC",
    "Rush Interdisciplinary Consortium for Critical Care Trials and Data Science",
    "Rush University",
    "critical care trials",
    "ICU data science",
    "critical care AI",
    "clinical informatics",
    "CLIF consortium",
    "JC Rojas",
    "J.C. Rojas",
    "Juan C. Rojas",
    "Juan Carlos Rojas",
    "Rojas Rush University",
    "Kevin Buell",
    "Buell Rush University",
  ],
  authors: [
    { name: siteConfig.name, url: siteConfig.url },
    { name: "Juan C. Rojas", url: `${siteConfig.url}/team#juan-rojas` },
    { name: "Kevin Buell", url: `${siteConfig.url}/team#kevin-buell` },
  ],
  metadataBase: new URL(siteConfig.url),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${font.variable} ${GeistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-rush-surface text-rush-on-surface">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
