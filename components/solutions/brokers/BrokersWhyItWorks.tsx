"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * BrokersWhyItWorks — "The Business Impact: Better Outcomes for Your
 * Clients, Better Care for Their Members" (Section 7). Names both audiences
 * the broker answers to — the employer client (cost) and the member
 * (care) — so the impact reads as B2B and B2C at once.
 *
 * Four cards, per the brief: Reduce Avoidable Claims, Improve Medication
 * Adherence, Encourage Early Care, Scale Coaching Efficiently. The last
 * card carries the one hard number from the brief — replacing up to 80%
 * of traditional human coaching sessions at roughly $5 per session —
 * rendered as an inline stat line rather than a separate stat tile, so
 * all four cards read as one even set instead of two different layouts.
 */

type ImpactCard = {
  title: string;
  body: string;
};

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty.
export type BrokersWhyItWorksContent = {
  eyebrow?: string;
  headingLead?: string;
  headingEmph?: string;
  aside?: string;
  cards?: ImpactCard[];
};

const DEFAULT_CARDS: ImpactCard[] = [
  {
    title: "Reduce Avoidable Claims",
    body: "Support healthier behaviors before conditions worsen into high-cost interventions.",
  },
  {
    title: "Improve Medication Adherence",
    body: "Help members stay on track with the treatment plan the plan already covers.",
  },
  {
    title: "Encourage Early Care",
    body: "Reduce the delays that turn manageable issues into expensive ones.",
  },
  {
    title: "Scale Coaching Efficiently",
    body: "Replace up to 80% of traditional human coaching sessions, at roughly $5 per session.",
  },
];

const DEFAULTS = {
  eyebrow: "The business impact",
  headingLead: "Fewer claims, better adherence, earlier care,",
  headingEmph: "at a fraction of the cost.",
  aside: "A cost curve you can actually bend.",
  cards: DEFAULT_CARDS,
} satisfies Required<BrokersWhyItWorksContent>;

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

// Same background treatment as the AgentCard: a blurred pattern image
// masked so the color rises from the bottom edge, under a milky white overlay
// that dissolves it into white near the top. Uses the purple/rose Millie AI
// pattern from the homepage so every impact card carries that same tint.
const CARD_PATTERN = "/millie-pattern.webp";
const CARD_MASK =
  "linear-gradient(to top, #000 0%, rgba(0,0,0,0.55) 55%, transparent 100%)";
// The AgentCard gets extra warmth from its avatar's orange halo and its
// warm-paper section backdrop; these impact cards have neither and sit on
// pure white, so the same 0.55-floor wash crushes the tan into flat white.
// We lift the wash floor (0.35 at the bottom edge) so the same warm pattern
// actually reads here — matching the agent card's warmth, not just its CSS.
const CARD_WASH =
  "linear-gradient(to top, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.7) 55%, #FFFFFF 100%)";

// Per-card line icon — same stroke language as the site's other inline
// SVGs (1.5px stroke, round caps, no fill), tinted to the tonal brand-900.
function ImpactIcon({ index, size = 26 }: { index: number; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (index) {
    // Reduce avoidable claims — downward cost trend
    case 0:
      return (
        <svg {...common}>
          <path d="M4 7l6 6 3.5-3.5L20 16" />
          <path d="M20 11v5h-5" />
        </svg>
      );
    // Improve medication adherence — pill
    case 1:
      return (
        <svg {...common}>
          <rect x="3.5" y="9.5" width="17" height="6.4" rx="3.2" transform="rotate(-45 12 12.7)" />
          <path d="M9 9.7 14.3 15" />
        </svg>
      );
    // Encourage early care — clock
    case 2:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3.2 2" />
        </svg>
      );
    // Scale coaching efficiently — ascending bars
    default:
      return (
        <svg {...common}>
          <path d="M5 20V13M12 20V8M19 20V4" />
        </svg>
      );
  }
}

export function BrokersWhyItWorks({
  content,
}: {
  content?: BrokersWhyItWorksContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const CARDS = content?.cards?.length ? content.cards : DEFAULTS.cards;
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="brokers-why-label"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-[42ch]">
            <p className="reveal-row eyebrow [transition-delay:80ms]">
              {c.eyebrow}
            </p>
            <h2
              id="brokers-why-label"
              className="reveal-row mt-4 font-serif font-normal text-section text-ink [transition-delay:180ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.headingLead}{" "}
              <span className="text-brand-700 italic">{c.headingEmph}</span>
            </h2>
          </div>
          <p className="reveal-row eyebrow-subtle [transition-delay:260ms]">
            {c.aside}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {CARDS.map((card, i) => {
            const delay = 340 + i * 130;
            return (
              <div
                key={card.title}
                className="reveal-row relative flex min-h-[200px] flex-col overflow-hidden rounded-[24px] border border-ink/5 bg-white p-7 text-ink transition-transform duration-400 ease-out-quart motion-reduce:transition-none hover:-translate-y-1 md:min-h-[230px] md:p-8"
                style={{ transitionDelay: `${delay}ms` }}
              >
                {/* Blurred pattern wash rising from the bottom — identical
                    treatment to the AgentCard, so the gradient carries the
                    same warm→cool (teal) tones. */}
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
                {/* Milky white overlay — keeps the texture quiet under type. */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: CARD_WASH }}
                />

                <span className="relative text-brand-900">
                  <ImpactIcon index={i} />
                </span>

                <h3 className="relative mt-auto pt-8 font-serif text-xl font-normal leading-[1.15] md:text-2xl">
                  {card.title}
                </h3>
                <p className="relative mt-3 max-w-[36ch] text-[14px] leading-relaxed text-ink-soft md:text-[15px]">
                  {card.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
