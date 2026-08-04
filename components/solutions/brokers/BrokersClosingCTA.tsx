"use client";

/**
 * BrokersClosingCTA — the sign-off (Section 11, Final CTA).
 *
 * Mirrors the site Footer's closing treatment (and /solutions/vendors): a
 * cream rounded card with a full-bleed marquee of soft portrait cards over a
 * centered demo CTA — re-voiced for the broker page ("Help your clients
 * control costs before they become claims").
 */

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty.
export type BrokersClosingCTAContent = {
  headingLine1?: string;
  headingLine2?: string;
  body?: string;
  primaryLabel?: string;
  primaryUrl?: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
  signoff?: string;
  carousel?: string[];
};

const DEFAULT_CAROUSEL_SRCS = [
  "/card-1-bg.jpg",
  "/generated-images/chronilogix-soft-flower-senior-portrait.png",
  "/card-3-bg.jpg",
  "/generated-images/chronilogix-soft-flower-family-portrait.png",
];

const DEFAULTS = {
  headingLine1: "Help your clients control costs",
  headingLine2: "before they become claims.",
  body: "Book a 30 minute demo. We’ll walk through a live coaching session, the clinical method behind it, and how it reduces avoidable spending for your self-funded clients.",
  primaryLabel: "Book a Demo",
  primaryUrl: "#book-a-demo",
  secondaryLabel: "See How Chronilogix Works",
  secondaryUrl: "#how-it-works",
  signoff: "Chronilogix. Chronic care coaching that actually clicks.",
  carousel: DEFAULT_CAROUSEL_SRCS,
} satisfies Required<BrokersClosingCTAContent>;

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

export function BrokersClosingCTA({
  content,
}: {
  content?: BrokersClosingCTAContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const carouselSrcs = content?.carousel?.length
    ? content.carousel
    : DEFAULTS.carousel;
  const CAROUSEL = carouselSrcs.map((src) => ({
    src,
    aspect: "3/4",
    w: "w-[260px] md:w-[300px]",
  }));
  return (
    <section
      id="book-a-demo"
      aria-labelledby="brokers-closing-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-40"
    >
      {/* Full-bleed marquee carousel — identical treatment to the footer. */}
      <div className="relative mt-14 overflow-hidden md:mt-16 lg:mt-20" aria-hidden>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper-warm to-transparent md:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper-warm to-transparent md:w-24" />

        <ul
          className="flex w-max items-end gap-6"
          style={{
            animation: "footerMarquee 56s linear infinite",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          {[0, 1, 2, 3].flatMap((loopIndex) =>
            CAROUSEL.map((img, i) => {
              const offsets = ["mb-0", "mb-6", "mb-2", "mb-8", "mb-3", "mb-5"];
              const offset = offsets[i % offsets.length];
              return (
                <li key={`${loopIndex}-${i}`} className={`shrink-0 ${img.w} ${offset}`}>
                  <div
                    className="overflow-hidden rounded-[22px] border border-ink/[0.04] bg-paper shadow-[0_10px_28px_-18px_rgba(20,8,2,0.22)]"
                    style={{ aspectRatio: img.aspect }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt=""
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </div>
                </li>
              );
            }),
          )}
        </ul>
      </div>

      {/* Centered closing CTA. */}
      <div className="container-page mt-24 text-center md:mt-32 lg:mt-40">
        <h2
          id="brokers-closing-label"
          className="mx-auto text-display font-serif font-normal text-ink"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          <span className="md:whitespace-nowrap">{c.headingLine1}</span>
          <br />
          <span className="text-brand-700">{c.headingLine2}</span>
        </h2>
        <p className="mx-auto mt-7 max-w-[52ch] body-quiet">
          {c.body}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          {/* TODO: Calendly URL */}
          <a href={c.primaryUrl} className="group/cta btn-primary">
            {c.primaryLabel}
            <Arrow />
          </a>
          <a href={c.secondaryUrl} className="btn-secondary">
            {c.secondaryLabel}
          </a>
        </div>

        {/* Brand sign-off — the audio brief's closing line. */}
        <p className="mt-14 font-serif text-lg italic text-ink-muted md:mt-16 md:text-xl">
          {c.signoff}
        </p>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/cta:translate-x-1"
    >
      <path
        d="M3 7h6m0 0L6 4m3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
