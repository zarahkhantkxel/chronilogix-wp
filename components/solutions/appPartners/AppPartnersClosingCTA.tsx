"use client";

import { useReveal } from "@/components/hooks/useReveal";
import { DEMO_BOOKING_URL } from "@/site.config";

export type AppPartnersClosingCTAContent = {
  eyebrow?: string;
  headingLead?: string;
  headingBrand?: string;
  body?: string;
  primaryLabel?: string;
  primaryUrl?: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
  footer?: string;
};

const DEFAULTS = {
  eyebrow: "One integration, thirty years of science.",
  headingLead: "Ship the coaching",
  headingBrand: "your users deserve.",
  body:
    "Chronilogix is the clinical intelligence layer built to live inside other products. Bring Dr. Resnicow’s methodology to your users — without waiting a decade to build it yourself.",
  primaryLabel: "Explore the partnership",
  primaryUrl: DEMO_BOOKING_URL,
  secondaryLabel: "Download the whitepaper",
  secondaryUrl: "/chronilogix-mi-whitepaper.pdf",
  footer:
    "Grounded in 30 years of Motivational Interviewing research. Built for embedding. Available 24/7 to your users.",
} satisfies Required<AppPartnersClosingCTAContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function AppPartnersClosingCTA({
  content,
}: {
  content?: AppPartnersClosingCTAContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const { ref, inView } = useReveal<HTMLDivElement>();
  return (
    <section
      id="book-a-demo"
      aria-labelledby="ap-closing-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 0%, rgba(249,144,77,0.18) 0%, rgba(249,144,77,0.05) 40%, transparent 75%)",
        }}
      />

      {/* Ambient orbs — same treatment as the Brokers closing so both
          deep-dive pages share the "living surface" signature. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full opacity-40 blur-3xl animate-orb-rotate-a"
        style={{
          background:
            "radial-gradient(circle, rgba(249,144,77,0.55) 0%, rgba(249,144,77,0) 65%)",
          transformOrigin: "60% 60%",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-16 h-80 w-80 rounded-full opacity-30 blur-3xl animate-orb-rotate-b"
        style={{
          background:
            "radial-gradient(circle, rgba(255,116,52,0.45) 0%, rgba(255,116,52,0) 65%)",
          transformOrigin: "40% 40%",
        }}
      />

      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-28 text-center md:py-36 lg:py-44"
      >
        <p className="eyebrow">{c.eyebrow}</p>

        <h2
          id="ap-closing-label"
          className="reveal-row mx-auto mt-6 max-w-[20ch] font-serif font-normal text-display text-ink [transition-delay:120ms]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {c.headingLead}
          <br />
          <span className="text-brand-700">{c.headingBrand}</span>
        </h2>

        <div className="reveal-row mx-auto mt-10 max-w-[58ch] space-y-5 body-prose [transition-delay:280ms]">
          <p>{c.body}</p>
        </div>

        <div className="reveal-row mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 [transition-delay:440ms]">
          <a href={c.primaryUrl} target="_blank" rel="noopener noreferrer" className="group/pc btn-primary">
            {c.primaryLabel}
            <Arrow />
          </a>
          <a
            href={c.secondaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            {c.secondaryLabel}
          </a>
        </div>

        <p className="reveal-row mx-auto mt-10 max-w-[54ch] body-quiet [transition-delay:600ms]">
          {c.footer}
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
      className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/pc:translate-x-1"
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
