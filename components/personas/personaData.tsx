"use client";

// Shared persona model — the single source of truth for the six
// audiences Chronilogix serves. Consumed by:
//   • components/sections/WhoWeServe.tsx  — the homepage persona section
//   • components/Nav.tsx                  — the Solutions mega-menu
//
// Two of the personas (Benefits Brokers, Product Vendors) have live
// deep-dive sub-pages; the other four open a detail popup. Both surfaces
// share the same data and the same popup so they never drift apart.

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

// ── Types ────────────────────────────────────────────────────────────

export type IconVariant = "peach" | "coral" | "ember";
export type GlyphKey =
  | "briefcase"
  | "box"
  | "building"
  | "shield"
  | "device"
  | "heart";

export type Metric = {
  lead: string;
  caption: string;
  comparison: string;
};

export type Signal = {
  label: string;
  body: string;
};

type PersonaCommon = {
  key: string;
  label: string;
  intro: string;
  /** One-line hook shown in the row, under the label. */
  hook: string;
  /** Which filled glyph + warm-tile variant to render — mirrors Nav. */
  glyph: GlyphKey;
  iconVariant: IconVariant;
};

// Personas with a live sub-page + narrated track: link out, play inline.
export type LinkPersona = PersonaCommon & {
  kind: "link";
  href: string;
  linkLabel: string;
  audio: { src: string; title: string; durationHint: number };
};

// Personas with no sub-page: the row opens a popup carrying the detail.
export type PopupPersona = PersonaCommon & {
  kind: "popup";
  headline: [string, string];
  description: string | ReactNode;
  metrics?: Metric[];
  signals?: Signal[];
};

export type Persona = LinkPersona | PopupPersona;

// ── Icons — warm gradient tiles with filled glyphs ───────────────────
//
// A soft warm base with a diffused radial glow and a white glyph reading
// as a chapter mark on the tile. Three variants (peach / coral / ember)
// span brand-400 → brand-800 so a stack of them reads like a small
// gallery rather than a uniform column.

const ICON_BG: Record<IconVariant, string> = {
  peach:
    "radial-gradient(ellipse 70% 85% at 50% 105%, rgba(184,70,20,0.45) 0%, rgba(184,70,20,0) 68%), linear-gradient(180deg, #FB9C5E 0%, #FF7434 100%)",
  coral:
    "radial-gradient(ellipse 65% 70% at 50% -8%, rgba(253,179,125,0.55) 0%, rgba(253,179,125,0) 60%), linear-gradient(180deg, #FF7434 0%, #E45A1C 100%)",
  ember:
    "radial-gradient(circle at 28% 32%, rgba(253,179,125,0.5) 0%, rgba(253,179,125,0) 55%), radial-gradient(circle at 74% 74%, rgba(120,40,10,0.42) 0%, rgba(120,40,10,0) 55%), linear-gradient(135deg, #FB9C5E 0%, #B84614 100%)",
};

// Filled 20×20 glyphs, all drawn in the same style so the set reads as
// one family. Exported so surfaces that render their own tile (e.g. the
// Nav Solutions cards) can reuse the same glyph paths.
export const GLYPHS: Record<GlyphKey, ReactNode> = {
  briefcase: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 3.25A1.75 1.75 0 0 0 6.25 5v0.75H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-2.25V5A1.75 1.75 0 0 0 12 3.25H8zm3.75 2.5V5a.75.75 0 0 0-.75-.75h-2a.75.75 0 0 0-.75.75v0.75h3.5z"
    />
  ),
  box: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 2.4l6.5 3.35v8.5L10 17.6 3.5 14.25v-8.5L10 2.4zm0 2.15L6.6 6.3 10 8.05 13.4 6.3 10 4.55zM5 7.95v5.35l4.15 2.15v-5.3L5 7.95zm5.85 7.5L15 13.3V7.95l-4.15 2.2v5.3z"
    />
  ),
  building: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.5 3.5h11v13.5h-4V13h-3v4h-4V3.5zm2 2.75h1.75V8H6.5V6.25zm3.5 0h1.75V8h-1.75V6.25zm3.25 0h-1.75V8h1.75V6.25zM6.5 9.75h1.75v1.75H6.5V9.75zm3.5 0h1.75v1.75h-1.75V9.75zm3.25 0h-1.75v1.75h1.75V9.75z"
    />
  ),
  shield: (
    <path
      fill="currentColor"
      d="M10 3l6 2v5c0 3.5-2.5 6.2-6 7-3.5-.8-6-3.5-6-7V5l6-2z"
    />
  ),
  device: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.75 2.75h6.5A1.75 1.75 0 0 1 15 4.5v11a1.75 1.75 0 0 1-1.75 1.75h-6.5A1.75 1.75 0 0 1 5 15.5v-11A1.75 1.75 0 0 1 6.75 2.75zM10 7.05c-.6-.78-2-.62-2 .45 0 .86 1.2 1.63 2 2.15.8-.52 2-1.29 2-2.15 0-1.07-1.4-1.23-2-.45z"
    />
  ),
  heart: (
    <path
      fill="currentColor"
      d="M10 16.5s-6.5-3.6-6.5-8a3.75 3.75 0 0 1 6.5-2.5A3.75 3.75 0 0 1 16.5 8.5c0 4.4-6.5 8-6.5 8z"
    />
  ),
};

export function GlyphTile({
  glyph,
  variant,
}: {
  glyph: GlyphKey;
  variant: IconVariant;
}) {
  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_1px_2px_rgba(15,20,25,0.06),0_12px_24px_-14px_rgba(184,70,20,0.42)] transition-all duration-200 ease-out-quart group-hover:shadow-[0_2px_6px_rgba(15,20,25,0.08),0_16px_30px_-14px_rgba(184,70,20,0.52)] motion-reduce:transition-none"
      style={{ backgroundImage: ICON_BG[variant] }}
    >
      <svg viewBox="0 0 20 20" className="h-6 w-6" aria-hidden>
        {GLYPHS[glyph]}
      </svg>
    </span>
  );
}

// ── Persona data ─────────────────────────────────────────────────────

export const PERSONAS: Persona[] = [
  {
    kind: "popup",
    key: "employers",
    label: "Employers",
    intro: "For HR leaders & benefits owners",
    hook: "Reach an additional 25% of employees who never raise their hand — before they surface in claims.",
    glyph: "building",
    iconVariant: "coral",
    headline: ["Reach every employee.", "Not just the few who ask."],
    description: (
      <>
        <p className="body-prose">
          Chronilogix engages an additional 25% of your employees who
          were not previously receiving care &mdash; the benchmark Aetna
          reported from the{" "}
          <a
            href="/case-studies/aetna"
            className="underline decoration-brand-500/40 decoration-1 underline-offset-[3px] transition-colors hover:text-brand-700 hover:decoration-brand-600"
          >
            Aetna case study
          </a>
          .
        </p>
        <p className="mt-4 body-prose">
          At $60&ndash;70 per member per month, live coaching is too
          expensive to offer at real scale. Chronilogix delivers the same
          evidence-based coaching to your whole population, 24/7, at a
          fraction of the cost.
        </p>
      </>
    ),
    metrics: [
      {
        lead: "+25%",
        caption: "Additional employees engaged",
        comparison: "Not previously receiving care → reached, per Aetna",
      },
      {
        lead: "50%",
        caption: "Of live coaching, replaceable",
        comparison: "Live coaching calls → up to half replaced, no measurable decline",
      },
      {
        lead: "24/7",
        caption: "Available the moment it's needed",
        comparison: "Business hours → every hour",
      },
    ],
  },
  {
    kind: "link",
    key: "brokers",
    label: "Benefits Brokers",
    intro: "For benefits consultants & brokers",
    hook: "A defensible, CFO-ready ROI story — not another point solution.",
    glyph: "briefcase",
    iconVariant: "ember",
    href: "/solutions/brokers",
    linkLabel: "Read the full Brokers story",
    audio: {
      src: "/audio/chronilogix-broker-track.mp3",
      title: "A message to benefits brokers",
      durationHint: 122,
    },
  },
  {
    kind: "popup",
    key: "health-plans",
    label: "Health Plans & ACOs",
    intro: "For health plans & accountable care organizations",
    hook: "First-line claims mitigation — engage members before the claim.",
    glyph: "shield",
    iconVariant: "peach",
    headline: ["Claims mitigation,", "before the claim."],
    description:
      "A first line claims mitigation strategy. Chronilogix engages members before issues escalate, replacing up to 70% of routine human coaching at roughly one twentieth the cost, while improving access and member experience.",
    metrics: [
      {
        lead: "70%",
        caption: "Of routine coaching, replaceable",
        comparison: "Human coach required → Chronilogix covers",
      },
      {
        lead: "1/20",
        caption: "Of live coaching cost",
        comparison: "Baseline → ~5% of baseline",
      },
      {
        lead: "Pre",
        caption: "Engagement, before escalation",
        comparison: "Reactive triage → proactive outreach",
      },
    ],
  },
  {
    kind: "link",
    key: "vendors",
    label: "Product Vendors",
    intro: "For chronic care product & device vendors",
    hook: "Your product isn't the problem. What happens after delivery is.",
    glyph: "box",
    iconVariant: "peach",
    href: "/solutions/vendors",
    linkLabel: "Read the full Vendors story",
    audio: {
      src: "/audio/chronilogix-vendor-track.mp3",
      title: "A message to chronic care product vendors",
      durationHint: 139,
    },
  },
  {
    kind: "popup",
    key: "wellness-platforms",
    label: "Wellness Platforms",
    intro: "For consumer & enterprise wellness apps",
    hook: "The engagement layer your platform is missing.",
    glyph: "device",
    iconVariant: "coral",
    headline: ["The engagement layer", "your platform is missing."],
    description:
      "Embed Chronilogix as a white labeled coach to drive longer sessions, deeper retention, and more upgrade moments, without expanding staff or building clinical IP in house.",
    signals: [
      {
        label: "Longer sessions, deeper retention",
        body: "An engagement layer designed for return visits: more upgrade moments without reacquiring users.",
      },
      {
        label: "White labeled by design",
        body: "Your brand stays the surface; Chronilogix runs the coaching loop quietly underneath.",
      },
      {
        label: "No new staff, no clinical IP to build",
        body: "Skip the years of methodology work and the headcount that comes with it. Plug in, ship.",
      },
    ],
  },
  {
    kind: "popup",
    key: "underserved",
    label: "Underserved & Uninsured",
    intro: "For public health & community care programs",
    hook: "Judgment-free behavioral support, reachable at population scale.",
    glyph: "heart",
    iconVariant: "ember",
    headline: ["Care without the gate.", "Reachable at population scale."],
    description:
      "For people who often have no support alternative at all (the uninsured, underserved communities, and those who cannot afford repeated sessions), Chronilogix is an accessible, judgment free entry point to behavioral support at population scale.",
    signals: [
      {
        label: "An entry point where there isn't one",
        body: "For the uninsured and underserved, often the only behavioral support available at all.",
      },
      {
        label: "Judgment free, no scheduling, no cost barrier",
        body: "Help that arrives in the moment, on a phone, without the friction that turns people away.",
      },
      {
        label: "Population scale reach",
        body: "Picks up where staffed community programs cap out. Every member, every hour, every language.",
      },
    ],
  },
];

// Convenience selectors so consumers don't re-filter the array by hand.
export const LINK_PERSONAS = PERSONAS.filter(
  (p): p is LinkPersona => p.kind === "link",
);
export const POPUP_PERSONAS = PERSONAS.filter(
  (p): p is PopupPersona => p.kind === "popup",
);

// ── Popup ────────────────────────────────────────────────────────────

export function PersonaDetailPopup({
  persona,
  onClose,
}: {
  persona: PopupPersona | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousActive = useRef<HTMLElement | null>(null);
  const open = persona !== null;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      previousActive.current = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => closeBtnRef.current?.focus());
    } else if (previousActive.current) {
      previousActive.current.focus?.();
      previousActive.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !persona) return null;

  return createPortal(
    <>
      <div
        aria-hidden
        className="fixed inset-0 z-[100] bg-ink/45 backdrop-blur-md"
        style={{ animation: "fadeIn 240ms ease-out both" }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="persona-detail-heading"
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-8"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex w-full max-w-[760px] max-h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-[28px] bg-paper-warm shadow-[0_40px_80px_-24px_rgba(15,20,25,0.35)] md:max-h-[calc(100svh-4rem)]"
          style={{ animation: "modalIn 320ms cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60 md:right-7 md:top-7"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden>
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="overflow-y-auto px-7 py-12 md:px-14 md:py-14">
            <p className="eyebrow">{persona.intro}</p>
            <h2
              id="persona-detail-heading"
              className="mt-4 max-w-2xl font-serif text-[26px] font-normal leading-[1.12] text-ink md:mt-5 md:text-[32px]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {persona.headline[0]}{" "}
              <span className="text-ink-muted">{persona.headline[1]}</span>
            </h2>

            <div className="mt-6 max-w-2xl md:mt-7">
              {typeof persona.description === "string" ? (
                <p className="body-prose">{persona.description}</p>
              ) : (
                persona.description
              )}
            </div>

            {persona.metrics?.length ? (
              <MetricsGrid metrics={persona.metrics} />
            ) : null}
            {persona.signals?.length ? (
              <SignalsList signals={persona.signals} />
            ) : null}

            <div className="mt-10 md:mt-12">
              <a href="#book-a-demo" className="group/cta btn-primary w-fit">
                Talk to our team
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
                >
                  <ArrowRight />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

const ROMAN = ["I", "II", "III", "IV", "V"];

function MetricsGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="mt-10 border-t border-ink/15 pt-6 md:mt-12">
      <p className="eyebrow-muted">By the numbers</p>
      <div className="mt-6 grid grid-cols-1 gap-x-7 gap-y-6 sm:grid-cols-3">
        {metrics.map((m, i) => {
          const parts = m.comparison.split(/\s*→\s*/);
          const hasArrow = parts.length === 2;
          return (
            <div
              key={`${m.lead}-${i}`}
              className={
                i > 0 ? "border-t border-ink/10 pt-5 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0" : ""
              }
            >
              <p className="font-serif text-stat-md font-normal text-ink">
                {m.lead}
              </p>
              <p className="mt-2 text-sm font-medium leading-snug text-ink md:text-base">
                {m.caption}
              </p>
              {hasArrow ? (
                <p className="mt-1.5 font-serif text-[13px] italic leading-snug">
                  <span className="text-ink/45">{parts[0]}</span>
                  <span aria-hidden className="mx-1.5 not-italic text-brand-700">
                    →
                  </span>
                  <span className="text-ink-soft">{parts[1]}</span>
                </p>
              ) : (
                <p className="mt-1.5 font-serif text-[13px] italic text-ink-muted">
                  {m.comparison}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SignalsList({ signals }: { signals: Signal[] }) {
  return (
    <div className="mt-10 border-t border-ink/15 pt-6 md:mt-12">
      <p className="eyebrow-muted">What changes</p>
      <ol className="mt-4 flex flex-col">
        {signals.map((s, i) => {
          const isLast = i === signals.length - 1;
          return (
            <li
              key={`${s.label}-${i}`}
              className={`grid grid-cols-[2rem_1fr] gap-x-4 gap-y-1.5 py-5 ${
                !isLast ? "border-b border-ink/10" : ""
              }`}
            >
              <span className="font-serif text-[15px] italic leading-[1.55] text-brand-700">
                {ROMAN[i] ?? String(i + 1)}.
              </span>
              <p className="text-base font-medium leading-snug text-ink md:text-lg">
                {s.label}
              </p>
              <span aria-hidden />
              <p className="max-w-xl body-quiet">{s.body}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 7h9M8 3.5 11.5 7 8 10.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
