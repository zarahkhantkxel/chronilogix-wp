"use client";

import { useEffect, useRef, useState } from "react";

export function HiwClosingCTA() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  return (
    <section
      id="book-a-demo"
      aria-labelledby="closing-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      {/* Soft warm radial wash — anchors the closing beat in brand color
          without flipping the whole surface orange. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 0%, rgba(249,144,77,0.18) 0%, rgba(249,144,77,0.05) 40%, transparent 75%)",
        }}
      />

      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-28 text-center md:py-36 lg:py-44"
      >
        <p className="eyebrow">Chronic coaching that clicks.&trade;</p>

        <h2
          id="closing-label"
          className="reveal-row mx-auto mt-6 max-w-[18ch] text-display font-serif font-normal text-ink [transition-delay:120ms]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          Human coaches cannot scale.
          <br />
          <span className="text-brand-700">The need can.</span>
        </h2>

        <div className="reveal-row mx-auto mt-10 max-w-[58ch] space-y-5 body-prose [transition-delay:280ms]">
          <p>
            Chronilogix was built for that gap, so that every member,
            regardless of insurance status, work schedule, cultural
            background, or willingness to walk into a clinic, has access
            to a coaching relationship grounded in thirty years of
            clinical science.
          </p>
          <p>Always on. Never judging. Built so members keep showing up.</p>
        </div>

        <div className="reveal-row mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 [transition-delay:440ms]">
          {/* TODO: Calendly URL */}
          <a href="#book-a-demo" className="btn-primary">
            Book a Demo
            <Arrow />
          </a>
          <a
            href="/chronilogix-mi-whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group/wp btn-secondary"
          >
            Download the Clinical Overview
            <Arrow />
          </a>
        </div>

        {/* Supporting line — the quiet final reassurance. */}
        <p className="reveal-row mx-auto mt-10 max-w-[46ch] body-quiet [transition-delay:600ms]">
          Available 24/7. Grounded in 30 years of evidence. Built for the
          moments that actually determine outcomes.
        </p>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/wp:translate-x-1"
    >
      <path
        d="M3 7h6m0 0L6 4m3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function useReveal<T extends HTMLElement>() {
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
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}
