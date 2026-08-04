"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Milestone = {
  era: string;
  title: string;
  // ReactNode so an entry can inline a link (e.g. the Aetna case study).
  body: React.ReactNode;
};

export type AboutTimelineContent = {
  eyebrow?: string;
  headingLead?: string;
  headingMuted?: string;
  intro?: string;
  milestones?: Milestone[];
};

// Oldest first — the visitor reads left to right in natural Western
// chronological order, from the origins of the research lineage in 2000
// through to the Roni launch in January 2026.
const DEFAULTS = {
  eyebrow: "Our timeline",
  headingLead: "Thirty years in the making.",
  headingMuted: "Built for right now.",
  intro:
    "Chronilogix didn’t start with a pitch deck. It started with research. The intellectual foundation of our platform, Motivational Interviewing as a scalable intervention for chronic and behavioral health, has been in development for over three decades. What’s changed is the technology available to deliver it.",
  milestones: [
    { era: "2000 to 2005", title: "Initial development", body: "Motivational Interviewing training system." },
    { era: "2005 to 2010", title: "R&D expansion", body: "Deep tailoring eHealth academic research." },
    {
      era: "2010 to 2015",
      title: "Market entry",
      body: (
        <>
          Partnered with AmeriHealth, Caritas, and launched the Global MI
          program for{" "}
          <a
            href="/case-studies/aetna"
            className="underline decoration-brand-500/40 decoration-1 underline-offset-[3px] transition-colors hover:text-brand-700 hover:decoration-brand-600"
          >
            Aetna
          </a>
          .
        </>
      ),
    },
    { era: "2015 to present", title: "Expansion", body: "U.S. providers including Kaiser and Active Health, plus global clients. 10,000+ practitioners and 200 trainers trained worldwide." },
    { era: "2023", title: "Chronilogix founded", body: "Initial scripting begins as a rules based technology." },
    { era: "2025 to present", title: "Present and future vision", body: "Commercial launch of Roni and the Chronilogix app at the NBIP and ASCEND Conference." },
    { era: "January 2026", title: "Roni launch", body: "Full suite of MI eHealth brought to market." },
  ],
} satisfies Required<AboutTimelineContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

// Brand-tinted wave — uses a warm orange close to the brand primary so
// the journey line lives in the page's colour family instead of as a
// dark accent. Alpha keeps it sitting back as ambient texture, not as a
// loud line. Combined with the thinner stroke + sparse dasharray below
// the result is a quiet, dotted brand-coloured current rather than two
// bold ink lines.
const STROKE_COLOR = "rgba(184, 70, 20, 0.55)";

/**
 * Two intertwined sinusoidal strokes. Each path is a smooth S-curve that
 * spans exactly one wavelength and lands back on the centre at both
 * boundaries, so the pattern tiles seamlessly when repeated horizontally.
 *
 *   wave A: rises early, dips late  ─ ╭╮╭╮ ─
 *   wave B: dips early, rises late   ─ ╰╯╰╯ ─
 *
 * The two curves cross at the centre and at every wavelength boundary,
 * giving the band its woven, current-like texture. Thin (0.9px) dashed
 * strokes with sparse dots keep the wave understated against the warm
 * gradient background — when the layer breathes via scaleY the woven
 * pattern visibly opens up and pulls in.
 */
const WAVE_TILE_WIDTH = 80;
const WAVE_TILE_HEIGHT = 28;
const WAVE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='${WAVE_TILE_WIDTH}' height='${WAVE_TILE_HEIGHT}' viewBox='0 0 ${WAVE_TILE_WIDTH} ${WAVE_TILE_HEIGHT}'><path d='M 0 14 C 20 2 60 26 80 14' stroke='${STROKE_COLOR}' stroke-width='0.9' stroke-dasharray='1.4 3' stroke-linecap='round' fill='none'/><path d='M 0 14 C 20 26 60 2 80 14' stroke='${STROKE_COLOR}' stroke-width='0.9' stroke-dasharray='1.4 3' stroke-linecap='round' fill='none'/></svg>`;
const WAVE_BG = `url("data:image/svg+xml;utf8,${encodeURIComponent(WAVE_SVG)}")`;

export function AboutTimeline({
  content,
}: {
  content?: AboutTimelineContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const milestones = content?.milestones?.length
    ? content.milestones
    : DEFAULTS.milestones;
  const trackRef = useRef<HTMLDivElement | null>(null);

  return (
    <section
      id="timeline"
      className="group/timeline relative overflow-hidden rounded-[28px]"
      style={{
        background:
          "linear-gradient(180deg, #FBF6F0 0%, #F6E5D2 65%, #F2DCC4 100%)",
      }}
    >
      <div className="container-page pt-16 md:pt-20 lg:pt-24">
        <Intro
          eyebrow={c.eyebrow}
          headingLead={c.headingLead}
          headingMuted={c.headingMuted}
          intro={c.intro}
        />
      </div>

      <HorizontalTimeline trackRef={trackRef} milestones={milestones} />

      <div className="h-12 md:h-16 lg:h-20" />
    </section>
  );
}

function Intro({
  eyebrow,
  headingLead,
  headingMuted,
  intro,
}: {
  eyebrow: string;
  headingLead: string;
  headingMuted: string;
  intro: string;
}) {
  return (
    <div className="max-w-[48rem]">
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <Reveal delay={100}>
        <h2
          className="mt-4 text-hero font-serif font-normal text-ink"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {headingLead}{" "}
          <span className="text-ink-muted">{headingMuted}</span>
        </h2>
      </Reveal>
      <Reveal delay={200}>
        <p className="mt-6 max-w-[58ch] body-prose">{intro}</p>
      </Reveal>
    </div>
  );
}

// ─── Horizontal scrolling timeline ──────────────────────────────────────────
// Track is full-bleed (escapes the container-page max-width) so the dotted
// line and milestones can run edge-to-edge. Drag-to-scroll handles mouse,
// pen, and touch via PointerEvents. Native trackpad / touch swipe also works.

function HorizontalTimeline({
  trackRef,
  milestones,
}: {
  trackRef: React.MutableRefObject<HTMLDivElement | null>;
  milestones: Milestone[];
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let down = false;
    let startX = 0;
    let startScroll = 0;
    let capturedId: number | null = null;
    let moved = false;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      down = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      capturedId = e.pointerId;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      setIsDragging(true);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startScroll - dx;
    };

    const release = () => {
      if (!down) return;
      down = false;
      if (capturedId !== null) {
        try {
          el.releasePointerCapture(capturedId);
        } catch {
          /* ignore */
        }
        capturedId = null;
      }
      setIsDragging(false);
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
    el.addEventListener("pointerleave", release);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", release);
      el.removeEventListener("pointercancel", release);
      el.removeEventListener("pointerleave", release);
    };
  }, [trackRef]);

  // Cursor-following drag indicator. We update the indicator's transform
  // directly via the ref on every mousemove rather than going through
  // React state — at hover rates this would otherwise trigger a re-render
  // every animation frame and stutter under load.
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const wrapper = wrapperRef.current;
    const indicator = indicatorRef.current;
    if (!wrapper || !indicator) return;
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Sit the pill just below-right of the cursor — close enough to read
    // as "attached to the mouse", offset enough that it doesn't sit
    // underneath the cursor itself.
    indicator.style.transform = `translate(${x + 14}px, ${y + 10}px)`;
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="group/track relative mt-8 md:mt-10 lg:mt-12"
      onMouseMove={onMouseMove}
    >
      <div
        ref={trackRef}
        className="overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x",
          // Soft fade on BOTH edges of the track so the row feels continuous —
          // implies lineage extending past the visible window in both directions.
          maskImage:
            "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
        }}
      >
        <div className="relative flex select-none">
          {/* Continuous wave band — one element spans the entire row width,
              sitting behind the columns. The columns layer on top and
              contribute only the markers at their left edges; the wave is
              unbroken end-to-end so the journey reads as a single, living
              current rather than a chain of segments. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[44px] md:h-[52px]"
          >
            <WaveBand />
          </div>

          <DottedFiller />

          {milestones.map((m, i) => (
            <MilestoneColumn key={m.era} milestone={m} index={i} />
          ))}

          <DottedFiller />
        </div>
      </div>

      {/* Cursor-following drag indicator. Hidden by default, fades in on
          hover, and tracks the mouse position via the onMouseMove handler
          on the wrapper. pointer-events-none so it doesn't block drag. */}
      <div
        ref={indicatorRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 opacity-0 transition-opacity duration-200 ease-out group-hover/track:opacity-100 motion-reduce:transition-none"
        style={{ transform: "translate(-9999px, -9999px)" }}
      >
        <DragPill />
      </div>
    </div>
  );
}

/**
 * Small label that follows the mouse cursor when the visitor hovers the
 * timeline track. Chevron-flanked "drag" text in a dark pill so it reads
 * as a quiet affordance against the warm-paper background.
 */
function DragPill() {
  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-ink/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_6px_18px_-8px_rgba(40,25,15,0.4)] backdrop-blur-sm">
      <svg
        width="10"
        height="10"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden
      >
        <path
          d="M9 3 L4 7 L9 11"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      drag
      <svg
        width="10"
        height="10"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden
      >
        <path
          d="M5 3 L10 7 L5 11"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * A single wave layer fills the band. It carries both animations —
 * horizontal drift (14s linear) AND the scaleY amplitude breathe (5s
 * ease-in-out, ranging 0.4× → 1.6×) — so the line reads as one living
 * curve that grows and contracts in place.
 */
function WaveBand() {
  const layerStyle: React.CSSProperties = {
    backgroundSize: `${WAVE_TILE_WIDTH}px ${WAVE_TILE_HEIGHT}px`,
    backgroundRepeat: "repeat-x",
    backgroundPosition: "center",
    willChange: "background-position, transform",
  };
  return (
    <div
      className="timeline-wave absolute inset-x-0 top-1/2 h-7 -translate-y-1/2 md:h-8"
      style={{ ...layerStyle, backgroundImage: WAVE_BG }}
    />
  );
}

/**
 * Width-only spacer for the leading/trailing edges. The continuous wave
 * layer above is the visual; this just reserves horizontal space so the
 * lineage feels like it extends past the visible window in both directions.
 */
function DottedFiller() {
  return (
    <div className="shrink-0 w-[clamp(80px,12vw,180px)]">
      <div className="h-[44px] md:h-[52px]" />
    </div>
  );
}

function MilestoneColumn({
  milestone,
  index,
}: {
  milestone: Milestone;
  index: number;
}) {
  return (
    <div
      data-milestone-column
      className="relative z-10 shrink-0 w-[260px] pr-10 md:w-[340px] md:pr-12 lg:w-[400px] lg:pr-14"
    >
      {/* Spacer to reserve the height of the continuous wave band above.
          No markers — the wave runs uninterrupted; era labels anchor each
          milestone visually. */}
      <div className="h-[44px] md:h-[52px]" />

      {/* Content — era is the small brand label, title is the serif
          anchor, body is the descriptive prose underneath. Matches the
          reference timeline graphic's hierarchy. */}
      <Reveal delay={index * 60}>
        <div className="pt-7 md:pt-9">
          <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-brand-700">
            {milestone.era}
          </p>
          <h3
            className="mt-3 font-serif font-normal leading-[1.05] tracking-[-0.018em] text-ink"
            style={{ fontSize: "clamp(22px, 2.6vw, 34px)" }}
          >
            {milestone.title}
          </h3>
          <p className="mt-4 max-w-[32ch] text-[13.5px] leading-relaxed text-ink-muted md:mt-5 md:text-[14.5px]">
            {milestone.body}
          </p>
        </div>
      </Reveal>
    </div>
  );
}

function Reveal({
  delay = 0,
  children,
}: {
  delay?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 800ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, transform 800ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
