"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { AIOrb } from "@/components/AIOrb";
import { DEMO_BOOKING_URL } from "@/site.config";
// Hidden for now — restore by un-commenting the import and the <HeroPhoneMockup /> render below.
// import { HeroPhoneMockup } from "@/components/HeroPhoneMockup";

const HEADLINE_LINE_1 = "Filling the gaps in mental health and chronic care";
const HEADLINE_LINE_2 = "through AI coaching agents. 24/7";

// 2:04 AM. Maria reaches out first — she can't sleep, the week
// collapsed. The exchange follows MI cadence: open question, reflect
// the member's words back, name what they're feeling, ask a grounded
// safety check, then move into what's underneath. Member lines stay
// lowercase + casual — the rhythm of a real late-night text — while
// Millie's reflections do the careful clinical work.
type ChatTurn = { who: "member" | "roni"; text: string };
type ChatPhase = "idle" | "running" | "exiting" | "resetting";
const CHAT: ChatTurn[] = [
  {
    who: "member",
    text: "cant sleep",
  },
  {
    who: "roni",
    text: "What's going on?",
  },
  {
    who: "member",
    text: "everything just collapsed this week. i've been holding it together for so long",
  },
  {
    who: "roni",
    text: "That sounds like you, Maria, you carry it quietly until you can't. What does “can't hold it together” feel like right now?",
  },
  {
    who: "member",
    text: "like i'm standing still but falling at the same time",
  },
  {
    who: "roni",
    text: "Standing still and falling. Are you safe right now?",
  },
  {
    who: "member",
    text: "yeah. just exhausted. my relationship. i feel invisible in it",
  },
  {
    who: "roni",
    text: "Invisible to someone you're still showing up for, that's its own kind of lonely. What was your last conversation with Smith?",
  },
];

const REVEAL_DURATION_MS = 2400;
const REVEAL_WINDOW_RATIO = 4;

// Chat flow — discrete-step ticker. Every tick a new message enters at
// the bottom slot and every prior message shifts up by one slot. CSS
// transitions handle the in-between motion, so the loop reads as smooth
// scrolling regardless of frame timing (no per-frame JS).
const CHAT_TICK_MS = 1900;            // dwell between message advances
const CHAT_START_DELAY_MS = 80;       // chat opens almost immediately — first bubble rises with the headline
const CHAT_HOLD_END_MS = 9000;        // hold the full conversation in view — long enough to read it all
const CHAT_EXIT_DURATION_MS = 380;    // fast clean fade-out, no theatrics
const CHAT_EXIT_STAGGER_MS = 0;       // all bubbles clear together for a crisp reset
const CHAT_EXIT_LIFT_PX = 0;          // fade in place, no upward drift
const CHAT_LOOP_RESTART_MS = 180;     // minimal beat before the new "Hey" rises from behind the hill
const CHAT_GAP_PX = 12;               // gap between stacked bubbles
const CHAT_RISE_PX = 130;             // entry deep in the opaque hill so the bubble truly emerges from behind it

export function Hero() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const [revealProgress, setRevealProgress] = useState(0);
  // activeIndex = which message is currently the "newest" (bottom slot).
  // -1 means the chat hasn't started yet (all messages pending below the
  // hill line). Wraps past CHAT.length so older messages keep scrolling
  // out before the loop quietly resets.
  const [activeIndex, setActiveIndex] = useState(-1);
  // Phase governs how each bubble's translateY + opacity + transition is
  // computed. 'idle' — pre-cycle, every bubble parked beneath the hill.
  // 'running' — walking through the conversation. 'exiting' — the whole
  // stack drifts up out of frame on a slower curve. 'resetting' — single
  // frame with transitions disabled to snap bubbles back below the hill
  // before the next cycle begins, so there's no visible whiplash.
  const [chatPhase, setChatPhase] = useState<ChatPhase>("idle");
  const [reducedMotion, setReducedMotion] = useState(false);
  // Measured heights of each bubble. Roni messages are 2–4 lines and
  // member messages are 1 line, so we can't use a fixed slot height —
  // each bubble reports its own height via ResizeObserver and the stack
  // positions itself off cumulative heights of the messages below it.
  const [bubbleHeights, setBubbleHeights] = useState<number[]>(() =>
    new Array(CHAT.length).fill(0),
  );
  const reportHeight = useMemo(
    () => (index: number, height: number) =>
      setBubbleHeights((prev) => {
        if (Math.abs((prev[index] ?? 0) - height) < 0.5) return prev;
        const next = prev.slice();
        next[index] = height;
        return next;
      }),
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Mount reveal — drives revealProgress 0 → 1 once on load.
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

  // Chat ticker — walks the chat once, holds the full stack on screen
  // for a long beat so the conversation can actually be read, then
  // gracefully drifts the whole thing up and out before silently
  // resetting beneath the hill for the next cycle. CSS transitions
  // handle the in-between motion; React only re-renders on phase /
  // index changes.
  useEffect(() => {
    if (reducedMotion) {
      setChatPhase("running");
      setActiveIndex(CHAT.length - 1);
      return;
    }
    let timerId: number | undefined;
    let rafId1: number | undefined;
    let rafId2: number | undefined;
    let cancelled = false;
    let isFirstPass = true;

    const stepTo = (i: number) => {
      if (cancelled) return;
      setChatPhase("running");
      setActiveIndex(i);
      if (i < CHAT.length - 1) {
        timerId = window.setTimeout(() => stepTo(i + 1), CHAT_TICK_MS);
      } else {
        // Park the conversation on screen for a long beat — long enough
        // that a viewer can read through every line before the chat
        // begins its drift out.
        timerId = window.setTimeout(beginExit, CHAT_HOLD_END_MS);
      }
    };

    const beginExit = () => {
      if (cancelled) return;
      // Fade each bubble in place with a small upward grace, staggered
      // so the oldest message leaves first and the newest last — reads
      // as the conversation closing itself rather than a curtain lift.
      setChatPhase("exiting");
      const totalExitMs =
        CHAT_EXIT_DURATION_MS + (CHAT.length - 1) * CHAT_EXIT_STAGGER_MS;
      timerId = window.setTimeout(() => {
        if (cancelled) return;
        // Snap back beneath the hill with transitions disabled — the
        // bubbles are already invisible from the exit, so this is the
        // moment to teleport them home without anyone seeing.
        setChatPhase("resetting");
        setActiveIndex(-1);
        rafId1 = requestAnimationFrame(() => {
          rafId2 = requestAnimationFrame(() => {
            if (cancelled) return;
            runCycle();
          });
        });
      }, totalExitMs);
    };

    const runCycle = () => {
      if (cancelled) return;
      setChatPhase("idle");
      setActiveIndex(-1);
      const delay = isFirstPass ? CHAT_START_DELAY_MS : CHAT_LOOP_RESTART_MS;
      isFirstPass = false;
      timerId = window.setTimeout(() => stepTo(0), delay);
    };

    runCycle();
    return () => {
      cancelled = true;
      if (timerId !== undefined) window.clearTimeout(timerId);
      if (rafId1 !== undefined) cancelAnimationFrame(rafId1);
      if (rafId2 !== undefined) cancelAnimationFrame(rafId2);
    };
  }, [reducedMotion]);

  const headlineLine1Words = useMemo(() => HEADLINE_LINE_1.split(" "), []);
  const headlineLine2Words = useMemo(() => HEADLINE_LINE_2.split(" "), []);

  const totalWords =
    headlineLine1Words.length + headlineLine2Words.length;
  const stride = 1 / (totalWords - 1 + REVEAL_WINDOW_RATIO);
  const wordWindow = stride * REVEAL_WINDOW_RATIO;
  const easedReveal = easeOutCubic(revealProgress);

  // Tail elements (CTA + persona block) join in the final stretch of the reveal.
  const tailReveal = clamp01((easedReveal - 0.78) / 0.22);

  // Shared word-renderer — uses a counter ref so headline + sub share one timeline.
  const counter = { i: 0 };
  const renderWords = (words: string[], keyPrefix: string) =>
    words.map((word, wi) => {
      const idx = counter.i++;
      const start = idx * stride;
      const end = start + wordWindow;
      const t = clamp01((easedReveal - start) / (end - start));
      const blur = (1 - t) * 3.5;
      const opacity = 0.12 + t * 0.88;
      return (
        <Fragment key={`${keyPrefix}-${wi}`}>
          <span
            className="inline-block"
            style={{
              filter: `blur(${blur}px)`,
              opacity,
              willChange: "filter, opacity",
            }}
          >
            {word}
          </span>
          {wi < words.length - 1 && " "}
        </Fragment>
      );
    });

  return (
    <div ref={runwayRef} className="relative h-[130vh]">
      <section
        className="sticky top-2 h-[calc(100svh-1rem)] overflow-hidden rounded-[28px] md:top-3 md:h-[calc(100svh-1.5rem)]"
        style={{ backgroundColor: "#F1EFEC", isolation: "isolate" }}
      >
        <HeroBackgroundAtmosphere />

        {/* Pastel landscape, layered ABOVE the info card so the hills
            visibly crop the lower portion of the card — the card reads
            as tucked behind the scenery. The image uses a vertical mask
            (transparent at the top, opaque at the bottom) so its sky
            portion lets the headline + card show through while its
            grass portion covers everything beneath it. The headline +
            CTA column sits on a higher z-index than the image, so they
            stay legible even where the mask becomes opaque.
            The image is intentionally static (no parallax, no scale) —
            it holds its position as the user scrolls past. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[78%] w-full select-none object-cover object-bottom"
          src="/hero-bg-enhanced.png"
          alt=""
          aria-hidden
          draggable={false}
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 36%, rgba(0,0,0,0.4) 48%, #000 62%, #000 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 36%, rgba(0,0,0,0.4) 48%, #000 62%, #000 100%)",
          }}
        />
        <HeroForegroundDepth />

        {/* Content layer.
            Horizontal padding + max-width come from `container-page`, the
            shared layout primitive used by Nav, Outcome, WhoWeServe,
            CoreCapabilities, Footer, etc. This keeps the hero's headline
            and info card vertically aligned with the section content on
            every other page (and with the nav links above), instead of
            having a bespoke padding scale that drifted at large viewports.
            Vertical rhythm stays inline (mt-24/28) since the section is
            a fixed viewport height, not driven by intrinsic content. */}
        <div className="relative flex h-full w-full flex-col">
          <div className="container-page mt-40 grid grid-cols-1 gap-10 md:mt-52 lg:mt-60 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-start lg:gap-14 xl:gap-20">
            {/* Left column — the message and the call to action. Sits
                at z-20 so the masked landscape (z-10) never crops the
                headline or the CTA. The headline reads as the section's
                anchor against the pastel sky. */}
            <div className="relative z-20 flex flex-col">
              <h1
                className="max-w-[28ch] font-serif font-normal leading-[1.04] tracking-[-0.02em] text-ink text-[2.25rem] sm:text-[2.5rem] md:text-[2.875rem] lg:text-[3.125rem] xl:text-[3.5rem]"
                style={{ textWrap: "balance" } as React.CSSProperties}
              >
                {renderWords(headlineLine1Words, "h1")}{" "}
                {renderWords(headlineLine2Words, "h2")}
              </h1>

              <a
                href={DEMO_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group/herocta btn-primary mt-10 w-fit"
                style={{
                  opacity: tailReveal,
                  transform: `translateY(${(1 - tailReveal) * 8}px)`,
                  willChange: "opacity, transform",
                }}
              >
                Book A Demo
                <Arrow />
              </a>
            </div>

            {/* Right column — conversational chat. Acts as a vertical
                ticker: each message is absolutely positioned by slot, so
                a new one entering at the bottom shifts every prior one
                up. CSS transitions interpolate position + opacity so the
                motion stays smooth (no per-frame JS). z-0 keeps the
                stack beneath the masked landscape (z-10) — new lines
                rise out from behind the hills. */}
            <aside
              className="relative z-0 lg:w-full lg:max-w-[28rem] lg:justify-self-end"
              style={{
                // Sized so the aside's bottom edge lands inside the
                // hill mask's fade zone — bubbles rest with their lower
                // edge dissolving into the meadow silhouette, and their
                // entry origin (CHAT_RISE_PX below rest) sits deep in
                // the fully-opaque terrain. Each new message visibly
                // rises out of the landscape rather than floating in
                // above it.
                minHeight: "280px",
                // Soft fade across the top so older messages dissolve into
                // the sky rather than getting cut off at a hard edge as the
                // stack grows.
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 8%, #000 22%, #000 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 8%, #000 22%, #000 100%)",
              }}
              aria-label="Sample coaching conversation"
            >
              {CHAT.map((turn, i) => {
                const slot = activeIndex - i;
                // Cumulative offset of the messages stacked between this
                // one and the bottom of the stack — drives translateY so
                // a tall Roni bubble pushes its older neighbour further
                // up than a short member bubble would.
                let stackOffset = 0;
                if (slot > 0) {
                  for (let k = 0; k < slot; k++) {
                    const belowIndex = activeIndex - k;
                    stackOffset += (bubbleHeights[belowIndex] ?? 0) + CHAT_GAP_PX;
                  }
                }
                return (
                  <ChatLine
                    key={i}
                    index={i}
                    turn={turn}
                    slot={slot}
                    stackOffset={stackOffset}
                    phase={chatPhase}
                    onMeasure={reportHeight}
                  />
                );
              })}
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroBackgroundAtmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.11]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(84,70,54,0.18) 0.55px, transparent 0.55px)",
          backgroundSize: "7px 7px",
          mixBlendMode: "multiply",
        }}
      />
      <svg
        className="absolute -left-[5%] bottom-[18%] h-[42%] w-[62%] opacity-[0.13]"
        viewBox="0 0 900 420"
        fill="none"
        preserveAspectRatio="none"
      >
        <path d="M-40 330C90 250 198 252 330 306C474 364 626 330 768 254C842 214 906 204 968 224" stroke="rgba(77,92,72,0.58)" strokeWidth="1.2" />
        <path d="M-34 285C94 216 214 216 352 262C482 306 598 292 734 218C830 166 908 154 986 180" stroke="rgba(117,94,72,0.5)" strokeWidth="1" />
        <path d="M-20 238C118 184 240 178 368 214C510 254 612 234 744 166C846 114 936 110 1010 134" stroke="rgba(77,92,72,0.42)" strokeWidth="1" />
        <path d="M8 196C142 146 262 144 396 174C526 204 632 186 756 128C858 82 948 78 1028 102" stroke="rgba(183,126,90,0.38)" strokeWidth="0.9" />
        <path d="M34 154C160 112 292 104 424 130C548 154 658 142 786 92C886 54 974 48 1050 70" stroke="rgba(77,92,72,0.34)" strokeWidth="0.9" />
      </svg>
      <svg
        className="absolute right-[-8%] top-[18%] h-[44%] w-[50%] opacity-[0.09]"
        viewBox="0 0 720 420"
        fill="none"
        preserveAspectRatio="none"
      >
        <path d="M-28 92C88 50 178 56 300 116C422 176 548 162 750 72" stroke="rgba(89,106,84,0.58)" strokeWidth="1" />
        <path d="M-6 144C120 100 224 108 342 158C468 212 566 196 744 126" stroke="rgba(201,132,90,0.42)" strokeWidth="0.9" />
        <path d="M20 198C146 154 252 160 374 204C500 250 612 240 752 184" stroke="rgba(89,106,84,0.42)" strokeWidth="0.9" />
      </svg>
    </div>
  );
}

function HeroForegroundDepth() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[11] h-[58%]"
        style={{
          background:
            "linear-gradient(to top, rgba(42,54,43,0.24) 0%, rgba(73,80,56,0.14) 22%, rgba(132,97,71,0.08) 44%, rgba(132,97,71,0) 72%)",
          mixBlendMode: "multiply",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.72) 48%, #000 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.72) 48%, #000 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] h-[46%]"
        style={{
          background:
            "linear-gradient(160deg, rgba(249,144,77,0.16) 0%, rgba(249,144,77,0.04) 34%, rgba(85,111,89,0.1) 70%, rgba(85,111,89,0) 100%)",
          mixBlendMode: "soft-light",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.18) 18%, rgba(0,0,0,0.82) 55%, #000 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.18) 18%, rgba(0,0,0,0.82) 55%, #000 100%)",
        }}
      />
    </>
  );
}

function ChatLine({
  turn,
  index,
  slot,
  stackOffset,
  phase,
  onMeasure,
}: {
  turn: ChatTurn;
  index: number;
  // slot 0 = newest (bottom). 1, 2, … = older messages stacked upward.
  // slot < 0 = not yet entered (hidden beneath the hill mask).
  slot: number;
  stackOffset: number;
  phase: ChatPhase;
  onMeasure: (index: number, height: number) => void;
}) {
  const isRoni = turn.who === "roni";
  const measureRef = useRef<HTMLDivElement>(null);

  // Report rendered height back to the parent so the stack can position
  // every other slot relative to this bubble's actual size. ResizeObserver
  // catches font-load reflows and width changes.
  useEffect(() => {
    const node = measureRef.current;
    if (!node) return;
    const update = () => onMeasure(index, node.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, [index, onMeasure]);

  // Slot → translateY + opacity. Position is anchored at the container's
  // bottom; older slots stack upward by the heights of the bubbles below
  // them. CSS transition interpolates between states so each tick reads
  // as a smooth shift up. Once a message has landed it stays visible —
  // older slots only get a gentle opacity dip for visual depth, never
  // fully fade out.
  let translateY: number;
  let opacity: number;
  // Oldest-first exit stagger — slot 0 is the newest, so larger slot
  // numbers leave first. Newest message gets the full stagger delay.
  const exitOrder = Math.max(0, CHAT.length - 1 - Math.max(slot, 0));
  if (phase === "exiting" && slot >= 0) {
    // Fade each bubble in place with a small upward grace — the
    // conversation closes itself, no full-stack curtain lift.
    translateY = -stackOffset - CHAT_EXIT_LIFT_PX;
    opacity = 0;
  } else if (slot < 0) {
    translateY = CHAT_RISE_PX;
    opacity = 0;
  } else {
    translateY = -stackOffset;
    // Every landed message stays fully present — older lines lose only
    // a hair of opacity for depth, never enough to dim the conversation.
    if (slot === 0) opacity = 1;
    else if (slot === 1) opacity = 0.98;
    else if (slot === 2) opacity = 0.96;
    else opacity = Math.max(0.9, 0.96 - (slot - 2) * 0.02);
  }

  // Two glass-mist bubble treatments — Roni reads as cool dawn glass
  // (the AI side), member as a sunlit cream haze (the person speaking).
  // Low opacity + heavy blur + ghosted borders so the bubbles feel like
  // a part of the pastel meadow weather, not UI panels stacked on top.
  // No shadows — the atmosphere carries the depth.
  const bubbleStyle: React.CSSProperties = isRoni
    ? {
        background:
          "linear-gradient(to bottom, rgba(255, 255, 255, 0.62) 0%, rgba(255, 255, 255, 0.48) 100%)",
        backdropFilter: "blur(16px) saturate(135%)",
        WebkitBackdropFilter: "blur(16px) saturate(135%)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
      }
    : {
        background:
          "linear-gradient(to bottom, rgba(252, 232, 208, 0.66) 0%, rgba(248, 218, 188, 0.5) 100%)",
        backdropFilter: "blur(16px) saturate(135%)",
        WebkitBackdropFilter: "blur(16px) saturate(135%)",
        border: "1px solid rgba(232, 196, 158, 0.4)",
      };

  // 850ms ease-out-quart for the per-tick rise. The exit phase stretches
  // that to ~1600ms so the final drift-out reads as a relaxed scroll,
  // not a snap. The single resetting frame disables transitions entirely
  // so we can silently teleport bubbles back to their start position
  // without animating across the entire viewport.
  const exitDelay = exitOrder * CHAT_EXIT_STAGGER_MS;
  const transition =
    phase === "resetting"
      ? "none"
      : phase === "exiting"
        ? `transform ${CHAT_EXIT_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) ${exitDelay}ms, opacity ${CHAT_EXIT_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) ${exitDelay}ms`
        : "transform 620ms cubic-bezier(0.22, 1, 0.36, 1), opacity 620ms cubic-bezier(0.22, 1, 0.36, 1)";

  if (isRoni) {
    return (
      <div
        ref={measureRef}
        className="absolute bottom-0 left-0 flex max-w-[94%] items-end gap-2.5"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          transition,
          willChange: "opacity, transform",
        }}
      >
        <span className="mb-[6px] shrink-0" style={{ opacity: 0.55 }}>
          <AIOrb size={14} />
        </span>
        <div
          className="rounded-[16px] rounded-bl-[6px] px-3.5 py-2 text-[12.5px] leading-[1.5] text-ink-soft md:text-[13px]"
          style={bubbleStyle}
        >
          {turn.text}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={measureRef}
      className="absolute bottom-0 right-0 flex max-w-[94%] items-end justify-end gap-2.5"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transition,
        willChange: "opacity, transform",
      }}
    >
      <div
        className="rounded-[16px] rounded-br-[6px] px-3.5 py-2 font-serif text-[12.5px] italic leading-[1.5] text-ink-soft md:text-[13px]"
        style={bubbleStyle}
      >
        {turn.text}
      </div>
      <span
        aria-hidden
        className="mb-[6px] inline-block shrink-0 rounded-full"
        style={{
          width: 10,
          height: 10,
          background: "rgba(168, 139, 110, 0.55)",
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.25)",
        }}
      />
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
