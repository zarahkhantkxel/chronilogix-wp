"use client";

// pageNav — the reusable "On this page" wayfinder.
//
// This is the wayfinding half of the old homepage SectionGuide, lifted out
// so every long page (product, about, the solutions pages) can carry the
// same rail with its own table of contents. Three exports:
//
//   • TocItem / usePageNav — the shared state (reduced-motion, the reveal
//     gate, and the scroll-spy that tracks the active section).
//   • PageNavRail — the presentational pill ⇄ rail card, driven by items +
//     activeIndex. SectionGuide renders this directly so it can stack the
//     rail above its homepage-only DemoCard in one fixed column.
//   • PageNav — a self-contained widget (reveal gate + fixed positioning +
//     the rail) for pages that only need wayfinding. No DemoCard.
//
// Scroll targets: each item id is resolved to its enclosing <section> for
// both scroll-spy and click-scroll, so a page can point at whatever anchor
// it already has — a section root id OR an aria-labelledby heading id —
// and still get accurate section-level tracking. A null id means "top".

import { useEffect, useMemo, useState } from "react";

export type TocItem = {
  // null id means "scroll to top" — an opening/hero with no anchor of its own.
  id: string | null;
  label: string;
};

// Fixed-nav offset applied on click-scroll so a targeted section lands below
// the sticky top nav rather than tucked under it. Matches scroll-mt-24 (6rem).
const NAV_OFFSET = 96;

// Match the site's primary motion curve (out-quart).
const RAIL_EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";
const REVEAL_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

// Shared surface material, kept identical to the homepage DemoCard so the
// two read as one system when stacked: paper-warm fill, two-layer shadow
// (cool close-shadow + warm brand bloom), hairline border.
export const PANEL_BG = "#FBF8F4";
export const PANEL_SHADOW = [
  "0 1px 0 rgba(255,255,255,0.65) inset",
  "0 -0.5px 0 rgba(15,20,25,0.04) inset",
  "0 1px 2px rgba(15,20,25,0.04)",
  "0 10px 28px -6px rgba(15,20,25,0.16)",
  "0 22px 40px -16px rgba(228,90,28,0.18)",
].join(", ");
export const PANEL_BORDER = "1px solid rgba(15,20,25,0.08)";
const CARD_WIDTH = 264;

// Resolve a TOC id to the element the rail should observe and scroll to.
// Climbs to the nearest <section> so a heading-level anchor still yields a
// full-height target (accurate intersection ratios, sensible scroll stop).
function resolveTarget(id: string): HTMLElement | null {
  const el = document.getElementById(id);
  if (!el) return null;
  return (el.closest("section") as HTMLElement | null) ?? el;
}

function scrollToItem(id: string | null) {
  if (id === null) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = resolveTarget(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

// Collapsed-state progress indicator. A small ring that fills as the reader
// moves through the page, replacing the old bottom hairline that floated off
// the pill's edge and read as a rendering artifact. Faint track + a
// brand-accent arc with a rounded cap.
function ProgressRing({
  pct,
  reducedMotion,
}: {
  pct: number;
  reducedMotion: boolean;
}) {
  const r = 6;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = circumference * (1 - clamped / 100);
  return (
    <span
      aria-hidden
      className="relative flex h-4 w-4 shrink-0 items-center justify-center"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" className="-rotate-90">
        <circle
          cx="8"
          cy="8"
          r={r}
          fill="none"
          stroke="rgba(15,20,25,0.14)"
          strokeWidth="2"
        />
        <circle
          cx="8"
          cy="8"
          r={r}
          fill="none"
          stroke="#FF7434"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: reducedMotion
              ? "none"
              : `stroke-dashoffset 400ms ${RAIL_EASE}`,
          }}
        />
      </svg>
    </span>
  );
}

// Shared state for both the standalone PageNav and SectionGuide's inline
// rail: reduced-motion, the once-fires reveal gate, and the scroll-spy that
// reports the active TOC index.
export function usePageNav(
  items: TocItem[],
  { revealId }: { revealId?: string | null } = {},
) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Reveal once the visitor is past the hero. Prefer watching the given
  // anchor (its section); fall back to a 60%-viewport scroll so the rail is
  // never unreachable if the anchor is missing.
  useEffect(() => {
    if (revealed) return;
    const target =
      revealId != null ? resolveTarget(revealId) : null;
    if (target) {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
          }
        },
        { threshold: 0.1 },
      );
      obs.observe(target);
      return () => obs.disconnect();
    }
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        setRevealed(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [revealed, revealId]);

  // Scroll-spy — track the section with the largest visible ratio, keyed
  // back to its TOC id. Falls back to the first item when nothing is in view.
  useEffect(() => {
    const targets = items
      .map((t) => (t.id ? { id: t.id, el: resolveTarget(t.id) } : null))
      .filter((t): t is { id: string; el: HTMLElement } => Boolean(t?.el));
    if (targets.length === 0) return;

    const elToId = new Map(targets.map((t) => [t.el, t.id]));
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = elToId.get(entry.target as HTMLElement);
          if (id) ratios.set(id, entry.intersectionRatio);
        }
        let best: { id: string; r: number } | null = null;
        for (const [id, r] of ratios) {
          if (r > 0.15 && (!best || r > best.r)) best = { id, r };
        }
        setActiveId(best?.id ?? null);
      },
      { threshold: [0.15, 0.3, 0.5, 0.75] },
    );

    targets.forEach((t) => observer.observe(t.el));
    return () => observer.disconnect();
  }, [items]);

  const activeIndex = useMemo(() => {
    if (activeId === null) return 0;
    const i = items.findIndex((t) => t.id === activeId);
    return i === -1 ? 0 : i;
  }, [activeId, items]);

  return { revealed, activeIndex, reducedMotion };
}

// ─── PageNavRail ─────────────────────────────────────────────────────
// Presentational wayfinder. Collapsed pill ⇄ expanded rail card. The fill +
// knob track `activeIndex`; a hairline on the collapsed pill preserves a
// sense of place while the rail is closed. Purely driven by props — the
// caller owns positioning and the reveal gate.
export function PageNavRail({
  items,
  activeIndex,
  reducedMotion,
  navLabel = "Sections",
}: {
  items: TocItem[];
  activeIndex: number;
  reducedMotion: boolean;
  navLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const stepCount = items.length;

  // Rail geometry — equal row slices; track spans first→last row center;
  // fill grows top-down to the active row's center.
  const segment = 100 / stepCount;
  const trackTop = segment / 2;
  const trackHeight = 100 - segment;
  const fillHeight =
    stepCount > 1 ? (activeIndex / (stepCount - 1)) * trackHeight : 0;
  const knobTop = trackTop + segment * activeIndex;
  const progressPct =
    stepCount > 1 ? (activeIndex / (stepCount - 1)) * 100 : 0;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open the page guide"
        aria-expanded={false}
        className="pointer-events-auto group flex h-9 items-center gap-2 rounded-full pl-2.5 pr-3.5 text-[12px] font-medium text-ink-soft transition-colors duration-200 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF8F4]"
        style={{
          background: PANEL_BG,
          border: PANEL_BORDER,
          boxShadow: PANEL_SHADOW,
        }}
      >
        <ProgressRing pct={progressPct} reducedMotion={reducedMotion} />
        On this page
      </button>
    );
  }

  return (
    <div
      role="complementary"
      aria-label="Page guide"
      className="pointer-events-auto relative origin-bottom-left overflow-hidden rounded-[14px]"
      style={{
        width: CARD_WIDTH,
        background: PANEL_BG,
        border: PANEL_BORDER,
        boxShadow: PANEL_SHADOW,
        opacity: 0,
        animation: reducedMotion
          ? "none"
          : `guideReveal 420ms ${REVEAL_EASE} forwards`,
      }}
    >
      {/* Caption row — a quiet label over the list, not a header bar: no
          separator, no hover slab, sits flush above the rail. Doubles as
          the collapse control (chevron). */}
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-expanded
        aria-controls="page-guide-rail"
        aria-label="Collapse the page guide"
        className="group flex w-full items-center gap-2 px-3.5 pb-1.5 pt-3 text-left focus:outline-none"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.07em] text-ink-subtle transition-colors duration-200 group-hover:text-ink-soft">
          On this page
        </span>
        <span
          aria-hidden
          className="ml-auto text-[11px] font-medium tabular-nums text-ink-subtle"
        >
          {activeIndex + 1}
          <span className="text-ink/25"> / {stepCount}</span>
        </span>
        <span
          aria-hidden
          className="text-ink-subtle transition-colors duration-200 group-hover:text-ink-soft"
        >
          <svg width="11" height="7" viewBox="0 0 11 7" aria-hidden>
            <path
              d="M1 5.5 5.5 1.5 10 5.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </span>
      </button>

      <nav
        id="page-guide-rail"
        className="px-3.5 pb-3.5 pt-1"
        aria-label={navLabel}
      >
        <ul className="relative">
          <span
            aria-hidden
            className="absolute left-0 block w-px bg-ink/12"
            style={{ top: `${trackTop}%`, height: `${trackHeight}%` }}
          />
          <span
            aria-hidden
            className="absolute left-[-0.5px] block w-[2px] rounded-full"
            style={{
              top: `${trackTop}%`,
              height: `${fillHeight}%`,
              background:
                "linear-gradient(180deg, #FFB088 0%, #FF7434 55%, #E45A1C 100%)",
              boxShadow:
                "0 0 0 1px rgba(255,116,52,0.06), 0 4px 12px -4px rgba(255,116,52,0.45)",
              transition: reducedMotion
                ? "none"
                : `top 400ms ${RAIL_EASE}, height 400ms ${RAIL_EASE}`,
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-[0.5px]"
            style={{
              top: `${knobTop}%`,
              transform: "translate(-50%, -50%)",
              transition: reducedMotion ? "none" : `top 400ms ${RAIL_EASE}`,
            }}
          >
            <span className="relative block">
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 block h-[7px] w-[7px] rounded-full"
                style={{
                  backgroundColor: "#FF7434",
                  transform: "translate(-50%, -50%)",
                  animation: reducedMotion
                    ? "none"
                    : "knobPulse 2400ms cubic-bezier(0.22, 0.61, 0.36, 1) infinite",
                }}
              />
              <span
                className="relative block h-[7px] w-[7px] rounded-full bg-brand-accent"
                style={{
                  boxShadow:
                    "0 0 0 2px rgba(255,116,52,0.15), 0 3px 8px -2px rgba(255,116,52,0.4)",
                }}
              />
            </span>
          </span>

          {items.map((item, i) => {
            const isActive = i === activeIndex;
            const isVisited = i < activeIndex;
            const color = isActive
              ? "rgba(15,20,25,0.95)"
              : isVisited
                ? "rgba(15,20,25,0.62)"
                : "rgba(15,20,25,0.4)";
            return (
              <li key={item.label} className="cursor-pointer">
                <button
                  type="button"
                  onClick={() => scrollToItem(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className="group relative flex w-full items-center rounded-md py-[5px] pl-4 pr-1.5 text-left transition-colors duration-200 hover:bg-ink/[0.025] focus:outline-none focus-visible:bg-ink/[0.04]"
                  style={{
                    background: isActive
                      ? "rgba(255,116,52,0.06)"
                      : "transparent",
                    transition: reducedMotion
                      ? "none"
                      : "background-color 300ms ease-out",
                  }}
                >
                  <span
                    className="text-[12px] leading-snug"
                    style={{
                      color,
                      fontWeight: isActive ? 500 : 400,
                      transition: reducedMotion
                        ? "none"
                        : "color 300ms ease-out",
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

// ─── PageNav ─────────────────────────────────────────────────────────
// Self-contained wayfinder for pages that only need "On this page" (no demo
// card). Owns the reveal gate + fixed bottom-left positioning; hidden below
// md so mobile stays uncluttered.
export function PageNav({
  items,
  revealId,
  navLabel,
}: {
  items: TocItem[];
  revealId?: string | null;
  navLabel?: string;
}) {
  const { revealed, activeIndex, reducedMotion } = usePageNav(items, {
    revealId,
  });

  if (!revealed) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 hidden md:block md:bottom-6 md:left-6">
      <PageNavRail
        items={items}
        activeIndex={activeIndex}
        reducedMotion={reducedMotion}
        navLabel={navLabel}
      />
    </div>
  );
}
