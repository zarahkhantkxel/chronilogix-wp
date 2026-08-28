import { getYoastSchema } from "@/lib/yoast";

/**
 * Renders Yoast's structured data as JSON-LD.
 *
 * Next's Metadata API has no field for JSON-LD, so the script tag is rendered
 * in the page rather than declared in generateMetadata. Google reads
 * application/ld+json from anywhere in the document, so placing it in the body
 * is fine and is what Next's own docs recommend.
 *
 * Async server component: it fetches on the server, ships no client JavaScript,
 * and shares the Yoast fetch cache with generateMetadata on the same route, so
 * adding it does not cost a second request.
 *
 * Renders nothing when Yoast, WordPress or the page is unavailable. That is the
 * right failure mode — a page with no structured data is normal, a page with
 * structured data pointing at the wrong site is a problem someone has to notice
 * to fix.
 */
export async function YoastSchema({
  slug,
  path,
  type = "pages",
}: {
  slug: string;
  /** The route on THIS site. Yoast addresses the page by its WordPress
   *  permalink, which is not always the same path. */
  path: string;
  type?: "pages" | "posts";
}) {
  const schema = await getYoastSchema(slug, path, type);
  if (!schema) return null;

  // `<` is escaped so a string inside the graph can never close this script
  // element early. JSON.stringify does not do this, and Yoast fields are
  // editor-supplied, so the input is not trusted markup.
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
