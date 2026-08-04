import type React from "react";

// Single-focal-point illustrations. Each toast carries ONE memorable
// element — a big number, a single visual — plus a quiet label.
// The heading in the parent cell becomes the eye's anchor; the
// illustration provides visual punctuation, not a mini-dashboard.

export type Capability = {
  heading: string;
  body: string;
  Illustration: React.FC<{ className?: string }>;
};

const BRAND = "#F9904D";
const BRAND_DEEP = "#E45A1C";

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

/* ─── 1 · A1C — big number + minimal sparkline ──────────────────────── */

function NumbersIllustration({ className }: { className?: string }) {
  return (
    <div className={`flex w-full justify-center ${className ?? ""}`}>
      <ToastSurface className="flex-col gap-1 px-5 py-3.5">
        <span
          className="text-[10px] font-medium tracking-[-0.005em] text-ink-muted"
        >
          A1C
        </span>
        <div className="flex items-end gap-2.5">
          <span className="font-serif text-[34px] leading-none tabular-nums text-ink">
            6.4
            <span className="text-[15px] text-ink-muted">%</span>
          </span>
          <svg
            viewBox="0 0 80 20"
            className="mb-1 h-5 w-[80px]"
            fill="none"
            aria-hidden
          >
            <path
              d="M2 16 L18 13 L34 15 L50 9 L66 5 L78 3"
              stroke={BRAND}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="78" cy="3" r="2" fill={BRAND} />
          </svg>
        </div>
      </ToastSurface>
    </div>
  );
}

/* ─── 2 · Meals — big carb count + small context ───────────────────── */

function MealsIllustration({ className }: { className?: string }) {
  return (
    <div className={`flex w-full justify-center ${className ?? ""}`}>
      <ToastSurface className="flex-col gap-1 px-5 py-3.5">
        <span className="text-[10px] font-medium tracking-[-0.005em] text-ink-muted">
          Lunch, today
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="font-serif text-[34px] leading-none tabular-nums text-ink">
            42
          </span>
          <span
            className="font-serif text-[18px] leading-none text-ink-muted"
          >
            g
          </span>
          <span
            className="ml-2 text-[10.5px] font-medium tracking-[-0.005em]"
            style={{ color: BRAND_DEEP }}
          >
            on plan
          </span>
        </div>
      </ToastSurface>
    </div>
  );
}

/* ─── 3 · Meds — single notification, time-emphasized ──────────────── */

function MedsIllustration({ className }: { className?: string }) {
  return (
    <div className={`flex w-full justify-center ${className ?? ""}`}>
      <ToastSurface className="flex-row items-center gap-3 px-4 py-3">
        <span
          aria-hidden
          className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center"
        >
          <span
            className="absolute h-2.5 w-2.5 rounded-full opacity-35"
            style={{ background: BRAND }}
          />
          <span
            className="block h-1.5 w-1.5 rounded-full"
            style={{ background: BRAND_DEEP }}
          />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="text-[11px] font-medium tracking-[-0.005em] text-ink-muted">
            Metformin
          </span>
          <span className="font-serif text-[19px] leading-tight tabular-nums text-ink">
            8:00 <span className="text-[12px] text-ink-muted">AM</span>
          </span>
        </div>
      </ToastSurface>
    </div>
  );
}

/* ─── 4 · Walks — the tally IS the visual, single small label ──────── */

function MomentumIllustration({ className }: { className?: string }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const done = [true, true, true, true, true, false, false];
  return (
    <div className={`flex w-full justify-center ${className ?? ""}`}>
      <ToastSurface className="flex-col gap-2 px-5 py-3.5">
        <div className="flex items-baseline justify-between gap-6">
          <span className="text-[10px] font-medium tracking-[-0.005em] text-ink-muted">
            Walks this week
          </span>
          <span
            className="text-[10px] font-medium tabular-nums"
            style={{ color: BRAND_DEEP }}
          >
            5 of 7
          </span>
        </div>
        <div className="flex items-end justify-between gap-1.5">
          {days.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span
                aria-hidden
                className="block w-[3px] rounded-full"
                style={{
                  height: done[i] ? 24 : 10,
                  background: done[i] ? BRAND : "rgba(15,20,25,0.16)",
                }}
              />
              <span
                className="text-[9px] font-medium tabular-nums"
                style={{
                  color: i === 4 ? BRAND_DEEP : "rgba(15,20,25,0.40)",
                }}
              >
                {d}
              </span>
            </div>
          ))}
        </div>
      </ToastSurface>
    </div>
  );
}

/* ─── Capability array ──────────────────────────────────────────────── */

export const RONI_CAPABILITIES: Capability[] = [
  {
    heading: "Reads the numbers",
    body: "A1C and blood sugar trends, week over week.",
    Illustration: NumbersIllustration,
  },
  {
    heading: "Plans the meals",
    body: "Carbohydrate awareness. Guidance, never lectures.",
    Illustration: MealsIllustration,
  },
  {
    heading: "Holds the medication thread",
    body: "Timing and adherence between every visit.",
    Illustration: MedsIllustration,
  },
  {
    heading: "Carries the weight of the day",
    body: "Fatigue, movement, and the small wins that compound.",
    Illustration: MomentumIllustration,
  },
];
