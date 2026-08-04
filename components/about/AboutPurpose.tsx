"use client";

import { useEffect, useRef, useState } from "react";

type Persona = { lead: string; rest: string };

export type AboutPurposeContent = {
  eyebrow?: string;
  headingLead?: string;
  headingEmph?: string;
  intro1?: string;
  intro2?: string;
  intro3?: string;
  personas?: Persona[];
  reason?: string;
  italicLine?: string;
  closing1?: string;
  closing2?: string;
  quote?: string;
};

const DEFAULTS = {
  eyebrow: "Our purpose",
  headingLead: "The people nobody",
  headingEmph: "was building for.",
  intro1: "We want to be honest about who Chronilogix is really for.",
  intro2:
    "Not the already engaged wellness consumer who tracks their sleep and orders supplements online. Not the fully insured employee at a large company with a robust benefits package.",
  intro3:
    "We are building for the people the healthcare system consistently fails to reach.",
  personas: [
    { lead: "The night shift nurse", rest: "who needs support at 3 AM." },
    {
      lead: "The diabetic patient",
      rest: "who wants to stop taking their medication because they’re exhausted and nobody is checking in.",
    },
    {
      lead: "The underinsured worker",
      rest: "who has avoided care for two years because the deductible makes it inaccessible.",
    },
    {
      lead: "The person",
      rest: "who has never spoken honestly to a therapist because the stigma in their community makes it feel impossible.",
    },
  ],
  reason: "They are the reason Chronilogix exists.",
  italicLine: "We are here to help everyone.",
  closing1:
    "Filling the gaps includes everyone across all economic spectrum. No matter their coverage, whether insured through a plan, self-insured, or without a job, this is built to serve them all.",
  closing2:
    "Where affordability creates barriers, we bridge them, extending care from between visits through to ongoing aftercare support.",
  quote:
    "Chronilogix creates an emotionally accessible entry point for populations that might otherwise avoid support altogether.",
} satisfies Required<AboutPurposeContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

/**
 * Section 7: Who We're Building For. The most emotionally direct beat on
 * the page. A short prose statement followed by a large pull quote.
 */
export function AboutPurpose({ content }: { content?: AboutPurposeContent }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const personas = content?.personas?.length
    ? content.personas
    : DEFAULTS.personas;
  const ref = useRef<HTMLDivElement | null>(null);
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
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(20px)",
    filter: inView ? "blur(0)" : "blur(4px)",
    transition: `opacity 900ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, filter 900ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
  });

  return (
    <section
      id="purpose"
      ref={ref}
      className="relative overflow-hidden rounded-[28px] bg-paper-warm py-24 md:py-32 lg:py-40"
    >
      <div className="container-page relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow" style={reveal(0)}>
            {c.eyebrow}
          </p>
          <h2
            className="mt-5 text-display font-serif font-normal text-ink"
            style={
              {
                textWrap: "balance",
                ...reveal(120),
              } as React.CSSProperties
            }
          >
            {c.headingLead}{" "}
            <span className="text-ink-muted italic">{c.headingEmph}</span>
          </h2>
        </div>

        <div className="mx-auto mt-16 max-w-[64ch] space-y-7 md:mt-20">
          <p className="body-prose" style={reveal(260)}>
            {c.intro1}
          </p>
          <p className="body-prose" style={reveal(340)}>
            {c.intro2}
          </p>
          <p className="body-prose" style={reveal(420)}>
            {c.intro3}
          </p>

          {/* Personas as a list — same brand-dot bullet treatment Problem
              uses for "Between the numbers". Each persona is one concrete
              scene, not an abstraction; the bold lead anchors the eye,
              the rest of the line carries the why. */}
          <ul className="space-y-5 pt-2 md:space-y-6" style={reveal(500)}>
            {personas.map((p) => (
              <li
                key={p.lead}
                className="flex gap-4 text-left text-base leading-relaxed text-ink-soft md:text-lg"
              >
                <span
                  aria-hidden
                  className="mt-[0.7em] inline-block h-2 w-2 shrink-0 rounded-full bg-brand"
                />
                <span>
                  <span className="text-ink">{p.lead}</span> {p.rest}
                </span>
              </li>
            ))}
          </ul>

          <p className="body-prose" style={reveal(640)}>
            {c.reason}
          </p>

          {/* Closing beat — pulls the aperture wider from "the four faces
              above" out to "everyone the system leaves at the door." The
              first line lands as a standalone declaration (slightly weightier
              than surrounding prose); the next two paragraphs carry the
              coverage-agnostic promise and the aftercare bridge. */}
          <p
            className="pt-4 font-serif text-[22px] font-normal italic leading-[1.35] text-ink md:text-[26px]"
            style={reveal(720)}
          >
            {c.italicLine}
          </p>
          <p className="body-prose" style={reveal(800)}>
            {c.closing1}
          </p>
          <p className="body-prose" style={reveal(880)}>
            {c.closing2}
          </p>
        </div>

        <figure
          className="mx-auto mt-20 max-w-3xl md:mt-24"
          style={reveal(960)}
        >
          <blockquote className="relative text-center">
            {/* Decorative serif open quote glyph sits behind the quote
                line, anchoring it without using a line. */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 -top-10 -translate-x-1/2 select-none font-serif text-[120px] leading-none text-brand/15 md:-top-14 md:text-[160px]"
            >
              &ldquo;
            </span>
            <p className="relative font-serif text-section font-normal italic leading-[1.2] text-ink">
              {c.quote}
            </p>
          </blockquote>
        </figure>
      </div>
    </section>
  );
}
