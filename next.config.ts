import type { NextConfig } from "next";

const wordpressUrl = process.env.WORDPRESS_URL;
// Fall back to WORDPRESS_URL's host so ACF media (wp-content/uploads) can
// still be optimized by next/image when WORDPRESS_HOSTNAME isn't set.
const wordpressHostname =
  process.env.WORDPRESS_HOSTNAME ||
  (wordpressUrl ? new URL(wordpressUrl).hostname : undefined);

// Derive the protocol from WORDPRESS_URL so local (http://*.local) instances
// work for next/image optimization, not just https hosts.
const wordpressProtocol: "http" | "https" =
  wordpressUrl?.startsWith("http://") ? "http" : "https";

const nextConfig: NextConfig = {
  output: "standalone",
  // Hide the Next.js dev-tools indicator (the "N / Issues" badge) in dev.
  devIndicators: false,
  images: {
    // AVIF first (smallest), WebP fallback. 50 is used for decorative,
    // heavily blurred backdrops where the extra bytes are invisible.
    formats: ["image/avif", "image/webp"],
    qualities: [50, 75],
    // Next's defaults plus 1440: the 1200→1920 jump made the hero phone on
    // 2x desktop screens (~1300px needed) download a 1920 variant.
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
    remotePatterns: wordpressHostname
      ? [
          {
            protocol: wordpressProtocol,
            hostname: wordpressHostname,
            port: "",
            pathname: "/**",
          },
        ]
      : [],
  },
  async redirects() {
    const redirects = [
      // Rooney -> Roni rebrand: preserve the old article URL.
      {
        source:
          "/resources/blog/inside-rooney-ai-clinical-grade-coaching-at-scale",
        destination:
          "/resources/blog/inside-roni-ai-clinical-grade-coaching-at-scale",
        permanent: true,
      },
    ];
    if (wordpressUrl) {
      redirects.push({
        source: "/admin",
        destination: `${wordpressUrl}/wp-admin`,
        permanent: true,
      });
    }
    return redirects;
  },
};

export default nextConfig;
