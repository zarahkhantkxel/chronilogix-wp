"use client";

import { useEffect, useState } from "react";

/**
 * PhoneChatMockup — the animated conversational phone from the homepage
 * hero, packaged as a self-contained, drop-in component.
 *
 * Renders the `/new-mobile.svg` phone-in-hand with a live chat overlay
 * that types, holds, and loops on its own timeline (respecting
 * prefers-reduced-motion). The root is `w-full`, so size it from the
 * parent (width or an aspect-ratio box). Mirrors HeroV5's PhoneFrame; kept
 * separate so the delicate hero composition isn't refactored to share it.
 */

type ChatTurn = { who: "member" | "millie"; text: string; time: string };

// The hero's 2am arc: symptom → phenomenon → specific thought → Millie
// names the loop and offers a small piece of perspective.
const CHAT: ChatTurn[] = [
  { who: "member", text: "can't sleep. thoughts keep looping.", time: "02:04" },
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
];

const TYPING_MS = 950;
const MEMBER_DWELL_MS = 1350;
const MILLIE_DWELL_MS = 1850;
const HOLD_MS = 4400;
const EXIT_MS = 600;
const RESET_PAUSE_MS = 520;

type ChatPhase = "idle" | "running" | "typing" | "hold" | "exit";

// Sampled from new-mobile.svg (835×986). Bezel center at 60.66% of the
// canvas; the symmetric outer wrapper (1013/986) places that center at 50%.
const SCREEN_RECT = {
  left: "41.9%",
  top: "8.6%",
  width: "36.7%",
  height: "64.7%",
} as const;

export function PhoneChatMockup({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [typingFor, setTypingFor] = useState<number | null>(null);
  const [phase, setPhase] = useState<ChatPhase>("idle");
  const [reducedMotion, setReducedMotion] = useState(false);

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
      setActiveIndex(CHAT.length - 1);
      setPhase("hold");
      return;
    }
    let cancelled = false;
    let timer: number | undefined;

    const advance = (i: number) => {
      if (cancelled) return;
      if (i >= CHAT.length) {
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

      const msg = CHAT[i];
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
  }, [reducedMotion]);

  const exiting = phase === "exit";

  return (
    <div className={`relative w-full ${className ?? ""}`}>
      <div className="relative" style={{ aspectRatio: "1013 / 986" }}>
        <div
          className="absolute inset-y-0 left-0"
          style={{ width: `${(835 / 1013) * 100}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/new-mobile.svg"
            alt="Chronilogix coaching on a member's phone"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
            style={{
              maskImage:
                "linear-gradient(180deg, #000 0%, #000 55%, rgba(0,0,0,0.92) 65%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.42) 84%, rgba(0,0,0,0.18) 92%, rgba(0,0,0,0.05) 97%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(180deg, #000 0%, #000 55%, rgba(0,0,0,0.92) 65%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.42) 84%, rgba(0,0,0,0.18) 92%, rgba(0,0,0,0.05) 97%, transparent 100%)",
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
            <ScreenAvatar />

            <div
              className="absolute inset-x-[5%] top-[27%] bottom-[26%] flex flex-col justify-end gap-[5px] md:gap-[7px] lg:gap-[8px]"
              style={{
                maskImage:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 8%, #000 22%, #000 100%)",
                WebkitMaskImage:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 8%, #000 22%, #000 100%)",
              }}
            >
              {CHAT.map((turn, i) => (
                <ChatMessage
                  key={i}
                  turn={turn}
                  visible={i <= activeIndex && !exiting}
                  exiting={exiting}
                />
              ))}
              {typingFor !== null && !exiting ? <TypingBubble /> : null}
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
      <span
        aria-hidden
        className="block h-[7px] w-[4px] flex-none md:h-[10px] md:w-[6.5px] lg:h-[11px] lg:w-[7px]"
      />
    </div>
  );
}

function ScreenAvatar() {
  return (
    <div className="absolute inset-x-0 top-[13%] flex justify-center">
      <div className="relative h-[22px] w-[22px] md:h-[28px] md:w-[28px] lg:h-[32px] lg:w-[32px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/millie.png"
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

// Millie's "composing" indicator — three dots pulsing, shown while she types.
function TypingBubble() {
  return (
    <div className="flex w-full flex-col items-start gap-[1px] text-left">
      <span className="text-[6px] font-bold leading-none text-[#111827] md:text-[7.5px] lg:text-[8.5px]">
        Millie
      </span>
      <span className="inline-flex items-center gap-[2px] py-[1px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden
            className="block h-[3px] w-[3px] rounded-full bg-[#C9CDD4] md:h-[3.5px] md:w-[3.5px]"
            style={{
              animation: `loaderDot 1000ms ease-in-out ${i * 160}ms infinite`,
            }}
          />
        ))}
      </span>
    </div>
  );
}
