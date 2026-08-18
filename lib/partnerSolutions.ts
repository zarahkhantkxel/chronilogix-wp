/**
 * ACF → props mapping for the Partner Solutions page.
 *
 * Kept out of the page component so `app/partner-solutions/page.tsx` and
 * `components/Nav.tsx` share one mapper and cannot drift, and so the nested
 * repeater handling is unit testable.
 *
 * ACF returns `false` (not `undefined` or `[]`) for an empty repeater, at every
 * nesting level — hence `arr()` on both the outer `bundles` list and each of its
 * inner collections.
 */
import {
  BUNDLES,
  PARTNER_LOGOS,
  type Bundle,
  type BundleGraphic,
  type BundleStep,
  type PartnerLogo,
} from "@/components/partnerSolutions/partnerData";

/** Coerce an ACF repeater value to an array. */
const arr = (x: unknown): any[] => (Array.isArray(x) ? x : []);

/** Drop empty strings so a blank ACF field falls through to the default. */
const str = (x: unknown): string | undefined => {
  const s = typeof x === "string" ? x.trim() : "";
  return s === "" ? undefined : s;
};

/** Flatten a repeater of single-text-field rows to a string array. */
const textRows = (x: unknown): string[] =>
  arr(x)
    .map((r: any) => str(r?.text))
    .filter((s): s is string => !!s);

const GRAPHICS: BundleGraphic[] = ["video", "list", "steps"];

/**
 * Partner logos for the hero proof row and the Solutions nav promo card.
 * Falls back to the built-in defaults when the repeater is empty or absent.
 */
export function mapPartnerLogos(
  acf: Record<string, any> | null | undefined,
): PartnerLogo[] {
  const rows = arr(acf?.partner_logos)
    .map((r: any) => {
      const src = str(r?.logo);
      return src ? { src, alt: str(r?.alt) ?? "" } : null;
    })
    .filter((l): l is PartnerLogo => l !== null);

  return rows.length ? rows : PARTNER_LOGOS;
}

/**
 * The partner bundles. `index` is derived from position (1-based) rather than
 * stored, since its only job is the even/odd layout flip.
 */
export function mapBundles(
  acf: Record<string, any> | null | undefined,
): Bundle[] {
  const rows = arr(acf?.bundles).map((r: any, i: number): Bundle => {
    const graphic: BundleGraphic = GRAPHICS.includes(r?.graphic)
      ? r.graphic
      : "list";

    const steps: BundleStep[] = arr(r?.graphic_steps)
      .map((s: any) => {
        const heading = str(s?.heading);
        if (!heading) return null;
        const meta = str(s?.meta);
        return meta
          ? { heading, body: str(s?.body) ?? "", meta }
          : { heading, body: str(s?.body) ?? "" };
      })
      .filter((s): s is BundleStep => s !== null);

    const bundle: Bundle = {
      key: str(r?.key) ?? `bundle-${i + 1}`,
      index: i + 1,
      title: str(r?.title) ?? "",
      category: str(r?.category) ?? "",
      lead: textRows(r?.lead),
      pointers: textRows(r?.pointers),
      pointersHeading: str(r?.pointers_heading),
      leadAfter: str(r?.lead_after),
      tagline: str(r?.tagline) ?? "",
      graphic,
      graphicList: textRows(r?.graphic_list),
      graphicHeading: str(r?.graphic_heading),
      graphicFootnote: str(r?.graphic_footnote),
      graphicSteps: steps,
      logo: {
        src: str(r?.logo) ?? "",
        alt: str(r?.logo_alt) ?? "",
      },
    };

    if (graphic === "video") {
      bundle.video = {
        poster: str(r?.video_poster) ?? "",
        src: str(r?.video_src) ?? "",
        runtime: str(r?.video_runtime) ?? "",
        eyebrow: str(r?.video_eyebrow) ?? "",
        title: str(r?.video_title) ?? "",
        blurb: str(r?.video_blurb) ?? "",
        credit: str(r?.video_credit) ?? "",
      };
    }

    return bundle;
  });

  return rows.length ? rows : BUNDLES;
}

export type PartnerTocItem = { id: string | null; label: string };

/**
 * "On this page" wayfinder, derived from the bundles so adding a partner in
 * WordPress updates the TOC with no code change.
 *
 * One row per SECTION, not per anchor. YourSolutionPanel is a single
 * <section id="book-a-demo"> whose <h2> also carries
 * `ps-your-solution-label`, and the rail resolves every id to its enclosing
 * <section> — so two rows pointing into that panel collapse onto one target:
 * the later id wins the scroll-spy and the earlier row can never light up,
 * while still eating a rail slice and a slot in the "n / total" counter. The
 * closing panel therefore gets exactly one row.
 */
export function buildPartnerToc(bundles: Bundle[]): PartnerTocItem[] {
  return [
    { id: null, label: "Overview" },
    ...bundles.map((b) => ({
      id: `ps-${b.key}-label`,
      label: b.title,
    })),
    { id: "book-a-demo", label: "Book a demo" },
  ];
}
