import "./globals.css";

import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Analytics } from "@vercel/analytics/react";

import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

// Self-hosted, trimmed copies of the Google Fonts latin subsets (both OFL).
// The full variable files cost 157KB on every first visit and were the
// largest thing downloaded before the hero could paint; these keep only the
// weights the site uses (85KB). Usage today: sans 400–700 (font-light only
// on a decorative "+"), serif 400–500, serif italic 400 only.
// To change weights, re-instance from the Google latin woff2 with fontTools:
//   instancer.instantiateVariableFont(font, {"wght": (min, max)})
const fontSans = localFont({
  src: "./fonts/hanken-grotesk-latin-wght-400-700.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: "Arial",
});

const fontSerif = localFont({
  src: [
    {
      path: "./fonts/newsreader-latin-wght-400-500.woff2",
      weight: "400 500",
      style: "normal",
    },
    {
      path: "./fonts/newsreader-italic-latin-400.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  title:
    "Chronilogix — Clinical grade AI coaching for behavioral health and chronic care",
  description:
    "Chronilogix is the AI native behavioral health and chronic care coaching platform built on Dr. Ken Resnicow's 30 years of Motivational Interviewing research. Clinical grade outcomes at a fraction of the cost of live care.",
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen font-sans antialiased",
          fontSans.variable,
          fontSerif.variable,
        )}
      >
        {/* Chronilogix is a light-only marketing site. ThemeProvider is kept
            for next-wp's shadcn components but pinned to light so there is no
            dark-mode flash and the marketing pages render as designed.
            Page-level chrome (Nav/Footer) is rendered by each page, not here. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
