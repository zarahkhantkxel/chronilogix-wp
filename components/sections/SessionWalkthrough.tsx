"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { AIOrb } from "@/components/AIOrb";

/**
 * SessionWalkthrough — the 4-stage Chronilogix session block.
 *
 * The canonical "how a session works" treatment, shared between the
 * homepage Solution section (Part 2) and the product page's experience
 * section. Each stage is a tall card with an animated visual on top and
 * an icon + label + description below.
 *
 * The block ships its own header (eyebrow + h3 + intro paragraph) so it
 * can drop into any surrounding section without the host having to
 * duplicate copy.
 */

const SESSION_MESSAGES = [
  "What made today feel that way?",
  "What helped you through the last time it felt like this?",
  "What is one small thing that might feel reachable tonight?",
  "What would tomorrow look like if it went a little better?",
];

const STEPS = [
  {
    label: "Onboarding",
    title:
      "A structured intake captures emotional challenges, behavioral patterns, motivations, stressors, goals, and life priorities. Chronilogix synthesizes it into a personalized coaching brief, ready before the very first session.",
    Visual: IntakeVisual,
    Icon: ClipboardIcon,
  },
  {
    label: "Daily sessions",
    title:
      "From day one, the coach summarizes context and personalizes every exchange. Chronilogix is culturally sensitive and emotionally aware, because behavior change is deeply personal.",
    Visual: SessionVisual,
    Icon: ChatIcon,
  },
  {
    label: "Goal tracking",
    title:
      "Big challenges get broken into smaller, achievable goals. Members build momentum, confidence, and sustainable progress, one small win at a time.",
    Visual: MemoryVisual,
    Icon: TargetIcon,
  },
  {
    label: "Progress reporting",
    title:
      "A clear recap of what's moved, session over session and week over week. Members see their progress, and coaches see exactly where to nudge next.",
    Visual: ReportVisual,
    Icon: ChartIcon,
  },
] as const;

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold]);

  return { ref, inView };
}

export function SessionWalkthrough({
  hideEyebrow = false,
  featured = false,
}: {
  hideEyebrow?: boolean;
  /**
   * When true, the walkthrough's heading is rendered as the section's
   * primary headline — `h2` at `text-hero`. Use on pages where this
   * block sits as a top-level section (the product page). Default
   * (`false`) keeps it as a nested `h3` at `text-section`, which is
   * correct on the homepage where it lives inside Solution's own `h2`.
   */
  featured?: boolean;
} = {}) {
  const Heading = featured ? "h2" : "h3";
  // Heading top margin is only needed when an eyebrow sits above it.
  const headingMargin = hideEyebrow ? "" : "mt-3";
  const headingSize = featured ? "text-hero" : "text-section";

  return (
    <div>
      {/* Header — intro to the four-stage session walkthrough below.
          Keeps the section's promise tight: therapeutically informed,
          founded on Resnicow's MI research, culturally sensitive. The
          specifics are demonstrated in the stage grid that follows,
          so the prose stays a setup, not a recap. The product page
          hides the eyebrow via `hideEyebrow` and promotes the heading
          to a top-level `h2` via `featured`. */}
      <div className="max-w-5xl">
        {hideEyebrow ? null : (
          <p className="eyebrow-muted">How a Chronilogix session works</p>
        )}
        <Heading
          className={`${headingMargin} max-w-4xl ${headingSize} font-serif font-normal text-ink`.trim()}
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          AI therapeutic coaching designed for how people actually change.
        </Heading>
        <p className="mt-5 max-w-[72ch] body-quiet md:mt-6">
          Chronilogix&rsquo;s AI coaches aren&rsquo;t generic chatbots
          or simple symptom checkers. The platform is built for
          ongoing, therapeutically informed, efficacious coaching
          rooted in evidence based behavioral science. Founded on{" "}
          <span className="text-ink">Dr. Ken Resnicow&rsquo;s</span>{" "}
          Motivational Interviewing research, with cultural
          sensitivity built into every interaction.
        </p>
      </div>

      {/* 4-stage grid */}
      <div className="mt-12 grid gap-6 md:mt-14 md:grid-cols-2 md:gap-7 lg:grid-cols-4 lg:gap-6">
        {STEPS.map((s, i) => (
          <StepCard key={s.label} step={s} index={i} />
        ))}
      </div>
    </div>
  );
}

function StepCard({
  step,
  index,
}: {
  step: {
    label: string;
    title: string;
    Visual: React.ComponentType<{ active: boolean }>;
    Icon: React.ComponentType<{ className?: string }>;
  };
  index: number;
}) {
  const { Visual, Icon } = step;
  const { ref, inView } = useInView<HTMLElement>(0.2);

  return (
    <article ref={ref}>
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
          transition:
            "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        <Visual active={inView} />
      </div>
      <div
        className="mt-6 md:mt-7"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(10px)",
          transition:
            "opacity 600ms cubic-bezier(0.22, 0.61, 0.36, 1) 200ms, transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1) 200ms",
        }}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="h-[18px] w-[18px] text-brand-600" />
          <p className="text-base font-medium text-ink">{step.label}</p>
        </div>
        <div className="mt-2 max-w-[36ch] space-y-3 text-[15px] leading-relaxed text-ink-muted">
          {step.title.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ── Icons used by STEPS ───────────────────────────────────────────────── */

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4" y="3.5" width="10" height="12" rx="2" />
      <path d="M7 3.5V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1" />
      <path d="M6.5 8h5M6.5 11h3.5" />
    </svg>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="9" r="6.5" />
      <circle cx="9" cy="9" r="3.2" />
      <circle cx="9" cy="9" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 13.5 6.5 9.5 9.5 12 15 5.5" />
      <path d="M11 5.5h4v4" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 7a2.5 2.5 0 0 1 2.5-2.5h7A2.5 2.5 0 0 1 15 7v3.5a2.5 2.5 0 0 1-2.5 2.5H8l-3 2.5v-2.5h-.5A2.5 2.5 0 0 1 2 10.5V7z" />
      <circle cx="9" cy="8.75" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Each step visual reads as ONE clear idea. No status pills, no badges, no
   redundant indicators — typography + whitespace carry the meaning. */

/* ── Step 1 — Onboarding: a 3-field intake summary, no rows of chrome ──── */

const INTAKE_FACETS: string[] = [
  "Emotional challenges",
  "Behavioral patterns",
  "Motivations",
  "Stressors",
  "Personal goals",
  "Life priorities",
];

function IntakeVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      <Image
        src="/card-1-bg.webp"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
          fill
          sizes="(max-width: 768px) 100vw, 1280px"
        />
      <div className="absolute inset-0 bg-gradient-to-b from-paper/65 via-paper/55 to-paper/70" />

      <div className="relative flex h-full items-center justify-center p-5 md:p-6">
        {/* Single elevated card — premium soft shadow, generous breathing room.
            Header pairs the AI orb with "Understanding" as an identity mark;
            the six dimensions check in one-by-one as the AI comprehends them. */}
        <figure
          className="relative w-full max-w-[252px] rounded-[18px] bg-white/95 p-4 shadow-[0_18px_40px_-14px_rgba(40,25,15,0.22),0_2px_8px_-2px_rgba(40,25,15,0.08)] ring-1 ring-ink/[0.04]"
          style={{
            animation: "fadeUp 600ms ease-out 120ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          {/* Header — orb identity + label */}
          <div className="flex items-center gap-2">
            <AIOrb size={16} />
            <p className="text-[13px] font-medium text-ink">Understanding</p>
          </div>

          {/* Six dimensions — each one resolving in sequence to imply
              the AI taking each in. */}
          <ul className="mt-3 space-y-[7px]">
            {INTAKE_FACETS.map((f, i) => (
              <li
                key={f}
                className="flex items-center gap-2 text-[12.5px] leading-snug text-ink"
                style={{
                  animation: `fadeUp 360ms ease-out ${360 + i * 140}ms forwards`,
                  animationPlayState: playState,
                  opacity: 0,
                }}
              >
                <span
                  aria-hidden
                  className="flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full bg-brand-600/12 text-brand-700"
                >
                  <svg
                    className="h-[8px] w-[8px]"
                    viewBox="0 0 8 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1.6 4.2 L3.4 5.8 L6.6 2.4" />
                  </svg>
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </figure>
      </div>
    </div>
  );
}

/* ── Step 2 — Daily sessions: two bubbles, no composer, no status pill ─── */

function SessionVisual({ active }: { active: boolean }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % SESSION_MESSAGES.length),
      3500,
    );
    return () => clearInterval(t);
  }, [active]);

  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pattern.webp"
        alt=""
        className="absolute left-0 top-0 h-full w-auto max-w-none scale-110 select-none blur-md"
        draggable={false}
          loading="lazy"
          decoding="async"
        />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-paper-warm/70 via-paper-warm/60 to-paper-warm/75"
      />

      <div className="relative flex h-full flex-col justify-center gap-3 p-5 md:p-6">
        {/* Member — short, honest */}
        <div
          className="surface-glass-inner relative max-w-[82%] self-end overflow-hidden rounded-[16px] rounded-br-[6px] px-4 py-3 text-[14px] leading-snug text-ink"
          style={{
            animation: "fadeUp 600ms ease-out 200ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          Honestly, today felt impossible.
        </div>

        {/* Chronilogix — MI question (cycling) */}
        <div
          className="relative flex max-w-[88%] items-start gap-2 self-start"
          style={{
            animation: "fadeUp 600ms ease-out 800ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span className="mt-1.5"><AIOrb size={18} /></span>
          <div
            key={idx}
            className="surface-glass relative overflow-hidden rounded-[16px] rounded-bl-[6px] px-4 py-3 text-[14px] leading-snug text-ink"
            style={{
              animation: "fadeUp 500ms ease-out forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            <span aria-hidden className="surface-glass-shine absolute inset-x-0 top-0 h-1/2 rounded-t-[16px]" />
            <span className="relative">{SESSION_MESSAGES[idx]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 3 — Goal tracking: one goal, a tally of the week, one line ──── */

function MemoryVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";
  // Member's own commitment for the week — 4 of 7 days done, today in progress
  const FILLED = 4;
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const todayIdx = FILLED; // the in-progress mark

  return (
    <div className="absolute inset-0">
      <Image
        src="/card-3-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
          fill
          sizes="(max-width: 768px) 100vw, 1280px"
        />
      <div className="absolute inset-0 bg-gradient-to-b from-paper/65 via-paper/55 to-paper/70" />

      <div className="relative flex h-full items-center justify-center p-5 md:p-6">
        <figure
          className="surface-glass relative w-full max-w-[260px] overflow-hidden rounded-[20px] p-5"
          style={{
            animation: "fadeUp 600ms ease-out 120ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span aria-hidden className="surface-glass-shine absolute inset-x-0 top-0 h-[42%] rounded-t-[20px]" />

          <p className="relative font-serif text-[19px] leading-[1.18] tracking-tight text-ink md:text-[21px]">
            Walk twenty minutes, four days.
          </p>

          {/* Tally row — vertical strokes, no circles */}
          <div className="relative mt-6 flex items-end justify-between">
            {days.map((d, i) => {
              const done = i < FILLED;
              const isToday = i === todayIdx;
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span
                    className={`block w-[3px] origin-bottom rounded-full ${
                      done
                        ? "bg-brand-600"
                        : isToday
                          ? "bg-brand-600/40"
                          : "bg-ink/15"
                    }`}
                    style={{
                      height: done ? 22 : isToday ? 22 : 12,
                      animation: `tallyRise 380ms cubic-bezier(0.34, 1.4, 0.64, 1) ${480 + i * 90}ms forwards`,
                      animationPlayState: playState,
                      transform: "scaleY(0)",
                    }}
                  />
                  <span
                    className={`font-mono text-[11px] font-medium tracking-tight ${
                      isToday ? "text-brand-700" : "text-ink-muted"
                    }`}
                  >
                    {d}
                  </span>
                </div>
              );
            })}
          </div>

          <p
            className="relative mt-5 text-[13px] leading-snug text-ink-soft"
            style={{
              animation: "fadeUp 600ms ease-out 1500ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            Last week she walked four.{" "}
            <span className="text-ink">This week she chose five.</span>
          </p>
        </figure>
      </div>
    </div>
  );
}

/* ── Step 4 — Progress reporting: one big number, a sparkline, one line ─ */

function ReportVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

  // Gentle two-week sparkline — small dip on day 7, recovers higher
  const series = [22, 24, 23, 26, 25, 28, 24, 27, 30, 32, 31, 34, 36, 38];
  const W = 200;
  const H = 34;
  const lo = Math.min(...series);
  const hi = Math.max(...series);
  const stepX = W / (series.length - 1);
  const pathD = series
    .map((v, i) => {
      const x = i * stepX;
      const y = H - ((v - lo) / (hi - lo)) * H;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="absolute inset-0">
      <Image
        src="/card-1-bg.webp"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
          fill
          sizes="(max-width: 768px) 100vw, 1280px"
        />
      <div className="absolute inset-0 bg-gradient-to-b from-paper/65 via-paper/55 to-paper/70" />

      <div className="relative flex h-full items-center justify-center p-5 md:p-6">
        <figure
          className="surface-glass relative w-full max-w-[260px] overflow-hidden rounded-[20px] p-5"
          style={{
            animation: "fadeUp 600ms ease-out 120ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span aria-hidden className="surface-glass-shine absolute inset-x-0 top-0 h-[42%] rounded-t-[20px]" />

          <p className="relative text-[12.5px] font-medium text-ink-soft">
            Two weeks in
          </p>

          <p
            className="relative mt-3 font-serif text-[44px] font-normal leading-none tracking-tight text-brand-700"
            style={{
              animation: "fadeUp 700ms ease-out 380ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            +18%
          </p>
          <p className="relative mt-1.5 text-[13.5px] font-medium text-ink-soft">
            Daily activity
          </p>

          <svg
            viewBox={`0 -3 ${W} ${H + 6}`}
            className="relative mt-5 h-[38px] w-full"
            fill="none"
            aria-hidden
            preserveAspectRatio="none"
          >
            <path
              d={pathD}
              stroke="#E45A1C"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 420,
                strokeDashoffset: 420,
                animation: "oversightLine 1500ms ease-out 700ms forwards",
                animationPlayState: playState,
              }}
            />
          </svg>

          <p
            className="relative mt-4 text-[14px] font-medium leading-snug text-ink-soft"
            style={{
              animation: "fadeUp 600ms ease-out 2000ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            Small wins, holding.
          </p>
        </figure>
      </div>
    </div>
  );
}
