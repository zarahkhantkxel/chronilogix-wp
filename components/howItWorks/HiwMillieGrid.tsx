"use client";

import { useEffect, useRef, useState } from "react";
import { MILLIE_CAPABILITIES } from "./MillieCapabilities";

const SLATE = "#3F5C7C";
const SLATE_DEEP = "#2E465F";

// Hooks defined as const expressions above the component (Next.js SWC
// hoisting quirk in this file family).

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
};

const useReveal = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
};

/**
 * Millie's grid. Rows swapped from the original — NAME+DESC now opens
 * the section at the top-left, AVATAR+CHAT closes it at the bottom-right.
 * Diagonal flows TL → BR (matching Roni's direction) but the read order
 * starts with the agent's identity instead of her face.
 *
 *   Desktop:
 *     +──────────────────+──────────+──────────+
 *     │   NAME+DESC      │  cap[2]  │  cap[3]  │
 *     +──────────────────+──────────+──────────+
 *     │  cap[0]  │  cap[1]  │   AVATAR+CHAT   │
 *     +──────────+──────────+─────────────────+
 */
export function HiwMillieGrid() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Diagonal wash flows TL → BR after the row swap. Slate emanates from
  // the NAME (now TL) and the AVATAR (now BR); the two adjacent
  // capabilities pick up a softer gradient that flows inward; the
  // off-diagonal pair (TR + BL) carries no tint, so the eye reads the
  // diagonal cleanly.
  const cells: Array<{
    key: string;
    node: React.ReactNode;
    pos: string;
    border: string;
    pad: string;
    tint: React.CSSProperties;
  }> = [
    {
      key: "avatar",
      node: <AvatarAndChat />,
      pos: "lg:col-span-2 lg:col-start-3 lg:row-start-2",
      border: "lg:border-t lg:border-l lg:border-ink/[0.07]",
      pad: "px-6 py-8 md:px-9 md:py-9 lg:px-11 lg:py-10",
      tint: {
        backgroundImage:
          "radial-gradient(ellipse 90% 110% at 100% 100%, rgba(63,92,124,0.14) 0%, rgba(63,92,124,0.05) 40%, rgba(63,92,124,0) 75%)",
      },
    },
    {
      key: "cap-0",
      node: <CapabilityCell index={0} />,
      pos: "lg:col-start-1 lg:row-start-2",
      border: "border-t border-ink/[0.07]",
      pad: "px-6 py-8 md:px-7 md:py-9",
      tint: {},
    },
    {
      key: "cap-1",
      node: <CapabilityCell index={1} />,
      pos: "lg:col-start-2 lg:row-start-2",
      border: "border-t border-ink/[0.07] lg:border-l",
      pad: "px-6 py-8 md:px-7 md:py-9",
      tint: {
        backgroundImage:
          "linear-gradient(to left, rgba(63,92,124,0.07) 0%, rgba(63,92,124,0) 75%)",
      },
    },
    {
      key: "cap-2",
      node: <CapabilityCell index={2} />,
      pos: "lg:col-start-3 lg:row-start-1",
      border: "border-t border-ink/[0.07] lg:border-t-0 lg:border-l",
      pad: "px-6 py-8 md:px-7 md:py-9",
      tint: {
        backgroundImage:
          "linear-gradient(to right, rgba(63,92,124,0.07) 0%, rgba(63,92,124,0) 75%)",
      },
    },
    {
      key: "cap-3",
      node: <CapabilityCell index={3} />,
      pos: "lg:col-start-4 lg:row-start-1",
      border: "border-t border-ink/[0.07] lg:border-t-0 lg:border-l",
      pad: "px-6 py-8 md:px-7 md:py-9",
      tint: {},
    },
    {
      key: "name",
      node: <NameAndDescription />,
      pos: "lg:col-span-2 lg:col-start-1 lg:row-start-1",
      border: "border-t border-ink/[0.07] lg:border-t-0",
      pad: "px-6 py-8 md:px-9 md:py-9 lg:px-11 lg:py-10",
      tint: {
        backgroundImage:
          "radial-gradient(ellipse 90% 110% at 0% 0%, rgba(63,92,124,0.14) 0%, rgba(63,92,124,0.05) 40%, rgba(63,92,124,0) 75%)",
      },
    },
  ];

  return (
    <div
      ref={ref}
      data-revealed={inView ? "true" : "false"}
      className="overflow-hidden rounded-[24px] border border-ink/[0.07]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2">
        {cells.map((cell, i) => {
          const shown = inView || prefersReducedMotion;
          const cellStyle: React.CSSProperties = prefersReducedMotion
            ? {}
            : {
                opacity: shown ? 1 : 0,
                transform: shown ? "translateY(0)" : "translateY(10px)",
                transition:
                  "opacity 600ms ease-out, transform 600ms ease-out",
                transitionDelay: `${i * 70}ms`,
                willChange: "opacity, transform",
              };
          return (
            <div
              key={cell.key}
              className={`relative ${cell.pos} ${cell.border} ${cell.pad}`}
              style={{ ...cell.tint, ...cellStyle }}
            >
              {cell.node}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Featured: avatar + chat (R1C3–4, mirror — chat left, avatar right) */

function AvatarAndChat() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 md:flex-row-reverse md:items-center md:gap-8 lg:gap-10">
      <div className="relative shrink-0">
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-4 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(63,92,124,0.18) 0%, rgba(63,92,124,0) 70%)",
            filter: "blur(8px)",
          }}
        />
        <div
          className="relative h-[80px] w-[80px] overflow-hidden rounded-full bg-white md:h-[92px] md:w-[92px] lg:h-[104px] lg:w-[104px]"
          style={{
            boxShadow:
              "0 0 0 2px #FFFFFF, 0 0 0 3px rgba(63,92,124,0.32)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/millie.png"
            alt="Millie, mental health coach."
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      </div>

      <div className="flex w-full max-w-[440px] flex-col gap-2.5">
        <MemberBubble>I can&rsquo;t get my mind to slow down.</MemberBubble>
        <CoachBubble>
          Racing thoughts aren&rsquo;t yours to solve at midnight. Let&rsquo;s
          bring your body back into the room first. I&rsquo;ll walk you
          through it.
        </CoachBubble>
      </div>
    </div>
  );
}

function MemberBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[92%] rounded-[16px] rounded-br-[6px] px-4 py-2.5 text-[13.5px] leading-[1.5] text-ink-soft md:text-[14px]"
        style={{
          background: "rgba(252, 230, 205, 0.78)",
          backdropFilter: "blur(10px) saturate(150%)",
          WebkitBackdropFilter: "blur(10px) saturate(150%)",
          border: "1px solid rgba(232, 188, 142, 0.55)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function CoachBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      {/* No avatar here — the big portrait beside the chat is the sole
          source of Millie's face. A small slate dot signals who's speaking. */}
      <span
        aria-hidden
        className="mt-2.5 block h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: SLATE }}
      />
      <div
        className="max-w-[94%] rounded-[16px] rounded-bl-[6px] px-4 py-2.5 text-[13.5px] leading-[1.5] text-ink-soft md:text-[14px]"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px) saturate(150%)",
          WebkitBackdropFilter: "blur(10px) saturate(150%)",
          border: "1px solid rgba(255, 255, 255, 0.72)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── Featured: name + description (R2C1–2) ────────────────────────── */

function NameAndDescription() {
  return (
    <div className="flex h-full flex-col justify-center">
      {/* Name — "AI" slate-tinted (same serif weight, no italic), matching
          Roni's treatment with the cool accent. */}
      <h3 className="font-serif text-[48px] font-normal leading-[0.98] tracking-[-0.025em] text-ink md:text-[58px] lg:text-[68px]">
        Millie{" "}
        <span style={{ color: SLATE_DEEP }}>AI</span>
      </h3>
      <p className="mt-3 font-serif text-[18px] font-normal leading-[1.3] text-ink-soft md:text-[20px]">
        Mental health coach
      </p>
      <p className="mt-6 max-w-[44ch] body-prose md:mt-7">
        Built for the moments no appointment reaches. At midnight. After
        an argument. On a Tuesday when nothing catastrophic happened but
        everything feels heavy. Millie shows up specifically for those.
      </p>
    </div>
  );
}

/* ─── Capability cell ───────────────────────────────────────────────── */

function CapabilityCell({ index }: { index: number }) {
  const cap = MILLIE_CAPABILITIES[index];
  if (!cap) return null;
  const { heading, body, Illustration } = cap;
  // Same read-path rules as Roni's grid — heading dominates the now-
  // simpler illustration; body sits in `ink-subtle` so it doesn't
  // pull the eye.
  return (
    <div className="flex h-full flex-col">
      <div className="mb-7 flex flex-1 items-center justify-center md:mb-8">
        <Illustration />
      </div>
      <h4 className="font-serif text-[22px] font-normal leading-[1.15] tracking-[-0.012em] text-ink md:text-[24px]">
        {heading}
      </h4>
      <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-subtle md:text-[14px]">
        {body}
      </p>
    </div>
  );
}
