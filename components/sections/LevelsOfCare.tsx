"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Three Levels of Care
 *
 * Layout (Pass 2-H):
 *   - Per-row identity sits at the row's TOP (full width) — eyebrow,
 *     serif level title, supporting line. Lifting identity out of the
 *     left column lets the artifact column and content column start
 *     at the same baseline.
 *   - Below the identity: a 5/7 grid with `items-stretch`. The
 *     artifact block uses `h-full` instead of an aspect ratio so it
 *     stretches to the row height set by whichever column is naturally
 *     taller. Result: artifact block height = right-column content
 *     height, per row, automatically.
 *   - Each artifact has its own internal design (status list, timeline
 *     log, stat dashboard) so the three levels read as three different
 *     stories, not three copies of the same pattern.
 *
 * Copy verbatim from `Chronilogix Docx/IP.pdf` — headers, lead-in
 * sentences, and bullet text.
 *
 * The shared outer frame is identical to SessionWalkthrough's step
 * cards (blurred warm-cream background + paper gradient wash +
 * centered white figure-card with the warm-brown shadow). Only the
 * figure-card's internal composition differs per level.
 */

/* ── Level data ─────────────────────────────────────────────────────────── */

type Level = {
  ordinal: string;
  label: string;
  subhead: string;
  lead: string;
  bullets: string[];
  visualBg: string;
  Artifact: React.ComponentType<{ active: boolean }>;
  /** When set, the level renders this image in the visual column instead
   *  of the abstract Artifact card. */
  image?: { src: string; alt: string };
};

const LEVELS: Level[] = [
  {
    ordinal: "Level 01",
    label: "First Line of Care",
    subhead: "Where no other coverage exists",
    lead: "For the people who fall through the cracks of traditional care:",
    bullets: [
      "Rural communities with limited provider access",
      "Those who cannot afford deductibles",
      "Patients who have exhausted their covered counseling sessions",
      "Anyone in between scheduled appointments",
      "Available 24/7 when live coaches are not",
      "Bridges the typical 2 to 6 week wait for a human appointment",
      "Cost efficient access for virtually anyone",
    ],
    visualBg: "/card-1-bg.jpg",
    Artifact: AvailabilityArtifact,
    image: {
      src: "/generated-images/family-low-angle-chronilogix-aesthetic.webp",
      alt: "A family from below, the people who fall through the cracks of traditional care, where Chronilogix steps in as the first line.",
    },
  },
  {
    ordinal: "Level 02",
    label: "Hybrid Process",
    subhead: "Human + AI, working together",
    lead: "Combines the depth of human coaching with the consistency of AI:",
    bullets: [
      "Extends the value of each appointment by supporting the patient in between sessions",
      "Continuously collects information for the therapist so no progress is lost",
      "Delivers cost efficiency and scalability without sacrificing quality of care",
    ],
    visualBg: "/pattern.webp",
    Artifact: BriefingArtifact,
    image: {
      src: "/generated-images/caregiver-senior-chronilogix-aesthetic.webp",
      alt: "A caregiver beside an older adult, the human plus AI hybrid Chronilogix supports.",
    },
  },
  {
    ordinal: "Level 03",
    label: "Digital Only",
    subhead: "For those who prefer it this way",
    lead: "A growing category of demographics who get better outcomes with a fully digital coach:",
    bullets: [
      "Certain ethnic and cultural backgrounds where a digital coach reduces barriers",
      "No bias, no judgment. Consistent every session",
      "Uniform, reliable treatment regardless of provider variability",
      "The most cost efficient option available",
    ],
    visualBg: "/card-3-bg.jpg",
    Artifact: ConsistencyArtifact,
    image: {
      src: "/generated-images/home-phone-man-chronilogix-aesthetic.webp",
      alt: "A man at home with his phone, the members who get better outcomes with a fully digital coach.",
    },
  },
];

/* ── Hooks ─────────────────────────────────────────────────────────────── */

function useInView<T extends HTMLElement>(threshold = 0.2) {
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

/* ── Section ───────────────────────────────────────────────────────────── */

export function LevelsOfCare({
  hideEyebrow = false,
}: { hideEyebrow?: boolean } = {}) {
  return (
    <div>
      <div className="max-w-5xl">
        {hideEyebrow ? null : (
          <p className="eyebrow">Three Levels of Care</p>
        )}
        <h3
          className={`${hideEyebrow ? "" : "mt-3"} max-w-4xl text-hero font-serif font-normal text-ink`.trim()}
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          Chronilogix meets people where they are, across every gap in the
          care continuum.
        </h3>
      </div>

      {/* Scroll-stacking column. Each row is `sticky top-...` with a
          matching `bg-paper-warm` so as the user scrolls, the next
          level rises from below and lands directly on top of the
          previous one. No card chrome, no shadows — the matching
          background makes the transition read as content flowing,
          not as panels stacking. DOM order (row 1 → 2 → 3) naturally
          places later rows on top of earlier rows.

          Tighter top margin so the "Three Levels of Care" intro reads
          as the header for the rows immediately below it. Section-
          above separation is carried by Solution.tsx's wrapper. */}
      <div className="mt-6 flex flex-col md:mt-7">
        {LEVELS.map((level, i) => (
          <LevelRow
            key={level.ordinal}
            level={level}
            index={i}
            isLast={i === LEVELS.length - 1}
          />
        ))}
      </div>

      {/* Closing thesis — sits tight against the row stack above so it
          reads as the same section's resolution, not a separate beat. */}
      <div className="mt-8 md:mt-10">
        <p
          className="mx-auto max-w-3xl text-center font-serif text-section font-normal leading-[1.15] text-ink"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          One engine. Three levels. Every gap covered.
        </p>
      </div>
    </div>
  );
}

function LevelRow({
  level,
  index,
  isLast,
}: {
  level: Level;
  index: number;
  isLast: boolean;
}) {
  const { ref, inView } = useInView<HTMLElement>(0.15);
  const { Artifact } = level;
  // Alternate image/text placement on odd rows so the row cadence
  // doesn't feel mechanical. Card 02 flips image to the right.
  const flipped = index % 2 === 1;

  return (
    <article
      ref={ref}
      // Sticky scroll-stacking is a desktop pattern — on mobile it
      // makes scroll feel uncertain in a small viewport. Below md the
      // row flows naturally; at md+ it sticks and stacks via the fog
      // veil as before.
      className="md:sticky md:top-24"
      style={{
        opacity: inView ? 1 : 0,
        // Use `none` rather than `translateY(0)` once revealed so the
        // article doesn't carry a permanent transform — a stray
        // transform on the article would create a containing block
        // that prevents the fog drop-shadow from rendering above the
        // body and clip the visual layering effect.
        transform: inView ? "none" : "translateY(16px)",
        transition:
          "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)",
      }}
    >
      {/* Fog veil — softens the seam where rows stack on md+. Hidden
          on mobile where rows flow naturally without overlapping. */}
      {/* No veil above the first row — there is no previous row to blend
          into, and a veil here sweeps up over the "Three Levels of Care"
          heading during scroll (client: "can't see the entire page during
          the reveal"). Only rows that stack onto a prior row get it. */}
      {index > 0 && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 hidden h-40 md:block md:-top-40 md:h-40"
          style={{
            // Symmetric smoothstep ramp (eases in AND out) over a taller
            // veil so the previous row dissolves evenly across the whole
            // scroll distance instead of rushing from ~0.4 to solid in the
            // final third. The gentle head keeps content readable, the
            // gentle tail lands on the seam without a visible step, and
            // full opacity is reached by ~90% so the last stretch is a
            // stable solid band flowing into the next row.
            background:
              "linear-gradient(to bottom, rgba(251,248,244,0) 0%, rgba(251,248,244,0.03) 10%, rgba(251,248,244,0.12) 20%, rgba(251,248,244,0.26) 30%, rgba(251,248,244,0.42) 40%, rgba(251,248,244,0.58) 50%, rgba(251,248,244,0.74) 60%, rgba(251,248,244,0.87) 70%, rgba(251,248,244,0.96) 80%, rgba(251,248,244,1) 90%, rgba(251,248,244,1) 100%)",
          }}
        />
      )}

      {/* Card body — the row sits flush with the surrounding section
          on the same paper-warm background. The fog veil above carries
          the layering transition so the three rows still read as one
          continuous paper surface as they stack. */}
      {/* Rows that get stacked over (all but the last) carry extra bottom
          padding so their content clears the next row's incoming fog veil
          (md:h-40 above) — the whole row reads at rest, and the veil only
          dissolves empty paper during the scroll-stack transition. */}
      <div
        className={`relative bg-paper-warm pb-8 pt-10 md:pt-[4.5rem] ${
          isLast ? "md:pb-10" : "md:pb-40"
        }`}
      >
        {/* Two-column layout: image in one column, text (header + lead
            + bullets) in the other. The header now sits at the top of
            the text column so the row's identity reads against the
            content rather than spanning the full width. Odd rows flip
            the image to the opposite side via grid `order`. */}
        <div className="relative grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div className={flipped ? "md:order-2" : ""}>
            {level.image ? (
              <LevelImage image={level.image} active={inView} />
            ) : (
              <ArtifactFrame bg={level.visualBg} active={inView}>
                <Artifact active={inView} />
              </ArtifactFrame>
            )}
          </div>

          <div className={flipped ? "md:order-1" : ""}>
            <header className="mb-7 md:mb-8">
              <p className="eyebrow">{level.ordinal}</p>
              <h4 className="mt-3 text-row font-serif font-normal text-ink">
                {level.label}
              </h4>
              <p className="mt-3 body-quiet">{level.subhead}</p>
            </header>

            <p className="body-prose text-ink-soft">{level.lead}</p>
            <ul className="mt-5 space-y-3 md:mt-6">
              {level.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-3 body-prose text-ink-soft"
                >
                  <span
                    aria-hidden
                    className="mt-[0.7em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Image card (replaces the abstract Artifact when a level has an
 *    `image` field) ─────────────────────────────────────────────────────── */
function LevelImage({
  image,
  active,
}: {
  image: { src: string; alt: string };
  active: boolean;
}) {
  return (
    <div
      className="relative aspect-[4/5] w-full max-w-[360px] overflow-hidden rounded-2xl bg-ink/5 md:max-w-[420px] lg:max-w-[460px]"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "none" : "translateY(12px)",
        transition:
          "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
          loading="lazy"
          decoding="async"
        />
    </div>
  );
}

/* ── Shared artifact frame ─────────────────────────────────────────────── */
/**
 * Outer treatment matches SessionWalkthrough's step cards exactly:
 * blurred warm-cream background, paper gradient wash, centered white
 * figure-card with the warm-brown shadow + ink-tinted ring. The figure
 * card's INTERIOR is provided by the per-level Artifact component.
 *
 * `h-full` + `min-h-[300px]` lets the block stretch to the grid row
 * height (driven by the right column's content) while still containing
 * the figure card when content is short.
 */
function ArtifactFrame({
  bg,
  active,
  children,
}: {
  bg: string;
  active: boolean;
  children: React.ReactNode;
}) {
  const playState = active ? "running" : "paused";
  return (
    <div className="relative min-h-[340px] overflow-hidden rounded-2xl bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bg}
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
          loading="lazy"
          decoding="async"
        />
      <div className="absolute inset-0 bg-gradient-to-b from-paper/65 via-paper/55 to-paper/70" />

      <div className="relative flex h-full items-center justify-center p-6 md:p-7">
        <figure
          className="relative w-full max-w-[320px] rounded-[18px] bg-white/95 p-5 shadow-[0_18px_40px_-14px_rgba(40,25,15,0.22),0_2px_8px_-2px_rgba(40,25,15,0.08)] ring-1 ring-ink/[0.04]"
          style={{
            animation: "fadeUp 600ms ease-out 120ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          {children}
        </figure>
      </div>
    </div>
  );
}

/* ── Artifact 01 — Availability comparison ─────────────────────────────── */
/**
 * A status list of conventional care channels — each closed, booked,
 * waitlisted, or out — followed by a brand-tinted box that elevates
 * Chronilogix's `Available now` row out of the comparison set.
 *
 * Maps directly to the level's framing: "For the people who fall
 * through the cracks of traditional care." The list IS the gap; the
 * highlight is the answer.
 */

const AVAILABILITY_UNAVAILABLE: { label: string; status: string }[] = [
  { label: "In clinic appointment", status: "3 weeks out" },
  { label: "Covered counseling", status: "0 of 6 left" },
  { label: "After hours support", status: "Closed" },
  { label: "Sliding scale therapist", status: "Waitlist" },
];

function AvailabilityArtifact({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";
  return (
    <>
      <p className="text-xs font-medium tracking-tight text-ink-muted">
        Care available today
      </p>

      <ul className="mt-4 space-y-2.5">
        {AVAILABILITY_UNAVAILABLE.map((item, i) => (
          <li
            key={item.label}
            className="flex items-baseline justify-between gap-3 text-[13px]"
            style={{
              animation: `fadeUp 460ms cubic-bezier(0.22, 0.61, 0.36, 1) ${320 + i * 60}ms forwards`,
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            <span className="text-ink-muted">{item.label}</span>
            <span className="text-ink-subtle tabular-nums">{item.status}</span>
          </li>
        ))}
      </ul>

      {/* Highlight — a subtle brand-tinted box lifts Chronilogix's row
          out of the list above. No literal divider line. */}
      <div
        className="mt-4 -mx-2 flex items-baseline justify-between gap-3 rounded-lg bg-brand-50 px-2.5 py-2 text-[13px]"
        style={{
          animation: `fadeUp 460ms cubic-bezier(0.22, 0.61, 0.36, 1) ${320 + AVAILABILITY_UNAVAILABLE.length * 60}ms forwards`,
          animationPlayState: playState,
          opacity: 0,
        }}
      >
        <span className="flex items-center gap-2 font-medium text-ink">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-brand-600"
          />
          Chronilogix
        </span>
        <span className="font-medium text-brand-700">Available now</span>
      </div>
    </>
  );
}

/* ── Artifact 02 — Briefing timeline ───────────────────────────────────── */
/**
 * A vertical log of what happened between Tuesday's session and
 * Friday's, formatted as a clinical briefing for Dr. Chen. Day labels
 * on the left in small caps; event text on the right. Final entry —
 * "Ready for Friday" — carries the brand accent.
 *
 * Maps directly to the level's bullet: "Continuously collects
 * information for the therapist so no progress is lost." The artifact
 * IS the deliverable.
 */

const BRIEFING_EVENTS: { day: string; text: string; session?: boolean }[] = [
  { day: "Tue", text: "Last session, anxiety and medication review", session: true },
  { day: "Wed", text: "Check in: felt heavy around 6pm" },
  { day: "Thu", text: "Practiced 3-3-3 grounding, sustained" },
  { day: "Thu", text: "Open question: timing of evening dose" },
];

function BriefingArtifact({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";
  return (
    <>
      <p className="text-xs font-medium tracking-tight text-ink-muted">
        Pre session briefing
        <span className="text-ink-subtle"> · Dr. Chen</span>
      </p>

      <ol className="mt-4 space-y-2.5">
        {BRIEFING_EVENTS.map((event, i) => (
          <li
            key={i}
            className="flex gap-3 text-[13px]"
            style={{
              animation: `fadeUp 460ms cubic-bezier(0.22, 0.61, 0.36, 1) ${320 + i * 60}ms forwards`,
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            <span className="w-[34px] shrink-0 pt-[2px] font-mono text-[10.5px] font-medium uppercase tracking-[0.06em] text-ink-subtle">
              {event.day}
            </span>
            <span
              className={
                event.session
                  ? "flex-1 font-medium text-ink"
                  : "flex-1 text-ink-soft"
              }
            >
              {event.text}
            </span>
          </li>
        ))}
      </ol>

      {/* Highlight — the readiness line as the timeline's resolution */}
      <div
        className="mt-4 flex items-baseline gap-3 text-[13px]"
        style={{
          animation: `fadeUp 460ms cubic-bezier(0.22, 0.61, 0.36, 1) ${320 + BRIEFING_EVENTS.length * 60}ms forwards`,
          animationPlayState: playState,
          opacity: 0,
        }}
      >
        <span className="w-[34px] shrink-0 pt-[2px] font-mono text-[10.5px] font-medium uppercase tracking-[0.06em] text-brand-700">
          Fri
        </span>
        <span className="flex flex-1 items-center gap-2 font-medium text-brand-700">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-brand-600"
          />
          Ready for Friday&rsquo;s session
        </span>
      </div>
    </>
  );
}

/* ── Artifact 03 — Consistency dashboard ───────────────────────────────── */
/**
 * A measurable-consistency summary. Big serif "30 / 30" focal,
 * supporting line, then a stat grid mapping each Digital Only bullet
 * (variance, bias, cultural fit, cost) to a measured value. Cost tier
 * carries the brand accent — the doc's "most cost-efficient option"
 * promise made literal.
 */

const CONSISTENCY_ROWS: { label: string; value: string }[] = [
  { label: "Tone variance", value: "None" },
  { label: "Bias flags", value: "0" },
  { label: "Cultural fit", value: "Active" },
];

function ConsistencyArtifact({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";
  return (
    <>
      <p className="text-xs font-medium tracking-tight text-ink-muted">
        Last 30 sessions
      </p>

      {/* Big stat — the focal point */}
      <div
        className="mt-4 flex items-baseline gap-2"
        style={{
          animation: `fadeUp 540ms cubic-bezier(0.22, 0.61, 0.36, 1) 280ms forwards`,
          animationPlayState: playState,
          opacity: 0,
        }}
      >
        <span className="font-serif text-stat-md font-normal leading-none text-brand-700">
          30
        </span>
        <span className="font-serif text-row font-normal leading-none text-ink-subtle">
          / 30
        </span>
      </div>
      <p
        className="mt-1 text-xs text-ink-muted"
        style={{
          animation: `fadeUp 460ms cubic-bezier(0.22, 0.61, 0.36, 1) 440ms forwards`,
          animationPlayState: playState,
          opacity: 0,
        }}
      >
        Same coach, every session
      </p>

      {/* Stat grid */}
      <dl className="mt-5 space-y-2.5 text-[13px]">
        {CONSISTENCY_ROWS.map((row, i) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-3"
            style={{
              animation: `fadeUp 460ms cubic-bezier(0.22, 0.61, 0.36, 1) ${560 + i * 60}ms forwards`,
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            <dt className="text-ink-muted">{row.label}</dt>
            <dd className="text-ink-soft">{row.value}</dd>
          </div>
        ))}
        {/* Cost — the brand-highlighted row, matching the doc's
            "most cost-efficient option" bullet */}
        <div
          className="flex items-baseline justify-between gap-3"
          style={{
            animation: `fadeUp 460ms cubic-bezier(0.22, 0.61, 0.36, 1) ${560 + CONSISTENCY_ROWS.length * 60}ms forwards`,
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <dt className="flex items-center gap-2 font-medium text-ink">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-brand-600"
            />
            Cost tier
          </dt>
          <dd className="font-medium text-brand-700">Lowest available</dd>
        </div>
      </dl>
    </>
  );
}
