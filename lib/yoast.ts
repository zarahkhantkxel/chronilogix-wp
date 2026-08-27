/**
 * Yoast SEO layer — turns the title and meta description an editor sets in
 * wp-admin into Next.js `Metadata`.
 *
 * Yoast (wordpress-seo 28.x) adds `yoast_head_json` to the REST payload for
 * pages and posts, so the fields under Yoast's "Search appearance" panel come
 * back as structured data rather than a blob of HTML. The `yoast_head` string
 * is deliberately not used: injecting raw <head> markup would duplicate the
 * tags Next already emits and fight its metadata handling.
 *
 * Fetches are graceful in the same way as lib/acf.ts — an unreachable or
 * unconfigured WordPress returns null and the caller keeps its hardcoded
 * metadata, so a CMS outage never strips a page's title tag.
 *
 * ONE THING TO KNOW ABOUT CANONICALS. Yoast computes `canonical` from the
 * WordPress site URL, so it returns e.g.
 *   https://nextwp.chronilogix.com/home/
 * That is the headless backend, not a page anyone should land on. Passing it
 * through verbatim would tell search engines the real URL is on the CMS host —
 * worse than having no canonical at all. `toMetadata` therefore ignores Yoast's
 * canonical and takes the frontend path from the caller, which knows its own
 * route. Same reasoning for og_url.
 */
import type { Metadata } from "next";

const baseUrl = process.env.WORDPRESS_URL;
const CACHE_TTL = 3600; // 1 hour, matching lib/acf.ts and lib/wordpress.ts
const USER_AGENT = "Next.js WordPress Client";

/** The subset of yoast_head_json this site uses. */
export type YoastHead = {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: {
    index?: string; // "index" | "noindex"
    follow?: string; // "follow" | "nofollow"
    [key: string]: string | undefined;
  };
  og_title?: string;
  og_description?: string;
  og_url?: string;
  og_type?: string;
  og_image?: Array<{ url?: string; width?: number; height?: number }>;
  article_modified_time?: string;
  twitter_card?: string;
};

type RestType = "pages" | "posts";

/**
 * Fetch `yoast_head_json` for a published page or post by slug.
 * Returns null when WordPress is unconfigured/unreachable, the slug does not
 * exist, or Yoast is not active (in which case the key is simply absent).
 */
export async function getYoastHead(
  slug: string,
  type: RestType = "pages",
): Promise<YoastHead | null> {
  if (!baseUrl) return null;

  const url =
    `${baseUrl}/wp-json/wp/v2/${type}` +
    `?slug=${encodeURIComponent(slug)}&_fields=yoast_head_json&per_page=1`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      next: {
        // Shares the "wordpress" tag so the existing revalidate webhook clears
        // SEO fields along with everything else on an edit.
        tags: ["wordpress", "yoast", `yoast-${type}-${slug}`],
        revalidate: CACHE_TTL,
      },
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{ yoast_head_json?: YoastHead }>;
    return rows?.[0]?.yoast_head_json ?? null;
  } catch {
    console.warn(`Yoast fetch failed for ${type} "${slug}"`);
    return null;
  }
}

/**
 * Map a YoastHead onto Next `Metadata`, merged over whatever the page already
 * declares.
 *
 * `fallback` wins for any field Yoast leaves empty, so a page that has not been
 * filled in under Search appearance keeps the copy it shipped with rather than
 * losing its title. `path` is the route on THIS site and is the only source for
 * canonical and og:url — see the canonical note at the top of this file.
 */
export function toMetadata(
  yoast: YoastHead | null,
  fallback: Metadata,
  path: string,
): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;

  if (!yoast) {
    return { ...fallback, alternates: { ...fallback.alternates, canonical } };
  }

  const title = yoast.title?.trim() || fallback.title;
  const description = yoast.description?.trim() || fallback.description;

  // Yoast reports robots as strings ("index" / "noindex"). Anything other than
  // an explicit noindex is left to Next's defaults rather than asserted, so a
  // page is never accidentally marked noindex by a parsing slip.
  const noindex = yoast.robots?.index === "noindex";
  const nofollow = yoast.robots?.follow === "nofollow";

  const ogImages = (yoast.og_image ?? [])
    .filter((img) => Boolean(img?.url))
    .map((img) => ({ url: img.url as string, width: img.width, height: img.height }));

  return {
    ...fallback,
    title,
    description,
    alternates: { ...fallback.alternates, canonical },
    ...(noindex || nofollow
      ? { robots: { index: !noindex, follow: !nofollow } }
      : {}),
    openGraph: {
      ...fallback.openGraph,
      title: yoast.og_title?.trim() || (title as string | undefined),
      description:
        yoast.og_description?.trim() || (description as string | undefined),
      // Relative URL resolved against metadataBase, so it lands on the frontend
      // domain rather than Yoast's CMS-host og_url.
      url: canonical,
      ...(ogImages.length ? { images: ogImages } : {}),
    },
    twitter: {
      ...fallback.twitter,
      card:
        (yoast.twitter_card as "summary" | "summary_large_image" | undefined) ??
        "summary_large_image",
      title: yoast.og_title?.trim() || (title as string | undefined),
      description:
        yoast.og_description?.trim() || (description as string | undefined),
    },
  };
}

/**
 * Convenience wrapper for the common case: one page slug, one route.
 *
 *   export const generateMetadata = () =>
 *     yoastMetadata("about", "/about", { title: "About · Chronilogix" });
 */
export async function yoastMetadata(
  slug: string,
  path: string,
  fallback: Metadata,
  type: RestType = "pages",
): Promise<Metadata> {
  return toMetadata(await getYoastHead(slug, type), fallback, path);
}
