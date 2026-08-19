"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Anatomy of one reply.
 *
 *   Left  — A diagrammatic dissection inside a single cool-gray box.
 *           Maria's message → Roni-is-considering panel (six reasoning
 *           pills) → Roni's reply. Centered dashed path links the three
 *           phases.
 *
 *   Right — The photographic hand-tilted mockup. The image carries its
 *           own native lighting, so we sit it flat on the warm section
 *           ground without an added wash or drop-shadow.
 */

type ReasonRow = {
  label: string;
  value: string;
};

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty.
export type HiwReplyContent = {
  headingLead?: string;
  headingEmph?: string;
  dissectionEyebrow?: string;
  memberViewEyebrow?: string;
  memberName?: string;
  memberMessage?: string;
  coachName?: string;
  coachAvatar?: string;
  coachReply?: string;
  thinkingLabel?: string;
  reasoningRows?: ReasonRow[];
  mockupImage?: string;
  mockupAlt?: string;
};

const DEFAULTS = {
  headingLead: "Each reply weighs",
  headingEmph: "everything Chronilogix knows.",
  dissectionEyebrow: "Inside one reply",
  memberViewEyebrow: "The app members open between sessions",
  memberName: "Maria",
  memberMessage: "I skipped lunch again. I know I shouldn't.",
  coachName: "Roni",
  coachAvatar: "/roni.png",
  coachReply:
    "You’re noticing it. That’s not nothing. What got in the way today?",
  thinkingLabel: "Thinking",
  reasoningRows: [
    { label: "Remembers", value: "Last session, stress eating after work calls" },
    { label: "Pattern this week", value: "Third lunch skipped in five days" },
    { label: "Goal in motion", value: "Eat lunch before the 1pm call" },
    { label: "Emotional read", value: "Self critical, bracing for a lecture" },
    { label: "MI technique", value: "Reflect what she noticed, then ask" },
    { label: "Holds back", value: "Direct advice, a checklist, a fix" },
  ],
  mockupImage: "/hand-tilted-mockup.webp",
  mockupAlt:
    "Chronilogix on a member's phone showing daily greeting, upcoming Roni session, goals in flight",
} satisfies Required<HiwReplyContent>;

// Reasoning-pill icons stay hardcoded and pair with reasoningRows by index.
const REASONING_ICONS: React.ComponentType<{ className?: string }>[] = [
  ClockBackIcon,
  TrendIcon,
  TargetIcon,
  PulseIcon,
  ReflectIcon,
  BlockIcon,
];

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

function useInView<T extends HTMLElement>(threshold = 0.18) {
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

export function HiwReply({ content }: { content?: HiwReplyContent }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.18);
  const playState = inView ? "running" : "paused";
  const c = { ...DEFAULTS, ...clean(content) };
  const reasoningRows = content?.reasoningRows?.length
    ? content.reasoningRows
    : DEFAULTS.reasoningRows;

  return (
    <section
      id="reply"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm pt-14 pb-14 md:pt-16 md:pb-16 lg:pt-20 lg:pb-20"
    >
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="text-row font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {c.headingLead}{" "}
            <span className="text-ink-muted">{c.headingEmph}</span>
          </h2>
        </div>

        <div
          ref={ref}
          className="mt-12 grid grid-cols-1 items-stretch gap-8 md:mt-16 lg:mt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-14"
        >
          <DissectionColumn playState={playState} c={c} reasoningRows={reasoningRows} />
          <MemberViewColumn playState={playState} c={c} />
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   Left column
   ─────────────────────────────────────────────────────────────────── */

function DissectionColumn({
  playState,
  c,
  reasoningRows,
}: {
  playState: "running" | "paused";
  c: Required<HiwReplyContent>;
  reasoningRows: ReasonRow[];
}) {
  return (
    <div className="flex flex-col">
      <p className="eyebrow-muted text-center">{c.dissectionEyebrow}</p>

      <div
        className="surface-glass relative mt-4 flex flex-1 flex-col rounded-[24px] px-12 py-[4.2rem] md:px-[4.2rem] md:py-20 lg:px-20 lg:py-24"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255, 255, 255, 0.92), inset 0 -1px 0 rgba(15, 20, 25, 0.04)",
        }}
      >
        {/* Soft warm brand wash in the top-left corner — picks up the Roni
            accent and lights the panel from above without competing with
            the diagram inside. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[24px]"
          style={{
            background:
              "radial-gradient(60% 60% at 0% 0%, rgba(249, 144, 77, 0.10) 0%, rgba(249, 144, 77, 0) 70%)",
          }}
        />
        <div className="relative flex flex-1 flex-col justify-center">
        {/* Maria — message arriving */}
        <div
          className="flex justify-end"
          style={{
            animation: "fadeUp 500ms ease-out 100ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <div className="flex max-w-[86%] flex-col items-end gap-1.5">
            <span className="flex items-center gap-1.5">
              <span className="text-[12px] font-medium text-ink-soft">
                {c.memberName}
              </span>
              <MariaAvatar className="h-5 w-5" letter={c.memberName.charAt(0)} />
            </span>
            <div
              className="rounded-[16px] rounded-br-[6px] px-4 py-2.5 text-[14px] leading-snug text-ink"
              style={{
                background: "rgba(252, 230, 205, 0.85)",
                border: "1px solid rgba(232, 188, 142, 0.55)",
              }}
            >
              {c.memberMessage}
            </div>
          </div>
        </div>

        {/* Path: message → thinking */}
        <CenteredPath delay={500} playState={playState} />

        {/* Thinking — left-aligned label with a three-dot loader pulsing
            beside it, so the row reads as "the AI is working on this reply"
            rather than a static section header. */}
        <div
          className="flex items-center gap-2"
          style={{
            animation: "fadeUp 500ms ease-out 700ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <p className="text-[13px] font-medium text-ink-soft">{c.thinkingLabel}</p>
          <ThinkingPulse playState={playState} />
        </div>

        {/* Reasoning pills */}
        <ul className="mt-3 flex flex-col gap-1.5">
          {reasoningRows.map((row, i) => (
            <ReasoningPill
              key={row.label}
              row={row}
              icon={REASONING_ICONS[i % REASONING_ICONS.length]}
              delay={900 + i * 130}
              playState={playState}
            />
          ))}
        </ul>

        {/* Path: thinking → reply */}
        <CenteredPath delay={1900} playState={playState} />

        {/* Roni — reply landing */}
        <div
          className="flex justify-start"
          style={{
            animation: "fadeUp 500ms ease-out 2100ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <div className="flex max-w-[88%] flex-col items-start gap-1.5">
            <span className="flex items-center gap-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.coachAvatar}
                alt=""
                className="h-5 w-5 rounded-full object-cover"
                draggable={false}
                style={{
                  boxShadow: "0 0 0 1px rgba(249, 144, 77, 0.30)",
                }}
          loading="lazy"
          decoding="async"
        />
              <span className="text-[12px] font-medium text-ink-soft">
                {c.coachName}
              </span>
            </span>
            <div
              className="rounded-[16px] rounded-bl-[6px] px-4 py-2.5 text-[14px] leading-snug text-ink"
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(10px) saturate(150%)",
                WebkitBackdropFilter: "blur(10px) saturate(150%)",
                border: "1px solid rgba(255, 255, 255, 0.72)",
                boxShadow: "0 6px 18px -10px rgba(15, 20, 25, 0.10)",
              }}
            >
              {c.coachReply}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

/* ── Maria avatar — soft warm-cream circle with a serif monogram. The
   color mirrors the member-bubble palette so the avatar reads as
   continuous with the message it sits above. */

function MariaAvatar({ className, letter = "M" }: { className?: string; letter?: string }) {
  return (
    <span
      aria-hidden
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full ${className ?? ""}`}
      style={{
        background:
          "linear-gradient(135deg, #FCE6CD 0%, #F0CFA8 100%)",
        boxShadow: "inset 0 0 0 1px rgba(232, 188, 142, 0.55)",
      }}
    >
      <span
        className="font-serif text-[10px] leading-none"
        style={{ color: "#8A5A2E" }}
      >
        {letter}
      </span>
    </span>
  );
}

/* ── Reasoning pill ─────────────────────────────────────────────────── */

function ReasoningPill({
  row,
  icon: Icon,
  delay,
  playState,
}: {
  row: ReasonRow;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
  playState: "running" | "paused";
}) {
  const isHoldsBack = row.label === "Holds back";

  return (
    <li
      className="surface-glass-toast flex items-center gap-3 rounded-[12px] px-3.5 py-1.5"
      style={{
        animation: `fadeUp 380ms ease-out ${delay}ms forwards`,
        animationPlayState: playState,
        opacity: 0,
      }}
    >
      <span
        aria-hidden
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-600/10 text-brand-700"
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="text-[12.5px] font-medium text-ink-soft">
        {row.label}
      </span>
      <span
        className={`ml-auto text-right text-[13px] leading-snug md:text-[13.5px] ${
          isHoldsBack
            ? "text-ink-soft line-through decoration-ink/35"
            : "text-ink"
        }`}
      >
        {row.value}
      </span>
    </li>
  );
}

/* ── Centered dashed path between phases ────────────────────────────── */

function CenteredPath({
  delay,
  playState,
}: {
  delay: number;
  playState: "running" | "paused";
}) {
  return (
    <div className="my-3 flex flex-col items-center gap-1 md:my-4">
      {/* Top terminal cap — a short horizontal bar anchoring the path
          to the message above. Replaces the previous dot. */}
      <span
        aria-hidden
        className="block h-[2px] w-3 rounded-full bg-brand-700/80"
        style={{
          animation: `fadeUp 280ms ease-out ${delay}ms forwards`,
          animationPlayState: playState,
          opacity: 0,
        }}
      />
      {/* Dotted segment — three larger, well-spaced dots between the
          terminals so the path reads as distinct beats, not a hairline. */}
      <span
        aria-hidden
        className="block"
        style={{
          width: 4,
          height: 28,
          backgroundImage:
            "radial-gradient(circle, rgba(228, 90, 28, 0.85) 1.6px, transparent 2px)",
          backgroundSize: "4px 9px",
          backgroundRepeat: "repeat-y",
          backgroundPosition: "center",
          animation: `scaleYFromTop 500ms ease-out ${delay + 120}ms forwards`,
          animationPlayState: playState,
          transform: "scaleY(0)",
          transformOrigin: "top",
        }}
      />
      {/* Bottom terminal cap — closes the path onto the next phase. */}
      <span
        aria-hidden
        className="block h-[2px] w-3 rounded-full bg-brand-700/80"
        style={{
          animation: `fadeUp 280ms ease-out ${delay + 500}ms forwards`,
          animationPlayState: playState,
          opacity: 0,
        }}
      />
    </div>
  );
}

/* ── Thinking pulse — three brand dots that bounce in sequence to imply
   the AI is still mid-thought. Uses the existing loaderDot keyframe so the
   rhythm matches other loaders on the site. ─────────────────────────── */

function ThinkingPulse({ playState }: { playState: "running" | "paused" }) {
  return (
    <span
      aria-hidden
      className="inline-flex items-end gap-[3px]"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block h-3 w-[2px] rounded-full bg-brand-700/80"
          style={{
            animation: `loaderDot 1100ms ease-in-out ${i * 180}ms infinite`,
            animationPlayState: playState,
          }}
        />
      ))}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   Right column — bare image, no added wash or drop-shadow
   ─────────────────────────────────────────────────────────────────── */

function MemberViewColumn({
  playState,
  c,
}: {
  playState: "running" | "paused";
  c: Required<HiwReplyContent>;
}) {
  return (
    <div className="flex flex-col">
      <p className="eyebrow-muted text-center">{c.memberViewEyebrow}</p>

      {/* Mirror the left column's surface-glass panel — same background,
          same corner radius — but with no padding so the hand-tilted
          mockup bleeds to the edges. overflow-hidden + the rounded corners
          do the cropping, so the hand reads as poking out of / behind the
          box rather than floating inside it. */}
      <div
        className="surface-glass relative mt-4 flex flex-1 items-end justify-start overflow-hidden rounded-[24px]"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255, 255, 255, 0.92), inset 0 -1px 0 rgba(15, 20, 25, 0.04)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[24px]"
          style={{
            background:
              "radial-gradient(60% 60% at 0% 0%, rgba(249, 144, 77, 0.10) 0%, rgba(249, 144, 77, 0) 70%)",
          }}
        />
        {/* Capped at 88% panel height + anchored to the bottom so a strip
            of headroom sits above the phone — the photo no longer feels
            crammed against the top of the panel. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.mockupImage}
          alt={c.mockupAlt}
          className="relative block max-h-[88%] max-w-full object-contain"
          draggable={false}
          style={{
            animation: "fadeUp 700ms ease-out 200ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

/* ── Reasoning row data + icons ─────────────────────────────────────── */

function ClockBackIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6.5A5.5 5.5 0 1 1 3 9.5" />
      <path d="M3 4v2.5h2.5" />
      <path d="M8 5.5V8l1.8 1.2" />
    </svg>
  );
}

function TrendIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2.5 11l3.5-3 2.5 2 4.5-4.5" />
      <path d="M10.5 5.5h3v3" />
    </svg>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="8" cy="8" r="5.5" />
      <circle cx="8" cy="8" r="2.5" />
      <circle cx="8" cy="8" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PulseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M1.5 8h2.5L5.5 5l1.5 6 1.5-4 1 2h5" />
    </svg>
  );
}

function ReflectIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 4.5h7" />
      <path d="M12 4.5l-1.5-1.5M12 4.5l-1.5 1.5" />
      <path d="M11 11.5H4" />
      <path d="M4 11.5l1.5-1.5M4 11.5l1.5 1.5" />
    </svg>
  );
}

function BlockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="8" cy="8" r="5.5" />
      <path d="M4.2 4.2l7.6 7.6" />
    </svg>
  );
}

