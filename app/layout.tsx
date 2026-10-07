import type { Metadata } from "next";
import { DM_Sans, League_Spartan } from "next/font/google";

import { siteConfig } from "@/config/site";

import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
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
