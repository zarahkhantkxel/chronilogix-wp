"use client";

import { useReveal } from "@/components/hooks/useReveal";
import { DEMO_BOOKING_URL } from "@/site.config";

export type YourSolutionContent = {
  headingBrand?: string;
  headingRest?: string;
  subLead?: string;
  subBrand?: string;
  body?: string;
  bodyBrand?: string;
  ctaHeadingLead?: string;
  ctaHeadingMuted?: string;
  ctaBody?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

const DEFAULTS = {
  headingBrand: "Your Solution",
  headingRest: "+ Chronilogix",
  subLead: "Imagine what AI coaching could do for",
  subBrand: "your organization.",
  body: "Whether you provide wellness programs, digital health platforms, pharmacies, medical devices, health screenings, employer benefits, disease management, remote monitoring, nutrition, or telehealth —",
  bodyBrand: "there’s a coaching layer to add.",
  ctaHeadingLead: "Already have a healthcare solution?",
  ctaHeadingMuted: "Let’s build something better together.",
  ctaBody:
    "Chronilogix can add a clinically grounded, Motivational Interviewing-based AI coaching layer that increases engagement, improves outcomes, and creates new value for your members.",
  ctaLabel: "Book a Demo",
  ctaUrl: DEMO_BOOKING_URL,
};

/**
 * YourSolutionPanel — the fourth panel + closing CTA. Turns the three
 * examples into an open invitation: whatever the visitor already runs,
 * Chronilogix can add the coaching layer on top. Chronilogix is the subject
 * of the resolution and the sign-off. Carries id="book-a-demo" so every
 * page CTA resolves here.
 */
export function YourSolutionPanel({
  content,
}: {
  content?: YourSolutionContent;
}) {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const c = { ...DEFAULTS, ...content };

  return (
    <section
      id="book-a-demo"
      aria-labelledby="ps-your-solution-label"
      // Bottom corners squared and a negative margin cancels the card
      // system's gap so this panel sits flush on the footer; the dissolve
      // overlays below then blur the seam into the footer's warm paper.
      className="relative -mb-2 overflow-hidden rounded-t-[28px] md:-mb-3"
      style={{
        background:
          "linear-gradient(120deg, #FFF3E8 0%, #FBF5EE 46%, #F4EEE4 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 50% at 50% 115%, rgba(249,144,77,0.24), transparent 70%), radial-gradient(40% 40% at 88% 6%, rgba(228,90,28,0.12), transparent 72%)",
        }}
      />

      {/* Bottom dissolve — melts the panel's base into the footer's warm
          paper (paper-warm, #FBF8F4). A tall colour ramp matches the tone,
          and a blurred paper bar softens the actual seam so the panel and
          the footer read as one continuous surface, not two stacked cards.
          Placed before the content so the CTA still paints on top. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 md:h-56"
        style={{
          background:
            "linear-gradient(to bottom, rgba(251,248,244,0) 0%, rgba(251,248,244,0.18) 55%, rgba(251,248,244,0.72) 83%, #FBF8F4 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
        style={{
          background: "#FBF8F4",
          filter: "blur(22px)",
          WebkitFilter: "blur(22px)",
        }}
      />

      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative pt-24 pb-12 text-center md:pt-32 md:pb-14 lg:pt-36 lg:pb-16"
      >
        <h2
          id="ps-your-solution-label"
          className="reveal-row mx-auto max-w-[22ch] font-serif font-normal text-display text-ink [transition-delay:60ms]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          <span className="italic text-brand-700">{c.headingBrand}</span>{" "}
          {c.headingRest}
        </h2>

        <h3 className="reveal-row mx-auto mt-4 font-serif font-normal text-[21px] leading-[1.3] text-ink [transition-delay:140ms] sm:text-[24px] md:whitespace-nowrap lg:text-[28px]">
          {c.subLead}{" "}
          <span className="italic text-brand-700">{c.subBrand}</span>
        </h3>

        <p className="reveal-row mx-auto mt-8 max-w-[54ch] text-[16px] leading-[1.6] text-ink/80 [transition-delay:220ms] md:text-[18px]">
          {c.body}{" "}
          <span className="text-brand-700">{c.bodyBrand}</span>
        </p>

        {/* Closing CTA — a self-contained dark slab card, same treatment as
            the FAQ close, dropped inside the warm panel so the section ends
            on a familiar Book-a-Demo block. */}
        <div className="reveal-row mt-14 [transition-delay:340ms] md:mt-16">
          <div className="relative overflow-hidden rounded-[20px] bg-ink px-7 py-12 text-left sm:rounded-[24px] sm:px-10 md:rounded-[28px] md:px-14 md:py-16 lg:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 100% 0%, rgba(249,144,77,0.18) 0%, rgba(249,144,77,0.06) 40%, transparent 72%)",
              }}
            />

            <div className="relative max-w-3xl">
              <h4
                className="font-serif text-hero font-normal text-paper"
                style={
                  {
                    textWrap: "balance",
                    hyphens: "none",
                    wordBreak: "normal",
                  } as React.CSSProperties
                }
              >
                {c.ctaHeadingLead}{" "}
                <span className="text-paper/60">{c.ctaHeadingMuted}</span>
              </h4>

              <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-paper/70 md:mt-6 md:text-lg">
                {c.ctaBody}
              </p>

              <div className="mt-8 md:mt-10">
                <a
                  href={c.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary group/cta bg-brand-600 text-paper hover:bg-brand-500 hover:shadow-[0_20px_44px_-16px_rgba(249,144,77,0.55)]"
                >
                  {c.ctaLabel}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden
                    className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/cta:translate-x-1"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
