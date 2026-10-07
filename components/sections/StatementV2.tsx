"use client";

import Image from "next/image";

// V2 — merged Section 2.
//
// Previously two separate sections sat between the hero and Solution:
//   (1) Statement: scroll-driven 3-sentence reveal + phone mockup + 3
//       orbit cards (Clinically grounded / Whole-person aware / Always
//       supportive).
//   (2) MotivationalInterviewing: full MI deep-dive — heading, body,
//       CTA, 4-card process grid (Engage / Focus / Evoke / Plan), proof.
//
// V2 collapses both into this one section. The phone has moved up into
// HeroV2 (it now hosts the looping Millie chat), so this section drops
// the phone mockup and the 3 cards that used to orbit it. The remaining
// content beat is:
//
//   Eyebrow:       Built on Motivational Interviewing
//   Heading:       MI, designed for how people actually change.
//   Body:          Member is the expert. Resnicow as architect.
//                  Four processes, four micro-skills (OARS), reflective
//                  listening as the workhorse. Why it fits chronic care.
//   CTA:           Read the full white paper
//   4-card grid:   Engage → Focus → Evoke → Plan (canonical
//                  SessionWalkthrough chrome — sibling of the "How a
//                  Chronilogix session works" block in Solution below).
//   Proof line:    Proven across 200+ RCTs. Engineered into every
//                  Chronilogix conversation.

import { useEffect, useRef, useState } from "react";
import { AIOrb } from "@/components/AIOrb";

const STEPS = [
  {
    label: "Engage",
    title:
      "Build partnership. Chronilogix earns the right to coach by listening first — open questions and small affirmations in the member's own language, before any agenda. Skip this and everything after feels brittle.",
    Visual: EngageVisual,
    Icon: HandshakeIcon,
  },
  {
    label: "Focus",
    title:
      "Find what matters now. Short summaries keep the conversation honest — the change the member wants, not the one we wish they wanted.",
    Visual: FocusVisual,
    Icon: TargetIcon,
  },
  {
    label: "Evoke",
    title:
      "Draw the motivation out. Reflective listening — MI's workhorse — offers back a precise, sometimes deepened version of what the member just said, so they hear their own thinking out loud. The more change talk, the more change.",
    Visual: EvokeVisual,
    Icon: WaveIcon,
  },
  {
    label: "Plan",
    title:
      "Translate intent into a next step — small, specific, chosen by the member, never prescribed. Planning is earned, not forced.",
    Visual: PlanVisual,
    Icon: CheckCircleIcon,
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

export function StatementV2() {
  return (
    <section
      id="statement"
      className="relative rounded-[28px] bg-white pt-24 pb-24 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40"
    >
      <div className="container-page">
        {/* Header — narrative continuation of the hero.
            The hero established who built MI (Dr. Resnicow's life's
            work). This section answers the natural next question: "so
            what is MI?" The heading carries the question; the body
            delivers the answer in five short sentences, with key terms
            (draws motivation out, engage/focus/evoke/plan, OARS,
            workhorse) anchored to text-ink so the eye can scan for the
            structure without losing the prose voice. Width capped at
            ~60ch so each line breaks at ~12 words — sentence-by-sentence
            rhythm rather than a wall of paragraph. */}
        <div className="max-w-5xl">
          <p className="eyebrow-muted">What is Motivational Interviewing</p>
          <h2
            className="mt-3 max-w-4xl text-section font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Most chatbots ask, answer, sell, dispense. People don&rsquo;t
            change like that — Motivational Interviewing is how they do.
          </h2>
          <p className="mt-5 max-w-[78ch] body-quiet md:mt-6">
            Developed by Miller and Rollnick in the early 1980s, MI is a
            collaborative way of speaking that{" "}
            <span className="text-ink">draws motivation out</span> — never
            installs it. It moves through four processes —{" "}
            <span className="text-ink">engage, focus, evoke, plan</span> —
            and four micro-skills called{" "}
            <span className="text-ink">OARS</span>: open questions,
            affirmations, reflective listening, summaries. Reflective
            listening is the workhorse. The density of a member&rsquo;s own{" "}
            <span className="text-ink">change talk</span> is the strongest
            predictor of whether behavior actually shifts.
          </p>

          {/* TODO: dedicated MI white-paper / methodology page URL */}
          <a
            href="#motivational-interviewing-paper"
            className="btn-primary group/mi-cta mt-8 md:mt-9"
          >
            Read the full white paper
            <Arrow />
          </a>
        </div>

        {/* 4-stage grid — identical chrome to SessionWalkthrough's step
            cards. Each card maps to one of MI's four processes, with the
            relevant OARS skill named inside the description. */}
        <div className="mt-12 grid gap-6 md:mt-14 md:grid-cols-2 md:gap-7 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((s) => (
            <StepCard key={s.label} step={s} />
          ))}
        </div>

        {/* Proof + bridge. Single quiet line. */}
        <p className="mt-16 max-w-3xl font-serif text-row font-normal leading-[1.2] text-ink md:mt-20">
          Proven across more than 200 randomized controlled trials.
          Delivered faithfully not by clever prompting — by architecture.
        </p>
      </div>
    </section>
  );
}

function StepCard({
  step,
}: {
  step: {
    label: string;
    title: string;
    Visual: React.ComponentType<{ active: boolean }>;
    Icon: React.ComponentType<{ className?: string }>;
  };
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
          <p>{step.title}</p>
        </div>
      </div>
    </article>
  );
}

/* ── Step 1 — Engage ────────────────────────────────────────────────────── */

function EngageVisual({ active }: { active: boolean }) {
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

      <div className="relative flex h-full flex-col justify-center gap-3 p-5 md:p-6">
        {/* Bot opens — no agenda, makes space.
            Mirrors Evoke's bot-left/member-right convention so the four
            cards read as frames from one session. */}
        <div
          className="relative flex max-w-[88%] items-start gap-2 self-start"
          style={{
            animation: "fadeUp 600ms ease-out 200ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span className="mt-1.5"><AIOrb size={18} /></span>
          <div className="surface-glass relative overflow-hidden rounded-[16px] rounded-bl-[6px] px-4 py-3 text-[13.5px] leading-snug text-ink">
            <span aria-hidden className="surface-glass-shine absolute inset-x-0 top-0 h-1/2 rounded-t-[16px]" />
            <span className="relative">
              Mind if we just talk for a minute? Whatever&rsquo;s on your mind.
            </span>
          </div>
        </div>

        {/* Maria tentatively starts. Italic mirrors the inbound style in
            Evoke so the same voice carries across the section. */}
        <div
          className="surface-glass-inner relative max-w-[78%] self-end overflow-hidden rounded-[16px] rounded-br-[6px] px-4 py-3 font-serif text-[13.5px] italic leading-snug text-ink"
          style={{
            animation: "fadeUp 600ms ease-out 900ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          just had a long week.
        </div>
      </div>
    </div>
  );
}

/* ── Step 2 — Focus ─────────────────────────────────────────────────────── */

const FOCUS_TOPICS = [
  { label: "Sleep", chosen: false },
  { label: "Energy at work", chosen: false },
  { label: "Relationship with Smith", chosen: true },
  { label: "Eating habits", chosen: false },
  { label: "Medication routine", chosen: false },
];

function FocusVisual({ active }: { active: boolean }) {
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

      <div className="relative flex h-full items-center justify-center p-5 md:p-6">
        <figure
          className="relative w-full max-w-[252px] rounded-[18px] bg-white/95 p-4 shadow-[0_18px_40px_-14px_rgba(40,25,15,0.22),0_2px_8px_-2px_rgba(40,25,15,0.08)] ring-1 ring-ink/[0.04]"
          style={{
            animation: "fadeUp 600ms ease-out 120ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.08em] text-ink-muted">
            Maria · today
          </p>
          <p className="mt-1 text-[12.5px] font-medium text-ink">
            What she could bring
          </p>

          <ul className="mt-3 space-y-[7px]">
            {FOCUS_TOPICS.map((t, i) => (
              <li
                key={t.label}
                className={`flex items-center gap-2 rounded-md px-2 py-1 text-[12.5px] leading-snug ${
                  t.chosen ? "bg-brand-50 text-ink" : "text-ink-muted"
                }`}
                style={{
                  animation: `fadeUp 360ms ease-out ${360 + i * 110}ms forwards`,
                  animationPlayState: playState,
                  opacity: 0,
                }}
              >
                <span
                  aria-hidden
                  className={`inline-block h-[6px] w-[6px] shrink-0 rounded-full ${
                    t.chosen ? "bg-brand-600" : "bg-ink/20"
                  }`}
                />
                <span className={t.chosen ? "font-medium" : ""}>{t.label}</span>
              </li>
            ))}
          </ul>
        </figure>
      </div>
    </div>
  );
}

/* ── Step 3 — Evoke ─────────────────────────────────────────────────────── */

function EvokeVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

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

      <div className="relative flex h-full flex-col justify-center gap-3 p-5 md:p-6">
        <div
          className="surface-glass-inner relative max-w-[82%] self-end overflow-hidden rounded-[16px] rounded-br-[6px] px-4 py-3 font-serif text-[13.5px] italic leading-snug text-ink"
          style={{
            animation: "fadeUp 600ms ease-out 200ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          i feel invisible in it.
        </div>

        <div
          className="relative flex max-w-[88%] items-start gap-2 self-start"
          style={{
            animation: "fadeUp 600ms ease-out 900ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span className="mt-1.5"><AIOrb size={18} /></span>
          <div className="surface-glass relative overflow-hidden rounded-[16px] rounded-bl-[6px] px-4 py-3 text-[13.5px] leading-snug text-ink">
            <span aria-hidden className="surface-glass-shine absolute inset-x-0 top-0 h-1/2 rounded-t-[16px]" />
            <span className="relative">
              Invisible to someone you&rsquo;re still showing up for — that&rsquo;s
              its own kind of lonely.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 4 — Plan ──────────────────────────────────────────────────────── */

function PlanVisual({ active }: { active: boolean }) {
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
        <figure
          className="surface-glass relative w-full max-w-[252px] overflow-hidden rounded-[18px] p-5"
          style={{
            animation: "fadeUp 600ms ease-out 120ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span aria-hidden className="surface-glass-shine absolute inset-x-0 top-0 h-[42%] rounded-t-[18px]" />

          <p className="relative text-[10px] uppercase tracking-[0.08em] text-ink-muted">
            Maria · tomorrow night
          </p>
          <p className="relative mt-1 text-[12.5px] font-medium text-ink">
            Her next step
          </p>

          <p
            className="relative mt-3 font-serif text-[19px] leading-[1.22] tracking-tight text-ink md:text-[20px]"
            style={{
              animation: "fadeUp 700ms ease-out 480ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            Text Smith one honest line before bed.
          </p>

          <div
            className="relative mt-5 flex items-center gap-2 text-[12.5px] text-ink-soft"
            style={{
              animation: "fadeUp 500ms ease-out 1200ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            <span
              aria-hidden
              className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-brand-600/15 text-brand-700"
            >
              <svg
                className="h-[9px] w-[9px]"
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
            <span>Chosen by Maria, not prescribed.</span>
          </div>
        </figure>
      </div>
    </div>
  );
}

/* ── Icons ──────────────────────────────────────────────────────────────── */

function HandshakeIcon({ className }: { className?: string }) {
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
      <path d="M2.5 10.5 6 7l2 1.5 2-2 3.5 3.5" />
      <path d="M5.5 13.5 9 10l3 3" />
      <path d="M15.5 7.5 12 11" />
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

function WaveIcon({ className }: { className?: string }) {
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
      <path d="M2 9c1.5-2.5 3-2.5 4.5 0S9.5 11.5 11 9s3-2.5 4.5 0" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
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
      <path d="M5.8 9.2 8 11.4 12.4 6.8" />
    </svg>
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
