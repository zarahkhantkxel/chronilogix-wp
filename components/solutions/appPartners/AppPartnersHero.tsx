"use client";

import { Fragment, useEffect, useMemo, useState } from "react";

/**
 * AppPartnersHero — opening beat of the /solutions/app-partners page.
 *
 * Structure mirrors BrokersHero's word-reveal treatment, but the right
 * column is a built-in visual metaphor rather than a placeholder card:
 * a partner app frame wrapping a "Chronilogix inside" pill, so the value
 * proposition (your product on the surface, our engine inside) reads on
 * first paint. The primary CTA is the partnership call because this
 * persona is closer to a technical/BD lead than a benefits buyer.
 */

const REVEAL_DURATION_MS = 2200;
const REVEAL_WINDOW_RATIO = 4;

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty. `intro` carries inline emphasis spans,
// so it is a ReactNode default and left unseeded in ACF.
export type AppPartnersHeroContent = {
  eyebrow?: string;
  headingBright?: string;
  headingMuted?: string;
  intro?: React.ReactNode;
  primaryLabel?: string;
  primaryUrl?: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
};

const DEFAULT_INTRO = (
  <>
    Chronilogix is the AI-native coaching platform behind{" "}
    <span className="text-ink">Roni AI</span> &mdash; the clinical
    intelligence layer you drop inside your app. Thirty years of{" "}
    <span className="text-ink">Dr. Ken Resnicow&rsquo;s</span> Motivational
    Interviewing research, delivered as an API your team can integrate this
    quarter.
  </>
);

const DEFAULTS = {
  eyebrow: "For product & partnership leads",
  headingBright: "The engagement layer",
  headingMuted: "your platform is missing.",
  primaryLabel: "Explore the partnership",
  primaryUrl: "#book-a-demo",
  secondaryLabel: "Download the whitepaper",
  secondaryUrl: "/chronilogix-mi-whitepaper.pdf",
} satisfies Omit<Required<AppPartnersHeroContent>, "intro">;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function AppPartnersHero({
  content,
}: {
  content?: AppPartnersHeroContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const intro = content?.intro ?? DEFAULT_INTRO;

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

  const headlineLines = useMemo(
    () =>
      [
        { text: c.headingBright, tone: "bright" as const },
        { text: c.headingMuted, tone: "muted" as const },
      ],
    [c.headingBright, c.headingMuted],
  );

  const headlineWords = useMemo(
    () =>
      headlineLines.flatMap((line, li) =>
        line.text.split(" ").map((word) => ({ word, line: li, tone: line.tone })),
      ),
    [headlineLines],
  );
  const totalWords = headlineWords.length;
  const stride = 1 / (totalWords - 1 + REVEAL_WINDOW_RATIO);
  const wordWindow = stride * REVEAL_WINDOW_RATIO;
  const easedReveal = easeOutCubic(revealProgress);

  const subTailReveal = clamp01((easedReveal - 0.5) / 0.5);
  const ctasReveal = clamp01((easedReveal - 0.7) / 0.3);
  const visualReveal = clamp01((easedReveal - 0.3) / 0.6);

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
      const color = w.tone === "bright" ? "#0F1419" : "#E45A1C";
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
      aria-labelledby="ap-hero-label"
      className="relative overflow-hidden rounded-[28px]"
      style={{
        background:
          "linear-gradient(120deg, #FFF3E8 0%, #FBF5EE 42%, #F4EEE4 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 88% 12%, rgba(249,144,77,0.22), transparent 70%), radial-gradient(45% 40% at 8% 90%, rgba(228,90,28,0.14), transparent 72%)",
        }}
      />

      <div className="container-page relative pt-32 pb-24 md:pt-40 md:pb-28 lg:pt-48 lg:pb-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
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
              id="ap-hero-label"
              className="mt-5 font-serif font-normal text-display"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {headlineLines.map((_, li) => (
                <span key={li} className="block">
                  {renderLine(li)}
                </span>
              ))}
            </h1>

            <p
              className="mt-7 max-w-[48ch] body-prose md:mt-8"
              style={{
                opacity: subTailReveal,
                transform: `translateY(${(1 - subTailReveal) * 8}px)`,
                willChange: "opacity, transform",
              }}
            >
              {intro}
            </p>

            <div
              className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4"
              style={{
                opacity: ctasReveal,
                transform: `translateY(${(1 - ctasReveal) * 8}px)`,
                willChange: "opacity, transform",
              }}
            >
              {/* TODO: Calendly URL */}
              <a href={c.primaryUrl} className="group/pc btn-primary">
                {c.primaryLabel}
                <Arrow group="pc" />
              </a>
              <a
                href={c.secondaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                {c.secondaryLabel}
              </a>
            </div>
          </div>

          {/* Built-in visual metaphor — not a placeholder. Outer partner
              app frame wraps the "Chronilogix inside" pill, so the value
              proposition reads without any imagery. */}
          <div
            className="relative"
            style={{
              opacity: visualReveal,
              transform: `translateY(${(1 - visualReveal) * 14}px)`,
              willChange: "opacity, transform",
            }}
          >
            <PartnerAppFrame reducedMotion={reducedMotion} />
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnerAppFrame({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="surface-glass relative mx-auto aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-[28px] p-6 md:p-8">
      <span
        aria-hidden
        className="surface-glass-shine pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[28px]"
      />

      {/* Outer partner surface — a piece of the partner's product speaking
          in the partner's voice. Serif italic label follows the site's
          eyebrow-subtle treatment. */}
      <div className="relative">
        <span className="font-serif text-[13px] italic text-ink-muted">
          Your product
        </span>
        <p className="mt-4 max-w-[28ch] font-serif text-lg leading-snug text-ink md:text-xl">
          &ldquo;How are you feeling about tomorrow&rsquo;s
          check&#8209;in?&rdquo;
        </p>
      </div>

      {/* Nested Chronilogix engine — the point of the metaphor. The
          live-pulse dot is a functional status indicator, not decoration. */}
      <div className="surface-glass-inner relative mt-8 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="block h-2 w-2 flex-none rounded-full"
            style={{
              backgroundColor: "#FF7434",
              animation: reducedMotion ? "none" : "livePulse 2.6s ease-in-out infinite",
            }}
          />
          <span className="font-serif text-[13px] italic text-brand-700">
            Chronilogix inside
          </span>
        </div>
        <p className="mt-4 text-[15px] leading-snug text-ink">
          &ldquo;It sounds like the meal plan has been the tricky part.
          What&rsquo;s felt most doable this week?&rdquo;
        </p>
        <p className="mt-4 font-serif text-[12px] italic text-ink-muted">
          Grounded in thirty years of clinical methodology &mdash; your
          brand on top, your data staying with you.
        </p>
      </div>
    </div>
  );
}

function Arrow({ group }: { group: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={`transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/${group}:translate-x-1`}
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
