import "./globals.css";

import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme/theme-provider";

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

const GTM_ID = "GTM-K9WKCPXV";
const CLARITY_ID = "vft9u0it80";

// NextLevel AI agents widget. These point at UAT — swap all four for the
// production CDN/API before launch. authToken ships in the page source, so
// it must stay a scoped, short-lived widget token and nothing broader.
const AI_WIDGET = {
  scriptSrc: "https://uat-cdn.nextlevel.ai/widgets/ai-agents-web-widget_current.js",
  authUrl: "https://uat-api.nextlevel.ai/livekit/v1/live-kit/get-token",
  authToken: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9VyX2lkIjoxLC",
  agentId: "e9766077-f624-4963-b524-6008e13d2128",
};

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
      <head>
        {/* Third-party tags: GTM, Microsoft Clarity and the NextLevel AI
            widget. The dataLayer / clarity queue stubs run immediately so
            nothing pushed early is lost, but the scripts themselves load
            only on the visitor's first interaction (scroll, mouse move, tap
            or key). Loaded in the head they added ~450KB and 200–700ms of
            blocking main-thread work and dropped mobile PageSpeed from the
            90s to the 70s–80s; even right after load their long tasks landed
            in TBT, and the UAT widget's 403s and Clarity's third-party
            cookies cost Best Practices. Trade-off: a visitor who never
            interacts is not recorded in GTM or Clarity. The widget
            loader is exposed as window.loadAiAgentsWidget so a CTA clicked
            before then can start it on demand (see lib/ai-widget.ts). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d){
w.dataLayer=w.dataLayer||[];w.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
w.clarity=w.clarity||function(){(w.clarity.q=w.clarity.q||[]).push(arguments)};
function add(src){var s=d.createElement('script');s.async=true;s.src=src;d.head.appendChild(s);return s;}
w.loadAiAgentsWidget=function(){
  if(w.AiAgentsWebWidgetLoaded)return w.AiAgentsWebWidgetReady;
  w.AiAgentsWebWidgetLoaded=true;
  w.AiAgentsWebWidgetReady=new Promise(function(resolve){
    var s=add("${AI_WIDGET.scriptSrc}");
    s.onload=function(){
      w.AiAgentsWebWidget.init({
        authUrl:"${AI_WIDGET.authUrl}",
        authToken:"${AI_WIDGET.authToken}",
        agentId:"${AI_WIDGET.agentId}",
        openButtonContainerWebTop:24,
        openButtonContainerWebRight:32,
        openButtonContainerMobileTop:100,
        openButtonContainerMobileRight:32
      });
      resolve(true);
    };
    s.onerror=function(){console.error('Failed to load AI Widget script');resolve(false);};
  });
  return w.AiAgentsWebWidgetReady;
};
var started=false,events=['scroll','mousemove','pointerdown','keydown','touchstart'];
function start(){
  if(started)return;started=true;
  events.forEach(function(e){w.removeEventListener(e,start,true);});
  add('https://www.googletagmanager.com/gtm.js?id=${GTM_ID}');
  add('https://www.clarity.ms/tag/${CLARITY_ID}');
  w.loadAiAgentsWidget();
}
events.forEach(function(e){w.addEventListener(e,start,{capture:true,passive:true});});
})(window,document);`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen font-sans antialiased",
          fontSans.variable,
          fontSerif.variable,
        )}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
      </body>
    </html>
  );
}
