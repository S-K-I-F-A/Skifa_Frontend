import type { Metadata } from "next";
import localFont from "next/font/local";

import { siteConfig } from "@/config/site";

import "./globals.css";

const dmSans = localFont({
  src: "../public/fonts/dm-sans.ttf",
  weight: "100 1000",
  display: "swap",
  variable: "--font-dm-sans",
});

const leagueSpartan = localFont({
  src: "../public/fonts/league-spartan.ttf",
  weight: "100 900",
  display: "swap",
  variable: "--font-league-spartan",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: "Skifa — Discover. Develop. Deploy.",
    description: siteConfig.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skifa — Discover. Develop. Deploy.",
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${leagueSpartan.variable} h-full antialiased`}
    >
      <body className={`${dmSans.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
