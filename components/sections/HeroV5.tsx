"use client";

import { useEffect, useMemo, useState } from "react";
import { DEMO_BOOKING_URL } from "@/site.config";

// V5 Hero — V2's three-band composition, but the static phone is
// replaced with the animated chat-on-mobile from earlier V5 iterations.
//
// Stacking (back to front):
//   z-0   Phone band (image + animated chat overlay)
//   z-10  White blurred rectangle — "fog" beneath the hand, dissolves
//         the lower portion of the phone into the white background
//   z-20  Text row (eyebrow + headline + CTA on left; Resnicow caption
//         + stats on right) — crisp, floats on the fog

// A four-turn 2am arc: symptom → phenomenon → specific thought → Millie
// names the thought AS the loop and offers a small piece of perspective
// (the closing beat that turns rumination into observation). MI stays
// strict: affirm, open question, then a complex reflection that ties the
// specific thought back to the opener and quietly normalizes the hour.
// Member lines stay lowercase + casual; Millie's replies do the careful
// clinical work.
type ChatTurn = { who: "member" | "millie"; text: string; time: string };

const TYPING_MS = 950;
const MEMBER_DWELL_MS = 1350;
const MILLIE_DWELL_MS = 1850;
const HOLD_MS = 4400;
const EXIT_MS = 600;
const RESET_PAUSE_MS = 520;

const REVEAL_DURATION_MS = 2400;

type ChatPhase = "idle" | "running" | "typing" | "hold" | "exit";

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty.
export type HeroV5Content = {
  headingLead?: string;
  headingHighlight1?: string;
  headingHighlight2?: string;
  headingItalic?: string;
  headingTail?: string;
  subtextLead?: string;
  subtextName?: string;
  subtextEmphasis?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  phoneImage?: string;
  avatarImage?: string;
  stats?: { value: string; label: string }[];
  chat?: ChatTurn[];
};

const DEFAULTS = {
  headingLead: "Filling the gaps in",
  headingHighlight1: "mental health",
  headingHighlight2: "chronic care",
  headingItalic: "through AI coaching agents.",
  headingTail: "24/7",
  subtextLead: "Built on the life’s work of world renowned",
  subtextName: "Dr. Ken Resnicow",
  subtextEmphasis: "Motivational Interviewing",
  ctaLabel: "Book a Demo",
  ctaUrl: DEMO_BOOKING_URL,
  phoneImage: "/new-mobile.svg",
  avatarImage: "/millie.png",
  stats: [
    { value: "30+", label: "years of MI research" },
    { value: "70+", label: "clinical studies" },
    { value: "400+", label: "peer reviewed publications" },
  ],
  chat: [
    {
      who: "member",
      text: "can't sleep. thoughts keep looping.",
      time: "02:04",
    },
    {
      who: "millie",
      text: "That sounds exhausting. What's the loudest thought right now?",
      time: "02:04",
    },
    { who: "member", text: "that i'm falling behind.", time: "02:05" },
    {
      who: "millie",
      text: "You've been carrying a heavy weight, and feeling left behind is keeping your mind from settling. When thoughts cycle like this at night, what's helped you get traction before?",
      time: "02:05",
    },
  ],
} satisfies Required<HeroV5Content>;

export function HeroV5({ content }: { content?: HeroV5Content }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const chat = useMemo(
    () => (content?.chat?.length ? content.chat : DEFAULTS.chat),
    [content],
  );
  const stats = content?.stats?.length ? content.stats : DEFAULTS.stats;
  const [activeIndex, setActiveIndex] = useState(-1);
  const [typingFor, setTypingFor] = useState<number | null>(null);
  const [phase, setPhase] = useState<ChatPhase>("idle");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const on = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setRevealProgress(1);
      return;
    }
    let rafId = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / REVEAL_DURATION_MS, 1);
      setRevealProgress(t);
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  // Conversation timeline — each Millie reply is preceded by a typing
  // indicator so the rhythm feels like a real coach composing a reply.
  useEffect(() => {
    if (reducedMotion) {
      setActiveIndex(chat.length - 1);
      setPhase("hold");
      return;
    }
    let cancelled = false;
    let timer: number | undefined;

    const advance = (i: number) => {
      if (cancelled) return;
      if (i >= chat.length) {
        setPhase("hold");
        timer = window.setTimeout(() => {
          if (cancelled) return;
          setPhase("exit");
          timer = window.setTimeout(() => {
            if (cancelled) return;
            setActiveIndex(-1);
            setTypingFor(null);
            setPhase("idle");
            timer = window.setTimeout(() => advance(0), RESET_PAUSE_MS);
          }, EXIT_MS);
        }, HOLD_MS);
        return;
      }

      const msg = chat[i];
      if (msg.who === "millie") {
        setTypingFor(i);
        setPhase("typing");
        timer = window.setTimeout(() => {
          if (cancelled) return;
          setTypingFor(null);
          setActiveIndex(i);
          setPhase("running");
          timer = window.setTimeout(() => advance(i + 1), MILLIE_DWELL_MS);
        }, TYPING_MS);
      } else {
        setActiveIndex(i);
        setPhase("running");
        timer = window.setTimeout(() => advance(i + 1), MEMBER_DWELL_MS);
      }
    };

    timer = window.setTimeout(() => advance(0), 400);
    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [reducedMotion, chat]);

  const eased = easeOutCubic(revealProgress);
  // Fog lays down first; phone reveals through it; text follows. Same
  // pacing relationship as V2 so the hero reads as one composed
  // moment, not three independent fades.
  const fogFade = clamp01(eased / 0.32);
  const phoneFade = clamp01((eased - 0.22) / 0.55);
  const textFade = clamp01((eased - 0.4) / 0.55);

  return (
    <section
      id="hero"
      aria-label="Chronilogix, AI coaching for mental health and chronic care"
      // Fixed viewport height so the composition always reads as a
      // full-screen hero. Mobile min-h is dropped (was 660px) so short
      // portrait viewports (iPhone SE 1st gen ~568px) and any landscape
      // phone still fit within one viewport instead of clipping the CTA
      // under `overflow-hidden`. Desktop keeps the 660px floor so the
      // 3-band composition doesn't collapse on tiny windows.
      className="relative flex flex-col overflow-hidden rounded-t-[28px] md:min-h-[660px]"
      style={{
        height: "min(100svh - 1.5rem, 1000px)",
        // Soft creamy ground tone — warmer than white, lets the
        // dissolved hand and the ambient halos read as part of the
        // same warm-paper page. Matches Tailwind's `paper.warm` token
        // so neighbouring sections that use bg-paper-warm sit flush.
        backgroundColor: "#FBF8F4",
      }}
    >
      {/* Ambient backdrop. A low-saturation meadow photo was previously
          painted in here at low opacity for "paper texture", but the
          photo's horizon is a full-width tonal step that no amount of
          blur removes (blur only softens the transition, the step
          remains) — it read as a faint line beside the headline where
          the radial mask revealed the periphery. The cream fill
          (bg-color) plus the radial cream wash below already carry the
          warm ground, so the photo is dropped entirely rather than
          fought. */}
      {/* Cream wash to keep the centre area soft — ensures the phone
          and headline read on uniform paper, never on photographic
          texture. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 65% at 50% 55%, rgba(251,248,244,0.85) 0%, rgba(251,248,244,0.35) 50%, rgba(251,248,244,0) 80%)",
        }}
      />

      {/* ── Desktop: 3-column composition ───────────────────────────
          Heading flanks the phone on the left; subtext + CTA + stats
          flank on the right. Phone in the centre claims a wider
          column so it reads as the hero visual rather than a side
          prop. Below `lg` we stack: heading → phone → subtext. */}
      <div className="container-page relative z-20 flex h-full w-full flex-col min-[900px]:grid min-[900px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1.1fr)_minmax(0,1.15fr)] min-[900px]:items-center min-[900px]:gap-10 lg:gap-20 min-[900px]:py-0 xl:gap-28">

        {/* Left — Heading. Sits high in the desktop column so it
            shoulders the phone from above; on smaller viewports flows
            in normal column order. Mobile top padding trimmed so short
            viewports (iPhone SE portrait) leave enough middle-band
            space for the phone to render at usable size. */}
        <div
          className="relative z-20 flex-none pt-24 sm:pt-24 md:pt-28 min-[900px]:self-start min-[900px]:pt-28 lg:pt-36 xl:pt-44"
          style={{
            opacity: textFade,
            transform: `translateY(${(1 - textFade) * 10}px)`,
            willChange: "opacity, transform",
          }}
        >
          <div className="flex w-full flex-col items-center text-center min-[900px]:items-start min-[900px]:text-left">
            <h1
              className="max-w-[20ch] font-serif font-normal leading-[1.06] tracking-[-0.022em] text-ink text-[1.875rem] sm:text-[2.25rem] md:text-[2.75rem] min-[900px]:text-[2.1rem] lg:text-[2.5rem] xl:text-[2.875rem]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.headingLead}{" "}
              <span className="text-brand">{c.headingHighlight1}</span> and{" "}
              <span className="text-brand">{c.headingHighlight2}</span>{" "}
              <span className="italic text-ink-soft">
                {c.headingItalic}
              </span>{" "}
              {c.headingTail}
            </h1>
          </div>
        </div>

        {/* Centre — Phone. Anchored to the section's bottom edge so
            the hand reaches the viewport floor and reads as held up
            from below. Phone height is capped well under section
            height so it doesn't dominate the composition. min-h floor
            keeps the phone at a legible size on short viewports where
            the flex-1 middle band would otherwise get crushed. */}
        <div
          className="relative z-0 flex w-full flex-1 items-center justify-center pt-3 md:pt-4 min-[900px]:items-end min-[900px]:self-stretch min-[900px]:pt-0"
          style={{ minHeight: 200 }}
        >
          {/* Stacked (below 900px): the phone is centred in the tall middle
              band so the space above and below reads as equal, and grows to
              fill that band — capped at the band width so it never overflows
              on narrow phones. Desktop keeps the bottom-anchored 76% rise. */}
          <div
            style={{
              opacity: phoneFade,
              transform: `translateY(${(1 - phoneFade) * 14}px)`,
              willChange: "opacity, transform",
            }}
            className="aspect-[1013/986] h-full max-h-[96%] w-auto max-w-full sm:max-h-[94%] min-[900px]:h-[76%] min-[900px]:max-h-none min-[900px]:w-auto min-[900px]:max-w-none"
          >
            <PhoneFrame
              phase={phase}
              activeIndex={activeIndex}
              typingFor={typingFor}
              chat={chat}
              phoneSrc={c.phoneImage}
              avatarSrc={c.avatarImage}
            />
          </div>
        </div>

        {/* Right — Subtext + CTA + stats. Bottom-aligned at desktop so
            it sits opposite the headline's high anchor across the
            phone, giving the composition a diagonal read. Each child
            is a quiet beat: Resnicow attribution → CTA → stat pills. */}
        <div
          className="relative z-20 flex-none pb-8 md:pb-10 min-[900px]:self-end min-[900px]:pb-16 lg:pb-28 xl:pb-32"
          style={{
            opacity: textFade,
            transform: `translateY(${(1 - textFade) * 12}px)`,
            willChange: "opacity, transform",
          }}
        >
          <div className="flex w-full flex-col items-center text-center min-[900px]:items-start min-[900px]:text-left">
            <p
              className="max-w-[36ch] font-serif font-normal italic leading-[1.32] tracking-[-0.01em] text-ink text-base md:text-lg"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.subtextLead}{" "}
              <em className="whitespace-nowrap not-italic font-medium">
                {c.subtextName}
              </em>
              , in{" "}
              <strong className="not-italic font-semibold text-ink">
                {c.subtextEmphasis}
              </strong>
              .
            </p>

            <a
              href={c.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/herocta btn-primary mt-5 md:mt-6"
            >
              {c.ctaLabel}
              <Arrow />
            </a>

            <dl className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[12px] text-ink-muted md:mt-5 md:gap-2 md:text-[11px] min-[900px]:justify-start min-[900px]:text-[11.5px]">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/8 bg-white/70 px-3 py-1.5 backdrop-blur-sm md:px-3 md:py-1"
                >
                  <dt className="font-medium leading-none text-ink">
                    {stat.value}
                  </dt>
                  <dd className="leading-none">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* ── Fog (ambient halo, supplementary) ───────────────────────
          The hand dissolves into the cream page via the mask on the
          phone <img>; these halos tint that seam slightly warmer so
          the dissolve reads as light pooling on warm paper, not a
          stark fade to white. Cream rgba mirrors `paper.warm`. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 z-10 hidden h-[16svh] min-[900px]:block"
        style={{
          bottom: "8svh",
          background:
            "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(251,248,244,0.75) 0%, rgba(251,248,244,0) 70%)",
          filter: "blur(40px)",
          WebkitFilter: "blur(40px)",
          opacity: fogFade * 0.7,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-10%] z-10 h-[20svh] min-[900px]:hidden"
        style={{
          bottom: "12svh",
          background:
            "radial-gradient(ellipse 70% 100% at 50% 50%, rgba(251,248,244,0.88) 0%, rgba(251,248,244,0) 75%)",
          filter: "blur(36px)",
          WebkitFilter: "blur(36px)",
          opacity: fogFade * 0.75,
        }}
      />
    </section>
  );
}

// ─── Phone with overlaid animated chat ──────────────────────────────
// Sampled from new-mobile.svg (835×986). Bezel center at 60.66% of
// the canvas; symmetric outer wrapper 1013/986 places that center at
// 50% of the wrapper. Inner image-box is 82.4% of the outer, left-
// aligned. Image and overlay share the inner box so they translate
// together across viewports.

const SCREEN_RECT = {
  left: "41.9%",
  top: "8.6%",
  width: "36.7%",
  height: "64.7%",
} as const;

function PhoneFrame({
  phase,
  activeIndex,
  typingFor,
  chat,
  phoneSrc,
  avatarSrc,
}: {
  phase: ChatPhase;
  activeIndex: number;
  typingFor: number | null;
  chat: ChatTurn[];
  phoneSrc: string;
  avatarSrc: string;
}) {
  const exiting = phase === "exit";
  return (
    <div className="relative w-full">
      <div className="relative" style={{ aspectRatio: "1013 / 986" }}>
        <div
          className="absolute inset-y-0 left-0"
          style={{ width: `${(835 / 1013) * 100}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={phoneSrc}
            alt="Chronilogix coaching on a member's phone"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
            style={{
              // Top edge is feathered over the first ~2.6%: the source SVG's
              // backdrop rect is very slightly rotated, so its top edge
              // rendered as a faint angled line above the phone (the phone
              // bezel itself doesn't start until ~4.2%, so this feather
              // clears the artifact without touching the device).
              // Bottom of the image dissolves into the cream page so
              // the hand + arm visibly merge with the background rather
              // than ending at a rectangular edge. The fade starts just
              // below the phone screen (~58%) and runs the full bottom
              // half of the image — by the time the eye reaches the
              // section floor, the arm has fully dissolved into paper.
              maskImage:
                "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.35) 1.4%, #000 2.6%, #000 55%, rgba(0,0,0,0.92) 65%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.42) 84%, rgba(0,0,0,0.18) 92%, rgba(0,0,0,0.05) 97%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.35) 1.4%, #000 2.6%, #000 55%, rgba(0,0,0,0.92) 65%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.42) 84%, rgba(0,0,0,0.18) 92%, rgba(0,0,0,0.05) 97%, transparent 100%)",
            }}
          />

          <div
            className="absolute overflow-hidden bg-white"
            style={{
              ...SCREEN_RECT,
              maskImage: "url('/mobile.svg')",
              WebkitMaskImage: "url('/mobile.svg')",
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
          >
            <ScreenChrome />
            <ScreenAvatar src={avatarSrc} />

            <div
              className="absolute inset-x-[5%] top-[27%] bottom-[26%] flex flex-col justify-end gap-[5px] md:gap-[7px] lg:gap-[8px]"
              style={{
                maskImage:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 8%, #000 22%, #000 100%)",
                WebkitMaskImage:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 8%, #000 22%, #000 100%)",
              }}
            >
              {chat.map((turn, i) => (
                <ChatMessage
                  key={i}
                  turn={turn}
                  visible={i <= activeIndex && !exiting}
                  exiting={exiting}
                />
              ))}
            </div>

            <ScreenBottomBar />
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenChrome() {
  return (
    <div className="absolute inset-x-0 top-0 flex h-[12%] items-center justify-between px-[5%]">
      <svg
        viewBox="0 0 8 14"
        className="h-[7px] w-[4px] flex-none text-ink md:h-[10px] md:w-[6.5px] lg:h-[11px] lg:w-[7px]"
        aria-hidden
        fill="none"
      >
        <path
          d="M6 1 1 7l5 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex min-w-0 flex-1 flex-col items-center px-1">
        <div className="whitespace-nowrap text-[6.5px] font-bold tracking-[-0.005em] text-ink md:text-[9px] lg:text-[10px]">
          <span className="md:hidden">Check-in</span>
          <span className="hidden md:inline">Mental Health Check-in</span>
        </div>
        <div className="mt-[1px] whitespace-nowrap text-[5px] text-[#9CA3AF] md:text-[6.5px] lg:text-[7.5px]">
          listening...
        </div>
      </div>
      {/* right-side spacer, matches back-arrow footprint */}
      <span aria-hidden className="block h-[7px] w-[4px] flex-none md:h-[10px] md:w-[6.5px] lg:h-[11px] lg:w-[7px]" />
    </div>
  );
}

function ScreenAvatar({ src }: { src: string }) {
  return (
    <div className="absolute inset-x-0 top-[13%] flex justify-center">
      <div className="relative h-[22px] w-[22px] md:h-[28px] md:w-[28px] lg:h-[32px] lg:w-[32px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          aria-hidden
          draggable={false}
          className="h-full w-full rounded-full object-cover"
        />
        <span
          aria-hidden
          className="absolute -bottom-[1px] -right-[1px] block h-[7px] w-[7px] rounded-full border border-white bg-[#22C55E] md:h-[8px] md:w-[8px] lg:h-[9px] lg:w-[9px]"
        />
      </div>
    </div>
  );
}

function ScreenBottomBar() {
  return (
    <div className="absolute inset-x-0 bottom-0 flex flex-col">
      <div className="relative flex justify-center pb-[2%] pt-[1.5%]">
        <span
          aria-hidden
          className="absolute inset-x-[3%] top-[55%] h-px bg-[#F5F5F5]"
        />
        <div className="relative flex items-center gap-[3px] rounded-full border border-[#F3F4F6] bg-[#F7F7F7] px-[8px] py-[3px] text-[6px] text-[#374151] md:gap-[4px] md:px-[10px] md:py-[4px] md:text-[7.5px] lg:text-[8.5px]">
          See full conversation
          <svg
            viewBox="0 0 10 10"
            className="h-[5px] w-[5px] text-[#9CA3AF] md:h-[6.5px] md:w-[6.5px] lg:h-[7px] lg:w-[7px]"
            fill="none"
            aria-hidden
          >
            <path
              d="M1.5 3.5V1.5h2M8.5 6.5v2h-2M3.5 8.5h-2v-2M6.5 1.5h2v2"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="flex items-center gap-[5px] px-[4.5%] pb-[7%] pt-[2%] md:gap-[6px]">
        <span className="text-[10px] font-light leading-none text-ink md:text-[13px] lg:text-[15px]">
          +
        </span>
        <div className="flex flex-1 items-center gap-[4px] rounded-full bg-[#F2F3F4] px-[8px] py-[5px] md:px-[10px] md:py-[6.5px] lg:py-[7.5px]">
          <span className="flex-1 truncate whitespace-nowrap text-[5.5px] text-[#7C818A] md:text-[7.5px] lg:text-[8.5px]">
            Ask anything
          </span>
          <span
            aria-hidden
            className="inline-flex h-[10px] w-[10px] items-center justify-center rounded-full bg-[#C9CDD4] md:h-[13px] md:w-[13px] lg:h-[14px] lg:w-[14px]"
          >
            <svg
              viewBox="0 0 10 10"
              className="h-[5px] w-[5px] md:h-[6.5px] md:w-[6.5px]"
              fill="none"
            >
              <path
                d="M1.7 5h6.6M5 1.7l3.3 3.3L5 8.3"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <svg
          viewBox="0 0 14 14"
          className="h-[9px] w-[9px] text-ink md:h-[12px] md:w-[12px] lg:h-[13px] lg:w-[13px]"
          fill="none"
          aria-hidden
        >
          <path
            d="M7 1.5a2 2 0 0 0-2 2v3.5a2 2 0 1 0 4 0V3.5a2 2 0 0 0-2-2Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M3.5 6.5a3.5 3.5 0 1 0 7 0M7 10v2"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

function ChatMessage({
  turn,
  visible,
  exiting,
}: {
  turn: ChatTurn;
  visible: boolean;
  exiting: boolean;
}) {
  const isMillie = turn.who === "millie";
  const label = isMillie ? "Millie" : "You";

  return (
    <div
      className={`flex w-full flex-col gap-[1px] ${isMillie ? "items-start text-left" : "items-end text-right"}`}
      style={{
        opacity: exiting ? 0 : visible ? 1 : 0,
        transform: exiting
          ? "translateY(-4px)"
          : visible
            ? "translateY(0)"
            : "translateY(6px)",
        transition:
          "opacity 460ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "opacity, transform",
        height: visible ? "auto" : 0,
        overflow: "hidden",
      }}
    >
      <span className="text-[6px] font-bold leading-none text-[#111827] md:text-[7.5px] lg:text-[8.5px]">
        {label}
      </span>
      <span className="max-w-[88%] text-[6.5px] leading-[1.35] text-[#111827] md:text-[8px] lg:text-[9px]">
        {turn.text}
      </span>
      <span className="text-[4.5px] leading-none text-[#9CA3AF] md:text-[5.5px] lg:text-[6.5px]">
        {turn.time}
      </span>
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

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
