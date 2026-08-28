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
          // /resources is deliberately NOT disallowed while it is unlaunched,
          // even though it is hidden. Those routes now serve
          // `noindex, nofollow` (see app/resources/blog/page.tsx), and the two
          // directives work against each other: a crawler told not to fetch a
          // URL never reads the noindex on it. A URL discovered some other way
          // — a shared link, an external mention — can then still be indexed
          // as a bare URL, with no way to drop it back out.
          //
          // Disallow saves crawl budget on pages that are already out of the
          // index. noindex is what removes them and keeps them out. The list
          // above is the former case: /posts and /pages are duplicates of
          // content indexed under its real URL, and the version routes are
          // scratch. Resources is the latter.
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
