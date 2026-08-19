"use client";

import Image from "next/image";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * VendorsAfterDelivery — "The reality vendors face: after delivery,
 * adherence quietly slips" (Section 2).
 *
 * Two side panels of decline signals — what patients do (left) and what it
 * costs the vendor (right) — flank an elevated center card carrying the
 * narrative and the closing reframe. Each signal is marked with the site's
 * warm-gradient icon tile (the same language as the nav mega-menu and the
 * homepage MI Explainer). The whole section reads centered; the middle card
 * carries a very subtle Card 3 wash behind its text.
 */

// Warm gradient tiles echo the nav's icon system (rounded tile + white
// glyph). Three variants span light → deep so a set reads as one family,
// alternating down each list the way the mega-menu does.
type IconVariant = "peach" | "coral" | "ember";

const ICON_BG: Record<IconVariant, string> = {
  peach:
    "radial-gradient(ellipse 70% 85% at 50% 105%, rgba(184,70,20,0.45) 0%, rgba(184,70,20,0) 68%), linear-gradient(180deg, #FB9C5E 0%, #FF7434 100%)",
  coral:
    "radial-gradient(ellipse 65% 70% at 50% -8%, rgba(253,179,125,0.55) 0%, rgba(253,179,125,0) 60%), linear-gradient(180deg, #FF7434 0%, #E45A1C 100%)",
  ember:
    "radial-gradient(circle at 28% 32%, rgba(253,179,125,0.5) 0%, rgba(253,179,125,0) 55%), radial-gradient(circle at 74% 74%, rgba(120,40,10,0.42) 0%, rgba(120,40,10,0) 55%), linear-gradient(135deg, #FB9C5E 0%, #B84614 100%)",
};

type Glyph =
  | "motivation"
  | "routine"
  | "life"
  | "fade"
  | "trenddown"
  | "exit"
  | "proof";

type Signal = { label: string; glyph: Glyph; variant: IconVariant };

// Glyph + variant per row stay hardcoded (decorative), matched to the editable
// labels by index — the same approach the About page uses for its value icons.
const BEHAVIOR_STYLES: { glyph: Glyph; variant: IconVariant }[] = [
  { glyph: "motivation", variant: "peach" },
  { glyph: "routine", variant: "coral" },
  { glyph: "life", variant: "ember" },
  { glyph: "fade", variant: "peach" },
];

const RESULT_STYLES: { glyph: Glyph; variant: IconVariant }[] = [
  { glyph: "trenddown", variant: "coral" },
  { glyph: "exit", variant: "ember" },
  { glyph: "proof", variant: "peach" },
];

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when a field is empty.
export type VendorsAfterDeliveryContent = {
  eyebrow?: string;
  headingLead?: string;
  headingEmph?: string;
  body?: string;
  reframeLead?: string;
  reframeEmph?: string;
  leftLabel?: string;
  leftSub?: string;
  rightLabel?: string;
  rightSub?: string;
  behaviors?: string[];
  results?: string[];
};

const DEFAULTS = {
  eyebrow: "The reality vendors face",
  headingLead: "After delivery, adherence",
  headingEmph: "quietly slips.",
  body: "Products get prescribed, shipped, and then quietly underused — adherence drops after the first 30 to 90 days. Competing on features, price, or distribution won’t fix it. And payers, employers, and partners are no longer impressed by logistics alone. They want outcomes.",
  reframeLead: "The product isn’t the problem.",
  reframeEmph: "What happens after delivery is.",
  leftLabel: "What patients do",
  leftSub: "After the product ships",
  rightLabel: "What it costs you",
  rightSub: "Within the first few months",
  behaviors: [
    "Patients lose motivation",
    "Treatment routines become difficult",
    "Life gets in the way",
    "Engagement slowly disappears",
  ],
  results: [
    "Adherence declines",
    "Retention drops",
    "Value gets harder to prove",
  ],
} satisfies Required<VendorsAfterDeliveryContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

function zipSignals(
  labels: string[],
  styles: { glyph: Glyph; variant: IconVariant }[],
): Signal[] {
  return labels.map((label, i) => ({
    label,
    glyph: styles[i % styles.length].glyph,
    variant: styles[i % styles.length].variant,
  }));
}

export function VendorsAfterDelivery({
  content,
}: {
  content?: VendorsAfterDeliveryContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const behaviorLabels = content?.behaviors?.length
    ? content.behaviors
    : DEFAULTS.behaviors;
  const resultLabels = content?.results?.length
    ? content.results
    : DEFAULTS.results;
  const behaviors = zipSignals(behaviorLabels, BEHAVIOR_STYLES);
  const results = zipSignals(resultLabels, RESULT_STYLES);
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="vendors-after-delivery-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3 lg:items-center">
          {/* Left — what patients do. */}
          <SignalPanel
            label={c.leftLabel}
            sub={c.leftSub}
            items={behaviors}
            baseDelay={320}
          />

          {/* Center — narrative + reframe, elevated, over a subtle Card 3 wash. */}
          <div className="reveal-row order-first overflow-hidden rounded-[24px] bg-white p-8 shadow-[0_30px_70px_-24px_rgba(15,20,25,0.35)] md:p-10 lg:order-none lg:-my-8 lg:z-10 [transition-delay:200ms] relative">
            {/* Very subtle Card 3 background — a faint warm blush behind the
                copy. A white scrim keeps the text fully legible. */}
            <Image
              src="/card-3-bg.jpg"
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-[0.10]"
          fill
          sizes="(max-width: 768px) 100vw, 1280px"
        />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 50% 50%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0.35) 100%)",
              }}
            />

            <div className="relative text-center">
              <p className="eyebrow">{c.eyebrow}</p>
              <h2
                id="vendors-after-delivery-label"
                className="mt-4 font-serif font-normal text-section text-ink"
                style={{ textWrap: "balance" } as React.CSSProperties}
              >
                {c.headingLead}{" "}
                <span className="text-brand-700 italic">{c.headingEmph}</span>
              </h2>
              <p className="mx-auto mt-5 max-w-[42ch] text-[15px] leading-relaxed text-ink-soft">
                {c.body}
              </p>
              <div className="mx-auto mt-7 max-w-[36ch] border-t border-ink/10 pt-6">
                <p
                  className="font-serif text-xl font-normal leading-snug text-ink md:text-2xl"
                  style={{ textWrap: "balance" } as React.CSSProperties}
                >
                  {c.reframeLead}{" "}
                  <span className="text-brand-700">{c.reframeEmph}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right — what it costs you. */}
          <SignalPanel
            label={c.rightLabel}
            sub={c.rightSub}
            items={results}
            baseDelay={380}
          />
        </div>
      </div>
    </section>
  );
}

function SignalPanel({
  label,
  sub,
  items,
  baseDelay,
}: {
  label: string;
  sub: string;
  items: Signal[];
  baseDelay: number;
}) {
  return (
    <div
      className="reveal-row rounded-[24px] border border-ink/10 bg-white p-6 text-center shadow-soft md:p-7"
      style={{ transitionDelay: `${baseDelay}ms` }}
    >
      <p className="font-serif text-xl font-normal leading-snug text-ink md:text-2xl">
        {label}
      </p>
      <p className="mt-1 text-[13px] text-ink-muted">{sub}</p>

      {/* Left-aligned rows keep the icon column tidy, centered as a block. */}
      <ul className="mx-auto mt-6 flex w-fit flex-col gap-3 text-left">
        {items.map((s) => (
          <li key={s.label} className="flex items-center gap-3">
            <IconTile variant={s.variant} glyph={s.glyph} />
            <span className="text-[14px] font-medium leading-snug text-ink">
              {s.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IconTile({
  variant,
  glyph,
}: {
  variant: IconVariant;
  glyph: Glyph;
}) {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-white shadow-[0_1px_2px_rgba(15,20,25,0.06),0_8px_18px_-10px_rgba(184,70,20,0.5)]"
      style={{ backgroundImage: ICON_BG[variant] }}
    >
      <GlyphSvg glyph={glyph} />
    </span>
  );
}

// White glyphs, drawn to read clearly at ~16px, each carrying the decline /
// friction meaning of its signal.
function GlyphSvg({ glyph }: { glyph: Glyph }) {
  const common = {
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  if (glyph === "motivation") {
    // Low battery — motivation draining away.
    return (
      <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4">
        <rect x="2.5" y="5" width="9" height="6" rx="1.4" {...common} />
        <path d="M13 7.2v1.6" {...common} />
        <rect x="4" y="6.5" width="2.2" height="3" rx="0.4" fill="currentColor" />
      </svg>
    );
  }
  if (glyph === "routine") {
    // Broken cycle — the routine that no longer holds.
    return (
      <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4">
        <path d="M11.5 5.2A4.5 4.5 0 1 0 12.5 9" {...common} />
        <path d="M11.5 2.6v2.8h-2.8" {...common} />
      </svg>
    );
  }
  if (glyph === "life") {
    // A barrier across the path — life getting in the way.
    return (
      <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4">
        <path d="M2.5 8h11" {...common} />
        <path d="M5 5.6 4 10.4M8 5.6 7 10.4M11 5.6 10 10.4" {...common} />
      </svg>
    );
  }
  if (glyph === "fade") {
    // Engagement fading out — dots shrinking + dimming.
    return (
      <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4">
        <circle cx="3.4" cy="8" r="1.7" fill="currentColor" />
        <circle cx="8" cy="8" r="1.2" fill="currentColor" fillOpacity="0.7" />
        <circle cx="12.2" cy="8" r="0.8" fill="currentColor" fillOpacity="0.4" />
      </svg>
    );
  }
  if (glyph === "trenddown") {
    // Declining trend line with an arrowhead.
    return (
      <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4">
        <path d="M2.5 5 6.5 9 9 6.5 13.5 11" {...common} />
        <path d="M13.5 7.6V11.2H9.9" {...common} />
      </svg>
    );
  }
  if (glyph === "exit") {
    // Downward arrow — retention dropping out.
    return (
      <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4">
        <path d="M8 3v8" {...common} />
        <path d="M4.6 8 8 11.4 11.4 8" {...common} />
      </svg>
    );
  }
  // proof — uneven bars: value that's harder to demonstrate.
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4">
      <path d="M2.6 12.6h10.8" {...common} />
      <path d="M4.2 12.2V9.2M8 12.2V6.2M11.8 12.2V10" {...common} />
    </svg>
  );
}
