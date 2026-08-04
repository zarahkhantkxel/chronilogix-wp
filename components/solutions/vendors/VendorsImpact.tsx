"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * VendorsImpact — "The Business Impact" (Section 6).
 *
 * "Results that strengthen your value proposition." The four hard numbers
 * from the brief, shown as icon-topped stat cards.
 *
 * Layout (referenced from a light "stats" band): a centered serif heading
 * over a row of white cards on a warm cream surface, each card leading
 * with a line icon, a large serif figure, and a short caption. Translated
 * to Chronilogix's brand — paper-warm surface, brand-orange line icons,
 * ink serif figures — rather than the reference's mono plum.
 */

type Stat = {
  lead: string;
  title: string;
  body: string;
};

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when a field is empty.
export type VendorsImpactContent = {
  eyebrow?: string;
  headingLead?: string;
  headingEmph?: string;
  body?: string;
  stats?: Stat[];
};

const DEFAULTS = {
  eyebrow: "The business impact",
  headingLead: "Up to 40% higher retention.",
  headingEmph: "At a fraction of the cost.",
  body: "When patients keep using what you ship, the outcomes show up where your buyers look — retention, results, and proof.",
  stats: [
    { lead: "Up to 40%", title: "Higher retention", body: "Keep patients engaged for longer." },
    { lead: "Up to 80%", title: "Of human coaching replaced", body: "Members get support the moment they need it — without adding staff." },
    { lead: "~$5", title: "Per coaching session", body: "Deliver meaningful patient engagement cost-effectively." },
    { lead: "$0", title: "Cost to vendors", body: "Upgrade your offering without replacing your product." },
  ],
} satisfies Required<VendorsImpactContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function VendorsImpact({ content }: { content?: VendorsImpactContent }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const STATS = content?.stats?.length ? content.stats : DEFAULTS.stats;
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="vendors-impact-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      {/* Soft warm glow rising from the bottom — depth without a hard band. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 120%, rgba(249,144,77,0.28), transparent 70%)",
        }}
      />

      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="mx-auto max-w-[52ch] text-center">
          <p className="reveal-row eyebrow [transition-delay:60ms]">
            {c.eyebrow}
          </p>
          <h2
            id="vendors-impact-label"
            className="reveal-row mt-4 font-serif font-normal text-section text-ink [transition-delay:160ms]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {c.headingLead}{" "}
            <span className="text-brand-700 italic">{c.headingEmph}</span>
          </h2>
          <p className="reveal-row mx-auto mt-5 max-w-[48ch] text-[15px] leading-relaxed text-ink-soft [transition-delay:240ms]">
            {c.body}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-16 md:gap-5 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.title}
              className="reveal-row flex flex-col rounded-2xl border border-ink/10 bg-white/40 p-7 md:p-8"
              style={{ transitionDelay: `${340 + i * 110}ms` }}
            >
              <p className="font-serif text-3xl font-normal leading-[1] text-ink md:text-4xl">
                {s.lead}
              </p>
              <p className="mt-5 text-[15px] font-medium leading-snug text-ink md:text-base">
                {s.title}
              </p>
              <p className="mt-1.5 text-[13.5px] leading-snug text-ink-soft">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
