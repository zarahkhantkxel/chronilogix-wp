"use client";

import { useReveal } from "@/components/hooks/useReveal";
import {
  PARTNER_LOGOS,
  type PartnerLogo,
} from "@/components/partnerSolutions/partnerData";
import { DEMO_BOOKING_URL } from "@/site.config";

export type PartnerHeroContent = {
  eyebrow?: string;
  headingLead?: string;
  headingBrand?: string;
  intro?: string;
  subintro?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  logos?: PartnerLogo[];
};

const DEFAULTS = {
  eyebrow: "Partner Solutions",
  headingLead: "Extend Your Solution.",
  headingBrand: "Increase Your Value.",
  intro:
    "Chronilogix doesn’t replace your product — we make it smarter, more engaging, and more effective through continuous AI coaching.",
  subintro: "Three examples of how we bundle with industry leaders.",
  ctaLabel: "Book a Demo",
  ctaUrl: DEMO_BOOKING_URL,
  logos: PARTNER_LOGOS,
};

/**
 * PartnerHero — /partner-solutions opener. Reframes the pitch: Chronilogix
 * doesn't replace your product, it extends it. The partner logos sit under
 * the CTA as proof that industry leaders already bundle with Chronilogix.
 *
 * Reuses the warm gradient + stacked radial-glow shell from VendorsHero,
 * with a simpler CSS reveal (useReveal + .reveal-row) rather than the
 * per-word RAF reveal.
 */
export function PartnerHero({ content }: { content?: PartnerHeroContent }) {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const c = { ...DEFAULTS, ...content };
  const logos = c.logos?.length ? c.logos : DEFAULTS.logos;

  return (
    <section
      aria-labelledby="ps-hero-label"
      className="relative overflow-hidden rounded-[28px]"
      style={{
        background:
          "linear-gradient(120deg, #FFF3E8 0%, #FBF5EE 42%, #F4EEE4 100%)",
      }}
    >
      {/* Warm radial glow — anchors the hero in brand color without a hard band. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 12% 8%, rgba(249,144,77,0.22), transparent 70%), radial-gradient(45% 40% at 92% 90%, rgba(228,90,28,0.14), transparent 72%)",
        }}
      />

      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative pt-28 pb-20 text-center md:pt-32 md:pb-24 lg:pt-36 lg:pb-28"
      >
        <p className="reveal-row eyebrow [transition-delay:60ms]">{c.eyebrow}</p>

        <h1
          id="ps-hero-label"
          className="reveal-row mt-5 font-serif font-normal text-display text-ink [transition-delay:140ms]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {c.headingLead}{" "}
          <span className="italic text-brand-700">{c.headingBrand}</span>
        </h1>

        <p className="reveal-row mx-auto mt-7 max-w-[62ch] body-prose [transition-delay:220ms] md:mt-8">
          {c.intro}
        </p>

        <p className="reveal-row mx-auto mt-3 max-w-[52ch] body-quiet [transition-delay:280ms]">
          {c.subintro}
        </p>

        <div className="reveal-row mt-9 flex justify-center [transition-delay:340ms]">
          <a href={c.ctaUrl} target="_blank" rel="noopener noreferrer" className="btn-primary group/cta">
            {c.ctaLabel}
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
          </a>
        </div>

        {/* Partner proof row — the leaders already bundling with Chronilogix.
            Rendered bare (no chip) and enlarged; the logos are pre-trimmed to
            transparent PNGs so no background box shows. */}
        <div className="reveal-row mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 [transition-delay:420ms] md:gap-x-14">
          {logos.map((logo) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              className="h-9 w-auto object-contain md:h-11"
              draggable={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
