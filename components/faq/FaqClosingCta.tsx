"use client";

/**
 * FAQ closing CTA — the last block on /faq.
 *
 * Same treatment as HiwClosingCTA / AboutClosingCTA so the page ends
 * with a familiar Book-a-Demo close. Dark slab, centered headline, one
 * primary + one secondary action, rounded card so it lands as its own
 * block inside the padded shell.
 */

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty.
export type FaqClosingCtaContent = {
  eyebrow?: string;
  headingLead?: string;
  headingEmph?: string;
  body?: string;
  primaryLabel?: string;
  primaryUrl?: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
};

const DEFAULTS = {
  eyebrow: "Still have questions",
  headingLead: "Let’s answer them together.",
  headingEmph: "Book a demo and we’ll walk through it live.",
  body: "Fifteen minutes, no slides. See a real Chronilogix session, hear how the fidelity rubric works, and get every question answered.",
  primaryLabel: "Book a demo",
  primaryUrl: "#book-a-demo",
  secondaryLabel: "Read the whitepaper",
  secondaryUrl: "/chronilogix-mi-whitepaper.pdf",
} satisfies Required<FaqClosingCtaContent>;

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

export function FaqClosingCta({ content }: { content?: FaqClosingCtaContent }) {
  const c = { ...DEFAULTS, ...clean(content) };

  return (
    <section
      id="book-a-demo"
      className="relative overflow-hidden rounded-[20px] bg-ink py-16 sm:rounded-[24px] sm:py-20 md:rounded-[28px] md:py-32 lg:py-40"
    >
      {/* Same brand-orange radial wash used across dark closes so the
          slab doesn't read as pure charcoal. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(249,144,77,0.18) 0%, rgba(249,144,77,0.06) 40%, transparent 72%)",
        }}
      />

      <div className="container-page relative">
        <div className="max-w-3xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-brand-500">
            {c.eyebrow}
          </p>
          <h2
            className="mt-3 font-serif text-hero font-normal text-paper md:mt-4"
            style={
              {
                textWrap: "balance",
                hyphens: "none",
                wordBreak: "normal",
              } as React.CSSProperties
            }
          >
            {c.headingLead}{" "}
            <span className="text-paper/60">{c.headingEmph}</span>
          </h2>
          <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-paper/70 md:mt-6 md:text-lg">
            {c.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4 md:mt-10">
            <a
              href={c.primaryUrl}
              className="btn-primary bg-brand-600 text-paper hover:bg-brand-500 hover:shadow-[0_20px_44px_-16px_rgba(249,144,77,0.55)]"
            >
              {c.primaryLabel}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
                className="transition-transform duration-300 ease-out"
              >
                <path
                  d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href={c.secondaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] font-medium tracking-tight text-paper/80 underline decoration-paper/30 decoration-1 underline-offset-[4px] transition-colors hover:text-paper hover:decoration-paper/70"
            >
              {c.secondaryLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
