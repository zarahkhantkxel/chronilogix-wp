"use client";

import { useReveal, useReducedMotion } from "@/components/hooks/useReveal";

type Metric = {
  lead: string;
  caption: string;
  comparison: string;
};

type MetricWithIllustration = Metric & {
  Illustration: React.ComponentType<{ playState: "running" | "paused" }>;
};

const ROMAN = ["I", "II", "III"];

/* ── Metric I — 0 hires needed ──────────────────────────────────────────
   Four abstract head-and-shoulder silhouettes in a row, with a
   diagonal strike-through drawing across on reveal. Uses `methodLine`
   to draw the stroke, then a subtle fade of the row itself. */
function HiresStrikeIllustration({
  playState,
}: {
  playState: "running" | "paused";
}) {
  return (
    <svg
      viewBox="0 0 72 40"
      className="h-10 w-[72px] text-ink/45"
      fill="none"
      aria-hidden
    >
      {/* Four head-and-shoulder silhouettes, evenly spaced. Head is a
          simple circle, shoulders a shallow arch — reads as "team row"
          without cartoon detail. */}
      {[6, 24, 42, 60].map((cx, i) => (
        <g
          key={cx}
          style={{
            opacity: 0,
            animation: `fadeUp 460ms cubic-bezier(0.22, 0.61, 0.36, 1) ${180 + i * 90}ms forwards`,
            animationPlayState: playState,
          }}
        >
          <circle
            cx={cx}
            cy="14"
            r="4"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d={`M ${cx - 6.5} 30 C ${cx - 6.5} 22.5, ${cx + 6.5} 22.5, ${cx + 6.5} 30`}
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* The strike — a single diagonal line drawing across the whole
          row. Uses the `methodLine` keyframe (stroke-dashoffset: 0). */}
      <line
        x1="2"
        y1="32"
        x2="70"
        y2="6"
        stroke="#E45A1C"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="80"
        strokeDashoffset="80"
        style={{
          animation:
            "methodLine 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 620ms forwards",
          animationPlayState: playState,
        }}
      />
    </svg>
  );
}

/* ── Metric II — 30 yrs of methodology ──────────────────────────────────
   A horizontal timeline compressed into a coil / spring. Draws in as
   a single stroke via `methodLine`. Serif-italic tick labels sit at
   either end ("1994" / "today") once the coil finishes drawing. */
function TimelineCoilIllustration({
  playState,
}: {
  playState: "running" | "paused";
}) {
  return (
    <svg
      viewBox="0 0 96 40"
      className="h-10 w-[96px]"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="ap-coil-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F9904D" stopOpacity="0.4" />
          <stop offset="55%" stopColor="#FF7434" />
          <stop offset="100%" stopColor="#E45A1C" />
        </linearGradient>
      </defs>

      {/* Small serif-italic tick labels — muted, at the two ends. */}
      <text
        x="4"
        y="8"
        fontFamily="serif"
        fontStyle="italic"
        fontSize="7"
        fill="#5B6470"
        style={{
          opacity: 0,
          animation:
            "fadeUp 500ms cubic-bezier(0.22, 0.61, 0.36, 1) 900ms forwards",
          animationPlayState: playState,
        }}
      >
        1994
      </text>
      <text
        x="72"
        y="8"
        fontFamily="serif"
        fontStyle="italic"
        fontSize="7"
        fill="#E45A1C"
        style={{
          opacity: 0,
          animation:
            "fadeUp 500ms cubic-bezier(0.22, 0.61, 0.36, 1) 1020ms forwards",
          animationPlayState: playState,
        }}
      >
        today
      </text>

      {/* The coil itself — a compressed spring. Draws in via
          stroke-dashoffset (methodLine keyframe). */}
      <path
        d="M 6 26 C 10 14, 18 14, 22 26 S 34 38, 38 26 S 50 14, 54 26 S 66 38, 70 26 S 82 14, 86 26"
        stroke="url(#ap-coil-grad)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="200"
        strokeDashoffset="200"
        style={{
          animation:
            "methodLine 900ms cubic-bezier(0.22, 0.61, 0.36, 1) 260ms forwards",
          animationPlayState: playState,
        }}
      />

      {/* End caps — small tick anchors at either end of the coil. */}
      <circle
        cx="6"
        cy="26"
        r="1.6"
        fill="#F9904D"
        style={{
          opacity: 0,
          animation:
            "oversightDot 260ms cubic-bezier(0.22, 0.61, 0.36, 1) 260ms forwards",
          animationPlayState: playState,
        }}
      />
      <circle
        cx="86"
        cy="26"
        r="1.6"
        fill="#E45A1C"
        style={{
          opacity: 0,
          animation:
            "oversightDot 260ms cubic-bezier(0.22, 0.61, 0.36, 1) 1120ms forwards",
          animationPlayState: playState,
        }}
      />
    </svg>
  );
}

/* ── Metric III — Auto included ─────────────────────────────────────────
   Three stacked "deal" cards with a small "+ Chronilogix" arrow
   pointing to each. Cards fade in in sequence via oversightDot, the
   arrow strokes draw in via methodLine on the same cadence. */
function AutoDealsIllustration({
  playState,
}: {
  playState: "running" | "paused";
}) {
  const rows = [0, 1, 2];
  return (
    <svg
      viewBox="0 0 96 48"
      className="h-12 w-[96px]"
      fill="none"
      aria-hidden
    >
      {rows.map((i) => {
        const y = 4 + i * 14;
        const enter = 200 + i * 220;
        return (
          <g
            key={i}
            style={{
              opacity: 0,
              animation: `oversightDot 460ms cubic-bezier(0.22, 0.61, 0.36, 1) ${enter}ms forwards`,
              animationPlayState: playState,
            }}
          >
            {/* Deal card */}
            <rect
              x="4"
              y={y}
              width="42"
              height="10"
              rx="2"
              stroke="#0F1419"
              strokeOpacity="0.28"
              strokeWidth="1.2"
              fill="#FBF8F4"
            />
            {/* Small line inside the card to imply title + row */}
            <line
              x1="7.5"
              y1={y + 3.5}
              x2="24"
              y2={y + 3.5}
              stroke="#0F1419"
              strokeOpacity="0.32"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <line
              x1="7.5"
              y1={y + 6.8}
              x2="18"
              y2={y + 6.8}
              stroke="#0F1419"
              strokeOpacity="0.18"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Arrow — draws in a beat after the card lands */}
            <line
              x1="48"
              y1={y + 5}
              x2="70"
              y2={y + 5}
              stroke="#E45A1C"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray="26"
              strokeDashoffset="26"
              style={{
                animation: `methodLine 420ms cubic-bezier(0.22, 0.61, 0.36, 1) ${enter + 220}ms forwards`,
                animationPlayState: playState,
              }}
            />
            <path
              d={`M 67 ${y + 2.5} L 70 ${y + 5} L 67 ${y + 7.5}`}
              stroke="#E45A1C"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                opacity: 0,
                animation: `oversightDot 260ms cubic-bezier(0.22, 0.61, 0.36, 1) ${enter + 520}ms forwards`,
                animationPlayState: playState,
              }}
            />

            {/* + Chronilogix badge — a compact circular plus at the
                right end. Italic serif "C" mark inside implies the
                Chronilogix payload without a wordmark. */}
            <circle
              cx="78"
              cy={y + 5}
              r="4.2"
              fill="#FFE6D4"
              stroke="#E45A1C"
              strokeWidth="1.2"
              style={{
                opacity: 0,
                animation: `oversightDot 340ms cubic-bezier(0.22, 0.61, 0.36, 1) ${enter + 600}ms forwards`,
                animationPlayState: playState,
              }}
            />
            <text
              x="78"
              y={y + 7.4}
              textAnchor="middle"
              fontFamily="serif"
              fontStyle="italic"
              fontSize="6.5"
              fill="#E45A1C"
              style={{
                opacity: 0,
                animation: `oversightDot 340ms cubic-bezier(0.22, 0.61, 0.36, 1) ${enter + 720}ms forwards`,
                animationPlayState: playState,
              }}
            >
              C
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Illustrations are decorative and matched to metrics by index.
const ILLUSTRATIONS: React.ComponentType<{
  playState: "running" | "paused";
}>[] = [HiresStrikeIllustration, TimelineCoilIllustration, AutoDealsIllustration];

export type AppPartnersNumbersContent = {
  eyebrow?: string;
  heading?: string;
  rangeLabel?: string;
  footnote?: string;
  metrics?: Metric[];
};

const DEFAULTS = {
  eyebrow: "By the numbers",
  heading: "What partners get without lifting a finger.",
  rangeLabel: "I to III",
  footnote:
    "Chronilogix business model — Roni AI embedded as the coaching engine inside partner apps.",
  metrics: [
    {
      lead: "0",
      caption: "Behavioral-science hires needed",
      comparison: "Team of PhDs → API call",
    },
    {
      lead: "30 yrs",
      caption: "Of methodology, embedded",
      comparison: "Build from zero → Dr. Resnicow's life's work",
    },
    {
      lead: "Auto",
      caption: "Every plan sale ships with it",
      comparison: "Extra deal → wider distribution",
    },
  ],
} satisfies Required<AppPartnersNumbersContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function AppPartnersNumbers({
  content,
}: {
  content?: AppPartnersNumbersContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const baseMetrics = content?.metrics?.length
    ? content.metrics
    : DEFAULTS.metrics;
  const metrics: MetricWithIllustration[] = baseMetrics.map((m, i) => ({
    ...m,
    Illustration: ILLUSTRATIONS[i % ILLUSTRATIONS.length],
  }));
  const { ref, inView } = useReveal<HTMLDivElement>();
  const reducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="ap-numbers-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-[46ch]">
            <p className="reveal-row eyebrow [transition-delay:80ms]">
              {c.eyebrow}
            </p>
            <h2
              id="ap-numbers-label"
              className="reveal-row mt-4 font-serif font-normal text-section text-ink [transition-delay:180ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.heading}
            </h2>
          </div>
          <p className="reveal-row eyebrow-subtle [transition-delay:260ms]">
            {c.rangeLabel}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 lg:mt-16 lg:gap-x-10">
          {metrics.map((m, i) => (
            <MetricColumn
              key={m.lead + i}
              metric={m}
              index={i}
              revealed={inView}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        <p className="eyebrow-subtle reveal-row mt-14 [transition-delay:700ms]">
          {c.footnote}
        </p>
      </div>
    </section>
  );
}

function MetricColumn({
  metric,
  index,
  revealed,
  reducedMotion,
}: {
  metric: MetricWithIllustration;
  index: number;
  revealed: boolean;
  reducedMotion: boolean;
}) {
  const numeral = ROMAN[index] ?? String(index + 1);
  const parts = metric.comparison.split(/\s*→\s*/);
  const hasArrow = parts.length === 2;
  const enterDelay = 340 + index * 140;
  const underlineDelay = enterDelay + 220;
  const playState = revealed && !reducedMotion ? "running" : "paused";
  const { Illustration } = metric;

  return (
    <div
      className={`reveal-row flex flex-col gap-5 ${
        index > 0 ? "sm:border-l sm:border-ink/10 sm:pl-7" : ""
      }`}
      style={{ transitionDelay: `${enterDelay}ms` }}
    >
      {/* Custom illustration — sits above the roman numeral chip.
          Fixed height so all three columns align on the baseline of
          the numeral, even if the SVGs are different widths. */}
      <div className="flex h-12 items-end">
        <Illustration playState={playState} />
      </div>

      <span className="font-serif text-[12px] italic tracking-[0.04em] text-brand-700/80">
        {numeral}.
      </span>
      <div className="relative w-fit pb-3">
        <p className="font-serif text-stat-md font-normal text-ink">
          {metric.lead}
        </p>
        <span
          aria-hidden
          className="absolute bottom-0 left-0 block h-[2px] origin-left rounded-full"
          style={{
            width: "44%",
            background: "linear-gradient(90deg, #FF7434 0%, #FFB088 100%)",
            transform: reducedMotion ? "scaleX(1)" : "scaleX(0)",
            animation: reducedMotion
              ? "none"
              : `barGrow 600ms cubic-bezier(0.22,1,0.36,1) ${underlineDelay}ms forwards`,
            animationPlayState: playState,
          }}
        />
      </div>
      <div>
        <p className="text-sm font-medium leading-snug text-ink md:text-base">
          {metric.caption}
        </p>
        {hasArrow ? (
          <p className="mt-2 font-serif text-[13px] italic leading-snug">
            <span className="text-ink/45">{parts[0]}</span>
            <span aria-hidden className="mx-1.5 not-italic text-brand-700">
              →
            </span>
            <span className="text-ink-soft">{parts[1]}</span>
          </p>
        ) : (
          <p className="mt-2 font-serif text-[13px] italic text-ink-muted">
            {metric.comparison}
          </p>
        )}
      </div>
    </div>
  );
}

