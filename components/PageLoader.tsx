"use client";

import { useEffect, useState } from "react";

// The loader stays mounted until web fonts are ready (so the hero headline
// doesn't swap typefaces under the fade), with a soft minimum display so
// cached loads don't flicker. It deliberately does NOT wait on images:
// gating on them used to hold the overlay for megabytes of downloads and
// competed with the page's own (optimized, prioritized) image requests.
const MIN_DISPLAY_MS = 650;
const HARD_TIMEOUT_MS = 3000;
const SESSION_KEY = "chronilogix:loader-shown";

export function PageLoader() {
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);

  // Skip the loader on subsequent visits within the same tab session.
  // We do this in an effect (not useState initializer) because the loader
  // is SSR'd and React won't honor a client-only initial value during
  // hydration — the effect runs synchronously enough to clear before
  // anything past the first paint.
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") {
        setRemoved(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (removed) return;
    const start = performance.now();
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      window.setTimeout(() => {
        if (!cancelled) setDone(true);
      }, wait);
    };

    document.fonts.ready.then(finish, finish);

    const hardTimeout = window.setTimeout(finish, HARD_TIMEOUT_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(hardTimeout);
    };
  }, [removed]);

  useEffect(() => {
    if (!done) return;
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
    const t = window.setTimeout(() => setRemoved(true), 500);
    return () => window.clearTimeout(t);
  }, [done]);

  if (removed) return null;

  // pointer-events-none on the wrapper means the overlay is purely visual:
  // clicks fall through to the Nav and other interactive elements
  // underneath, so navigation never feels stuck even on the very first
  // paint while images are still decoding.
  return (
    <div
      aria-hidden={done}
      role="status"
      className={`pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper-warm transition-opacity duration-500 ease-out ${
        done ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Logo%20Packs/Primary%20Logo/Chronilogix_Logo-FullColor.svg"
        alt="Chronilogix"
        className="h-8 w-auto md:h-10 animate-[loaderLogoPulse_1.6s_ease-in-out_infinite]"
        draggable={false}
      />
      <div className="mt-7 flex items-center gap-1.5" aria-hidden>
        <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-[loaderDot_1.1s_ease-in-out_infinite] [animation-delay:-0.32s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-[loaderDot_1.1s_ease-in-out_infinite] [animation-delay:-0.16s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-[loaderDot_1.1s_ease-in-out_infinite]" />
      </div>
      <span className="sr-only">Loading Chronilogix</span>
    </div>
  );
}
