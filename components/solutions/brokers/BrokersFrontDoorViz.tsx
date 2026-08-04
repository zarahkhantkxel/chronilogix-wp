"use client";

import { useReveal, useReducedMotion } from "@/components/hooks/useReveal";

/**
 * BrokersFrontDoorViz — hero right-column signature.
 *
 * A "bending the cost curve" chart, the standard shape in healthcare
 * cost-economics: a single rising baseline (do nothing), an intervention
 * point, and the intervention trajectory bending away from the baseline
 * after that point — the widening gap being the cost avoided.
 *
 *   - Baseline "Without Chronilogix" (rust) rises across the whole
 *     timeline as small, unaddressed risks compound into expensive claims.
 *   - "With Chronilogix" (sage) rides the baseline until Chronilogix
 *     engages, then flattens — risk is intercepted between visits before
 *     it surfaces in claims data.
 *
 * Crucially the green line only diverges AFTER the engage marker: before
 * Chronilogix is involved there is no intervention, so both trajectories
 * share the same early baseline. Kept conceptual, not calendar-precise
 * (x-axis reads "Earlier → Later"), because there's no dataset behind the
 * gradations.
 */

// Plot geometry — a 480×300 viewBox.
const PLOT = { left: 48, right: 452, top: 16, bottom: 240 };

// The point Chronilogix engages — where the intervention line bends off
// the shared baseline. Still early, still low-cost.
const ENGAGE = { x: 150, y: 214, tone: "#6FA287" };
const WITHOUT_END = { x: 452, y: 44, tone: "#B23A1C" };

// Baseline (do nothing) — rises across the full timeline. The "With"
// line traces the same curve up to the engage point, then bends flat.
const WITHOUT_PATH =
  "M48,232 C90,228 120,222 150,214 C190,204 220,194 252,180 C286,165 320,140 360,108 C395,80 425,60 452,44";
// Green begins at the engage point — before Chronilogix is involved the
// member simply rides the baseline above.
const WITH_PATH = "M150,214 C210,210 320,206 452,202";

// Filled wedge between the two trajectories, opening only after engage.
const SAVINGS_AREA =
  "M150,214 C210,210 320,206 452,202 L452,44 C425,60 395,80 360,108 C320,140 286,165 252,180 C220,194 190,204 150,214 Z";

export function BrokersFrontDoorViz() {
  const { ref, inView } = useReveal<HTMLDivElement>({ threshold: 0.3 });
  const reduced = useReducedMotion();
  const active = inView || reduced;

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[640px]">
      <svg
        viewBox="0 0 480 300"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <linearGradient id="brokers-without" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E8B04B" />
            <stop offset="55%" stopColor="#F9904D" />
            <stop offset="100%" stopColor="#B23A1C" />
          </linearGradient>
          <linearGradient id="brokers-savings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6FA287" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#6FA287" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* Cost-avoided wedge — the gap between the two trajectories. */}
        <path
          d={SAVINGS_AREA}
          fill="url(#brokers-savings)"
          style={{
            opacity: active ? 1 : 0,
            transition: "opacity 800ms ease-out 1500ms",
          }}
        />

        {/* Axes. */}
        <line
          x1={PLOT.left}
          y1={PLOT.top}
          x2={PLOT.left}
          y2={PLOT.bottom}
          stroke="#5B6470"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        <line
          x1={PLOT.left}
          y1={PLOT.bottom}
          x2={PLOT.right}
          y2={PLOT.bottom}
          stroke="#5B6470"
          strokeOpacity="0.35"
          strokeWidth="1"
        />

        {/* Dashed divider at the point Chronilogix engages. */}
        <line
          x1={ENGAGE.x}
          y1={PLOT.top}
          x2={ENGAGE.x}
          y2={PLOT.bottom}
          stroke="#5B6470"
          strokeOpacity="0.18"
          strokeWidth="1"
          strokeDasharray="3 5"
          style={{
            opacity: active ? 1 : 0,
            transition: "opacity 500ms ease-out 420ms",
          }}
        />

        {/* Baseline — Without Chronilogix, rising across the whole
            timeline. Both scenarios share this curve until the engage
            point. */}
        <path
          d={WITHOUT_PATH}
          fill="none"
          stroke="url(#brokers-without)"
          strokeWidth="2.75"
          strokeLinecap="round"
          style={{
            strokeDasharray: 640,
            strokeDashoffset: active ? 0 : 640,
            transition: reduced
              ? undefined
              : "stroke-dashoffset 1500ms cubic-bezier(0.22,0.61,0.36,1) 320ms",
          }}
        />

        {/* With Chronilogix — bends off the baseline at the engage point
            and flattens. */}
        <path
          d={WITH_PATH}
          fill="none"
          stroke="#6FA287"
          strokeWidth="2.75"
          strokeLinecap="round"
          style={{
            strokeDasharray: 340,
            strokeDashoffset: active ? 0 : 340,
            transition: reduced
              ? undefined
              : "stroke-dashoffset 1100ms cubic-bezier(0.22,0.61,0.36,1) 1100ms",
          }}
        />

        {/* Engage marker (where the line bends) + escalation endpoint. */}
        {[
          { ...ENGAGE, delay: 1100 },
          { x: WITHOUT_END.x, y: WITHOUT_END.y, tone: WITHOUT_END.tone, delay: 2000 },
        ].map((p, i) => (
          <g
            key={i}
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "scale(1)" : "scale(0.4)",
              transformOrigin: `${p.x}px ${p.y}px`,
              transition: `opacity 400ms ease-out ${p.delay}ms, transform 400ms cubic-bezier(0.22,1,0.36,1) ${p.delay}ms`,
            }}
          >
            <circle cx={p.x} cy={p.y} r="9" fill={p.tone} opacity="0.16" />
            <circle cx={p.x} cy={p.y} r="4.5" fill={p.tone} />
          </g>
        ))}

        {/* X-axis endpoint labels — conceptual, not calendar. */}
        <text
          x={PLOT.left}
          y={PLOT.bottom + 22}
          textAnchor="start"
          className="fill-ink-muted"
          style={{ fontSize: 11, fontWeight: 500 }}
        >
          Earlier
        </text>
        <text
          x={PLOT.right}
          y={PLOT.bottom + 22}
          textAnchor="end"
          className="fill-ink-muted"
          style={{ fontSize: 11, fontWeight: 500 }}
        >
          Later
        </text>

        {/* X-axis title. */}
        <text
          x={(PLOT.left + PLOT.right) / 2}
          y={PLOT.bottom + 44}
          textAnchor="middle"
          className="fill-ink-muted uppercase"
          style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.08em" }}
        >
          Time since a risk first appears
        </text>

        {/* Y-axis title, rotated. */}
        <text
          x={-128}
          y={20}
          textAnchor="middle"
          transform="rotate(-90)"
          className="fill-ink-muted uppercase"
          style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.08em" }}
        >
          Cost to your plan
        </text>

        {/* Engage annotation — sits atop the dashed divider. */}
        <text
          x={ENGAGE.x}
          y={54}
          textAnchor="middle"
          className="font-serif"
          style={{
            fontSize: 12,
            fontStyle: "italic",
            fill: "#4C7A62",
            opacity: active ? 1 : 0,
            transition: "opacity 600ms ease-out 1300ms",
          }}
        >
          Chronilogix engages
        </text>

        {/* Line label — Without Chronilogix (escalating, rust). */}
        <text
          x={PLOT.right}
          y={36}
          textAnchor="end"
          className="fill-ink font-serif"
          style={{
            fontSize: 13,
            fontStyle: "italic",
            opacity: active ? 1 : 0,
            transition: "opacity 600ms ease-out 2100ms",
          }}
        >
          Without Chronilogix
        </text>

        {/* Line label — With Chronilogix (flat, sage). */}
        <text
          x={PLOT.right}
          y={228}
          textAnchor="end"
          className="font-serif"
          style={{
            fontSize: 13,
            fontStyle: "italic",
            fill: "#4C7A62",
            opacity: active ? 1 : 0,
            transition: "opacity 600ms ease-out 2100ms",
          }}
        >
          With Chronilogix
        </text>

        {/* Gap label — the cost avoided. */}
        <text
          x={352}
          y={140}
          textAnchor="middle"
          className="font-serif"
          style={{
            fontSize: 13,
            fontStyle: "italic",
            fill: "#4C7A62",
            opacity: active ? 1 : 0,
            transition: "opacity 700ms ease-out 1600ms",
          }}
        >
          Cost avoided
        </text>
      </svg>

      {/* Source line — brief, matches the italic-serif footnote family
          used elsewhere on the page. */}
      <p className="eyebrow-subtle mt-4 max-w-[38ch] text-center mx-auto">
        Engage a risk early and it stays small &mdash; wait, and it
        compounds into a claim.
      </p>
    </div>
  );
}
