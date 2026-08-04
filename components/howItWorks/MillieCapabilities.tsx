import type React from "react";

// Single-focal-point illustrations for Millie. Each toast holds ONE
// memorable element — a number, a wave, a single bubble — so the
// heading in the parent cell can dominate as the eye's anchor.

export type Capability = {
  heading: string;
  body: string;
  Illustration: React.FC<{ className?: string }>;
};

const SLATE = "#3F5C7C";
const SLATE_DEEP = "#2E465F";

/* ─── Shared toast surface ──────────────────────────────────────────── */

function ToastSurface({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative inline-flex rounded-[14px] ${className}`}
      style={{
        background:
          "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.82) 100%)",
        backdropFilter: "blur(14px) saturate(160%)",
        WebkitBackdropFilter: "blur(14px) saturate(160%)",
        border: "1px solid rgba(15,20,25,0.06)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.85), 0 10px 24px -14px rgba(15,20,25,0.18)",
      }}
    >
      {children}
    </div>
  );
}

/* ─── 1 · Grounding — concentric breathing circles ─────────────────── */

function GroundingIllustration({ className }: { className?: string }) {
  return (
    <div className={`flex w-full justify-center ${className ?? ""}`}>
      <ToastSurface className="flex-col items-center gap-2 px-6 py-3.5">
        <span className="text-[10px] font-medium tracking-[-0.005em] text-ink-muted">
          3-3-3 grounding
        </span>
        <svg
          viewBox="0 0 56 56"
          className="h-12 w-12"
          fill="none"
          aria-hidden
        >
          <circle cx="28" cy="28" r="22" stroke={SLATE} strokeOpacity="0.18" strokeWidth="1.5" />
          <circle cx="28" cy="28" r="14" stroke={SLATE} strokeOpacity="0.42" strokeWidth="1.5" />
          <circle cx="28" cy="28" r="6" stroke={SLATE} strokeOpacity="0.7" strokeWidth="1.5" />
          <circle cx="28" cy="28" r="2.5" fill={SLATE_DEEP} />
        </svg>
      </ToastSurface>
    </div>
  );
}

/* ─── 2 · Sleep — big duration + moon glyph ────────────────────────── */

function SleepIllustration({ className }: { className?: string }) {
  return (
    <div className={`flex w-full justify-center ${className ?? ""}`}>
      <ToastSurface className="flex-row items-center gap-3 px-5 py-3.5">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ background: `${SLATE}14` }}
        >
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden>
            <path
              d="M15 12 a7 7 0 1 1 -7 -8 a5.5 5.5 0 0 0 7 8 z"
              fill={SLATE_DEEP}
            />
          </svg>
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] font-medium tracking-[-0.005em] text-ink-muted">
            Last night
          </span>
          <span className="font-serif text-[24px] leading-tight tabular-nums text-ink">
            7h 12m
          </span>
        </div>
      </ToastSurface>
    </div>
  );
}

/* ─── 3 · Mood — a single soft mood curve, no labels ───────────────── */

function MoodIllustration({ className }: { className?: string }) {
  return (
    <div className={`flex w-full justify-center ${className ?? ""}`}>
      <ToastSurface className="flex-col gap-1.5 px-5 py-3.5">
        <span className="text-[10px] font-medium tracking-[-0.005em] text-ink-muted">
          Mood, lifting
        </span>
        <svg
          viewBox="0 0 140 36"
          className="h-9 w-[140px]"
          fill="none"
          aria-hidden
        >
          <path
            d="M4 26 Q 20 22 36 24 T 70 18 T 104 10 T 136 6"
            stroke={SLATE}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.6"
          />
          <circle cx="136" cy="6" r="2.5" fill={SLATE_DEEP} />
        </svg>
      </ToastSurface>
    </div>
  );
}

/* ─── 4 · Hard conversations — one bubble, the moment Millie lands ─── */

function ConversationIllustration({ className }: { className?: string }) {
  return (
    <div
      className={`mx-auto flex w-full max-w-[210px] flex-col items-start gap-1.5 ${
        className ?? ""
      }`}
    >
      <span className="ml-1 text-[10px] font-medium tracking-[-0.005em] text-ink-muted">
        Millie, 11:42 PM
      </span>
      <div className="flex items-start gap-2">
        <span
          aria-hidden
          className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: SLATE }}
        />
        <div
          className="rounded-[14px] rounded-bl-[4px] px-3.5 py-2 text-[12.5px] leading-[1.45] text-ink-soft"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.82) 100%)",
            border: "1px solid rgba(15,20,25,0.06)",
            boxShadow:
              "0 8px 20px -12px rgba(15,20,25,0.18)",
          }}
        >
          That&rsquo;s the muscle.
        </div>
      </div>
    </div>
  );
}

/* ─── Capability array ──────────────────────────────────────────────── */

export const MILLIE_CAPABILITIES: Capability[] = [
  {
    heading: "Grounding when it spikes",
    body: "Anxiety techniques, breathing, the 3-3-3.",
    Illustration: GroundingIllustration,
  },
  {
    heading: "Sleep and rest",
    body: "Patterns that shape the next day.",
    Illustration: SleepIllustration,
  },
  {
    heading: "Mood patterns",
    body: "Emotional weather, tracked over weeks.",
    Illustration: MoodIllustration,
  },
  {
    heading: "The hard conversations",
    body: "Boundaries, coping skills, the muscle that builds resilience.",
    Illustration: ConversationIllustration,
  },
];
