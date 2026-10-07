"use client";

import { useEffect, useRef, useState } from "react";

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty.
export type OutcomeCard = {
  src?: string;
  alt?: string;
  label?: string;
  body?: string;
};

export type OutcomeContent = {
  eyebrow?: string;
  headingLine1?: string;
  headingLine2?: string;
  body?: string;
  statValue?: number;
  statSuffix?: string;
  quoteText?: string;
  quoteMuted?: string;
  sourceLine?: string;
  bridge?: string;
  galleryHeading?: string;
  gallerySubhead?: string;
  cards?: OutcomeCard[];
};

const DEFAULTS = {
  eyebrow: "With Chronilogix",
  headingLine1: "There in the moment.",
  headingLine2: "24/7. No waitlist. Judgment free. Consistent.",
  body: "Engagement rises, adherence improves, and avoidable utilization drops.",
  statValue: 58,
  statSuffix: "%",
  quoteText: "reduction in new Type 2 diabetes cases,",
  quoteMuted:
    "demonstrated by the US Diabetes Prevention Program when lifestyle change is supported between appointments.",
  sourceLine: "Source · US Diabetes Prevention Program · CDC and NIH",
  bridge: "The kind of continuous, between visit support Chronilogix scales.",
  galleryHeading: "Care that doesn’t go quiet.",
  gallerySubhead: "(Between visits. After discharge. At 11 PM.)",
  cards: [
    {
      src: "/for-employees.webp",
      alt: "A quiet, open frame, the kind of moment between scheduled care.",
      label: "The moments care can't schedule for",
      body: "11 PM stress eating. Anxiety at midnight. The skipped evening dose. Chronilogix is there when the appointment isn't.",
    },
    {
      src: "/for-universities.webp",
      alt: "A still frame from the long stretch after an appointment ends.",
      label: "The space after the appointment",
      body: "After discharge, after the session, after motivation slips. Continuous reinforcement that keeps people from quietly falling through.",
    },
  ],
} satisfies Required<OutcomeContent>;

/**
 * Animates an integer from 0 to `target` with an ease-out-quart curve when
 * `active` flips true. Respects prefers-reduced-motion (snaps to final).
 * Used by the proof figure so the 58% lands as a beat, not a value.
 */
function CountUpInt({
  target,
  active,
  durationMs = 1400,
  delayMs = 0,
}: {
  target: number;
  active: boolean;
  durationMs?: number;
  delayMs?: number;
}) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setValue(target);
      return;
    }

    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t + delayMs;
      const elapsed = t - start;
      if (elapsed < 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(Math.round(target * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [active, target, durationMs, delayMs]);

  return <>{value}</>;
}

export function Outcome({ content }: { content?: OutcomeContent }) {
  const c = { ...DEFAULTS, ...clean(content) };
  // Resolved for the (currently hidden) gallery; kept wired so re-enabling
  // the <OutcomeGallery/> call below picks up ACF content with no changes.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cards = content?.cards?.length ? content.cards : DEFAULTS.cards;

  return (
    <section
      id="outcome"
      className="relative border-t border-ink/10 bg-paper-warm"
    >
      {/* Soft brand wash — sets a different visual key from the dense Problem section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(249,144,77,0.16) 0%, rgba(249,144,77,0.05) 35%, transparent 65%)",
        }}
      />

      <OutcomeIntro content={c} />
      {/* <OutcomeGallery content={c} cards={cards} /> — hidden for now */}
    </section>
  );
}

function OutcomeIntro({ content: c }: { content: Required<OutcomeContent> }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const enter = reducedMotion;

  return (
    <div
      ref={ref}
      className="container-page relative py-16 md:py-32 lg:py-40"
    >
      {/* Promise — the headline reframes the problem from the inverse angle. */}
      <div
        className="max-w-4xl"
        style={{
          opacity: enter || inView ? 1 : 0,
          transform: enter || inView ? "translateY(0)" : "translateY(20px)",
          transition: enter
            ? "none"
            : "opacity 600ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        <p className="eyebrow">{c.eyebrow}</p>

        <h2 className="mt-4 text-hero font-serif font-normal text-ink">
          {c.headingLine1}
          <br />
          <span className="text-ink-muted">{c.headingLine2}</span>
        </h2>

        <p className="mt-7 max-w-[58ch] body-prose">{c.body}</p>
      </div>

      {/* Proof band — the 58% is the climax of the section. Framed as a
          study citation (DPP / CDC and NIH), with the formal source line
          underneath and a closing bridge sentence that separates the
          research finding from what Chronilogix actually does. */}
      <figure
        className="mt-12 max-w-4xl border-t border-ink/10 pt-8 md:mt-24 md:pt-14"
        style={{
          opacity: enter || inView ? 1 : 0,
          transform: enter || inView ? "translateY(0)" : "translateY(20px)",
          transition: enter
            ? "none"
            : "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 180ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 180ms",
        }}
      >
        <blockquote>
          <p className="font-serif text-section font-normal leading-[1.18] text-ink">
            <span
              aria-label={`${c.statValue} percent`}
              className="mr-3 font-normal text-brand-700 text-[1.7em] leading-[0.9] align-[-0.08em] tabular-nums"
            >
              <CountUpInt
                target={Number(c.statValue) || 0}
                active={inView}
                delayMs={220}
              />
              {c.statSuffix}
            </span>
            {c.quoteText}{" "}
            <span className="text-ink-muted">{c.quoteMuted}</span>
          </p>
        </blockquote>

        <figcaption className="source-line mt-7 md:mt-8">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-brand"
          />
          {c.sourceLine}
        </figcaption>

        <p className="mt-6 max-w-[58ch] body-quiet md:mt-7">{c.bridge}</p>
      </figure>
    </div>
  );
}

/**
 * Outcome gallery — editorial three-column layout. Left column carries
 * a second-beat headline; the right two columns are image cards (image,
 * bold label, body, case-study button). Each card's button is a
 * placeholder; destinations land later.
 *
 * The images are intentionally not tied to personas. They are quiet
 * editorial frames that carry the "in the moment" promise without any
 * label work on top of them. Card 2 sits a notch taller than card 1,
 * mirroring the reference's offset.
 */
// Card aspect ratios are structural (they drive the reference's offset) and
// stay hardcoded; only the image + copy inside each card is ACF-editable.
const CARD_ASPECTS = ["aspect-[4/5]", "aspect-[3/4]"] as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OutcomeGallery({
  content: c,
  cards,
}: {
  content: Required<OutcomeContent>;
  cards: OutcomeCard[];
}) {
  return (
    <div className="container-page relative pb-24 md:pb-32 lg:pb-40">
      {/* Top hairline — separates the gallery from the intro proof band
          and sets the editorial register of the three-column layout. */}
      <div aria-hidden className="h-px w-full bg-ink/15" />

      <div className="mt-14 grid gap-12 md:mt-20 md:gap-14 lg:grid-cols-12 lg:gap-12 xl:gap-16">
        <HeadlineColumn
          heading={c.galleryHeading}
          subhead={c.gallerySubhead}
        />
        <CardColumn card={cards[0]} aspect={CARD_ASPECTS[0]} delayMs={120} />
        <CardColumn card={cards[1]} aspect={CARD_ASPECTS[1]} delayMs={240} />
      </div>
    </div>
  );
}

function HeadlineColumn({
  heading,
  subhead,
}: {
  heading: string;
  subhead: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="lg:col-span-4"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition:
          "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)",
      }}
    >
      {/* Demoted from text-hero to text-section so it reads as the
          section's second beat, not a competing primary headline. */}
      <h3
        className="text-section font-serif font-normal leading-[1.08] text-ink"
        style={{ textWrap: "balance" } as React.CSSProperties}
      >
        {heading}
      </h3>
      <p className="mt-5 text-base text-ink-muted md:text-lg">{subhead}</p>
    </div>
  );
}

function CardColumn({
  card,
  aspect,
  delayMs,
}: {
  card: OutcomeCard;
  aspect: string;
  delayMs: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="lg:col-span-4"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 800ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delayMs}ms, transform 800ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delayMs}ms`,
      }}
    >
      <figure
        className={`relative ${aspect} overflow-hidden rounded-[24px] bg-ink/5`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.src}
          alt={card.alt}
          className="h-full w-full object-cover"
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </figure>

      <div className="mt-7 md:mt-8">
        <h4 className="text-base font-medium text-ink md:text-lg">
          {card.label}
        </h4>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft md:text-base">
          {card.body}
        </p>

        {/* Case-study CTA — placeholder, no destination wired. Rendered
            as a button so it stays inert until the case-study URLs land. */}
        <button
          type="button"
          className="group/link mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-brand-600"
        >
          Read the case study
          <Arrow />
        </button>
      </div>
    </div>
  );
}

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

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="transition-transform group-hover/link:translate-x-0.5"
    >
      <path d="M3 7h8M7.5 3l3.5 4-3.5 4" />
    </svg>
  );
}

// Strip null/undefined/empty-string values so partial ACF payloads never blank
// out the section — the DEFAULTS show through instead.
function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}
