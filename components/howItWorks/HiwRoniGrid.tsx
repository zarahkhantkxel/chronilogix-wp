"use client";

import { useEffect, useRef, useState } from "react";
import { RONI_CAPABILITIES } from "./RoniCapabilities";

// Hooks defined as const expressions above the component (function
// declarations were hitting a Next.js SWC client-bundle hoisting quirk
// in this file family).

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
 * Roni's diagonal grid. No outer container, no shadow — the grid sits
 * flat on the section's paper-warm surface and defines itself with
 * hairline dividers between cells (plus a top + bottom hairline rule
 * to bracket the band).
 *
 *   Desktop (4 cols × 2 rows):
 *     +─────────────────+──────────+──────────+
 *     │   AVATAR+CHAT   │  cap[0]  │  cap[1]  │
 *     +─────────────────+──────────+──────────+
 *     │  cap[2]  │  cap[3]  │   NAME+DESC      │
 *     +──────────+──────────+──────────────────+
 *
 *   Mobile: stack to a single column.
 */
export function HiwRoniGrid() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Each cell carries its own directional warm-orange wash. The two
  // featured cells (TL avatar, BR name) anchor the strongest tint at the
  // grid's outermost corners; capabilities directly adjacent to them pick
  // up a softer gradient that flows inward. The two off-diagonal cells
  // (TR + BL) carry no tint — that's the "fades out in the middle" beat.
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
      pos: "lg:col-span-2 lg:col-start-1 lg:row-start-1",
      border: "lg:border-r lg:border-b lg:border-ink/[0.07]",
      pad: "px-6 py-8 md:px-9 md:py-9 lg:px-11 lg:py-10",
      tint: {
        backgroundImage:
          "radial-gradient(ellipse 90% 110% at 0% 0%, rgba(249,144,77,0.14) 0%, rgba(249,144,77,0.05) 40%, rgba(249,144,77,0) 75%)",
      },
    },
    {
      key: "cap-0",
      node: <CapabilityCell index={0} />,
      pos: "lg:col-start-3 lg:row-start-1",
      border:
        "border-t border-ink/[0.07] lg:border-t-0 lg:border-r lg:border-b",
      pad: "px-6 py-8 md:px-7 md:py-9",
      tint: {
        backgroundImage:
          "linear-gradient(to right, rgba(249,144,77,0.07) 0%, rgba(249,144,77,0) 75%)",
      },
    },
    {
      key: "cap-1",
      node: <CapabilityCell index={1} />,
      pos: "lg:col-start-4 lg:row-start-1",
      border: "border-t border-ink/[0.07] lg:border-t-0 lg:border-b",
      pad: "px-6 py-8 md:px-7 md:py-9",
      tint: {},
    },
    {
      key: "cap-2",
      node: <CapabilityCell index={2} />,
      pos: "lg:col-start-1 lg:row-start-2",
      border: "border-t border-ink/[0.07] lg:border-r",
      pad: "px-6 py-8 md:px-7 md:py-9",
      tint: {},
    },
    {
      key: "cap-3",
      node: <CapabilityCell index={3} />,
      pos: "lg:col-start-2 lg:row-start-2",
      border: "border-t border-ink/[0.07] lg:border-r",
      pad: "px-6 py-8 md:px-7 md:py-9",
      tint: {
        backgroundImage:
          "linear-gradient(to left, rgba(249,144,77,0.07) 0%, rgba(249,144,77,0) 75%)",
      },
    },
    {
      key: "name",
      node: <NameAndDescription />,
      pos: "lg:col-span-2 lg:col-start-3 lg:row-start-2",
      border: "border-t border-ink/[0.07] lg:border-t-0",
      pad: "px-6 py-8 md:px-9 md:py-9 lg:px-11 lg:py-10",
      tint: {
        backgroundImage:
          "radial-gradient(ellipse 90% 110% at 100% 100%, rgba(249,144,77,0.14) 0%, rgba(249,144,77,0.05) 40%, rgba(249,144,77,0) 75%)",
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

/* ─── Featured: avatar + chat (R1C1–2) ──────────────────────────────── */

function AvatarAndChat() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 md:flex-row md:items-center md:gap-8 lg:gap-10">
      {/* Avatar — single source of truth for Roni's face in this section. */}
      <div className="relative shrink-0">
        {/* Soft brand-tinted wash behind the portrait so it has its own
            atmosphere even with no card around it. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-4 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(249,144,77,0.16) 0%, rgba(249,144,77,0) 70%)",
            filter: "blur(8px)",
          }}
        />
        <div
          className="relative h-[80px] w-[80px] overflow-hidden rounded-full bg-white md:h-[92px] md:w-[92px] lg:h-[104px] lg:w-[104px]"
          style={{
            boxShadow:
              "0 0 0 2px #FFFFFF, 0 0 0 3px rgba(249,144,77,0.28)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/roni.png"
            alt="Roni, diabetes and chronic care coach."
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      </div>

      {/* Chat pair — sits beside the avatar (no duplicate avatar inside
          the bubble; Roni's face is already right there). */}
      <div className="flex w-full max-w-[440px] flex-col gap-2.5">
        <MemberBubble>
          I keep forgetting to check my sugar before meals.
        </MemberBubble>
        <CoachBubble>
          Forgetting isn&rsquo;t failure. Pair the check with your coffee.
          We&rsquo;re stacking, not adding willpower.
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
          source of Roni's face. A small brand dot leads the bubble
          instead, signaling who's speaking. */}
      <span
        aria-hidden
        className="mt-2.5 block h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: "#F9904D" }}
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

/* ─── Featured: name + description (R2C3–4) ────────────────────────── */

function NameAndDescription() {
  return (
    <div className="flex h-full flex-col justify-center">
      {/* Name — "AI" is brand-tinted (same serif weight, no italic) so it
          reads as the identity mark of the agent without slanting away. */}
      <h3 className="font-serif text-[48px] font-normal leading-[0.98] tracking-[-0.025em] text-ink md:text-[58px] lg:text-[68px]">
        Roni{" "}
        <span style={{ color: "#E45A1C" }}>AI</span>
      </h3>
      {/* Role — visible subtitle that pairs with the name. Serif to echo
          the name, but at a smaller scale so the hierarchy stays clear.
          Brand-tinted slash ties it to the agent's accent color. */}
      <p className="mt-3 font-serif text-[18px] font-normal leading-[1.3] text-ink-soft md:text-[20px]">
        Diabetes and chronic care coach
      </p>
      <p className="mt-6 max-w-[44ch] body-prose md:mt-7">
        Built for the gap between clinical appointments. The meal that
        breaks the plan, the medication you considered skipping, the
        morning you woke up exhausted. The moments that decide A1C.
        Roni is there for them.
      </p>
    </div>
  );
}

/* ─── Capability cell ───────────────────────────────────────────────── */

function CapabilityCell({ index }: { index: number }) {
  const cap = RONI_CAPABILITIES[index];
  if (!cap) return null;
  const { heading, body, Illustration } = cap;
  // Read path inside each cell: illustration (quick visual proof) →
  // heading (the anchor) → body (one-line explanation). Heading sits
  // larger than v3 so it dominates the now-simpler illustration; body
  // recedes to `ink-subtle` so the eye doesn't get pulled to it.
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
