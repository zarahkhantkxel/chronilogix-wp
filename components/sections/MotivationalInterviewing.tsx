"use client";

import { useEffect, useRef, useState } from "react";
import { AIOrb } from "@/components/AIOrb";

/**
 * MotivationalInterviewing — V2 dedicated section for The Method.
 *
 * Lives directly below StatementV2 on the V2 homepage. The "Learn more
 * about MI" pill + modal that used to anchor Statement have been replaced
 * by this full section so MI reads as proof structure, not a footnote.
 *
 * Visual shape is intentionally **identical** to SessionWalkthrough — the
 * canonical "How a Chronilogix session works" 4-card grid. Eyebrow → h2
 * → intro paragraph → CTA → 4-card grid → quiet proof paragraph. No
 * bespoke chrome on the cards (no ordinal numbers, no skill-tag chips)
 * so the section reads as a sibling of the session walkthrough rather
 * than an alternate pattern. The four cards are the four MI processes
 * in order: Engage → Focus → Evoke → Plan. OARS micro-skills are named
 * inside the relevant card description rather than broken out as a
 * separate strip — the description does the explanatory work that a
 * label chip otherwise would.
 *
 * Closes with the proof + bridge paragraph that ties MI to Chronilogix
 * as the architectural layer underneath every conversation.
 */

const STEPS = [
  {
    label: "Engage",
    title:
      "The conversation opens without judgment or agenda. Chronilogix earns the right to coach by listening first — open questions and small affirmations, in the member's own language.",
    Visual: EngageVisual,
    Icon: HandshakeIcon,
  },
  {
    label: "Focus",
    title:
      "Together with the member, the coach narrows toward what actually matters right now. Short summaries keep the conversation honest — the change the member wants, not the one we wish they wanted.",
    Visual: FocusVisual,
    Icon: TargetIcon,
  },
  {
    label: "Evoke",
    title:
      "Reflective listening — the workhorse of MI. Chronilogix offers back a precise, sometimes deepened version of what the member just said, so they hear their own thinking out loud and motivation moves from outside in to inside out.",
    Visual: EvokeVisual,
    Icon: WaveIcon,
  },
  {
    label: "Plan",
    title:
      "When readiness arrives, the coach helps translate intent into a specific, reachable next step — chosen by the member, never prescribed by the platform.",
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

export function MotivationalInterviewing() {
  return (
    <section
      id="motivational-interviewing"
      className="relative rounded-[28px] bg-paper-warm pt-24 pb-24 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40"
    >
      <div className="container-page">
        {/* Header — same rhythm as Solution → SessionWalkthrough on V1:
            eyebrow → one-sentence h2 → single intro paragraph. The
            heading mirrors the reference shape ("…designed for how
            people actually change."); the paragraph carries the full
            mechanic load — who the expert is, who Dr. Resnicow is, the
            four processes named in order, OARS folded in as "four
            micro-skills", reflective listening flagged as the workhorse,
            and why MI fits long-arc behavioral / chronic care. */}
        <div className="max-w-5xl">
          <p className="eyebrow-muted">The method</p>
          <h2
            className="mt-3 max-w-4xl text-section font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Motivational Interviewing, designed for how people actually change.
          </h2>
          <p className="mt-5 max-w-[72ch] body-quiet md:mt-6">
            The member, not the coach, is the expert on their own life. MI
            doesn&rsquo;t install motivation — it draws it out. Developed by
            Miller &amp; Rollnick and refined across decades by{" "}
            <span className="text-ink">Dr. Ken Resnicow</span>,
            Chronilogix&rsquo;s Chief Science Officer, the method moves
            through four processes —{" "}
            <span className="text-ink">engage, focus, evoke, plan</span> —
            using four micro-skills called{" "}
            <span className="text-ink">OARS</span>: open questions,
            affirmations, reflective listening, summaries. Reflective
            listening is the workhorse. It&rsquo;s exactly why MI fits the
            long arc of mental health and chronic care, where every
            meaningful change has to come from the person living it.
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

        {/* Proof + bridge — exactly the two-sentence line the spec calls
            for. Quiet, single beat. No architectural-layer follow-up here;
            that story belongs on the white-paper page the CTA opens. */}
        <p className="mt-16 max-w-3xl font-serif text-row font-normal leading-[1.2] text-ink md:mt-20">
          Proven across more than 200 randomized controlled trials.
          Engineered into every Chronilogix conversation.
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

/* ── Step 1 — Engage: an open question opens the conversation ───────────── */

function EngageVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-1-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-paper/65 via-paper/55 to-paper/70" />

      <div className="relative flex h-full items-center justify-center p-5 md:p-6">
        <figure
          className="surface-glass relative w-full max-w-[252px] overflow-hidden rounded-[18px] p-4"
          style={{
            animation: "fadeUp 600ms ease-out 120ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span aria-hidden className="surface-glass-shine absolute inset-x-0 top-0 h-1/2 rounded-t-[18px]" />

          <div className="relative flex items-center gap-2">
            <AIOrb size={16} />
            <p className="text-[12.5px] font-medium text-ink">Opening</p>
          </div>

          <p
            className="relative mt-3 font-serif text-[18px] leading-[1.25] tracking-tight text-ink md:text-[19px]"
            style={{
              animation: "fadeUp 700ms ease-out 480ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            What would you most like today&rsquo;s conversation to be about?
          </p>
        </figure>
      </div>
    </div>
  );
}

/* ── Step 2 — Focus: narrow toward what matters most to the member ─────── */

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
        src="/pattern.png"
        alt=""
        className="absolute left-0 top-0 h-full w-auto max-w-none scale-110 select-none blur-md"
        draggable={false}
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
          <p className="text-[12.5px] font-medium text-ink">What matters now</p>

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

/* ── Step 3 — Evoke: reflective listening, the workhorse ────────────────── */

function EvokeVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-3-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-paper/65 via-paper/55 to-paper/70" />

      <div className="relative flex h-full flex-col justify-center gap-3 p-5 md:p-6">
        {/* Member — short, honest line in the member's own words */}
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

        {/* Chronilogix — reflective listening: deepens, doesn't paraphrase */}
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

/* ── Step 4 — Plan: a small, member-chosen next step ────────────────────── */

function PlanVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-1-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
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

          <p className="relative text-[12.5px] font-medium text-ink-soft">
            Their next step
          </p>

          <p
            className="relative mt-3 font-serif text-[19px] leading-[1.22] tracking-tight text-ink md:text-[20px]"
            style={{
              animation: "fadeUp 700ms ease-out 480ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            Text Smith one honest line before bed tomorrow.
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
