"use client";

import { useEffect, useState } from "react";
import { DEMO_BOOKING_URL } from "@/site.config";

// V2 Hero — three-layer composition matching the 1920×1809 reference.
//
// The reference's "phone dissolving into fog" effect is NOT a mask on
// the phone image — it's a discrete white blurred rectangle layer that
// overlays the bottom portion of the phone. Reference CSS (at 1920px
// viewport):
//
//   .blur-rect {
//     position: absolute;
//     width:  1920px;
//     height:  541px;          /* 29.9% of 1809 frame */
//     left:   calc(50% - 1920px/2 + 6px);
//     top:    582px;           /* 32.2% of 1809 frame */
//     background: #FFFFFF;
//     filter: blur(82px);      /* 4.27% of viewport width */
//   }
//
// This page scales those values to viewport so the relationship between
// phone, fog, and text holds at every breakpoint.
//
// Stacking (back to front):
//   z-0   Phone image (no mask, fully visible)
//   z-10  White blurred rectangle — covers bottom of phone + top of text
//   z-20  Text row (headline+CTA, Resnicow+stats) — crisp, sits ON fog
//   z-0   Scenery band at the bottom (rises out of white via top mask)

const REVEAL_DURATION_MS = 2400;

export function HeroV2() {
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
  // Fog lays down first as ambient haze, then the phone reveals through
  // it. Without this offset the two fade in together and the fog is
  // invisible against the white background — visitor only sees the phone.
  const fogFade = clamp01(eased / 0.32);
  const phoneFade = clamp01((eased - 0.22) / 0.55);
  const textFade = clamp01((eased - 0.4) / 0.55);
  const sceneryFade = clamp01((eased - 0.15) / 0.7);

  return (
    <section
      id="hero"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      {/* ── Band 1: Phone ────────────────────────────────────────────
          Phone is large (32vw at desktop, ~32% of viewport) and held
          near the top of the hero. No CSS mask — the blur LAYER below
          will cover its lower portion to create the fog effect. */}
      <div
        className="relative z-0 flex w-full justify-center pt-6 sm:pt-12 md:pt-14 lg:pt-10"
        style={{ minHeight: "max(360px, 0vw)" }}
      >
        <div
          style={{
            opacity: phoneFade,
            transform: `translateY(${(1 - phoneFade) * 14}px)`,
            willChange: "opacity, transform",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hand-phone-mockup.png"
            alt="Chronilogix coaching on a member's phone"
            className="h-auto w-[clamp(540px,54vw,1040px)] select-none"
            draggable={false}
          />
        </div>
      </div>


      {/* ── White blur layer ──────────────────────────────────────────
          A full-width white rectangle with heavy gaussian blur. Spans
          ~30% of hero height starting at ~30vw from the top. The blur
          radius (4.27vw, capped at 82px) feathers the rectangle's
          edges into the white background, producing the "fog" that
          dissolves the bottom of the phone and floats the text on a
          soft white veil. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 z-10 hidden lg:block"
        style={{
          top: "30vw",
          height: "32vw",
          background: "#FFFFFF",
          filter: "blur(min(80px, 4.2vw))",
          WebkitFilter: "blur(min(80px, 4.2vw))",
          opacity: fogFade,
        }}
      />

      {/* ── Bottom white blur layer ───────────────────────────────────
          A short white-blurred band positioned at the END of the
          scenery to create a smooth fade from meadow → white at the
          bottom of the hero. Anchored to the hero's bottom edge
          (`bottom: -3vw`) so the blur's lower feather falls fully
          outside the hero, leaving only the upper feather visible
          against the meadow — that's what creates the soft horizon
          dissolve.

          Width is intentionally wider than the viewport so the
          horizontal feather edges sit entirely offscreen, producing
          a clean band with no visible side falloff. */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-10 hidden lg:block"
        style={{
          bottom: "-2vw",
          left: "50%",
          width: "121.04vw",
          height: "10vw",
          maxHeight: "210px",
          transform: "translateX(-50%)",
          background: "#FFFFFF",
          filter: "blur(min(82px, 4.27vw))",
          WebkitFilter: "blur(min(82px, 4.27vw))",
          opacity: sceneryFade * 0.18,
        }}
      />

      {/* ── Band 2: Text row ─────────────────────────────────────────
          Sits in normal flow below the phone band. z-20 puts it ABOVE
          the blur layer so the text reads crisply over the fog.
          Headline left, Resnicow + stats right. */}
      <div
        className="relative z-20 pb-8 pt-0 md:pb-12 lg:-mt-[14vw] lg:pb-10"
        style={{
          opacity: textFade,
          transform: `translateY(${(1 - textFade) * 12}px)`,
          willChange: "opacity, transform",
        }}
      >
        <div className="container-page w-full">
          <div className="grid grid-cols-1 items-start gap-6 sm:gap-10 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
            {/* Left — headline + primary CTA */}
            <div>
              <h1
                className="max-w-[40ch] font-serif font-normal leading-[1.08] tracking-[-0.02em] text-ink text-[1.75rem] sm:text-[2.25rem] md:text-[2.5rem] lg:text-[2.625rem] xl:text-[2.75rem]"
              >
                Filling the gaps in mental health and chronic care through AI
                coaching agents. 24/7
              </h1>

              <a
                href={DEMO_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group/herocta btn-primary mt-5 w-fit sm:mt-7 md:mt-8"
              >
                Book a Demo
                <Arrow />
              </a>
            </div>

            {/* Right — Resnicow credibility + inline stats. Smaller than
                before so it reads as a quiet caption beside the
                headline, per the reference's visual hierarchy. */}
            <div className="lg:pt-0">
              <p
                className="max-w-[50ch] font-serif font-normal leading-[1.35] tracking-[-0.01em] text-ink text-[1.0625rem] md:text-[1.125rem] lg:text-[1.3125rem] xl:text-[1.4375rem]"
              >
                Built on the life&rsquo;s work of world-renowned{" "}
                <span className="text-ink">Dr. Ken Resnicow</span>, in
                Motivational Interviewing.
              </p>

              <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-2 text-[12.5px] text-ink-muted md:mt-6 md:text-[13.5px] lg:text-[14px]">
                <div className="flex items-baseline gap-2">
                  <dt className="font-medium text-ink">30+</dt>
                  <dd>Years of MI research</dd>
                </div>
                <div className="flex items-baseline gap-2">
                  <dt className="font-medium text-ink">400+</dt>
                  <dd>Peer-reviewed publications</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* ── Band 3: Scenery ──────────────────────────────────────────
          Full-width pastel meadow. Top edge dissolves into white via a
          linear-gradient mask so the meadow rises out of the page. */}
      <div
        className="relative z-0 w-full"
        style={{ height: "max(440px, 34vw)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-bottom"
          src="/hero-bg-enhanced.png"
          alt=""
          aria-hidden
          draggable={false}
          style={{
            opacity: sceneryFade,
            maskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.65) 10%, #000 18%, #000 58%, rgba(0,0,0,0.78) 70%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0.25) 90%, rgba(0,0,0,0.08) 96%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.65) 10%, #000 18%, #000 58%, rgba(0,0,0,0.78) 70%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0.25) 90%, rgba(0,0,0,0.08) 96%, transparent 100%)",
          }}
        />
      </div>
    </section>
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
