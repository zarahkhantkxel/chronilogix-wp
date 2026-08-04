"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * BrokersAdvantage — "What it means for you" (broker payoff).
 *
 * This is the audio brief's climax for the broker: after the employer
 * benefits (earlier engagement, fewer high-cost claims), the narration
 * pivots — "for brokers, it means something more valuable." Three payoffs
 * follow, lifted straight from the track: you differentiate in a market
 * of point solutions, you move upstream in the cost curve, and you get a
 * defensible ROI story.
 *
 * Rendered in the product page's "Privacy by design" language: a warm
 * cream card with a centered header (brand eyebrow, serif headline with a
 * brand accent, supporting line), a hairline divider, then the three
 * payoffs as naked pillars with circular brand-tinted icon anchors. Light
 * and on-brand with the rest of the site — no dark slab.
 */

type Payoff = {
  title: string;
  body: string;
  glyph: "differentiate" | "upstream" | "roi";
};

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty. Payoff glyphs are decorative and stay
// matched to each payoff by index.
type PayoffContent = { title: string; body: string };

export type BrokersAdvantageContent = {
  eyebrow?: string;
  headingLead?: string;
  headingEmph?: string;
  intro?: string;
  payoffs?: PayoffContent[];
};

// Three broker payoffs, in the order the audio delivers them (t91–113).
const DEFAULT_PAYOFFS: Payoff[] = [
  {
    title: "Differentiate beyond point solutions",
    body: "Everyone else is selling another point solution. You bring a front-door strategy that changes member behavior, not one more app that goes unused.",
    glyph: "differentiate",
  },
  {
    title: "Move upstream in the cost curve",
    body: "Engage members before claims escalate. You shape the cost story early, instead of explaining the increase after renewal.",
    glyph: "upstream",
  },
  {
    title: "A defensible ROI story",
    body: "Earlier engagement, better adherence, fewer high-cost claims. Measurable value you can stand behind in every renewal conversation.",
    glyph: "roi",
  },
];

// Decorative glyphs, matched to each payoff position by index.
const PAYOFF_GLYPHS: Payoff["glyph"][] = ["differentiate", "upstream", "roi"];

const DEFAULTS = {
  eyebrow: "What it means for you",
  headingLead: "For your clients, fewer claims.",
  headingEmph: "For you, an advantage you can defend.",
  intro:
    "The same coaching that lowers your clients’ spend changes how you show up: sharper positioning, an earlier seat at the cost conversation, and a number you can stand behind.",
  payoffs: DEFAULT_PAYOFFS.map(({ title, body }) => ({ title, body })),
} satisfies Required<BrokersAdvantageContent>;

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

export function BrokersAdvantage({
  content,
}: {
  content?: BrokersAdvantageContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const payoffsSource = content?.payoffs?.length
    ? content.payoffs
    : DEFAULTS.payoffs;
  const PAYOFFS: Payoff[] = payoffsSource.map((p, i) => ({
    title: p.title,
    body: p.body,
    glyph: PAYOFF_GLYPHS[i % PAYOFF_GLYPHS.length],
  }));
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="brokers-advantage-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        {/* Centered header — same family as the product page's Privacy by
            design block: brand eyebrow, serif headline with a brand accent,
            supporting line, all centre-aligned. */}
        <div className="reveal-row mx-auto max-w-3xl text-center [transition-delay:80ms]">
          <p className="text-[13px] font-medium tracking-tight text-brand-700/90">
            {c.eyebrow}
          </p>
          <h2
            id="brokers-advantage-label"
            className="mt-3 font-serif text-[28px] font-normal leading-[1.1] text-ink md:text-[36px] lg:text-[42px]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {c.headingLead}{" "}
            <span className="text-brand-700">
              {c.headingEmph}
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-[54ch] body-quiet">
            {c.intro}
          </p>
        </div>

        {/* Hairline divider — the same seam the Privacy block and the rest
            of the site use. */}
        <div
          aria-hidden
          className="reveal-row mx-auto mt-10 h-px w-16 bg-ink/12 md:mt-12 [transition-delay:180ms]"
        />

        {/* Three payoffs as naked pillars — circular brand-tinted icon
            anchor, serif title, body. Matches the trust-pillar language. */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:mt-12 md:grid-cols-3 md:gap-8 lg:gap-10">
          {PAYOFFS.map((p, i) => (
            <div
              key={p.title}
              className="reveal-row flex flex-col"
              style={{ transitionDelay: `${280 + i * 120}ms` }}
            >
              <span
                aria-hidden
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/10 text-brand-700 ring-1 ring-brand-600/20"
              >
                <PayoffGlyph kind={p.glyph} />
              </span>
              <h3 className="mt-4 font-serif text-[19px] font-normal leading-tight text-ink md:text-[21px]">
                {p.title}
              </h3>
              <p className="mt-2.5 max-w-[40ch] text-[14px] leading-relaxed text-ink-soft md:text-[14.5px]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PayoffGlyph({ kind }: { kind: Payoff["glyph"] }) {
  const commonProps = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (kind === "differentiate") {
    // Spark / distinction mark
    return (
      <svg {...commonProps}>
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="M6 6l2.5 2.5" />
        <path d="M15.5 15.5L18 18" />
      </svg>
    );
  }
  if (kind === "upstream") {
    // Arrow moving upstream along a curve
    return (
      <svg {...commonProps}>
        <path d="M4 18c4-4 8-4 12-8" />
        <path d="M11 6h5v5" />
      </svg>
    );
  }
  // roi — line chart with a highlighted point
  return (
    <svg {...commonProps}>
      <path d="M4 18l4-5 4 3 6-8" />
      <circle cx="14" cy="16" r="1.4" fill="currentColor" />
      <path d="M4 20h16" />
    </svg>
  );
}
