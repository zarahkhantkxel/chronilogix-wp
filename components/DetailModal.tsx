"use client";

// Universal detail modal — used everywhere on V4 (and later versions) as
// the shared "expand this idea" surface.
//
// V2 pass — sibling nav lives OUTSIDE the modal card as a floating
// chapter list pinned to the bottom-right of the viewport. The card
// itself is spacious, single-column, minimal chrome: no visible border,
// no prev/next footer, no ring outlines. Reads as an editorial article
// rising out of a blurred page.
//
// Behaviour:
// - Dark blurred backdrop, click to close
// - Floating chapter nav (bottom-right) lets a visitor flip between
//   siblings without closing
// - Arrow keys flip siblings; ESC / X / backdrop close
// - Page scroll locks while open (via useScrollLock — the scroller here is
//   <html>, not <body>); previous focus is restored on close
// - Rendered via portal into document.body so it escapes any parent
//   stacking context

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { useScrollLock } from "./hooks/useScrollLock";

export type DetailModalItem = {
  id: string;
  /** Full-sentence descriptive line rendered in the section ChapterRail. */
  railLabel: string;
  /** Short label used in the floating chapter nav (bottom-right). */
  navLabel: string;
  /** Small brand-tinted label at the top of the modal. */
  eyebrow?: string;
  /** Hero numeral inside the modal (e.g. "40M"). */
  statHero?: string;
  /** Italic serif caption next to the hero numeral. */
  statCaption?: string;
  /** Bold, balanced hook sentence. */
  heading: string;
  /** Long-form body — two or three short paragraphs. */
  body: ReactNode;
  /** Optional downstream cascade list. */
  chain?: string[];
};

export type DetailModalProps = {
  items: DetailModalItem[];
  activeId: string | null;
  onClose: () => void;
  onSelect: (id: string) => void;
};

export function DetailModal({
  items,
  activeId,
  onClose,
  onSelect,
}: DetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousActive = useRef<HTMLElement | null>(null);

  const active = items.find((i) => i.id === activeId) ?? null;
  const activeIndex = active ? items.findIndex((i) => i.id === active.id) : -1;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock page scroll while open. This used to set `overflow: hidden` on
  // <body>, which did nothing: the scrolling element on this site is
  // <html>, so the page kept scrolling behind the overlay. useScrollLock
  // locks the real scroller, compensates for the scrollbar gutter so the
  // layout doesn't jump sideways, and preserves the reader's position.
  useScrollLock(Boolean(activeId));

  // Focus management. On open, focus the close button so ESC and
  // arrow-key nav feel connected. On close, return focus to whichever
  // trigger opened the modal.
  useEffect(() => {
    if (activeId) {
      previousActive.current = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => {
        closeBtnRef.current?.focus();
      });
    } else if (previousActive.current) {
      previousActive.current.focus?.();
      previousActive.current = null;
    }
  }, [activeId]);

  // Keyboard: ESC closes; arrows flip siblings. Wraps around the list.
  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const next = items[(activeIndex + 1) % items.length];
        if (next) onSelect(next.id);
        return;
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const prev =
          items[(activeIndex - 1 + items.length) % items.length];
        if (prev) onSelect(prev.id);
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, activeIndex, items, onClose, onSelect]);

  if (!mounted) return null;
  if (!activeId || !active) return null;

  return createPortal(
    <>
      {/* Backdrop — dim + blur. */}
      <div
        aria-hidden
        className="fixed inset-0 z-[100] bg-ink/45 backdrop-blur-md"
        style={{ animation: "fadeIn 240ms ease-out both" }}
      />

      {/* Modal container — click anywhere outside the card closes. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`detail-heading-${active.id}`}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-8"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex w-full max-w-[720px] max-h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-[28px] bg-paper-warm shadow-[0_40px_80px_-24px_rgba(15,20,25,0.35)] md:max-h-[calc(100svh-4rem)]"
          style={{ animation: "modalIn 320ms cubic-bezier(0.16,1,0.3,1) both" }}
        >
          {/* Close — minimalist. Just the icon, no border, no shadow. */}
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

          {/* Content — single generous column. */}
          <div className="overflow-y-auto px-8 py-12 md:px-14 md:py-16">
            {active.eyebrow ? (
              <p className="eyebrow">{active.eyebrow}</p>
            ) : null}

            {active.statHero ? (
              <div className="mt-5 flex items-baseline gap-5 md:mt-6 md:gap-6">
                <p className="font-serif text-stat-md font-normal leading-none text-ink">
                  {active.statHero}
                </p>
                {active.statCaption ? (
                  <p className="max-w-[26ch] font-serif text-[13.5px] italic leading-[1.4] text-ink-muted md:text-[14.5px]">
                    {active.statCaption}
                  </p>
                ) : null}
              </div>
            ) : null}

            <h2
              id={`detail-heading-${active.id}`}
              className="mt-9 max-w-2xl font-serif text-[24px] font-normal leading-[1.2] text-ink md:mt-10 md:text-[28px] lg:text-[30px]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {active.heading}
            </h2>

            <div className="mt-6 max-w-2xl body-prose md:mt-7">
              {active.body}
            </div>

            {active.chain ? (
              <ol className="relative mt-8 max-w-lg space-y-3 md:mt-10">
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-[7px] top-[12px] bottom-[12px] w-px bg-ink/12"
                />
                {active.chain.map((step, i) => (
                  <li
                    key={step}
                    className="relative flex gap-3 text-[15px] leading-snug text-ink-soft md:text-base"
                  >
                    <span className="relative z-10 w-5 shrink-0 pt-[2px] font-mono text-[11px] font-medium tabular-nums text-ink-subtle">
                      <span className="inline-block bg-paper-warm px-px">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <span className="flex-1">{step}</span>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </div>
      </div>

      {/* Floating chapter nav — lives outside the modal card. Desktop
          only; on mobile, arrow keys still work and users can close
          then tap another rail row. */}
      <FloatingChapterNav
        items={items}
        activeId={active.id}
        onSelect={onSelect}
      />
    </>,
    document.body,
  );
}

function FloatingChapterNav({
  items,
  activeId,
  onSelect,
}: {
  items: DetailModalItem[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav
      aria-label="Related items"
      className="pointer-events-auto fixed bottom-10 right-10 z-[101] hidden md:block"
      style={{ animation: "fadeIn 280ms ease-out 120ms both" }}
    >
      {/* Typography-only list matching the Superpower FAQ nav reference:
          no card, no background, no shadow. Labels sit directly on the
          dim + blurred backdrop. The active row gets a filled triangle
          marker on its left; inactive rows carry no marker so the eye
          lands on the active one first. */}
      <ul className="flex flex-col gap-5">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center gap-3 text-left"
              >
                {/* Fixed-width marker slot so active / inactive labels
                    align horizontally regardless of visibility. */}
                <span
                  aria-hidden
                  className={`inline-flex w-2.5 shrink-0 items-center transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <svg
                    viewBox="0 0 8 10"
                    width="8"
                    height="10"
                    fill="currentColor"
                    className="text-white"
                    aria-hidden
                  >
                    <path d="M0 0 L8 5 L0 10 Z" />
                  </svg>
                </span>
                <span
                  className={`text-[15px] leading-tight tracking-[-0.005em] transition-colors duration-200 md:text-[16px] ${
                    isActive
                      ? "font-medium text-white"
                      : "text-white/55 group-hover:text-white/85"
                  }`}
                >
                  {item.navLabel}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
