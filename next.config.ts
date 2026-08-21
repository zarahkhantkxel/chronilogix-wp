import type { NextConfig } from "next";

const wordpressHostname = process.env.WORDPRESS_HOSTNAME;
const wordpressUrl = process.env.WORDPRESS_URL;

// Derive the protocol from WORDPRESS_URL so local (http://*.local) instances
// work for next/image optimization, not just https hosts.
const wordpressProtocol: "http" | "https" =
  wordpressUrl?.startsWith("http://") ? "http" : "https";

const nextConfig: NextConfig = {
  output: "standalone",
  // Hide the Next.js dev-tools indicator (the "N / Issues" badge) in dev.
  devIndicators: false,
  images: {
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
      // Legal pages renamed to spell out what they are. The old paths were
      // live and are referenced from outside this codebase — email footers,
      // app store listings, anything already indexed — so they 301 rather
      // than 404. The `:path*` variants carry the deep anchors across too,
      // since the documents cross-reference each other by fragment
      // (e.g. /terms#s-10-3 from the arbitration clause).
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms", destination: "/terms-and-conditions", permanent: true },
      {
        source: "/privacy/:path*",
        destination: "/privacy-policy/:path*",
        permanent: true,
      },
      {
        source: "/terms/:path*",
        destination: "/terms-and-conditions/:path*",
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
