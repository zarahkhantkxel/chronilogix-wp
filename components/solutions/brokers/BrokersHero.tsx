"use client";

import { Fragment, useEffect, useMemo, useState } from "react";

/**
 * BrokersHero — opening beat for /solutions/brokers.
 *
 * Answers the first question every broker has: why should I care? Leads
 * with the self-funded-client cost problem, not the product. The right
 * column keeps the existing "front-door" timeline visual — a member
 * engaging with Chronilogix long before they'd otherwise surface in
 * claims. See BrokersFrontDoorViz for the geometry + motion.
 */

// The hero headline is the broker brief's opening line, verbatim. The
// set-up runs small and muted; the thesis lands large and bright, with
// "plan design" carried in brand accent so the takeaway stays scannable.
type HeadlineLine = {
  text: string;
  variant: "lead" | "hero";
  /** Number of leading words rendered in brand accent (from the start). */
  accentWords?: number;
};

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the hero renders identically when WordPress is
// unavailable or a field is empty.
export type BrokersHeroContent = {
  eyebrow?: string;
  headlineLead?: string;
  headlineHero?: string;
  intro?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

const DEFAULTS = {
  eyebrow: "For benefits brokers",
  headlineLead: "The cost leak isn’t plan design.",
  headlineHero: "It’s member behavior.",
  intro:
    "The real drivers are chronic conditions, behavioral health, and delayed care. Chronilogix reaches them with AI coaching that changes member behavior before expensive claims happen.",
  ctaLabel: "Book a Demo",
  ctaUrl: "#book-a-demo",
} satisfies Required<BrokersHeroContent>;

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

const REVEAL_DURATION_MS = 2200;
const REVEAL_WINDOW_RATIO = 4;

export function BrokersHero({ content }: { content?: BrokersHeroContent }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const HEADLINE_LINES: HeadlineLine[] = [
    {
      text: c.headlineLead,
      variant: "lead",
    },
    {
      text: c.headlineHero,
      variant: "hero",
      accentWords: 2,
    },
  ];
  const [revealProgress, setRevealProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setRevealProgress(1);
      return;
    }
    let rafId = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / REVEAL_DURATION_MS, 1);
      setRevealProgress(t);
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const headlineWords = useMemo(
    () =>
      HEADLINE_LINES.flatMap((line, li) =>
        line.text.split(" ").map((word, wi) => ({
          word,
          line: li,
          variant: line.variant,
          accent: wi < (line.accentWords ?? 0),
        })),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [c.headlineLead, c.headlineHero],
  );
  const totalWords = headlineWords.length;
  const stride = 1 / (totalWords - 1 + REVEAL_WINDOW_RATIO);
  const wordWindow = stride * REVEAL_WINDOW_RATIO;
  const easedReveal = easeOutCubic(revealProgress);

  const subTailReveal = clamp01((easedReveal - 0.5) / 0.5);
  const taglineReveal = clamp01((easedReveal - 0.62) / 0.38);
  const ctasReveal = clamp01((easedReveal - 0.78) / 0.22);

  let wordIdx = 0;
  const renderLine = (lineIndex: number) => {
    const words = headlineWords.filter((w) => w.line === lineIndex);
    return words.map((w, wi) => {
      const idx = wordIdx++;
      const start = idx * stride;
      const end = start + wordWindow;
      const t = clamp01((easedReveal - start) / (end - start));
      const blur = (1 - t) * 3.5;
      const opacity = 0.12 + t * 0.88;
      // Dual-color heading, matching the product page hero: the lead line
      // resolves muted (#5B6470) and the payoff line lands in full ink
      // (#0F1419). No brand-orange accent — emphasis comes from the
      // muted-vs-bright contrast, not a third color.
      const color = w.variant === "lead" ? "#5B6470" : "#0F1419";
      return (
        <Fragment key={`l${lineIndex}-${wi}`}>
          <span
            className="inline-block"
            style={{
              filter: `blur(${blur}px)`,
              opacity,
              color,
              willChange: "filter, opacity",
            }}
          >
            {w.word}
          </span>
          {wi < words.length - 1 && " "}
        </Fragment>
      );
    });
  };

  return (
    <section
      aria-labelledby="brokers-hero-label"
      className="relative overflow-hidden rounded-[28px]"
      style={{
        background:
          "linear-gradient(120deg, #FFF3E8 0%, #FBF5EE 42%, #F4EEE4 100%)",
      }}
    >
      {/* Warm radial glow — anchors the hero in brand color without a
          hard band. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 12% 8%, rgba(249,144,77,0.22), transparent 70%), radial-gradient(45% 40% at 92% 90%, rgba(228,90,28,0.14), transparent 72%)",
        }}
      />

      <div className="container-page relative pt-32 pb-24 md:pt-40 md:pb-28 lg:pt-48 lg:pb-32">
        <div className="w-full text-center">
          <p
            className="eyebrow"
            style={{
              opacity: subTailReveal,
              transform: `translateY(${(1 - subTailReveal) * 6}px)`,
            }}
          >
            {c.eyebrow}
          </p>

          <h1
            id="brokers-hero-label"
            className="mt-5 font-serif font-normal"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {HEADLINE_LINES.map((_, li) => (
              <span key={li} className="block text-display">
                {renderLine(li)}
              </span>
            ))}
          </h1>

          <p
            className="mx-auto mt-7 max-w-[56ch] body-prose md:mt-8"
            style={{
              opacity: taglineReveal,
              transform: `translateY(${(1 - taglineReveal) * 6}px)`,
              willChange: "opacity, transform",
            }}
          >
            {c.intro}
          </p>

          <div
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
            style={{
              opacity: ctasReveal,
              transform: `translateY(${(1 - ctasReveal) * 8}px)`,
              willChange: "opacity, transform",
            }}
          >
            {/* TODO: Calendly URL */}
            <a href={c.ctaUrl} className="group/cta btn-primary">
              {c.ctaLabel}
              <Arrow />
            </a>
          </div>

        </div>
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

function clamp01(n: number) {
  return Math.min(Math.max(n, 0), 1);
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
