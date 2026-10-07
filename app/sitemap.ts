import { MetadataRoute } from "next";
import { getAllPostsForSitemap } from "@/lib/wordpress";
import { siteConfig } from "@/site.config";

/**
 * sitemap.xml
 *
 * This replaces the next-wp starter's version, which listed the starter's own
 * routes (/posts, /posts/authors, /posts/categories, /posts/tags, /pages) and
 * nothing this site actually publishes — no /about, no /product, no solutions
 * pages, no legal pages. Every URL in it also pointed at next-wp.com, so the
 * published sitemap described a different website entirely.
 *
 * Two rules for anything added here:
 *
 * 1. One URL per piece of content. Articles are reachable at BOTH
 *    /resources/blog/<slug> and the starter's /posts/<slug>; the nav, footer
 *    and every internal link use /resources/blog, so that is the canonical
 *    form and the only one listed. Advertising both would ask search engines
 *    to pick a canonical for us.
 *
 * 2. Only pages meant for the public. /v2, /v3, /v4 and /product/v4 are
 *    version explorations that are routable but not linked from anywhere, and
 *    /pages plus /posts* are starter scaffolding. They stay out here and are
 *    disallowed in robots.ts.
 *
 * lastModified for articles comes from WordPress, so re-crawls follow real
 * edits rather than deploy time.
 */

const BASE = siteConfig.site_domain.replace(/\/$/, "");

/**
 * The Resources section is not public yet. Its nav entry is hidden (see
 * NAV_LINKS in components/nav/NavClient.tsx, where RESOURCES_MENU is kept
 * intact for exactly this reason) and nothing in the footer links to it, so
 * neither the blog index nor its articles belong in the sitemap: submitting
 * URLs a visitor cannot reach through the site invites them into search
 * results ahead of launch.
 *
 * The routes still resolve, so this is a publishing decision rather than a
 * technical one. Flip to true when Resources ships and both the index and
 * every article return, no other edit needed — robots.ts reads the same flag.
 */
export const BLOG_PUBLISHED = false;

type Entry = MetadataRoute.Sitemap[number];

const page = (
  path: string,
  priority: number,
  changeFrequency: Entry["changeFrequency"] = "monthly",
): Entry => ({
  url: `${BASE}${path}`,
  lastModified: new Date(),
  changeFrequency,
  priority,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    page("", 1, "weekly"),

    // Primary marketing surfaces.
    page("/product", 0.9),
    page("/about", 0.8),
    page("/faq", 0.7),

    // Audience pages — the paid-acquisition landing targets.
    page("/solutions/brokers", 0.8),
    page("/solutions/vendors", 0.8),
    page("/solutions/app-partners", 0.8),
    page("/partner-solutions", 0.8),

    // Proof.
    page("/case-studies/aetna", 0.7),

    // Legal. Low priority but they should be indexable: people search for
    // them by name, and linking them from the footer without letting them be
    // found is worse than useless.
    page("/privacy-policy", 0.3, "yearly"),
    page("/terms-and-conditions", 0.3, "yearly"),
  ];

  // Articles are omitted entirely while BLOG_PUBLISHED is false — see the flag.
  // getAllPostsForSitemap rather than getBlogArticles: articles are WordPress
  // posts, and only this helper carries `modified`. BlogArticle exposes `date`
  // (published), so using it would have reported every article as freshly
  // changed on each deploy. It already returns [] when WordPress is not
  // configured; the catch covers it being configured but unreachable, since a
  // sitemap that fails the build is worse than one missing its articles.
  let articleUrls: MetadataRoute.Sitemap = [];
  if (BLOG_PUBLISHED) {
    staticUrls.push(page("/resources/blog", 0.7, "weekly"));
    try {
      const posts = await getAllPostsForSitemap();
      articleUrls = posts.map((post) => ({
        url: `${BASE}/resources/blog/${post.slug}`,
        lastModified: new Date(post.modified),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    } catch {
      articleUrls = [];
    }
  }

  return [...staticUrls, ...articleUrls];
}
