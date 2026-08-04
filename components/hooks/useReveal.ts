"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useReveal — intersection-observer based reveal hook. Fires once when
 * the element enters the viewport, then disconnects. Shared across the
 * /solutions sub-pages so the reveal cadence stays uniform.
 *
 * Usage:
 *   const { ref, inView } = useReveal<HTMLDivElement>();
 *   <div ref={ref} data-revealed={inView ? "true" : "false"}>…</div>
 */
export function useReveal<T extends HTMLElement>(options?: {
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      {
        threshold: options?.threshold ?? 0.2,
        rootMargin: options?.rootMargin ?? "0px 0px -8% 0px",
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [options?.threshold, options?.rootMargin]);

  return { ref, inView };
}

/**
 * useReducedMotion — subscribe to `(prefers-reduced-motion: reduce)`.
 * Returns `true` when the user has requested reduced motion so the
 * caller can render a static end-state instead of the animated one.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
