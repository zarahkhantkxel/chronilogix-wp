"use client";

import type { ReactNode } from "react";
import { useReveal } from "@/components/hooks/useReveal";

/**
 * VendorsReposition — "A Better Story for Buyers" (Section 7).
 *
 * The buyer-facing reframe, rebuilt as a "reframe ledger". Rather than two
 * scattered pill clouds, each row pairs one belief buyers hold about most
 * vendors (muted, struck through, receding) with how they see a vendor
 * running on Chronilogix (confident, one brand-lit keyword). The
 * transformation is the mechanic: five legible before → after lines the eye
 * walks straight down, closing on the punchline that the product itself
 * never changes.
 */

// One accent keyword per "after" phrase. The phrase is split into three
// editable parts — text before the accent word, the accent word itself
// (rendered in brand), and text after — so the highlight survives editing.
type ReframeContent = {
  before: string;
  afterPre?: string;
  afterEmph: string;
  afterPost?: string;
};

// Each row folds in one beat of the vendor story (impact, results, sustained
// engagement, outcome reporting, differentiation).
const DEFAULT_REFRAMES: ReframeContent[] = [
  { before: "Judged on a feature list", afterPre: "Measured on", afterEmph: "real impact" },
  { before: "Competing on price", afterPre: "Competing on", afterEmph: "results" },
  { before: "Delivery ends the story", afterEmph: "Engagement", afterPost: "sustains it" },
  { before: "No proof after the sale", afterEmph: "Outcome reporting", afterPost: "on demand" },
  { before: "One of many options", afterPre: "The", afterEmph: "obvious choice" },
];

function renderAfter(r: ReframeContent): ReactNode {
  return (
    <>
      {r.afterPre ? `${r.afterPre} ` : null}
      <span className="text-brand-700">{r.afterEmph}</span>
      {r.afterPost ? ` ${r.afterPost}` : null}
    </>
  );
}

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when a field is empty.
export type VendorsRepositionContent = {
  eyebrow?: string;
  headingLead?: string;
  headingEmph?: string;
  body?: string;
  leftHeader?: string;
  rightHeader?: string;
  reframes?: ReframeContent[];
  closingLead?: string;
  closingEmph?: string;
};

const DEFAULTS = {
  eyebrow: "A better story for buyers",
  headingLead: "From commodity supplier to",
  headingEmph: "outcomes partner.",
  body: "Healthcare buyers aren’t simply evaluating products anymore. They’re choosing partners who can prove measurable impact. Same product, told as a different story.",
  leftHeader: "How buyers see most vendors",
  rightHeader: "How buyers see you on Chronilogix",
  closingLead: "Your product stays the same.",
  closingEmph: "Its value grows.",
} satisfies Required<Omit<VendorsRepositionContent, "reframes">>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

// Understated arrow — points right on desktop, rotated down when the row
// stacks on mobile. Purely decorative; every row still reads as text.
function CrossoverArrow() {
  return (
    <span
      aria-hidden
      className="mx-auto flex h-8 w-8 rotate-90 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-600 sm:rotate-0"
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M4 10h11m0 0-4-4m4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function VendorsReposition({
  content,
}: {
  content?: VendorsRepositionContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const REFRAMES = content?.reframes?.length
    ? content.reframes
    : DEFAULT_REFRAMES;
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="vendors-reposition-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      {/* Sunrise wash — cool at the top-left (the past), warm rising into the
          bottom-right (the future the ledger resolves toward). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 8% 12%, rgba(90,100,112,0.06), transparent 72%), radial-gradient(60% 50% at 96% 92%, rgba(249,144,77,0.16), transparent 70%)",
        }}
      />

      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="w-full text-center">
          <p className="reveal-row eyebrow [transition-delay:60ms]">
            {c.eyebrow}
          </p>
          <h2
            id="vendors-reposition-label"
            className="reveal-row mt-4 font-serif font-normal text-section text-ink [transition-delay:160ms]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {c.headingLead}{" "}
            <span className="text-brand-700 italic">{c.headingEmph}</span>
          </h2>
          <p className="reveal-row mx-auto mt-6 max-w-[52ch] body-prose [transition-delay:260ms]">
            {c.body}
          </p>
        </div>

        {/* The reframe ledger — one before → after per line. */}
        <div className="reveal-row mx-auto mt-14 max-w-3xl md:mt-16 [transition-delay:320ms]">
          {/* Column identity headers — paired to the two sides, sm+ only. */}
          <div className="hidden grid-cols-[1fr_auto_1fr] items-baseline gap-6 pb-2 sm:grid">
            <p className="text-right text-[13px] font-medium tracking-[-0.005em] text-ink-subtle">
              {c.leftHeader}
            </p>
            <span className="h-8 w-8" aria-hidden />
            <p className="eyebrow text-left text-[13px]">
              {c.rightHeader}
            </p>
          </div>

          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {REFRAMES.map((r, i) => (
              <li
                key={r.before}
                className="grid grid-cols-1 items-center gap-3 py-6 text-center sm:grid-cols-[1fr_auto_1fr] sm:gap-6 sm:py-7 sm:text-left"
              >
                {/* Before — the old story, crossed out and receding. */}
                <p
                  className="reveal-row text-[15px] leading-snug text-ink-muted sm:text-right md:text-base"
                  style={{ transitionDelay: `${380 + i * 90}ms` }}
                >
                  <span className="line-through decoration-ink/25 decoration-1 underline-offset-2">
                    {r.before}
                  </span>
                </p>

                <div
                  className="reveal-row"
                  style={{ transitionDelay: `${420 + i * 90}ms` }}
                >
                  <CrossoverArrow />
                </div>

                {/* After — the new story, forward and confident. */}
                <p
                  className="reveal-row text-lg font-medium leading-snug text-ink sm:text-left md:text-xl"
                  style={{ transitionDelay: `${460 + i * 90}ms` }}
                >
                  {renderAfter(r)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <p
          className="reveal-row mx-auto mt-16 max-w-[46ch] text-center font-serif text-2xl italic leading-snug text-ink md:mt-20 md:text-3xl [transition-delay:920ms]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {c.closingLead}{" "}
          <span className="text-brand-700">{c.closingEmph}</span>
        </p>
      </div>
    </section>
  );
}
