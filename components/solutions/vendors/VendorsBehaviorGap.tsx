"use client";

import type { ReactNode } from "react";
import { useReveal } from "@/components/hooks/useReveal";

/**
 * VendorsBehaviorGap — "The behavior gap" (Section 5).
 *
 * The biggest barriers to better outcomes aren't medical — they're human.
 * Reuses the homepage persona-section (WhoWeServe) layout: an anchored
 * editorial column on the left (eyebrow, heading, framing line, and a warm
 * visual that fills the column height) beside a full-height, divided list
 * on the right — each barrier a warm-gradient icon tile (the nav / MI
 * Explainer language) with a title and a short line.
 */

// Warm gradient tiles + filled glyphs, matching the Nav / WhoWeServe icon
// system. Three variants (peach / coral / ember) span brand-400 → brand-800
// so the list reads as a small gallery rather than a uniform column.
type IconVariant = "peach" | "coral" | "ember";
type GlyphKey = "alert" | "moon" | "cost" | "book";

const ICON_BG: Record<IconVariant, string> = {
  peach:
    "radial-gradient(ellipse 70% 85% at 50% 105%, rgba(184,70,20,0.45) 0%, rgba(184,70,20,0) 68%), linear-gradient(180deg, #FB9C5E 0%, #FF7434 100%)",
  coral:
    "radial-gradient(ellipse 65% 70% at 50% -8%, rgba(253,179,125,0.55) 0%, rgba(253,179,125,0) 60%), linear-gradient(180deg, #FF7434 0%, #E45A1C 100%)",
  ember:
    "radial-gradient(circle at 28% 32%, rgba(253,179,125,0.5) 0%, rgba(253,179,125,0) 55%), radial-gradient(circle at 74% 74%, rgba(120,40,10,0.42) 0%, rgba(120,40,10,0) 55%), linear-gradient(135deg, #FB9C5E 0%, #B84614 100%)",
};

// Filled 20×20 glyphs, drawn in the same style as the Nav / WhoWeServe set.
const GLYPHS: Record<GlyphKey, ReactNode> = {
  // Fear & anxiety — an alert triangle with a cut-out exclamation.
  alert: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 3.4a1.4 1.4 0 0 1 1.22.71l6.1 10.55A1.4 1.4 0 0 1 16.1 16.8H3.9a1.4 1.4 0 0 1-1.22-2.14L8.78 4.11A1.4 1.4 0 0 1 10 3.4Zm-.02 3.7a.85.85 0 0 0-.85.93l.28 3.05a.57.57 0 0 0 1.14 0l.28-3.05a.85.85 0 0 0-.85-.93Zm.02 5.1a.95.95 0 1 0 0 1.9.95.95 0 0 0 0-1.9Z"
    />
  ),
  // Fatigue & burnout — a crescent moon (depletion, rest).
  moon: (
    <path
      fill="currentColor"
      d="M12.9 3.3A7 7 0 1 0 16.7 14 5.7 5.7 0 0 1 12.9 3.3Z"
    />
  ),
  // Cost stress — a banknote with a coin hole.
  cost: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 5.75A1.75 1.75 0 0 1 4.75 4h10.5A1.75 1.75 0 0 1 17 5.75v8.5A1.75 1.75 0 0 1 15.25 16H4.75A1.75 1.75 0 0 1 3 14.25v-8.5ZM10 7.4a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Z"
    />
  ),
  // Low health literacy — an open book.
  book: (
    <>
      <path
        fill="currentColor"
        d="M4 4.5h5A1.5 1.5 0 0 1 10 6v10a1.5 1.5 0 0 0-1.5-1.5H4V4.5z"
      />
      <path
        fill="currentColor"
        d="M16 4.5h-5A1.5 1.5 0 0 0 10 6v10a1.5 1.5 0 0 1 1.5-1.5H16V4.5z"
      />
    </>
  ),
};

function GlyphTile({
  glyph,
  variant,
}: {
  glyph: GlyphKey;
  variant: IconVariant;
}) {
  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_1px_2px_rgba(15,20,25,0.06),0_12px_24px_-14px_rgba(184,70,20,0.42)] transition-all duration-200 ease-out-quart group-hover:shadow-[0_2px_6px_rgba(15,20,25,0.08),0_16px_30px_-14px_rgba(184,70,20,0.52)] motion-reduce:transition-none"
      style={{ backgroundImage: ICON_BG[variant] }}
    >
      <svg viewBox="0 0 20 20" className="h-6 w-6" aria-hidden>
        {GLYPHS[glyph]}
      </svg>
    </span>
  );
}

type Barrier = {
  title: string;
  body: string;
  glyph: GlyphKey;
  variant: IconVariant;
};

// Glyph + variant per barrier stay hardcoded (decorative), matched to the
// editable title/body pairs by index.
const BARRIER_STYLES: { glyph: GlyphKey; variant: IconVariant }[] = [
  { glyph: "alert", variant: "peach" },
  { glyph: "moon", variant: "coral" },
  { glyph: "cost", variant: "ember" },
  { glyph: "book", variant: "peach" },
];

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when a field is empty.
export type VendorsBehaviorGapContent = {
  eyebrow?: string;
  headingLead?: string;
  headingEmph?: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  captionLead?: string;
  captionEmph?: string;
  barriers?: { title: string; body: string }[];
};

const DEFAULTS = {
  eyebrow: "The behavior gap",
  headingLead: "The real barriers to adherence aren’t medical.",
  headingEmph: "They’re human.",
  body: "Chronilogix addresses the emotional, behavioral, and socio-economic barriers that cause drop-off, without relying on expensive, hard-to-scale clinical teams.",
  image: "/behavior-gap-supplements.jpg",
  imageAlt: "A person taking daily supplement capsules alongside breakfast.",
  captionLead: "We close the gap between",
  captionEmph: "prescription and progress.",
  barriers: [
    { title: "Fear & anxiety", body: "Patients often feel overwhelmed after diagnosis." },
    { title: "Fatigue & burnout", body: "Motivation naturally decreases over time." },
    { title: "Cost stress", body: "Cost concerns affect treatment consistency." },
    { title: "Low health literacy", body: "Patients may not fully understand their care plan." },
  ],
} satisfies Required<VendorsBehaviorGapContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function VendorsBehaviorGap({
  content,
}: {
  content?: VendorsBehaviorGapContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const barrierContent = content?.barriers?.length
    ? content.barriers
    : DEFAULTS.barriers;
  const BARRIERS: Barrier[] = barrierContent.map((b, i) => ({
    title: b.title,
    body: b.body,
    glyph: BARRIER_STYLES[i % BARRIER_STYLES.length].glyph,
    variant: BARRIER_STYLES[i % BARRIER_STYLES.length].variant,
  }));
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="vendors-gap-label"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-16 md:py-24 lg:py-28"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-14 xl:gap-20">
          {/* Left — anchored editorial column + warm visual, filling the
              column height on desktop (mirrors WhoWeServe). */}
          <div className="flex flex-col lg:h-full">
            <p className="reveal-row eyebrow [transition-delay:60ms]">
              {c.eyebrow}
            </p>
            <h2
              id="vendors-gap-label"
              className="reveal-row mt-4 max-w-[20ch] font-serif font-normal text-section text-ink [transition-delay:140ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.headingLead}{" "}
              <span className="text-brand-700 italic">{c.headingEmph}</span>
            </h2>
            <p className="reveal-row mt-4 max-w-md body-prose [transition-delay:220ms]">
              {c.body}
            </p>

            <div className="reveal-row mt-7 lg:min-h-0 lg:flex-1 [transition-delay:300ms]">
              <div className="relative h-full overflow-hidden rounded-[24px] ring-1 ring-ink/[0.08]">
                <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[320px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt={c.imageAlt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {/* Frosted-glass caption — the section's resolution line. */}
                  <div className="surface-glass absolute inset-x-4 bottom-4 overflow-hidden rounded-2xl p-5 md:inset-x-5 md:bottom-5 md:p-6">
                    <span
                      aria-hidden
                      className="surface-glass-shine absolute inset-x-0 top-0 h-1/2 rounded-t-2xl"
                    />
                    <p className="relative font-serif text-lg font-normal leading-snug text-ink md:text-xl">
                      {c.captionLead}{" "}
                      <span className="text-brand-700 italic">
                        {c.captionEmph}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — the barriers, as a full-height divided list of icon rows. */}
          <ul className="min-w-0 divide-y divide-ink/10 lg:flex lg:h-full lg:flex-col">
            {BARRIERS.map((b, i) => (
              <li
                key={b.title}
                className="reveal-row group grid grid-cols-[auto_1fr] items-center gap-x-4 py-5 md:py-6 lg:min-h-0 lg:flex-1"
                style={{ transitionDelay: `${260 + i * 90}ms` }}
              >
                <GlyphTile glyph={b.glyph} variant={b.variant} />
                <div className="min-w-0">
                  <p className="text-lg font-medium leading-snug text-ink md:text-xl">
                    {b.title}
                  </p>
                  <p className="mt-1.5 max-w-xl body-quiet">{b.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
