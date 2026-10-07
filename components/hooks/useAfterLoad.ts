"use client";

import { useEffect, useState } from "react";

/**
 * useAfterLoad — true once the page has finished its initial load (window
 * `load`) and the browser has a moment of idle time.
 *
 * Use it to defer decorative, below-the-fold images that `loading="lazy"`
 * would still fetch immediately (lazy images within ~1250px of the viewport,
 * or inside invisible menus, load right away). Deferring them keeps their
 * bytes from competing with the hero for bandwidth on slow mobile networks.
 *
 * Usage:
 *   const ready = useAfterLoad();
 *   {ready && <Image … />}
 */
export function useAfterLoad() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const markReady = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(() => setReady(true), {
          timeout: 1500,
        });
      } else {
        timeoutId = window.setTimeout(() => setReady(true), 200);
      }
    };

    if (document.readyState === "complete") {
      markReady();
    } else {
      window.addEventListener("load", markReady, { once: true });
    }

    return () => {
      window.removeEventListener("load", markReady);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return ready;
}
