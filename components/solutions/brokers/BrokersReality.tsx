"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * BrokersReality — "The Reality Brokers Face" (Section 2).
 *
 * Answers the second question in the narrative arc: what's causing the
 * problem? Your clients aren't losing money because of plan design — the
 * biggest cost drivers are chronic conditions, behavioral health, and
 * delayed treatment from high deductibles.
 *
 * Header is a two-column editorial split: the heading sits left, the
 * supporting paragraph right, baseline-aligned. Below it, a bento of
 * image + text cells names the four drivers. The text cells borrow the
 * product page's Core Capabilities treatment — the card's own condition
 * photo scaled and blurred as an ambient wash, under a paper veil that
 * keeps the label fully legible.
 */

type Pressure = {
  title: string;
  detail: string;
  /** On-brand photo (from public/) paired with this card's image cell. */
  image: string;
  /** Alt text describing the photo. */
  alt: string;
};

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty.
export type BrokersRealityContent = {
  eyebrow?: string;
  headingLead?: string;
  headingEmph?: string;
  intro?: string;
  pressures?: Pressure[];
  closingLead?: string;
  closingEmph?: string;
};

// The four cost pressures the broker one-sheet names. Each pairs with an
// on-brand photo already in the repo (reused from the site's persona /
// portrait photography), so the grid stays on-brand and fully offline.
const DEFAULT_PRESSURES: Pressure[] = [
  {
    title: "Diabetes",
    detail: "One of the most predictable, highest-cost drivers on every renewal.",
    image: "/diabetes-glucose.jpg",
    alt: "A person checking their blood glucose level with a meter.",
  },
  {
    title: "Obesity",
    detail: "Compounds risk across nearly every other chronic condition on the plan.",
    image: "/obesity-reflective.webp",
    alt: "A woman sitting alone on the edge of a bed in low evening light.",
  },
  {
    title: "Behavioral health",
    detail: "Utilization climbs quietly, alongside the productivity loss beside it.",
    image: "/behavioral-health-sunlit.jpg",
    alt: "Two young women resting close together in warm sunlight through leaves.",
  },
  {
    title: "Delayed care",
    detail: "Employees postpone treatment until small issues become expensive claims.",
    image: "/delayed-care-caregiver.webp",
    alt: "A caregiver helping an older man with his shoes beside a wheelchair.",
  },
];

const DEFAULTS = {
  eyebrow: "The reality brokers face",
  headingLead: "The four cost drivers",
  headingEmph: "that build up between doctor visits.",
  intro:
    "When employees postpone care, conditions quietly worsen — and by the time they surface, the claims are already expensive. Brokers are left explaining the renewal increase after the fact, instead of preventing it.",
  pressures: DEFAULT_PRESSURES,
  closingLead:
    "None of it is caused by catastrophic events. It’s unmanaged behavior between doctor visits,",
  closingEmph: "the space traditional plans never reach.",
} satisfies Required<BrokersRealityContent>;

// Bento cells in grid-flow order (4 columns): image + text pairs that
// alternate lead per row — image-first on row 1, text-first on row 2.
type Cell =
  | { kind: "image"; p: Pressure }
  | { kind: "text"; p: Pressure };

// Layout pattern, keyed to the pressures by index so the bento reads the
// same regardless of which pressure copy is edited in WordPress.
const CELL_PATTERN: { kind: Cell["kind"]; i: number }[] = [
  { kind: "image", i: 0 },
  { kind: "text", i: 0 },
  { kind: "image", i: 1 },
  { kind: "text", i: 1 },
  { kind: "text", i: 2 },
  { kind: "image", i: 2 },
  { kind: "text", i: 3 },
  { kind: "image", i: 3 },
];

// Strip null/undefined/empty-string values so partial ACF payloads never blank
// out the section — the DEFAULTS show through instead.
function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function BrokersReality({
  content,
}: {
  content?: BrokersRealityContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const pressures = content?.pressures?.length
    ? content.pressures
    : DEFAULTS.pressures;
  const CELLS: Cell[] = CELL_PATTERN.filter((cell) => pressures[cell.i]).map(
    (cell) => ({ kind: cell.kind, p: pressures[cell.i] }),
  );
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="brokers-reality-label"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        {/* Two-column header — heading left, supporting copy right,
            baseline-aligned. Each side lands as roughly two lines. */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="reveal-row eyebrow [transition-delay:80ms]">
              {c.eyebrow}
            </p>
            <h2
              id="brokers-reality-label"
              className="reveal-row mt-4 max-w-[18ch] font-serif font-normal text-section text-ink [transition-delay:180ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.headingLead}{" "}
              <span className="text-ink-muted italic">
                {c.headingEmph}
              </span>
            </h2>
          </div>
          <p className="reveal-row max-w-[46ch] body-quiet md:justify-self-end md:pb-1 md:text-right [transition-delay:260ms]">
            {c.intro}
          </p>
        </div>

        {/* Bento grid — image + text cards, alternating per the reference. */}
        <div className="mt-14 grid auto-rows-[260px] grid-cols-1 gap-3 sm:grid-cols-2 md:mt-16 md:auto-rows-[300px] md:gap-4 lg:grid-cols-4">
          {CELLS.map((cell, i) => {
            const delay = 340 + i * 90;

            if (cell.kind === "image") {
              return (
                <div
                  key={`${cell.p.title}-img`}
                  className="reveal-row min-h-[220px] overflow-hidden rounded-2xl md:min-h-[260px] md:rounded-[20px]"
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cell.p.image}
                    alt={cell.p.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out-quart hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </div>
              );
            }

            return (
              <div
                key={`${cell.p.title}-text`}
                className="reveal-row relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl border border-ink/10 p-6 transition-transform duration-400 ease-out-quart motion-reduce:transition-none hover:-translate-y-1 md:min-h-[260px] md:rounded-[20px] md:p-7"
                style={{ transitionDelay: `${delay}ms` }}
              >
                {/* Blurred photographic wash — same recipe as the product
                    page's Core Capabilities cards: the card's own condition
                    photo, scaled and blurred as ambient texture, under a
                    paper veil that keeps the label fully legible. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cell.p.image}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover blur-md"
                />
                <div aria-hidden className="absolute inset-0 bg-paper/80" />

                <h3
                  className="relative font-serif text-2xl font-normal leading-[1.1] text-ink md:text-[26px]"
                  style={{ textWrap: "balance" as React.CSSProperties["textWrap"] }}
                >
                  {cell.p.title}
                </h3>

                <p className="relative text-[14px] leading-relaxed text-ink-soft md:text-[15px]">
                  {cell.p.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Root-cause pivot — the audio's sharpest line. Names what actually
            drives the spend and hands off to the Strategy section, which
            answers with Chronilogix. */}
        <div className="reveal-row mx-auto mt-16 max-w-[46ch] border-t border-ink/10 pt-10 text-center md:mt-20 [transition-delay:900ms]">
          <p
            className="font-serif text-row font-normal leading-[1.15] text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {c.closingLead}{" "}
            <span className="text-ink-muted italic">
              {c.closingEmph}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
