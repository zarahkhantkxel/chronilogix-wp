"use client";

// StatementV5 — scroll-driven two-beat statement.
//
// Beat 1 (entering the section):
//   Background = bg-image-low saturation (muted, ambient).
//   Only the first half of the heading is visible:
//     "Most healthcare chatbots ask, answer, sell or dispense.
//      People don't change like this."
//   The line sits large and centered — the reader has to dwell on
//   the indictment before the answer arrives.
//
// Beat 2 (further scroll):
//   Background cross-fades to the full-saturation BG Image.
//   The second half of the heading reveals:
//     "Motivational Interviewing is designed to change people's behaviours."
//
// The MI explainer (heading + 4 process cards) lives in its own
// dedicated section after this one — see MIExplainer.tsx.

import { useEffect, useRef, useState } from "react";

// Trigger-then-play. The cross-fade runs on its own timeline once the
// sticky scene comes into view — no scroll-scrubbing. Beat-1 holds
// briefly, then the bg swap and line-2 reveal play over the rest of
// the runway. Total play duration is wall-clock, not scroll-tied.
const PLAY_DURATION_MS = 1800;

// Total scroll distance of the pinned statement scene. The inner pane is
// `sticky top-0 h-svh`, so the first 100vh is the pane filling the screen and
// everything beyond it is "hold" — scroll where the scene stays pinned and
// static. The reveal is a one-shot rAF timer (PLAY_DURATION_MS above), NOT
// scroll-linked, so this value buys reading time only; it drives no animation.
//
// Was 130vh (30vh of hold), which read as a long empty white stretch between
// the hero and the MI explainer. 110vh keeps a 10vh beat so the statement
// still "lands" before the page moves on. Lower it toward 100vh to remove the
// hold entirely; the copy and animation are unaffected either way.
const SCENE_HEIGHT_VH = 110;
const T_LINE2_START = 0.3;
const T_LINE2_END = 0.9;

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty.
export type StatementV5Content = {
  line1?: string;
  line2?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  bgFull?: string;
  bgLow?: string;
};

const DEFAULTS = {
  line1:
    "Most healthcare chatbots ask, answer, sell or dispense. People don’t change like this.",
  line2:
    "Motivational Interviewing is designed to change people’s behaviours.",
  ctaLabel: "Read the full white paper",
  ctaUrl: "#motivational-interviewing",
  bgFull: "/statement-bg.png",
  bgLow: "/statement-bg-low.png",
} satisfies Required<StatementV5Content>;

export function StatementV5({ content }: { content?: StatementV5Content }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const [reveal, setReveal] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const on = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // One-shot trigger: a single scroll listener watches for the sticky
  // scene to cross the trigger threshold (top edge above 60% of the
  // viewport). On first crossing it locks the trigger, detaches, and
  // kicks off a rAF-driven animation that runs 0 → 1 over
  // PLAY_DURATION_MS. Scrolling past doesn't reverse the animation;
  // scrolling back doesn't restart it.
  useEffect(() => {
    if (reducedMotion) {
      setReveal(1);
      return;
    }
    const el = stickyRef.current;
    if (!el) return;
    let cancelled = false;
    let rafId = 0;
    let started = false;

    const startAnimation = () => {
      if (started) return;
      started = true;
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      const startT = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min((now - startT) / PLAY_DURATION_MS, 1);
        setReveal(t);
        if (t < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    };

    const check = () => {
      if (started) return;
      const rect = el.getBoundingClientRect();
      const triggerY = window.innerHeight * 0.6;
      if (rect.top < triggerY) startAnimation();
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  const eased = easeInOutCubic(reveal);
  const crossFade = clamp01(
    (eased - T_LINE2_START) / (T_LINE2_END - T_LINE2_START),
  );
  const line2Fade = crossFade;

  return (
    <section
      id="statement"
      className="relative"
      style={{ backgroundColor: "#FBF8F4" }}
      aria-label="Why most healthcare chatbots fail to change behaviour"
    >
      {/* Sticky scene: bg cross-fade + heading reveal */}
      <div
        ref={sectionRef}
        className="relative"
        style={{ height: `${SCENE_HEIGHT_VH}vh` }}
      >
        <div
          ref={stickyRef}
          className="sticky top-0 h-svh overflow-hidden rounded-b-[28px]"
        >
          {/* Background plates cross-fade */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.bgFull}
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
            style={{ opacity: crossFade }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.bgLow}
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
            style={{ opacity: 1 - crossFade }}
          />

          {/* Top scrim — dissolves the top of the image into the white page
              above. Kept short (18%): at 30% it merged with the hero's own
              white bottom fade into one long cream void before the heading
              landed. The stop positions are pulled forward too, so the image
              is essentially clear by ~40% of the scrim rather than 100%. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[18%]"
            style={{
              background:
                "linear-gradient(180deg, #FBF8F4 0%, rgba(251,248,244,0.6) 20%, rgba(251,248,244,0.2) 45%, rgba(251,248,244,0) 100%)",
            }}
          />

          <div className="relative z-10 flex h-full flex-col">
            {/* Top padding trimmed (was pt-28 → xl:pt-48): combined with the
                hero's white bottom fade it pushed the headline most of a
                screen down, so the transition read as dead space. */}
            <div className="container-page flex h-full w-full flex-col justify-start pt-20 md:pt-24 lg:pt-28 xl:pt-32">
              <div className="max-w-5xl">
                <h2
                  className="max-w-4xl text-section font-serif font-normal text-ink"
                  style={{ textWrap: "balance" } as React.CSSProperties}
                >
                  <span className="inline">{c.line1}</span>
                  <span
                    className="mt-3 block md:mt-4"
                    style={{
                      opacity: line2Fade,
                      filter: `blur(${(1 - line2Fade) * 6}px)`,
                      transition: "filter 80ms linear",
                    }}
                  >
                    {c.line2}
                  </span>
                </h2>

                {/* CTA — appears alongside Beat 2 so the action rides
                    the same reveal as the answer it earns. */}
                <a
                  href={c.ctaUrl}
                  className="btn-primary group/mi-cta mt-8 md:mt-9"
                  style={{
                    opacity: line2Fade,
                    transform: `translateY(${(1 - line2Fade) * 10}px)`,
                    pointerEvents: line2Fade > 0.6 ? "auto" : "none",
                  }}
                >
                  {c.ctaLabel}
                  <Arrow />
                </a>
              </div>
            </div>
          </div>
        </div>
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
      className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/mi-cta:translate-x-1"
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

function clamp01(n: number) {
  return Math.min(Math.max(n, 0), 1);
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
