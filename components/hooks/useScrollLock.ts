"use client";

import { useEffect } from "react";

/**
 * useScrollLock — freezes the page behind an open overlay.
 *
 * Why this exists (and why the old inline version didn't work):
 * every modal on this site used to do
 *
 *   document.body.style.overflow = "hidden"
 *
 * which is a no-op here. The scrolling element on this site is
 * `document.documentElement` (`<html>`), not `<body>` — confirmed
 * empirically: `document.documentElement.scrollHeight` reports the full
 * page height and `window.scrollTo()` drives it. The CSS rule that
 * *would* forward `body`'s overflow up to the viewport only applies while
 * the root element's own overflow stays `visible`, and in this document it
 * never took effect — so hiding `body` clipped nothing and the page kept
 * scrolling underneath the overlay. Locking the real scroller (`html`)
 * removes the ambiguity entirely.
 *
 * Why `overflow: hidden` and not `position: fixed`:
 * `overflow: hidden` on the scroller keeps `scrollTop` intact for free, so
 * the reader is returned to the exact same line when the overlay closes.
 * The `position: fixed` alternative resets `scrollTop` and forces a manual
 * `window.scrollTo()` on cleanup — which, because `app/globals.css` sets
 * `html { scroll-behavior: smooth }`, would *animate* the page back on
 * every close. Nothing here scrolls programmatically, so smooth scrolling
 * is never engaged and close feels instant.
 *
 * Scrollbar-gutter compensation:
 * hiding the scroller reclaims the classic scrollbar's width and reflows
 * the page a few pixels wider — a visible horizontal jump the moment the
 * overlay opens. We measure the gutter *before* locking and pad it back on
 * the same element we locked. On overlay-scrollbar platforms (most macOS
 * setups) the gutter is 0 and we deliberately write nothing at all, rather
 * than churning an inert `padding-right: 0px` onto the element.
 *
 * Reference counting:
 * locks are counted, so two overlays open at once (e.g. mobile nav plus a
 * detail modal) don't fight — the first one to close leaves the lock in
 * place, and the original inline styles are restored only when the last
 * lock releases.
 *
 * Usage:
 *   useScrollLock(isOpen);
 */

/** Number of live locks. The DOM is only touched on 0 → 1 and 1 → 0. */
let lockCount = 0;
/** Restores the exact inline styles captured when the lock engaged. */
let release: (() => void) | null = null;

function engage() {
  const html = document.documentElement;

  // Capture the previous *inline* values rather than assuming they were
  // empty — another effect (or a future one) may legitimately own these.
  const prevOverflow = html.style.overflow;
  const prevPaddingRight = html.style.paddingRight;

  // Must be measured before overflow is hidden, while the scrollbar (if
  // this platform has a space-taking one) is still laid out.
  const gutter = window.innerWidth - html.clientWidth;
  const padded = gutter > 0;

  html.style.overflow = "hidden";
  if (padded) html.style.paddingRight = `${gutter}px`;

  release = () => {
    html.style.overflow = prevOverflow;
    // Only restore what we actually wrote; on a 0-gutter platform we never
    // touched padding, so we leave it untouched on the way out too.
    if (padded) html.style.paddingRight = prevPaddingRight;
  };
}

export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    lockCount += 1;
    if (lockCount === 1) engage();

    // Cleanup also covers unmounting while still open — React runs it
    // either way, so a modal that disappears mid-open can't leave the page
    // permanently frozen.
    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        release?.();
        release = null;
      }
    };
  }, [locked]);
}
