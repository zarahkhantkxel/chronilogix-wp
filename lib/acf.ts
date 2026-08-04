/**
 * ACF content layer — reads Advanced Custom Fields data attached to WordPress
 * Pages via the REST API.
 *
 * Each field group is registered with `show_in_rest: true`, so a page's fields
 * are returned under the `acf` key of `/wp-json/wp/v2/pages?slug=...`. Image
 * fields use the "url" return format, so they arrive as plain string URLs that
 * drop straight into existing `src` props.
 *
 * Fetches are graceful: if WordPress is unreachable or the page/fields are
 * missing, `getPageAcf` returns `null` and callers fall back to the built-in
 * default content, so the UI always renders (matching lib/wordpress.ts).
 */
const baseUrl = process.env.WORDPRESS_URL;
const CACHE_TTL = 3600; // 1 hour, matching lib/wordpress.ts
const USER_AGENT = "Next.js WordPress Client";

/**
 * Fetch the ACF field object for a published Page by slug.
 * Returns `null` when WordPress is unconfigured/unreachable or the page (or its
 * `acf` payload) does not exist.
 */
export async function getPageAcf<T = Record<string, unknown>>(
  slug: string,
): Promise<T | null> {
  if (!baseUrl) return null;

  // `acf_format=standard` makes ACF return formatted values (e.g. image fields
  // as URL strings per their return_format) instead of raw attachment IDs.
  const url = `${baseUrl}/wp-json/wp/v2/pages?slug=${encodeURIComponent(
    slug,
  )}&_fields=acf&acf_format=standard&per_page=1`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      next: {
        tags: ["wordpress", "acf", `acf-${slug}`],
        revalidate: CACHE_TTL,
      },
    });
    if (!res.ok) return null;
    const pages = (await res.json()) as Array<{ acf?: T }>;
    return pages?.[0]?.acf ?? null;
  } catch {
    console.warn(`ACF fetch failed for page "${slug}"`);
    return null;
  }
}

/**
 * Merge fetched ACF content over a set of defaults, dropping null/undefined and
 * empty-string values so a partially-filled (or missing) ACF payload never
 * blanks out the UI — the built-in default copy shows through instead.
 */
export function withAcfDefaults<T extends Record<string, unknown>>(
  defaults: T,
  acf: Partial<T> | null | undefined,
): T {
  if (!acf) return defaults;
  const out: Record<string, unknown> = { ...defaults };
  for (const [key, value] of Object.entries(acf)) {
    if (value === null || value === undefined || value === "") continue;
    out[key] = value;
  }
  return out as T;
}
