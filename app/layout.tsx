import "./globals.css";

import { Hanken_Grotesk, Newsreader } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Analytics } from "@vercel/analytics/react";

import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

const fontSans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontSerif = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
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
        {/* Google Tag Manager — must load as high in <head> as possible so the
            dataLayer exists before any page script pushes to it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        {/* Microsoft Clarity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`,
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
        {/* NextLevel AI agents widget. Mounts itself onto document.body outside
            React's tree, so the load guard keeps it a single instance across
            client-side navigations. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.addEventListener("DOMContentLoaded", () => {
  function loadAiAgentsWidget() {
    if (window.AiAgentsWebWidgetLoaded) return;
    window.AiAgentsWebWidgetLoaded = true;
    window.AiAgentsWebWidgetReady = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "${AI_WIDGET.scriptSrc}";
      script.async = true;
      script.onload = () => {
        const config = {
          authUrl: "${AI_WIDGET.authUrl}",
          authToken: "${AI_WIDGET.authToken}",
          agentId: "${AI_WIDGET.agentId}",
          openButtonContainerWebTop: 24,
          openButtonContainerWebRight: 32,
          openButtonContainerMobileTop: 100,
          openButtonContainerMobileRight: 32
        };
        window.AiAgentsWebWidget.init(config);
        console.log('AI Widget successfully initialized');
        resolve(true);
      };
      script.onerror = () => {
        console.error('Failed to load AI Widget script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  loadAiAgentsWidget();
});`,
          }}
        />
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
