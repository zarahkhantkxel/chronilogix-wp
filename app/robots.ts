import { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

/**
 * robots.txt
 *
 * Replaces the two-line static app/robots.txt, which allowed everything and
 * — the part that mattered — never named the sitemap, so nothing pointed a
 * crawler at it.
 *
 * The disallow list is about duplicate content, not secrecy. Every path below
 * returns 200 and will be crawled if it is discovered; none of it should be
 * competing with the real pages in an index:
 *
 *   /posts, /posts/*   the starter's blog. Articles are served at BOTH
 *                      /posts/<slug> and /resources/blog/<slug>; the site
 *                      links exclusively to the latter, so the former is a
 *                      duplicate of every article.
 *   /pages, /pages/*   starter scaffolding that renders WordPress pages
 *                      directly, duplicating the designed routes — the legal
 *                      documents are reachable at /pages/privacy and
 *                      /pages/terms as well as their real URLs.
 *   /v2 /v3 /v4        homepage explorations, linked from nowhere.
 *   /product/v4        an alternate product page, same.
 *
 * Disallow only asks a crawler not to fetch. Anything already indexed needs a
 * noindex header or a redirect to actually leave an index — see the note in
 * the PR.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.site_domain.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/posts",
          "/posts/",
          "/pages",
          "/pages/",
          "/v2",
          "/v3",
          "/v4",
          "/product/v4",
          "/api/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
