import type { MetadataRoute } from "next";

// Web app manifest — this is what consumes the android-chrome icons in
// /public. The favicon.ico, icon.svg and apple-icon.png siblings in app/
// are picked up by Next's file conventions and need no entry here.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chronilogix",
    short_name: "Chronilogix",
    description:
      "Clinical grade AI coaching for behavioral health and chronic care.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    // Brand orange, matching the mark in the icons and the nav logo.
    theme_color: "#F47B46",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
