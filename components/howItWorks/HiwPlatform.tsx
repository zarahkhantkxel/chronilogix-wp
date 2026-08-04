"use client";

import { useEffect, useRef, useState } from "react";

type Row = {
  eyebrow: string;
  heading: string;
  body: React.ReactNode;
  Visual: React.ComponentType<{ active: boolean }>;
  // Optional per-row aspect override for the illustration frame.
  // Defaults to the White-label portrait (4/5 → md:5/6). Coverage
  // overrides to a shorter frame so the module grid fills without
  // leaving a big empty top and so the left content column reads as
  // balanced weight against the illustration.
  aspectClass?: string;
};

/**
 * Platform section — two anchored claims, each with its own bespoke
 * visual that *shows* the concept rather than describing it.
 *
 *   01 · White-label   The same coaching, under any brand. Visualised as
 *                      a partner-app card whose brand chrome cycles
 *                      while the Chronilogix coaching content underneath
 *                      stays identical.
 *   02 · Coverage      Two active coaches plus four chronic-care modules
 *                      in development. Visualised as a 2+4 module grid
 *                      where the active tiles read solid and the in-dev
 *                      tiles read as dashed outlines with a quiet pulse.
 */

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

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty. Collections carry non-text structure
// (body ReactNode / Visual / aspectClass / state / Icon) that stays fixed —
// only the text fields are merged by index over the defaults below.
export type HiwPlatformContent = {
  headingLead?: string;
  headingMuted?: string;
  intro?: string;
  rows?: { eyebrow?: string; heading?: string }[];
  modules?: { name?: string; domain?: string }[];
};

const DEFAULTS = {
  headingLead: "Built to fit.",
  headingMuted: "Built to grow.",
  intro: "Deployed under your brand today. Built to expand with you.",
} satisfies Required<Pick<HiwPlatformContent, "headingLead" | "headingMuted" | "intro">>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function HiwPlatform({ content }: { content?: HiwPlatformContent }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const modules = MODULES.map((m, i) => ({
    ...m,
    ...clean(content?.modules?.[i]),
  }));
  const rows = ROWS.map((r, i) => {
    const merged = { ...r, ...clean(content?.rows?.[i]) };
    // The Coverage row's module grid needs the resolved (possibly
    // overridden) module text. Row.Visual only receives `{ active }`, so
    // wrap it in a closure that injects the resolved modules.
    if (r.Visual === CoverageVisual) {
      return {
        ...merged,
        Visual: (p: { active: boolean }) => (
          <CoverageVisual {...p} modules={modules} />
        ),
      };
    }
    return merged;
  });

  return (
    <section
      id="platform"
      className="relative overflow-hidden rounded-[28px] bg-white pt-10 pb-24 md:pt-12 md:pb-32 lg:pt-14 lg:pb-40"
    >
      <div className="container-page">
        {/* Header */}
        <div className="max-w-3xl">
          <h2
            className="mt-4 text-hero font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {c.headingLead}{" "}
            <span className="text-ink-muted">{c.headingMuted}</span>
          </h2>
          <p className="mt-5 max-w-[58ch] body-quiet">{c.intro}</p>
        </div>

        {/* Two anchored rows, alternating sides. */}
        <div className="mt-20 space-y-24 md:mt-28 md:space-y-32 lg:space-y-40">
          {rows.map((row, i) => (
            <PlatformRow key={row.heading} row={row} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformRow({ row }: { row: Row; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const { Visual } = row;

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20"
    >
      {/* Content — always left on desktop, matching the home credibility
          section's consistent text-left / visual-right rhythm. */}
      <div
        className="order-2 lg:order-none flex flex-col justify-center"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(18px)",
          transition:
            "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 240ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 240ms",
        }}
      >
        <p className="eyebrow-muted">{row.eyebrow}</p>
        <h3 className="mt-3 max-w-[22ch] text-row font-serif font-normal text-ink">
          {row.heading}
        </h3>
        <p className="mt-5 max-w-[44ch] body-quiet">{row.body}</p>
      </div>

      {/* Bespoke visual — always right on desktop. */}
      <div
        className="order-1 lg:order-none"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "scale(1)" : "scale(0.97)",
          transition:
            "opacity 800ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        <div
          className={`relative w-full overflow-hidden rounded-[24px] border border-ink/[0.08] bg-paper shadow-[0_10px_28px_-18px_rgba(20,8,2,0.18)] ${
            row.aspectClass ?? "aspect-[4/5] md:aspect-[5/6]"
          }`}
        >
          <Visual active={inView} />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* 01 — White-label visual                                                  */
/*                                                                          */
/* A partner-app card whose chrome cycles through three partner brands      */
/* while the Chronilogix coaching content underneath stays identical.       */
/* The cycle is what carries the claim: same coach, any brand.              */
/* ──────────────────────────────────────────────────────────────────────── */

type PartnerBrand = {
  name: string;
  // A small SVG mark that sits next to the brand name. Kept abstract so
  // the visual reads as "any partner brand" rather than a real customer.
  mark: React.ComponentType<{ className?: string }>;
  // The brand's accent color used for the mark + a hairline above the
  // chat content. Chosen to imply variety across partner types.
  tint: string;
};

const PARTNER_BRANDS: PartnerBrand[] = [
  {
    // Health plan archetype — soft shield silhouette with a discreet cross.
    // Reads instantly as "insurer / medical benefits" without copying any
    // real trademark. Fill-plus-stroke gives the mark real body next to
    // the wordmark, not a lonely outline.
    name: "BlueCircle Health",
    mark: ({ className }) => (
      <svg
        className={className}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        aria-hidden
      >
        <path
          d="M8 1.5 L13.5 3.8 V8.4 C13.5 11.4 11.1 13.9 8 14.5 C4.9 13.9 2.5 11.4 2.5 8.4 V3.8 Z"
          fill="currentColor"
          fillOpacity="0.18"
        />
        <path
          d="M8 1.5 L13.5 3.8 V8.4 C13.5 11.4 11.1 13.9 8 14.5 C4.9 13.9 2.5 11.4 2.5 8.4 V3.8 Z"
        />
        <path
          d="M8 5.4 V10.4 M5.5 7.9 H10.5"
          strokeWidth="1.55"
          strokeLinecap="round"
        />
      </svg>
    ),
    tint: "#2F6DB1",
  },
  {
    // Wellness / employer benefit archetype — a stylised leaf with a vein.
    // Organic silhouette and a single interior line do the wellness cue
    // without leaning on the tired "water drop" cliché.
    name: "Wellspring Co.",
    mark: ({ className }) => (
      <svg
        className={className}
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden
      >
        <path
          d="M8 2.2 C 4.6 4.4, 3.6 8.4, 8 14 C 12.4 8.4, 11.4 4.4, 8 2.2 Z"
          fillOpacity="0.95"
        />
        <path
          d="M8 5.4 V12.6"
          stroke="#ffffff"
          strokeWidth="0.9"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M8 8.4 C 6.8 8.6, 6.2 9.2, 6 10"
          stroke="#ffffff"
          strokeWidth="0.7"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M8 10 C 9.2 10.2, 9.8 10.8, 10 11.6"
          stroke="#ffffff"
          strokeWidth="0.7"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
    tint: "#2F8A63",
  },
  {
    // Placeholder — dashed ring + soft plus. The circle rhymes with
    // BlueCircle's shield so all three marks feel like they belong to
    // the same family of "brand tiles" rather than random doodles.
    name: "Your brand here",
    mark: ({ className }) => (
      <svg
        className={className}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="8" cy="8" r="6" strokeDasharray="2 1.8" />
        <path d="M8 5.5 V10.5 M5.5 8 H10.5" />
      </svg>
    ),
    tint: "#E45A1C",
  },
];

const BRAND_CYCLE_MS = 3200;

function WhiteLabelVisual({ active }: { active: boolean }) {
  const [brandIdx, setBrandIdx] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const t = setInterval(
      () => setBrandIdx((i) => (i + 1) % PARTNER_BRANDS.length),
      BRAND_CYCLE_MS,
    );
    return () => clearInterval(t);
  }, [active]);

  const brand = PARTNER_BRANDS[brandIdx];
  const Mark = brand.mark;
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* Soft warm wash behind the device. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-1-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/60" />

      {/* Caption — sits above the phone so the eye reads "same coach, any
          brand" before it lands on the swapping chrome. */}
      <p
        className="pointer-events-none absolute inset-x-0 top-6 mx-auto max-w-[28ch] text-center font-serif text-[12px] italic leading-snug text-ink-muted md:top-8"
        style={{
          animation: "fadeUp 600ms ease-out 200ms forwards",
          animationPlayState: playState,
          opacity: 0,
        }}
      >
        Same coach. Any brand.
      </p>

      {/* Phone — rises from below the frame and pokes up. The bottom
          third is intentionally pushed past the parent card's edge so
          the device reads as a partial handset (clipped by the parent's
          overflow-hidden), not a floating rectangle. Bezel + dynamic
          island + side buttons carry the "real phone" cue. */}
      <div
        className="absolute inset-x-0 flex justify-center"
        style={{
          bottom: "-24%",
          animation:
            "phonePeek 900ms cubic-bezier(0.22, 0.61, 0.36, 1) 120ms forwards",
          animationPlayState: playState,
          opacity: 0,
          transform: "translateY(24px)",
        }}
      >
        <div className="relative w-[240px] md:w-[272px] lg:w-[292px]">
          {/* Volume + power side buttons — hairlines glued to the bezel. */}
          <span
            aria-hidden
            className="absolute -left-[3px] top-[54px] h-[22px] w-[3px] rounded-l-full bg-ink/40"
          />
          <span
            aria-hidden
            className="absolute -left-[3px] top-[86px] h-[34px] w-[3px] rounded-l-full bg-ink/40"
          />
          <span
            aria-hidden
            className="absolute -left-[3px] top-[128px] h-[34px] w-[3px] rounded-l-full bg-ink/40"
          />
          <span
            aria-hidden
            className="absolute -right-[3px] top-[104px] h-[46px] w-[3px] rounded-r-full bg-ink/40"
          />

          {/* Bezel — dark rim, deeper drop-shadow, over-extended height so
              the bottom clips out of the frame and the device reads as
              genuinely rising into view. */}
          <div
            className="relative rounded-t-[40px] rounded-b-[40px] bg-ink/90 p-[6px] pb-[120px]"
            style={{
              boxShadow:
                "0 34px 60px -22px rgba(20,15,10,0.42), 0 12px 26px -12px rgba(20,15,10,0.22)",
            }}
          >
            {/* Screen — brand chrome sits at the top, chat below. */}
            <div className="relative overflow-hidden rounded-t-[34px] rounded-b-[34px] bg-white">
              {/* Dynamic-island — pill-shaped inset at the top of the screen. */}
              <span
                aria-hidden
                className="absolute left-1/2 top-2 z-10 h-[18px] w-[74px] -translate-x-1/2 rounded-full bg-ink"
              />

              {/* Status-bar row — quiet time + signal glyphs sit beside
                  the dynamic-island so the top of the screen doesn't
                  feel empty. */}
              <div className="flex items-center justify-between px-5 pt-2.5 pb-1 text-[9.5px] font-semibold tracking-tight text-ink/70">
                <span>9:41</span>
                <span aria-hidden className="flex items-center gap-[3px]">
                  <span className="block h-[6px] w-[2px] rounded-sm bg-ink/60" />
                  <span className="block h-[8px] w-[2px] rounded-sm bg-ink/60" />
                  <span className="block h-[10px] w-[2px] rounded-sm bg-ink/60" />
                  <span className="ml-[3px] block h-[8px] w-[14px] rounded-[2px] border border-ink/60" />
                </span>
              </div>

              {/* Brand chrome — this is the part that swaps. */}
              <div
                className="relative flex items-center justify-between border-b border-ink/[0.06] px-5 py-3"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 100%)",
                }}
              >
                <div
                  key={brand.name}
                  className="flex items-center gap-2"
                  style={{
                    animation:
                      "fadeUp 360ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards",
                    opacity: 0,
                  }}
                >
                  <span style={{ color: brand.tint }}>
                    <Mark className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-[13.5px] font-semibold tracking-tight text-ink">
                    {brand.name}
                  </span>
                </div>
                <span aria-hidden className="flex items-end gap-[3px]">
                  <span className="block h-3 w-[2px] rounded-full bg-ink/15" />
                  <span className="block h-3 w-[2px] rounded-full bg-ink/15" />
                  <span className="block h-3 w-[2px] rounded-full bg-ink/15" />
                </span>
              </div>

              {/* Coaching content — identical across every brand. */}
              <div className="relative space-y-3 px-5 py-6">
                {/* Member message */}
                <div
                  className="ml-auto max-w-[78%] rounded-[14px] rounded-br-[6px] px-3.5 py-2.5 text-[13px] leading-snug text-ink"
                  style={{
                    background: "rgba(252, 230, 205, 0.72)",
                    border: "1px solid rgba(232, 188, 142, 0.55)",
                    animation: "fadeUp 500ms ease-out 480ms forwards",
                    animationPlayState: playState,
                    opacity: 0,
                  }}
                >
                  Honestly, today felt impossible.
                </div>

                {/* Coach reply */}
                <div
                  className="flex items-start gap-2"
                  style={{
                    animation: "fadeUp 500ms ease-out 880ms forwards",
                    animationPlayState: playState,
                    opacity: 0,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/roni.png"
                    alt=""
                    className="mt-0.5 h-6 w-6 shrink-0 rounded-full object-cover ring-2 ring-white"
                    draggable={false}
                  />
                  <div
                    className="max-w-[88%] rounded-[14px] rounded-bl-[6px] border border-white/70 bg-white/95 px-3.5 py-2.5 text-[13px] leading-snug text-ink"
                    style={{
                      boxShadow:
                        "0 1px 2px rgba(15,20,25,0.04), 0 6px 18px -10px rgba(15,20,25,0.10)",
                    }}
                  >
                    What made today feel that way?
                  </div>
                </div>
              </div>

              {/* Footer attribution — the only place Chronilogix is named. */}
              <div className="relative flex items-center justify-between border-t border-ink/[0.06] px-5 py-2.5">
                <span className="text-[11.5px] font-medium tracking-tight text-ink-muted">
                  Powered by
                </span>
                <span className="font-serif text-[13px] tracking-tight text-ink">
                  Chronilogix
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* 02 — Coverage visual                                                     */
/*                                                                          */
/* A 2+4 module grid. Two active coaches read solid; four in-development    */
/* modules read as dashed outlines with a quiet "in development" pulse.     */
/* ──────────────────────────────────────────────────────────────────────── */

type Module = {
  name: string;
  domain: string;
  state: "active" | "dev";
  Icon: React.ComponentType<{ className?: string }>;
};

const MODULES: Module[] = [
  {
    name: "Roni",
    domain: "Diabetes & chronic care",
    state: "active",
    Icon: LeafIcon,
  },
  {
    name: "Millie",
    domain: "Mental health & mood",
    state: "active",
    Icon: WaveIcon,
  },
  {
    name: "GLP-1 Weight",
    domain: "GLP-1 & weight management",
    state: "dev",
    Icon: ScaleIcon,
  },
  {
    name: "Addiction",
    domain: "Substance use & recovery",
    state: "dev",
    Icon: MoonIcon,
  },
  {
    name: "Hypertension",
    domain: "Blood pressure & cardiovascular",
    state: "dev",
    Icon: HeartIcon,
  },
  {
    name: "Cancer",
    domain: "Screening, treatment, and survivorship",
    state: "dev",
    Icon: RibbonIcon,
  },
];

function CoverageVisual({
  active,
  modules = MODULES,
}: {
  active: boolean;
  modules?: Module[];
}) {
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-3-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/65" />

      <div className="relative flex h-full flex-col justify-center gap-4 p-6 md:gap-5 md:p-8">
        {/* Active row label */}
        <div
          className="flex items-baseline justify-between"
          style={{
            animation: "fadeUp 500ms ease-out 100ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <p className="text-[12px] font-medium tracking-tight text-brand-700 md:text-[13px]">
            Active, 02
          </p>
          <span aria-hidden className="h-px flex-1 ml-3 self-center bg-ink/12" />
        </div>

        {/* Active modules — 2 cards in a row */}
        <ul className="grid grid-cols-2 gap-3.5 md:gap-4">
          {modules.filter((m) => m.state === "active").map((m, i) => (
            <ModuleTile
              key={m.name}
              module={m}
              delayMs={260 + i * 140}
              playState={playState}
            />
          ))}
        </ul>

        {/* In-dev row label */}
        <div
          className="mt-1 flex items-baseline justify-between"
          style={{
            animation: "fadeUp 500ms ease-out 800ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <p className="text-[12px] font-medium tracking-tight text-ink-muted md:text-[13px]">
            In development, 04
          </p>
          <span aria-hidden className="h-px flex-1 ml-3 self-center bg-ink/12" />
        </div>

        {/* In-dev modules — 2x2 grid of dashed tiles */}
        <ul className="grid grid-cols-2 gap-3.5 md:gap-4">
          {modules.filter((m) => m.state === "dev").map((m, i) => (
            <ModuleTile
              key={m.name}
              module={m}
              delayMs={980 + i * 140}
              playState={playState}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function ModuleTile({
  module,
  delayMs,
  playState,
}: {
  module: Module;
  delayMs: number;
  playState: "running" | "paused";
}) {
  const Icon = module.Icon;
  const isActive = module.state === "active";

  return (
    <li
      className={`relative overflow-hidden rounded-[16px] px-4 py-3.5 md:px-5 md:py-4 ${
        isActive
          ? "border border-ink/[0.08] bg-white shadow-[0_8px_22px_-14px_rgba(20,8,2,0.22)]"
          : "border border-dashed border-ink/25 bg-white/55"
      }`}
      style={{
        animation: `fadeUp 500ms ease-out ${delayMs}ms forwards`,
        animationPlayState: playState,
        opacity: 0,
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:h-10 md:w-10 ${
            isActive
              ? "bg-brand-600/12 text-brand-700"
              : "bg-ink/[0.06] text-ink-muted"
          }`}
        >
          <Icon className="h-[18px] w-[18px] md:h-5 md:w-5" />
        </span>
        <div className="min-w-0">
          <p
            className={`font-serif text-[15px] leading-tight tracking-tight ${
              isActive ? "text-ink" : "text-ink-soft"
            } md:text-[17px]`}
          >
            {module.name}
          </p>
          <p
            className={`mt-1 text-[11.5px] leading-snug ${
              isActive ? "text-ink-muted" : "text-ink-muted/85"
            } md:text-[12.5px]`}
          >
            {module.domain}
          </p>
        </div>
        {isActive ? (
          <span
            aria-hidden
            className="ml-auto mt-1 block h-3 w-[2px] shrink-0 rounded-full"
            style={{
              backgroundColor: "#34C759",
              boxShadow: "0 0 0 2px rgba(52, 199, 89, 0.18)",
            }}
          />
        ) : (
          <span
            aria-hidden
            className="ml-auto mt-1 block h-3 w-[2px] shrink-0 rounded-full bg-ink-muted/40"
            style={{
              animation: "knobPulse 2400ms cubic-bezier(0.22, 0.61, 0.36, 1) infinite",
              animationPlayState: playState,
            }}
          />
        )}
      </div>
    </li>
  );
}

/* ── Module icons ──────────────────────────────────────────────────────── */

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 4c-7 0-12 4-12 10 0 1.3.3 2.4.9 3.2" />
      <path d="M16 4c0 7-4 12-10 12" />
      <path d="M10 10c2 0 4 1 6 3" />
    </svg>
  );
}

function WaveIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2.5 12c1.5 0 1.5-4 3-4s1.5 4 3 4 1.5-6 3-6 1.5 6 3 6 1.5-2 3-2" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 16.5S3 12.2 3 7.6A3.6 3.6 0 0 1 10 5.8 3.6 3.6 0 0 1 17 7.6c0 4.6-7 8.9-7 8.9Z" />
    </svg>
  );
}

function RibbonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 12.5 6.4 18l-1.8-2.6L2.5 15l3.6-5.4" />
      <path d="M10 12.5 13.6 18l1.8-2.6 2.1-.4-3.6-5.4" />
      <path d="M10 12.5 6.5 6.9a4 4 0 1 1 7 0L10 12.5Z" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15.5 12.4A6.5 6.5 0 0 1 7.6 4.5a6.5 6.5 0 1 0 7.9 7.9Z" />
    </svg>
  );
}

function ScaleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="6" width="14" height="10" rx="1.6" />
      <path d="M7 10.5c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5" />
    </svg>
  );
}

/* ── Row data ──────────────────────────────────────────────────────────── */

const ROWS: Row[] = [
  {
    eyebrow: "01. White label",
    heading: "Same coach. Any brand.",
    body: (
      <>
        Chronilogix ships as a branded experience inside a partner&rsquo;s
        app, employer benefit, or wellness platform. Your chrome on top;
        the same MI trained coach underneath. The coaching layer without
        building clinical IP from scratch.
        {/* Customization callout — two-line beat, kept as a block-level
            <span> so it opens its own paragraph inside the parent <p>
            without producing invalid nested <p> HTML. */}
        <span className="mt-4 block">
          We can customize by Universities, Unions, Missions and industry
          specific needs.
          <br />
          Globally, regionally and locally.
        </span>
      </>
    ),
    Visual: WhiteLabelVisual,
  },
  {
    eyebrow: "02. Coverage",
    heading: "Two coaches today. Four chronic modules in development.",
    body: (
      <>
        Roni covers diabetes and chronic care. Millie covers anxiety,
        stress, and mood. Four additional modules are in development,
        including a diabetic retinopathy screener, and ship into the
        same coaching surface members already use.
      </>
    ),
    Visual: CoverageVisual,
    // Coverage carries a module grid, not a phone card — a less-tall
    // frame lets the grid fill the canvas edge-to-edge and reads as
    // balanced weight against the left content column.
    aspectClass: "aspect-[5/6] md:aspect-[8/7]",
  },
];
