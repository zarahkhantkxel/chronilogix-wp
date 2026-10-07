"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * BrokersStrategy — "Introducing Chronilogix: The Front Door to Smarter
 * Claims Prevention" (Section 4).
 *
 * Answers the fourth question in the narrative arc: how does Chronilogix
 * solve it? Continuous AI coaching instead of waiting for intensive care,
 * resulting in earlier intervention, stronger engagement, and lower
 * long-term costs.
 *
 * Layout (referenced from a "What it's like working with …" bento): chip
 * eyebrow + serif heading over a bento grid —
 *   • Left  : a wide member photo, the human anchor for "in front of every
 *             member." A landscape group shot, so it spans two of three
 *             columns rather than being cropped into a sliver.
 *   • Right : the two proof stats stacked — the 24/7 availability stat
 *             (with the Dr. Ken Resnicow / MI grounding as a footer tag)
 *             over the 30+ yrs research stat. (No client testimonial:
 *             Chronilogix has no approved broker quote, and the project
 *             forbids anonymous/fabricated quotes.)
 *
 * Tones translated to Chronilogix's brand: light brand-orange tint cards
 * (brand-50) with ink text. The reference's green palette and its real
 * accreditation badges are not carried over.
 */

type Stat = { value: string; caption: string };

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty.
export type BrokersStrategyContent = {
  eyebrow?: string;
  headingLead?: string;
  headingEmph?: string;
  intro?: string;
  image?: string;
  imageAlt?: string;
  stats?: Stat[];
  footerTitle?: string;
  footerSubtitle?: string;
};

const DEFAULT_STATS: Stat[] = [
  {
    value: "24/7",
    caption: "Coaching available every hour, no waiting for a clinician's calendar.",
  },
  {
    value: "30+ yrs",
    caption: "Of NIH-funded research behind every conversation.",
  },
];

const DEFAULTS = {
  eyebrow: "Introducing Chronilogix",
  headingLead: "AI coaches in front of every member,",
  headingEmph: "before claims start.",
  intro:
    "A front-door claims-mitigation strategy for self-funded plans, working across chronic and behavioral health to reach members long before a quiet risk becomes an expensive claim.",
  image: "/for-employees.webp",
  imageAlt: "Four members outdoors in warm sunlight, smiling together.",
  stats: DEFAULT_STATS,
  footerTitle: "Grounded in Motivational Interviewing",
  footerSubtitle: "Dr. Ken Resnicow’s clinically validated framework",
} satisfies Required<BrokersStrategyContent>;

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

// Same background treatment as the Roni AI agent card: a blurred warm pattern
// masked so the color rises from the bottom edge, under a milky white overlay
// that dissolves it into white near the top. The wash floor is lifted (0.35)
// so the warmth reads on these smaller cards the same way the tall agent card
// shows it. Renders as an absolute layer inside a relative/overflow-hidden card.
const CARD_PATTERN = "/roni-pattern.webp";
const CARD_MASK =
  "linear-gradient(to top, #000 0%, rgba(0,0,0,0.55) 55%, transparent 100%)";
const CARD_WASH =
  "linear-gradient(to top, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.7) 55%, #FFFFFF 100%)";

function CardBackdrop() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={CARD_PATTERN}
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover"
        style={{
          filter: "blur(32px) saturate(0.4) brightness(1.06)",
          WebkitFilter: "blur(32px) saturate(0.4) brightness(1.06)",
          maskImage: CARD_MASK,
          WebkitMaskImage: CARD_MASK,
        }}
          loading="lazy"
          decoding="async"
        />
      <div aria-hidden className="absolute inset-0" style={{ background: CARD_WASH }} />
    </>
  );
}

export function BrokersStrategy({
  content,
}: {
  content?: BrokersStrategyContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const STATS = content?.stats?.length ? content.stats : DEFAULTS.stats;
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="brokers-strategy-label"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <p className="reveal-row eyebrow [transition-delay:80ms]">
          {c.eyebrow}
        </p>
        {/* Heading + description share one row on desktop: heading left,
            supporting copy right. Stacks on mobile. */}
        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 md:items-start">
          <h2
            id="brokers-strategy-label"
            className="reveal-row max-w-[22ch] font-serif font-normal text-section text-ink [transition-delay:180ms]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {c.headingLead}{" "}
            <span className="text-brand-700 italic">{c.headingEmph}</span>
          </h2>
          <p className="reveal-row max-w-[56ch] body-quiet md:pt-2 [transition-delay:260ms]">
            {c.intro}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 md:mt-14 md:gap-4 lg:grid-cols-3 lg:items-stretch">
          {/* Left — the members Chronilogix coaches: the human anchor for
              "in front of every member." A landscape group shot, so it
              spans two columns on desktop (a wide frame that fits the
              image instead of cropping it to a face or two) and stretches
              to the height of the stacked stats beside it. A real banner
              when the grid stacks, never a decorative sliver. */}
          <div className="reveal-row relative order-first min-h-[220px] overflow-hidden rounded-[24px] md:min-h-[300px] lg:col-span-2 lg:min-h-0 [transition-delay:340ms]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.image}
              alt={c.imageAlt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          {/* Right — the two proof stats, stacked. */}
          <div className="flex flex-col gap-3 md:gap-4">
            {/* 24/7 availability, with the Dr. Ken Resnicow / MI grounding. */}
            <div className="reveal-row relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-brand-50 p-8 md:p-9 [transition-delay:440ms]">
              <CardBackdrop />
              <div className="relative">
                <p className="font-serif text-4xl font-normal leading-none text-ink md:text-5xl">
                  {STATS[0].value}
                </p>
                <p className="mt-3 max-w-[30ch] text-[14px] leading-snug text-ink-soft">
                  {STATS[0].caption}
                </p>
              </div>
              <div className="relative mt-8 border-t border-ink/10 pt-5">
                <p className="text-[13px] font-medium text-ink">
                  {c.footerTitle}
                </p>
                <p className="mt-0.5 text-[13px] text-ink-muted">
                  {c.footerSubtitle}
                </p>
              </div>
            </div>

            {/* 30+ yrs research. */}
            <div className="reveal-row relative flex flex-col justify-center overflow-hidden rounded-[24px] bg-brand-50 p-8 md:p-9 [transition-delay:540ms]">
              <CardBackdrop />
              <p className="relative font-serif text-4xl font-normal leading-none text-ink md:text-5xl">
                {STATS[1].value}
              </p>
              <p className="relative mt-3 max-w-[30ch] text-[14px] leading-snug text-ink-soft">
                {STATS[1].caption}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
