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
