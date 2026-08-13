"use client";

import { DEMO_BOOKING_URL } from "@/site.config";

/**
 * VendorsClosingCTA — the sign-off (Final CTA).
 *
 * Mirrors the site Footer's closing treatment: a cream rounded card with a
 * full-bleed marquee of soft portrait cards over a centered demo CTA —
 * re-voiced for the vendor page ("Upgrade outcomes without changing your
 * product").
 */

// Carousel card geometry is a fixed design constant; only the image sources
// are editable content.
const CARD_ASPECT = "3/4";
const CARD_W = "w-[260px] md:w-[300px]";

const DEFAULT_CAROUSEL = [
  "/card-1-bg.jpg",
  "/generated-images/chronilogix-soft-flower-senior-portrait.png",
  "/card-3-bg.jpg",
  "/generated-images/chronilogix-soft-flower-family-portrait.png",
];

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when a field is empty.
export type VendorsClosingCTAContent = {
  eyebrow?: string;
  headingLead?: string;
  headingEmph?: string;
  body?: string;
  primaryLabel?: string;
  primaryUrl?: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
  carousel?: string[];
};

const DEFAULTS = {
  eyebrow: "Chronic coaching care that clicks",
  headingLead: "Upgrade outcomes.",
  headingEmph: "Without changing your product.",
  body: "Book a 30 minute demo. We’ll walk through a live coaching session, the clinical method behind it, and how it works alongside the product you already ship.",
  primaryLabel: "Book a Demo",
  primaryUrl: DEMO_BOOKING_URL,
  secondaryLabel: "Download the Whitepaper",
  secondaryUrl: "/chronilogix-mi-whitepaper.pdf",
} satisfies Required<Omit<VendorsClosingCTAContent, "carousel">>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function VendorsClosingCTA({
  content,
}: {
  content?: VendorsClosingCTAContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const CAROUSEL = (
    content?.carousel?.length ? content.carousel : DEFAULT_CAROUSEL
  ).map((src) => ({ src, aspect: CARD_ASPECT, w: CARD_W }));
  return (
    <section
      id="book-a-demo"
      aria-labelledby="vendors-closing-label"
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
        <p className="eyebrow">{c.eyebrow}</p>
        <h2
          id="vendors-closing-label"
          className="mx-auto mt-4 text-display font-serif font-normal text-ink"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          <span className="md:whitespace-nowrap">{c.headingLead}</span>
          <br />
          <span className="text-brand-700">{c.headingEmph}</span>
        </h2>
        <p className="mx-auto mt-7 max-w-[52ch] body-quiet">{c.body}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a href={c.primaryUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            {c.primaryLabel}
          </a>
          <a
            href={c.secondaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/wp btn-secondary"
          >
            {c.secondaryLabel}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden
              className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/wp:translate-x-1"
            >
              <path
                d="M3 7h6m0 0L6 4m3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
