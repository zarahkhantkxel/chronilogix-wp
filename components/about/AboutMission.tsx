"use client";

import { useEffect, useRef, useState } from "react";

type Value = {
  label: string;
  body: string;
};

// Icons stay hardcoded and are matched to values by index (decorative).
const ICONS = [<PulseIcon key="p" />, <HeartIcon key="h" />, <GlobeIcon key="g" />];

export type AboutMissionContent = {
  eyebrow?: string;
  headingLead?: string;
  headingEmph?: string;
  intro?: string;
  values?: Value[];
};

const DEFAULTS = {
  eyebrow: "Our values",
  headingLead: "Three things Chronilogix",
  headingEmph: "won’t compromise on.",
  intro:
    "By partnering with healthcare leaders, employers, and clinicians, Chronilogix is rebuilding behavioral and chronic care from the ground up. Pushing the boundaries of applied AI while holding the line on what makes care worth having in the first place.",
  values: [
    {
      label: "Clinical integrity",
      body: "Every conversation Chronilogix has is grounded in clinical behavioral science, not wellness marketing. Our methodology is peer reviewed, our claims are evidence backed, and our coaching architecture is built on Motivational Interviewing: the most rigorously validated behavior change framework in the world.",
    },
    {
      label: "Human dignity",
      body: "Our platform is designed to feel like a conversation, not a transaction. People are met where they are, with the language they use, on the schedule they keep. Not managed toward where someone else wants them to be. No scripts. No nudges. No surveillance.",
    },
    {
      label: "Radical accessibility",
      body: "If we’re not reaching the people who fall through the cracks of traditional care, we’re not doing our job. That means meeting the night shift nurse at 3 AM, the underinsured worker who hasn’t seen a clinician in two years, and the person whose community makes therapy feel impossible.",
    },
  ],
} satisfies Required<AboutMissionContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function AboutMission({ content }: { content?: AboutMissionContent }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const values = content?.values?.length ? content.values : DEFAULTS.values;
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
  });

  return (
    <section
      id="values"
      ref={sectionRef}
      className="relative overflow-hidden rounded-[28px] bg-white py-20 md:py-24 lg:py-28"
    >
      <div className="container-page relative">
        {/* Editorial two-column intro — heading on the left, supporting
            body on the right. Both top-aligned (no self-end) so the
            columns read as balanced peers rather than a diagonal layout.
            The body sits down a beat (lg:mt-3) so its first line aligns
            visually with the heading's first baseline rather than with
            the smaller eyebrow above. */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 xl:gap-20">
          <div>
            <p className="eyebrow" style={reveal(0)}>
              {c.eyebrow}
            </p>
            <h2
              className="mt-5 font-serif text-[32px] font-normal leading-[1.1] tracking-[-0.012em] text-ink md:text-[40px] lg:text-[44px]"
              style={
                {
                  textWrap: "balance",
                  ...reveal(80),
                } as React.CSSProperties
              }
            >
              {c.headingLead}{" "}
              <span className="text-ink-muted italic">{c.headingEmph}</span>
            </h2>
          </div>
          <p
            className="max-w-[48ch] text-[15px] leading-relaxed text-ink-muted lg:mt-12 md:text-base"
            style={reveal(160)}
          >
            {c.intro}
          </p>
        </div>

        {/* Flat three-up grid — every value visible at once. The eye reads
            icon → label → body, indexed by a small ordinal so the three
            sit as a numbered set rather than a row of cards. Hairline rule
            above each row ties them into one editorial block. */}
        <ul className="mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-3 md:gap-8 lg:gap-10">
          {values.map((v, i) => (
            <ValueColumn
              key={v.label}
              value={v}
              icon={ICONS[i % ICONS.length]}
              style={reveal(240 + i * 100)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ValueColumn({
  value,
  icon,
  style,
}: {
  value: Value;
  icon: React.ReactNode;
  style: React.CSSProperties;
}) {
  return (
    <li className="flex flex-col" style={style}>
      <div className="flex items-center">
        <span aria-hidden className="inline-flex h-5 w-5 items-center justify-center text-brand-700">
          {icon}
        </span>
      </div>
      <h3 className="mt-5 font-serif text-[22px] font-normal leading-tight tracking-[-0.012em] text-ink md:text-[24px]">
        {value.label}
      </h3>
      <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-ink-soft md:text-[15.5px]">
        {value.body}
      </p>
    </li>
  );
}

function PulseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M1.5 9 H4.5 L6 5 L9 13 L11.5 9 H16.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 15.25 C 9 15.25, 2.25 11.5, 2.25 6.75 C 2.25 4.7, 3.85 3.1, 5.9 3.1 C 7.15 3.1, 8.3 3.75, 9 4.75 C 9.7 3.75, 10.85 3.1, 12.1 3.1 C 14.15 3.1, 15.75 4.7, 15.75 6.75 C 15.75 11.5, 9 15.25, 9 15.25 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2.5 9 H 15.5 M9 2.5 C 11.5 4.5, 11.5 13.5, 9 15.5 M9 2.5 C 6.5 4.5, 6.5 13.5, 9 15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
