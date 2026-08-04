"use client";

import { useEffect, useState } from "react";

// V3 Hero — editorial composition inspired by ZERO™ epilepsy reference.
//
// Structure (top → bottom, may exceed viewport on purpose):
//   1. Oversized split headline (smaller than the ZERO ref, but still
//      the loudest thing on the page).
//   2. Phone mockup absolutely positioned, tilted, breaking through
//      the headline lines.
//   3. Scenery card — a rounded "hero block" with the meadow image as
//      its background. Holds the brand mark ("Chronilogix™") and a
//      single-sentence positioning line.
//   4. Two-column description row beneath the card — short tagline on
//      the left, [OVERVIEW] block with Resnicow + stats + CTA on the
//      right.

const REVEAL_DURATION_MS = 2200;

export function HeroV3() {
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

  const eased = easeOutCubic(revealProgress);
  const headlineFade = clamp01(eased / 0.55);
  const phoneFade = clamp01((eased - 0.18) / 0.6);
  const cardFade = clamp01((eased - 0.28) / 0.55);
  const descFade = clamp01((eased - 0.45) / 0.55);

  return (
    <section
      id="hero"
      className="relative overflow-hidden rounded-[28px] bg-[#F6F2EC]"
    >
      <div className="container-page relative pb-10 pt-20 sm:pb-14 sm:pt-24 md:pb-20 md:pt-28 lg:pb-24 lg:pt-32">
        {/* ── Headline ─────────────────────────────────────────────
            Center-aligned editorial headline. Sits at the top, clearly
            readable; the phone follows beneath it. */}
        <h1
          className="mx-auto max-w-[26ch] text-center font-serif font-normal text-ink leading-[1.04] tracking-[-0.025em] text-[28px] sm:text-[38px] md:text-[48px] lg:text-[58px] xl:text-[64px]"
          style={{
            opacity: headlineFade,
            transform: `translateY(${(1 - headlineFade) * 16}px)`,
            willChange: "opacity, transform",
          }}
        >
          Filling the gaps in mental health and chronic care through AI
          coaching agents. 24/7
        </h1>

        {/* ── Phone + scenery composition ──────────────────────────
            Phone bridges the gap between headline and scenery: its top
            half rises into the *space* below the headline without
            covering any text, and its bottom half sits inside the card. */}
        <div className="relative mt-[clamp(140px,18vw,260px)]">
          {/* Scenery card — sits in flow, holds the bottom of the phone */}
          <div
            className="relative overflow-hidden rounded-[24px]"
            style={{
              opacity: cardFade,
              transform: `translateY(${(1 - cardFade) * 20}px)`,
              willChange: "opacity, transform",
              aspectRatio: "16 / 7",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-bg-enhanced.png"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full select-none object-cover"
              draggable={false}
            />
          </div>

          {/* Phone — absolute, centered. Sits in the gap below the
              headline and dips into the scenery card. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-[38%]"
            style={{
              opacity: phoneFade,
              willChange: "opacity, transform",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/v3-mobile.png"
              alt="Chronilogix coaching dashboard on a member's phone"
              className="h-auto w-[72vw] max-w-[340px] select-none drop-shadow-[0_40px_80px_rgba(20,20,20,0.22)] md:w-[40vw] md:max-w-[500px] lg:w-[34vw] lg:max-w-[560px] xl:max-w-[620px]"
              draggable={false}
            />
          </div>
        </div>

        {/* ── Description row ──────────────────────────────────────────
            Left  → about-Chronilogix paragraph naming Dr. Resnicow.
            Right → numeric stat block, top-aligned with the left copy
                    so the eye lands on the figures as it crosses over.
            Extra top margin on desktop clears the V4 phone's hand which
            extends below the scenery card. */}
        <div
          className="mt-10 grid grid-cols-1 gap-8 md:mt-14 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-12 lg:mt-16 lg:gap-20"
          style={{
            opacity: descFade,
            transform: `translateY(${(1 - descFade) * 16}px)`,
            willChange: "opacity, transform",
          }}
        >
          <div>
            <p className="font-serif font-normal text-ink leading-[1.18] tracking-[-0.015em] text-[24px] sm:text-[28px] md:text-[30px] lg:text-[34px]">
              Built on the life&rsquo;s work of world-renowned{" "}
              <span className="whitespace-nowrap">Dr. Ken Resnicow</span>, in
              Motivational Interviewing.
            </p>
            <a
              href="#book-a-demo"
              className="group/herocta btn-primary mt-6 w-fit md:mt-8"
            >
              Book A Demo
              <Arrow />
            </a>
          </div>

          <div className="md:pt-2">
            <dl className="grid grid-cols-1 gap-y-5 sm:grid-cols-3 md:grid-cols-1 md:gap-y-6">
              <Stat figure="30+" label="Years of MI research" />
              <Stat figure="400+" label="Peer-reviewed publications" />
              <Stat figure="15M+" label="Lives reachable today" />
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ figure, label }: { figure: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3 border-t border-ink/10 pt-3 md:gap-4 md:pt-4">
      <dt className="font-serif text-[28px] font-normal leading-none tracking-[-0.02em] text-ink md:text-[34px] lg:text-[40px]">
        {figure}
      </dt>
      <dd className="text-[13px] leading-snug text-ink-muted md:text-[14px]">
        {label}
      </dd>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/herocta:translate-x-1"
    >
      <path
        d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
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
