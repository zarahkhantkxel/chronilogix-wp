"use client";

// SectionGuide — bottom-left companion for the homepage.
//
// Two INDEPENDENT pieces share the bottom-left corner but never share
// chrome, because they serve different needs:
//
//   • PageNavRail ("On this page") — utilitarian wayfinding, now the shared
//     rail from ./pageNav so every long page carries the same guide. Sits
//     on top.
//
//   • DemoCard — a promotional product-demo teaser. A poster-framed card
//     that opens a focused modal lightbox on click. Sits below, owning the
//     corner. Homepage-only, so it stays local to this file.
//
// They stack vertically with a gap so they read as two distinct elements.
// This wrapper owns only the shared concerns: the reveal gate, reduced
// motion, and the scroll-spy that drives the rail — all via usePageNav.
//
// Positioning + reveal: fixed bottom-left, z-40, mounts once the visitor
// scrolls past the hero (fires once, stays), hidden below md.

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  PageNavRail,
  usePageNav,
  PANEL_BG,
  PANEL_SHADOW,
  PANEL_BORDER,
  type TocItem,
} from "./pageNav";

// TOC labels trace the homepage's actual argument as a buyer scans it:
// Overview → the premise → the method (MI) → the coaches → the gap →
// outcomes → who it's for → proof → voices. Clear over clever, each short
// enough to keep the compact rail's single-column rhythm.
const HOME_TOC: TocItem[] = [
  { id: null, label: "Overview" },
  { id: "statement", label: "The premise" },
  { id: "motivational-interviewing", label: "Method" },
  { id: "solution", label: "The coaches" },
  { id: "problem", label: "The gap" },
  { id: "outcome", label: "Outcomes" },
  { id: "who-we-serve", label: "Who it's for" },
  { id: "customer-stories", label: "Proof" },
  { id: "testimonials", label: "Voices" },
];

// Match the site's primary motion curve (out-quart) + the stronger
// deceleration used for first-mount reveals.
const RAIL_EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";
const REVEAL_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
// Consistent width so the stacked pieces align into a tidy column.
const CARD_WIDTH = 264;

// Demo asset. Copied into public/video/ so Next serves it statically.
const DEMO_SRC = "/video/zenn-demo.mp4";
const DEMO_POSTER = "/video/zenn-demo-poster.jpg";
const DEMO_RUNTIME = "4:06";

// White-label framing. Zenn is a partner-branded product running the
// Chronilogix platform, so the copy keeps Chronilogix the subject and casts
// Zenn as the surface you're watching it through.
const DEMO_EYEBROW = "Live demo";
const DEMO_TITLE = "See Chronilogix, white-labeled as Zenn";
const DEMO_BLURB =
  "Our platform in action, running inside a partner's own app.";

export function SectionGuide() {
  const { revealed, activeIndex, reducedMotion } = usePageNav(HOME_TOC, {
    revealId: "statement",
  });

  // Hold both pieces off-screen until past the hero. Returning null keeps
  // them out of the tab order and lets the entry animation play on mount.
  if (!revealed) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 z-40 hidden flex-col items-start gap-2.5 md:flex md:bottom-6 md:left-6"
      aria-label="Homepage companion"
    >
      <PageNavRail
        items={HOME_TOC}
        activeIndex={activeIndex}
        reducedMotion={reducedMotion}
        navLabel="Homepage sections"
      />
      <DemoCard reducedMotion={reducedMotion} />
    </div>
  );
}

// ─── DemoCard ────────────────────────────────────────────────────────
// Promotional teaser. Poster-framed card ⇄ "Watch demo" pill; clicking the
// poster (or the pill) opens the modal lightbox. Independent of the nav
// above it. Homepage-only.
function DemoCard({ reducedMotion }: { reducedMotion: boolean }) {
  const [open, setOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {open ? (
        <div
          className="pointer-events-auto relative origin-bottom-left overflow-hidden rounded-[14px]"
          style={{
            width: CARD_WIDTH,
            background: PANEL_BG,
            border: PANEL_BORDER,
            boxShadow: PANEL_SHADOW,
            opacity: 0,
            animation: reducedMotion
              ? "none"
              : `guideReveal 480ms ${REVEAL_EASE} 80ms forwards`,
          }}
        >
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            aria-label="Play the demo: Chronilogix white-labeled as Zenn"
            aria-haspopup="dialog"
            className="group relative block w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60"
          >
            <span className="relative block aspect-video w-full bg-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DEMO_POSTER}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.04]"
                style={{
                  transition: reducedMotion
                    ? "none"
                    : `transform 600ms ${RAIL_EASE}`,
                }}
              />
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(15,20,25,0.42) 0%, rgba(15,20,25,0) 34%, rgba(15,20,25,0) 62%, rgba(15,20,25,0.46) 100%)",
                }}
              />
              <span className="absolute left-3 top-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90">
                {DEMO_EYEBROW}
              </span>
              <span className="absolute bottom-2.5 right-3 rounded-full bg-ink/55 px-1.5 py-0.5 text-[10.5px] font-medium tabular-nums text-white/90 backdrop-blur-sm">
                {DEMO_RUNTIME}
              </span>
              <span className="absolute inset-0 flex items-center justify-center">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-accent text-white shadow-[0_6px_18px_-4px_rgba(228,90,28,0.6)] group-hover:scale-110"
                  style={{
                    transition: reducedMotion
                      ? "none"
                      : `transform 300ms ${RAIL_EASE}`,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                    aria-hidden
                    className="ml-0.5"
                  >
                    <path d="M8 5.5v13l11-6.5z" />
                  </svg>
                </span>
              </span>
            </span>
          </button>

          {/* Caption — the white-label story. Chronilogix stays the
              subject; Zenn is named as the partner brand the demo runs
              under. */}
          <div className="px-3.5 pb-3 pt-2.5">
            <p className="text-[12.5px] font-medium leading-snug text-ink">
              {DEMO_TITLE}
            </p>
            <p className="mt-1 text-[11.5px] leading-snug text-ink-soft">
              {DEMO_BLURB}
            </p>
          </div>

          {/* Minimize — floats over the poster's top-right. Sibling of the
              demo button so its clicks never open the modal. */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Minimize the demo"
            className="absolute right-2 top-2 z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-ink/45 text-white/85 backdrop-blur-sm transition-colors duration-200 hover:bg-ink/65 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <svg width="9" height="2" viewBox="0 0 9 2" aria-hidden>
              <path
                d="M0.75 1h7.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Show the product demo"
          className="pointer-events-auto group flex h-9 items-center gap-2 rounded-full pl-2.5 pr-3.5 text-[12px] font-medium text-ink-soft transition-colors duration-200 hover:text-ink"
          style={{
            background: PANEL_BG,
            border: PANEL_BORDER,
            boxShadow: PANEL_SHADOW,
          }}
        >
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-accent text-white">
            <svg
              viewBox="0 0 24 24"
              width="11"
              height="11"
              fill="currentColor"
              aria-hidden
              className="ml-0.5"
            >
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
          Watch demo
        </button>
      )}

      {modalOpen ? (
        <DemoModal
          onClose={() => setModalOpen(false)}
          reducedMotion={reducedMotion}
        />
      ) : null}
    </>
  );
}

// Focused lightbox for the product demo. Dim + blur backdrop, centered 16:9
// player with native controls, rendered through a portal so it escapes any
// parent stacking context. Closes on ESC, backdrop click, or the × button;
// locks body scroll and restores focus to the trigger on close.
function DemoModal({
  onClose,
  reducedMotion,
}: {
  onClose: () => void;
  reducedMotion: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousActive = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    previousActive.current = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => {
      previousActive.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        aria-hidden
        className="fixed inset-0 z-[100] bg-ink/60 backdrop-blur-md"
        style={{
          animation: reducedMotion ? "none" : "fadeIn 240ms ease-out both",
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Demo: Chronilogix white-labeled as Zenn"
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[1200px] overflow-hidden rounded-[18px] bg-ink shadow-[0_40px_80px_-24px_rgba(15,20,25,0.55)]"
          style={{
            animation: reducedMotion
              ? "none"
              : "modalIn 320ms cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close demo"
            className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink/55 text-white/90 backdrop-blur-sm transition-colors hover:bg-ink/75 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
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

          {/* Header — carries the white-label framing into the player. */}
          <div className="flex flex-col gap-1 px-5 pb-3.5 pr-14 pt-4 md:px-7 md:pb-4 md:pr-16 md:pt-5">
            <p className="text-[15px] font-medium leading-snug text-white md:text-[17px]">
              {DEMO_TITLE}
            </p>
            <p className="text-[12.5px] leading-snug text-white">
              {DEMO_BLURB}
            </p>
          </div>

          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            className="block aspect-video w-full bg-ink"
            src={DEMO_SRC}
            poster={DEMO_POSTER}
            controls
            autoPlay
            playsInline
            preload="metadata"
          />
        </div>
      </div>
    </>,
    document.body,
  );
}
