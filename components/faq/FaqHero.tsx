"use client";

import { DEMO_BOOKING_URL } from "@/site.config";

/**
 * FAQ hero — the first block on /faq.
 *
 * Rhythm matches About & Product page opens: warm-paper card, small
 * eyebrow, serif hero headline, one supporting line, no image. Reads
 * as "this is where the plain-language answers live" without competing
 * with the section that follows.
 */

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty. `body` carries an inline link, so its
// default is a styled ReactNode left unseeded (a plain textarea can't hold
// the formatting) — the default renders unless an editor overrides it.
export type FaqHeroContent = {
  eyebrow?: string;
  headingLead?: string;
  headingEmph?: string;
  body?: React.ReactNode;
};

const DEFAULTS = {
  eyebrow: "Questions, answered",
  headingLead: "The plain-language answers",
  headingEmph: "to the questions we hear most.",
  body: (
    <>
      What Chronilogix is, how it&rsquo;s different from a chatbot,
      how care stays safe, how deployment works, and what makes the
      science defensible. If your question isn&rsquo;t here,{" "}
      <a
        href={DEMO_BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-brand-500/40 decoration-1 underline-offset-[3px] transition-colors hover:text-brand-700 hover:decoration-brand-600"
      >
        book a demo
      </a>{" "}
      and we&rsquo;ll answer it directly.
    </>
  ),
} satisfies Required<FaqHeroContent>;

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

export function FaqHero({ content }: { content?: FaqHeroContent }) {
  const c = { ...DEFAULTS, ...clean(content) };

  return (
    <section
      id="faq-hero"
      className="relative overflow-hidden rounded-[20px] bg-paper-warm pt-20 pb-12 sm:rounded-[24px] sm:pt-28 sm:pb-16 md:rounded-[28px] md:pt-36 md:pb-20 lg:pt-44 lg:pb-24"
    >
      {/* Same brand-orange radial wash used on AboutScience — keeps the
          gravitational feel without a dark slab. */}
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
          <p className="eyebrow">{c.eyebrow}</p>
          <h1
            className="mt-3 text-hero font-serif font-normal text-ink md:mt-4"
            style={
              {
                textWrap: "balance",
                // Suppress the "plain-|language" hyphenation split on
                // narrow viewports — the visual break there hurts more
                // than the extra character-fit gains it.
                hyphens: "none",
                wordBreak: "normal",
              } as React.CSSProperties
            }
          >
            {c.headingLead}{" "}
            <span className="text-ink-muted">{c.headingEmph}</span>
          </h1>
          <p className="mt-5 max-w-[62ch] body-prose md:mt-6">{c.body}</p>
        </div>
      </div>
    </section>
  );
}
