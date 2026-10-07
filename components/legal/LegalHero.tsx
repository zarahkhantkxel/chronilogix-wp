"use client";

/**
 * Legal page hero — the first block on /privacy and /terms.
 *
 * Same rhythm as FaqHero / AboutScience: warm-paper card, eyebrow,
 * serif hero headline whose tail drops to ink-muted, one supporting
 * line. The one addition is the revision date, which legal pages need
 * to carry visibly — set as a quiet pill so it reads as metadata
 * rather than as part of the argument.
 */
export function LegalHero({
  eyebrow,
  title,
  titleTail,
  intro,
  updated,
}: {
  eyebrow: string;
  title: string;
  titleTail: string;
  intro: string;
  updated: string;
}) {
  return (
    <section
      id="legal-hero"
      className="relative overflow-hidden rounded-[20px] bg-paper-warm pt-20 pb-12 sm:rounded-[24px] sm:pt-28 sm:pb-16 md:rounded-[28px] md:pt-36 md:pb-20 lg:pt-44 lg:pb-24"
    >
      {/* Shared brand-orange radial wash — keeps the open warm without
          resorting to a dark slab. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(249,144,77,0.18) 0%, rgba(249,144,77,0.05) 38%, transparent 68%)",
        }}
      />

      <div className="container-page relative">
        <div className="max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h1
            className="mt-3 text-hero font-serif font-normal text-ink md:mt-4"
            style={
              {
                textWrap: "balance",
                hyphens: "none",
                wordBreak: "normal",
              } as React.CSSProperties
            }
          >
            {title} <span className="text-ink-muted">{titleTail}</span>
          </h1>
          <p className="mt-5 max-w-[62ch] body-prose md:mt-6">{intro}</p>
          <p className="mt-7 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3.5 py-1.5 text-[13px] font-medium text-ink-soft backdrop-blur-sm md:mt-8">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
            />
            Last updated {updated}
          </p>
        </div>
      </div>
    </section>
  );
}
