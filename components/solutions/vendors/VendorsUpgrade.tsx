"use client";

import React from "react";
import { useReveal, useReducedMotion } from "@/components/hooks/useReveal";

/**
 * VendorsUpgrade — the positioning turn (audio beat 3).
 *
 * Directly renders the audio's central claim: "Chronilogix is the
 * outcomes upgrade your products have been missing." Then names the three
 * things it drives, verbatim from the brief — sustained utilization,
 * adherence, and measurable real-world results.
 *
 * The "how" (24/7 Roni AI, MI) is deliberately held back for the next
 * section (Meet Roni AI); this beat is purely the WHAT: a coaching
 * layer that sits on top of the product the vendor already ships.
 *
 * Left column: the claim, framed as an oversized statement, paid off by
 * three branded property tiles.
 * Right column: an isometric layer diagram — the vendor's product plane
 * with a behavioral-signal stratum and the Chronilogix coaching layer
 * stacked on top, coaching touchpoints rising off it.
 */

/* ── Branded icon language — copied from the nav / MIExplainer tile system
   so this section's icons match the rest of the site. ──────────────────── */

type IconVariant = "peach" | "coral" | "ember";

const ICON_BG: Record<IconVariant, string> = {
  peach:
    "radial-gradient(ellipse 70% 85% at 50% 105%, rgba(184,70,20,0.45) 0%, rgba(184,70,20,0) 68%), linear-gradient(180deg, #FB9C5E 0%, #FF7434 100%)",
  coral:
    "radial-gradient(ellipse 65% 70% at 50% -8%, rgba(253,179,125,0.55) 0%, rgba(253,179,125,0) 60%), linear-gradient(180deg, #FF7434 0%, #E45A1C 100%)",
  ember:
    "radial-gradient(circle at 28% 32%, rgba(253,179,125,0.5) 0%, rgba(253,179,125,0) 55%), radial-gradient(circle at 74% 74%, rgba(120,40,10,0.42) 0%, rgba(120,40,10,0) 55%), linear-gradient(135deg, #FB9C5E 0%, #B84614 100%)",
};

type Glyph = "sustain" | "adhere" | "measure";

type Property = {
  title: string;
  body: string;
  variant: IconVariant;
  glyph: Glyph;
};

// Glyph + variant per property stay hardcoded (decorative), matched to the
// editable title/body pairs by index.
const PROPERTY_STYLES: { glyph: Glyph; variant: IconVariant }[] = [
  { glyph: "sustain", variant: "peach" },
  { glyph: "adhere", variant: "coral" },
  { glyph: "measure", variant: "ember" },
];

// Editable content (ACF-backed). `body` carries inline emphasis a plain
// textarea cannot, so its default is a ReactNode left unseeded; every other
// field falls back to the original hardcoded copy when empty.
export type VendorsUpgradeContent = {
  eyebrow?: string;
  headingPre?: string;
  headingEmph?: string;
  headingPost?: string;
  body?: React.ReactNode;
  properties?: { title: string; body: string }[];
};

const DEFAULTS = {
  eyebrow: "The upgrade",
  headingPre: "Chronilogix is the",
  headingEmph: "outcomes upgrade",
  headingPost: "your products have been missing.",
  body: (
    <>
      24/7 AI-powered chronic care and behavioral health coaching that sits{" "}
      <em className="not-italic font-medium text-ink">on top</em> of your
      existing solutions, driving sustained utilization, adherence, and
      measurable results in the real world. You don&rsquo;t replace your
      product. You upgrade it.
    </>
  ),
  properties: [
    {
      title: "Sustained utilization",
      body: "Patients keep using what you ship, long past the first 90 days.",
    },
    {
      title: "Higher adherence",
      body: "The care plan sticks, because someone keeps showing up for it.",
    },
    {
      title: "Measurable results",
      body: "Real-world outcomes your buyers can defend at renewal.",
    },
  ],
} satisfies Required<VendorsUpgradeContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function VendorsUpgrade({
  content,
}: {
  content?: VendorsUpgradeContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const propertyContent = content?.properties?.length
    ? content.properties
    : DEFAULTS.properties;
  const PROPERTIES: Property[] = propertyContent.map((p, i) => ({
    title: p.title,
    body: p.body,
    glyph: PROPERTY_STYLES[i % PROPERTY_STYLES.length].glyph,
    variant: PROPERTY_STYLES[i % PROPERTY_STYLES.length].variant,
  }));
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="vendors-upgrade-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 90% 10%, rgba(249,144,77,0.14), transparent 70%), radial-gradient(50% 45% at 10% 95%, rgba(228,90,28,0.10), transparent 75%)",
        }}
      />

      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20 lg:items-center">
          <div>
            <p className="reveal-row eyebrow [transition-delay:60ms]">
              {c.eyebrow}
            </p>
            <h2
              id="vendors-upgrade-label"
              className="reveal-row mt-4 font-serif font-normal text-section leading-[1.05] text-ink [transition-delay:160ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.headingPre}{" "}
              <span className="text-brand-700">{c.headingEmph}</span>{" "}
              {c.headingPost}
            </h2>

            <p className="reveal-row mt-6 max-w-[52ch] body-prose [transition-delay:260ms]">
              {c.body}
            </p>

            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {PROPERTIES.map((p, i) => (
                <li
                  key={p.title}
                  className="reveal-row group rounded-2xl border border-ink/[0.08] bg-white/70 p-5 backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_1px_2px_rgba(15,20,25,0.04),0_18px_36px_-24px_rgba(184,70,20,0.5)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  style={{ transitionDelay: `${400 + i * 90}ms` }}
                >
                  <PropertyTile variant={p.variant} glyph={p.glyph} />
                  <p className="mt-4 text-[13.5px] font-semibold tracking-tight text-ink">
                    {p.title}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-snug text-ink-muted">
                    {p.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Layer diagram — the vendor's product plane, a behavioral-signal
              stratum, and the Chronilogix coaching layer stacked on top. */}
          <div className="reveal-row [transition-delay:520ms]">
            <LayerStack />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Property tile — nav/MIExplainer icon language at card scale ─────────── */

function PropertyTile({
  variant,
  glyph,
}: {
  variant: IconVariant;
  glyph: Glyph;
}) {
  return (
    <span
      className="flex h-9 w-9 items-center justify-center rounded-[11px] text-white shadow-[0_1px_2px_rgba(15,20,25,0.06),0_8px_18px_-10px_rgba(184,70,20,0.5)] transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      style={{ backgroundImage: ICON_BG[variant] }}
    >
      <PropertyGlyph glyph={glyph} />
    </span>
  );
}

// White glyphs drawn to read clearly at ~18px, one distinct mark per property.
function PropertyGlyph({ glyph }: { glyph: Glyph }) {
  if (glyph === "sustain") {
    // Ongoing activity pulse — usage that keeps going.
    return (
      <svg aria-hidden viewBox="0 0 18 18" className="h-[18px] w-[18px]" fill="none">
        <path
          d="M2 9h2.6l1.8-4 2.6 8 1.9-4H16"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (glyph === "adhere") {
    // Rising steps — adherence climbing and holding.
    return (
      <svg aria-hidden viewBox="0 0 18 18" className="h-[18px] w-[18px]" fill="none">
        <path
          d="M3 14.5h12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M3.5 13v-2.4h3.4V8.2h3.4V5.8h3.4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.9 3.7 13.7 5.8 11.6 7.4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // measure — a small bar chart: measurable, defensible outcomes.
  return (
    <svg aria-hidden viewBox="0 0 18 18" className="h-[18px] w-[18px]" fill="none">
      <path
        d="M2.6 15h12.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M5 15V9.5M9 15V6M13 15V3.4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Layer diagram ──────────────────────────────────────────────────────── */

// Isometric geometry. Each plate is a flat diamond top plus two extruded
// side faces, so the layers read as solid slabs with real thickness. Labels
// live entirely OUTSIDE the plates, tied back with thin leader lines.
const CX = 172; // stack center x
const HX = 112; // diamond half-width (x)
const VY = 36; // diamond half-height (y)

type PlateShape = { top: string; right: string; left: string };

function plate(cy: number, t: number): PlateShape {
  const topPath = `M${CX} ${cy - VY} L${CX + HX} ${cy} L${CX} ${cy + VY} L${CX - HX} ${cy} Z`;
  const rightPath = `M${CX + HX} ${cy} L${CX} ${cy + VY} L${CX} ${cy + VY + t} L${CX + HX} ${cy + t} Z`;
  const leftPath = `M${CX} ${cy + VY} L${CX - HX} ${cy} L${CX - HX} ${cy + t} L${CX} ${cy + VY + t} Z`;
  return { top: topPath, right: rightPath, left: leftPath };
}

const BOTTOM = plate(312, 16); // vendor product plane
const MIDDLE = plate(212, 8); // behavioral-signal stratum (thin, dark)
const TOP = plate(104, 18); // Chronilogix coaching layer (brand, elevated)

// Coaching touchpoints rising off the brand plate. Each entry seeds a
// float loop (reduced-motion visitors get them held in place instead).
const TOUCHPOINTS = [
  { x: 132, r: 2.4, delay: 0, dur: 3600, top: 74 },
  { x: 158, r: 3.4, delay: 900, dur: 4200, top: 58 },
  { x: 186, r: 2.8, delay: 1800, dur: 3900, top: 66 },
  { x: 210, r: 3.6, delay: 500, dur: 4500, top: 52 },
  { x: 232, r: 2.6, delay: 2400, dur: 4000, top: 70 },
];

function LayerStack() {
  const reduced = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      {/* Ambient warm wash centered on the coaching layer. */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 42% 32%, rgba(255,116,52,0.22), transparent 62%)",
        }}
      />

      <svg
        viewBox="0 0 400 400"
        className="relative h-full w-full"
        style={{ fontFamily: "var(--font-sans)" } as React.CSSProperties}
        role="img"
        aria-label="Diagram: the Chronilogix coaching layer sitting on top of a behavioral-signal layer and your existing product, with 24/7 coaching touchpoints rising off it."
      >
        <defs>
          <linearGradient id="vuPaperTop" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#F1EADF" />
          </linearGradient>
          <linearGradient id="vuInkTop" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0" stopColor="#333A44" />
            <stop offset="1" stopColor="#1B212A" />
          </linearGradient>
          <linearGradient id="vuBrandTop" x1="0.05" y1="0" x2="0.85" y2="1">
            <stop offset="0" stopColor="#FDB37D" />
            <stop offset="0.55" stopColor="#F9904D" />
            <stop offset="1" stopColor="#F0722C" />
          </linearGradient>
          <filter
            id="vuGlow"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feDropShadow
              dx="0"
              dy="12"
              stdDeviation="14"
              floodColor="#E45A1C"
              floodOpacity="0.32"
            />
          </filter>
        </defs>

        {/* Bottom plate — the vendor's device / RPM / portal / app. */}
        <g>
          <path d={BOTTOM.left} fill="#E1D6C6" />
          <path d={BOTTOM.right} fill="#EDE4D6" />
          <path
            d={BOTTOM.top}
            fill="url(#vuPaperTop)"
            stroke="#0F1419"
            strokeOpacity="0.10"
            strokeWidth="1"
          />
        </g>

        {/* Middle plate — the behavioral-signal stratum (thin, ink). */}
        <g>
          <path d={MIDDLE.left} fill="#10151A" />
          <path d={MIDDLE.right} fill="#1B212A" />
          <path d={MIDDLE.top} fill="url(#vuInkTop)" />
        </g>

        {/* Top plate — Chronilogix coaching layer (brand, elevated). */}
        <g filter="url(#vuGlow)">
          <path d={TOP.left} fill="#B84614" />
          <path d={TOP.right} fill="#E45A1C" />
          <path
            d={TOP.top}
            fill="url(#vuBrandTop)"
            stroke="#FFFFFF"
            strokeOpacity="0.28"
            strokeWidth="1"
          />
        </g>

        {/* Coaching touchpoints rising off the coaching layer. */}
        {TOUCHPOINTS.map((d, i) =>
          reduced ? (
            <circle
              key={i}
              cx={d.x}
              cy={d.top}
              r={d.r}
              fill="#FF7434"
              opacity={0.72}
            />
          ) : (
            <circle
              key={i}
              cx={d.x}
              cy={d.top}
              r={d.r}
              fill="#FF7434"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: `vuRise ${d.dur}ms cubic-bezier(0.4,0,0.2,1) ${d.delay}ms infinite`,
              }}
            />
          ),
        )}

        {/* Touchpoint caption — names the rising dots so their meaning is
            unambiguous, tucked top-left clear of the right-hand labels. */}
        <line
          x1="96"
          y1="46"
          x2="120"
          y2="60"
          stroke="#FF7434"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
        <text
          x="92"
          y="42"
          textAnchor="end"
          fontSize="11"
          fontWeight={600}
          fill="#E45A1C"
        >
          24/7 touchpoints
        </text>

        {/* Annotation labels — all copy lives out here, tied to each plate
            with a thin leader line. */}
        <PlateLabel
          cy={104}
          accent="#E45A1C"
          title="Chronilogix"
          titleColor="#E45A1C"
          sub="coaching layer"
        />
        <PlateLabel
          cy={212}
          accent="#5B6470"
          title="Behavioral signal"
          titleColor="#2A3038"
          sub="real-world data"
        />
        <PlateLabel
          cy={312}
          accent="#8A93A0"
          title="Your product"
          titleColor="#2A3038"
          sub="device · RPM · app"
        />
      </svg>

      {/* Scoped float keyframe for the touchpoints. */}
      <style>{`
        @keyframes vuRise {
          0%   { opacity: 0; transform: translateY(8px); }
          18%  { opacity: 0.9; }
          70%  { opacity: 0.6; }
          100% { opacity: 0; transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

// One annotation: a leader line from the plate's right vertex out to a
// stacked two-line label. Kept in SVG so it scales with the diagram and
// never reflows over the plates.
function PlateLabel({
  cy,
  accent,
  title,
  titleColor,
  sub,
}: {
  cy: number;
  accent: string;
  title: string;
  titleColor: string;
  sub: string;
}) {
  const vertexX = CX + HX; // right vertex of the diamond, at height cy
  const railX = 296;
  const textX = 302;
  return (
    <g>
      <path
        d={`M${vertexX} ${cy} H${railX}`}
        stroke={accent}
        strokeOpacity="0.55"
        strokeWidth="1"
      />
      <circle cx={railX} cy={cy} r="1.8" fill={accent} />
      <text
        x={textX}
        y={cy - 3}
        fontSize="12.5"
        fontWeight={600}
        fill={titleColor}
      >
        {title}
      </text>
      <text x={textX} y={cy + 11} fontSize="10.5" fill="#8A93A0">
        {sub}
      </text>
    </g>
  );
}
