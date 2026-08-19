"use client";

import { DEMO_BOOKING_URL } from "@/site.config";

const CAROUSEL = [
  {
    src: "/card-1-bg.jpg",
    aspect: "3/4",
    w: "w-[260px] md:w-[300px]",
  },
  {
    src: "/generated-images/chronilogix-soft-flower-senior-portrait.webp",
    aspect: "3/4",
    w: "w-[260px] md:w-[300px]",
  },
  {
    src: "/card-3-bg.jpg",
    aspect: "3/4",
    w: "w-[260px] md:w-[300px]",
  },
  {
    src: "/generated-images/chronilogix-soft-flower-family-portrait.webp",
    aspect: "3/4",
    w: "w-[260px] md:w-[300px]",
  },
];

/* Two documents only. The HIPAA and Security entries were placeholder
   anchors with no page behind them, and the trust line to their right
   already carries the data-handling promise — so the strip now links
   the two documents that actually exist. */
const LEGAL_LINKS = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export function Footer() {
  return (
    <footer className="relative">
      {/* Closing section — cream rounded card, full-bleed carousel + CTA */}
      <section className="relative overflow-hidden rounded-[28px] bg-paper-warm pt-14 pb-20 md:pt-16 md:pb-28 lg:pt-20">
        {/* Full-bleed marquee carousel */}
        <div className="relative mt-10 overflow-hidden md:mt-12 lg:mt-12" aria-hidden>
          {/* Soft edge fade so cards melt into the cream on left/right */}
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
            {/* Items repeated 4× so the loop never runs dry. A single copy
                of CAROUSEL is ~1272px wide; on viewports above that the
                trailing edge would show the cream background before the
                loop resets. 4 copies keeps at least 2 copies' worth
                (~2568px) of content visible at every point in the cycle,
                covering desktop and most wide displays. The existing
                calc(-50% - 12px) keyframe still resolves to exactly two
                copies' shift, so the loop point stays seamless. */}
            {[0, 1, 2, 3].flatMap((loopIndex) =>
              CAROUSEL.map((img, i) => {
                const offsets = ["mb-0", "mb-6", "mb-2", "mb-8", "mb-3", "mb-5"];
                const offset = offsets[i % offsets.length];
                return (
                  <li
                    key={`${loopIndex}-${i}`}
                    className={`shrink-0 ${img.w} ${offset}`}
                  >
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
          loading="lazy"
          decoding="async"
        />
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Big closing CTA — minimal close. The page has already made the
            argument; this just opens the door. Short body sits centered
            without a tight max-width so it doesn't feel orphaned under the
            big display headline. */}
        <div className="container-page mt-24 text-center md:mt-32 lg:mt-40">
          <h3 className="mx-auto text-display font-serif font-normal text-ink">
            <span className="md:whitespace-nowrap">Coaching, every day.</span>
            <br />
            <span className="text-brand-700">For every member.</span>
          </h3>
          <p className="mx-auto mt-7 max-w-[52ch] body-quiet">
            Book a 30 minute demo. We&rsquo;ll walk through a live coaching
            session, the clinical method behind it, and the impact modeled
            for your member population.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href={DEMO_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Book a Demo
            </a>
            <a
              href="/chronilogix-mi-whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group/wp btn-secondary"
            >
              Download the Whitepaper
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

      {/* Bottom legal strip */}
      <div className="border-t border-ink/[0.07]">
        <div className="container-page">
          {/* Type ramp bumped a step off `text-xs` — at 12px the strip
              read as fine print, which is the wrong tone for a line about
              how member data is handled. 13px, 14px on desktop: still
              quiet, comfortably legible. */}
          {/* Two clusters, not three. With four legal links the strip
              worked as wordmark / links / trust-line, but at two links
              the middle group was too light to hold the centre: because
              `justify-between` equalises the gaps rather than the axis,
              the wide trust line dragged the pair 81px left of true
              centre and the row read as three unequal islands. Grouping
              the links with the wordmark puts ~270px of footer meta
              against ~300px of trust line — balanced on weight, and it
              also survives the `md` breakpoint without the sentence
              wrapping, which a three-equal-column grid would not. */}
          <div className="flex flex-col items-center gap-4 py-6 text-[13px] text-ink-muted md:flex-row md:items-center md:justify-between md:gap-6 md:py-7 md:text-sm">
            {/* Footer meta — wordmark, year, legal links */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5 md:gap-6">
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Logo%20Packs/Primary%20Logo/Chronilogix_Logo-FullColor.svg"
                  alt="Chronilogix"
                  className="h-5 w-auto"
          loading="lazy"
          decoding="async"
        />
                <span className="text-ink-muted">© 2026</span>
              </div>

              {/* Hairline divider keeps the wordmark reading as identity
                  rather than as a third link in the row. Hidden when the
                  cluster stacks, where the gap already separates them. */}
              <span
                aria-hidden
                className="hidden h-3.5 w-px shrink-0 bg-ink/15 sm:block"
              />

              <nav aria-label="Legal">
                <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                  {LEGAL_LINKS.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-ink-muted transition-colors duration-200 ease-out-quart motion-reduce:transition-none hover:text-ink"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Trust line */}
            <p className="text-center text-ink-muted md:text-right">
              Member data is never used to train our models.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
