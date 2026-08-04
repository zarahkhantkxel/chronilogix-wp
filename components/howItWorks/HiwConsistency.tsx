"use client";

import { useEffect, useRef, useState } from "react";

type Invariant = {
  index: string;
  category: string;
  body: string;
};

const INVARIANTS: Invariant[] = [
  {
    index: "01",
    category: "Method",
    body: "The quality of the MI framework in every exchange.",
  },
  {
    index: "02",
    category: "Tone",
    body: "Non judgmental, warm, and direct. Always.",
  },
  {
    index: "03",
    category: "Availability",
    body: "24/7, every day, no waitlist, no scheduling.",
  },
];

export function HiwConsistency() {
  return (
    <section
      id="consistency"
      aria-labelledby="consistency-label"
      className="relative bg-white"
    >
      <div className="container-page py-24 md:py-32 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left column — eyebrow + headline anchor. */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">Why AI changes this</p>
              <h2
                id="consistency-label"
                className="mt-4 text-hero font-serif font-normal text-ink"
                style={{ textWrap: "balance" } as React.CSSProperties}
              >
                Care that doesn&rsquo;t{" "}
                <span className="text-brand-700">have a bad day.</span>
              </h2>
            </div>
          </div>

          {/* Right column — body argument. Four short paragraphs. */}
          <div className="lg:col-span-7">
            <div className="space-y-6 body-prose">
              <p>
                The best human coaches are extraordinary. They are also
                human, subject to burnout, overloaded caseloads, turnover,
                and the natural variation that comes with being a person
                rather than a system.
              </p>
              <p>
                In chronic care and behavioral health, consistency is not a
                nice to have. It is the mechanism of change. The member who
                receives the same quality of engagement on their worst day
                as on their best day stays engaged. The member who shows
                up after a lapse and finds the same non judgmental voice
                waiting, that member comes back.
              </p>
              <p>
                Chronilogix delivers evidence based behavioral engagement
                at the same standard every single session. Not because it
                is robotic. Because its conversational frameworks are
                built on clinical method, not on how the coach is feeling
                that day.
              </p>
              <p>
                That consistency scales in a way human care cannot. One
                coach can reach one member. Chronilogix can reach all of
                them, simultaneously, at any hour, in any time zone, for
                any condition, without adding a single hire.
              </p>
            </div>
          </div>
        </div>

        {/* The three invariants — three columns, each a clean column row.
            The numerals carry the rhythm; the categories label the
            dimension; the phrases land as plain-language claims. */}
        <Invariants />
      </div>
    </section>
  );
}

function Invariants() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="mt-24 md:mt-32">
      <div className="flex items-baseline justify-between gap-4 border-t border-ink/15 pt-6">
        <p className="eyebrow-muted">Three things that don&rsquo;t vary</p>
        <p className="font-serif text-[13px] italic text-ink/45">
          03 invariants
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-x-10 md:gap-y-0 md:divide-x md:divide-ink/10">
        {INVARIANTS.map((it, i) => (
          <div
            key={it.index}
            className={`flex flex-col gap-5 ${
              i === 0 ? "md:pr-8" : i === INVARIANTS.length - 1 ? "md:pl-8" : "md:px-8"
            }`}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transition:
                "opacity 600ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1)",
              transitionDelay: `${160 + i * 120}ms`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="font-serif text-[15px] font-medium tabular-nums text-brand-700">
                {it.index}
              </span>
              <span aria-hidden className="block h-px w-10 bg-ink/15" />
            </div>
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink-muted">
              {it.category}
            </p>
            <p
              className="font-serif text-row font-normal leading-[1.18] text-ink"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {it.body}
            </p>
          </div>
        ))}
      </div>
    </div>
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
