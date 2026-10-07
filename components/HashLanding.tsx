"use client";

import { useEffect } from "react";

// HashLanding — makes an incoming `#fragment` actually land on a cold load.
//
// WHY THIS EXISTS
// The browser's native fragment scroll is unreliable on this site's content
// pages, and measurably fails on /about#science: the URL arrives correctly and
// the target is server-rendered, yet `window.scrollY` stays at exactly 0 while
// the target sits ~1600px down. Two things conspire:
//
//   1. `app/globals.css` sets `html { scroll-behavior: smooth }`, which turns
//      the load-time fragment scroll into an *animation*. An animated scroll
//      that begins while the document is still loading gets abandoned when the
//      layout above the target shifts underneath it — which is why the failure
//      mode is scrollY === 0 (attempt dropped) rather than a near-miss.
//   2. Everything above `#science` on /about is image-heavy (AboutTeam renders
//      seven portraits) plus a self-hosted webfont, so the target's document
//      offset genuinely moves for several hundred milliseconds after first
//      paint. Even a successful early scroll would land in the wrong place.
//
// So rather than fight the browser, we let it try, then converge on the right
// position ourselves.
//
// APPROACH
// A rAF loop that, each frame, measures the target's *document* offset
// (`rect.top + scrollY` — scroll-independent, so it isolates layout movement)
// and re-aligns instantly. No `setTimeout` guesswork: the loop exits as soon as
// that offset holds still for STABLE_FRAMES consecutive frames, i.e. when the
// layout above the target has actually settled. A frame budget caps the worst
// case, and `load` / `fonts.ready` give a late re-align for anything that
// settles after the budget (an unsized image, a slow font swap).
//
// Alignment goes through `scrollIntoView`, which honors the target's CSS
// `scroll-margin-top`. That keeps the landing position owned by the component
// that renders the anchor — AboutScience's `scroll-mt-28` (112px, clearing the
// 97px fixed nav) — instead of duplicating a magic offset here.
//
// `behavior: "instant"` is load-bearing, and specifically NOT `"auto"`. Per
// spec `auto` means "use the element's computed `scroll-behavior`" — so with
// `html { scroll-behavior: smooth }` in globals.css, `auto` produces a SMOOTH
// scroll, which is the very thing that gets abandoned mid-load. That was
// measured: with `auto`, scrollIntoView returned having moved nothing and
// `window.scrollY` stayed 0. `instant` forces a synchronous jump, so there is
// no animation to abandon, per-frame re-alignment is invisible rather than
// lurching, and there is nothing to animate for `prefers-reduced-motion`. An
// instant landing is also simply correct for a cold load — the visitor asked
// to arrive at a section, not to watch a 1600px flight to it.

// ~2.5s at 60fps. Long enough for portraits and webfonts to settle, short
// enough that we are never still moving the page once someone is reading.
const MAX_FRAMES = 150;

// Consecutive frames the target's document offset must hold still before we
// accept the landing as final.
const STABLE_FRAMES = 5;

// Hard wall-clock ceiling for the late `load` / `fonts.ready` re-align. Past
// this point the page belongs to the visitor, readiness signal or not.
const LATE_ALIGN_WINDOW_MS = 5000;

export function HashLanding() {
  useEffect(() => {
    // Only the hash present at mount. A hash the visitor produces later is a
    // same-page click, which the browser already handles correctly together
    // with the target's `scroll-mt` — we must not shadow that path.
    const raw = window.location.hash;
    if (raw.length < 2) return;

    let id = raw.slice(1);
    try {
      // Anchors elsewhere on the site are plain ASCII, but a hand-edited or
      // shared URL can arrive percent-encoded.
      id = decodeURIComponent(id);
    } catch {
      // Malformed escape sequence — fall through with the raw value.
    }
    if (!id) return;

    const startedAt = Date.now();
    let cancelled = false;
    let frames = 0;
    let stable = 0;
    let lastOffset = Number.NaN;
    let raf = 0;

    // Deliberately keyed to user *intent*, not to scroll position. Checking
    // `scrollY` cannot tell "the visitor started reading" apart from "the
    // browser's own fragment scroll is partway through", and we would guess
    // wrong either way. These events only fire for a real person, so the first
    // one is an unambiguous signal to get out of the way — permanently.
    //
    // This is also what keeps us clear of components/widget/pageNav.tsx: a
    // click on the "On this page" rail is a pointerdown, so we cancel before
    // its own NAV_OFFSET scroll runs and never tug against it.
    const INTENT_EVENTS = [
      "wheel",
      "touchstart",
      "pointerdown",
      "keydown",
    ] as const;

    const stop = () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      for (const type of INTENT_EVENTS) {
        window.removeEventListener(type, stop);
      }
    };

    for (const type of INTENT_EVENTS) {
      window.addEventListener(type, stop, { passive: true });
    }

    // `behavior: "auto"` is load-bearing — see the note above.
    const align = (el: Element) => {
      el.scrollIntoView({ block: "start", behavior: "instant" });
    };

    const tick = () => {
      if (cancelled) return;
      frames += 1;

      const el = document.getElementById(id);
      if (el) {
        // Document offset, not viewport offset: this changes only when the
        // layout above the target moves, which is exactly what we're waiting
        // out. Comparing viewport offsets would look "stable" the moment we
        // scrolled, defeating the check.
        const offset = el.getBoundingClientRect().top + window.scrollY;
        if (offset === lastOffset) {
          stable += 1;
        } else {
          stable = 0;
          lastOffset = offset;
        }

        // A no-op once we're already parked correctly, so holding still costs
        // nothing and produces no jitter.
        align(el);

        if (stable >= STABLE_FRAMES) {
          stop();
          return;
        }
      }
      // No element yet: keep spending frames from the budget. The anchor is
      // server-rendered today, but a future lazily-mounted target shouldn't
      // silently break the landing.

      if (frames >= MAX_FRAMES) {
        stop();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    // Late readiness signals, for content that settles after the frame budget
    // (an image with no reserved box, a font swapping in slowly). Guarded by
    // both the user-intent cancel and a wall-clock ceiling, so this can only
    // ever nudge a page nobody has touched yet.
    const lateAlign = () => {
      if (cancelled) return;
      if (Date.now() - startedAt > LATE_ALIGN_WINDOW_MS) return;
      const el = document.getElementById(id);
      if (el) align(el);
    };

    // `load` has usually ALREADY fired by the time a React effect runs on a
    // cold document load, and a `{ once: true }` listener attached to a past
    // event never fires — verified in this app: at effect time
    // `document.readyState` is already "complete", so registering blind made
    // this fallback dead on arrival. Call it directly in that case.
    if (document.readyState === "complete") {
      lateAlign();
    } else {
      window.addEventListener("load", lateAlign, { once: true });
    }
    // `document.fonts` is universally available in our supported browsers, but
    // it costs one guard to not throw if it isn't.
    document.fonts?.ready.then(lateAlign).catch(() => {});

    return () => {
      stop();
      window.removeEventListener("load", lateAlign);
    };
  }, []);

  return null;
}
