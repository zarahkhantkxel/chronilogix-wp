"use client";

// ProblemV2 — V4's reworked Problem section.
//
// The V1 Problem section renders six numeric facts inline as a long
// vertical scroll (5-ish viewports on desktop). V2 truncates the entry
// point: sticky image + short intro + a single pull quote + an
// editorial ChapterRail. Each row anchors on the hero stat and carries
// a full-sentence descriptive line; clicking opens the shared
// DetailModal with the fact's full detail — hero numeral, hook heading,
// two or three short paragraphs, and (for the prescription cascade)
// the chain. Modal copy is grounded in the business-context and
// copy-messaging source docs; each fact ties back to a Chronilogix
// differentiator (cultural tailoring, MI methodology, crisis
// protocol, 24/7 availability).

import { useState } from "react";
import { DetailModal } from "@/components/DetailModal";
import { ChapterRail, type ChapterRailRow } from "@/components/ChapterRail";
import { PROBLEM_FACTS } from "@/components/sections/problem-facts";

const RAIL_ROWS: ChapterRailRow[] = PROBLEM_FACTS.map((f) => ({
  id: f.id,
  stat: f.statHero,
  label: f.railLabel,
}));

export function ProblemV2() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section
      id="problem"
      className="relative border-y border-ink/10 bg-paper-warm"
      aria-labelledby="problem-heading"
    >
      <div className="grid lg:grid-cols-2">
        {/* Left — sticky image, unchanged from V1. */}
        <div className="relative p-2 lg:p-2">
          <div className="lg:sticky lg:top-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] lg:aspect-auto lg:h-[calc(100vh-1rem)]">
              <img
                src="/problem-portrait.webp"
                alt="A man sits cross-legged on a bed in afternoon light, alone, mid-thought."
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent"
              />
            </div>
          </div>
        </div>

        {/* Right — trimmed narrative + editorial stat rail. */}
        <div className="flex flex-col px-6 py-10 md:px-14 md:py-16 lg:px-16 lg:py-20 xl:px-20">
          <p className="eyebrow">The gaps</p>

          <h2
            id="problem-heading"
            className="mt-4 max-w-2xl text-hero font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            The most expensive moments{" "}
            <span className="text-ink-muted">
              happen between appointments.
            </span>
          </h2>

          <p className="mt-7 max-w-lg body-prose md:mt-8">
            The failure of traditional care is not one crisis but many. Behind
            each number below is a moment help wasn&rsquo;t there &mdash; and
            a cost that followed.
          </p>

          <p className="mt-10 max-w-lg font-serif text-[19px] italic leading-[1.4] text-ink-soft md:mt-12 md:text-[21px]">
            &ldquo;The costliest claims almost always begin as small,
            unaddressed risks between visits.&rdquo;
          </p>

          {/* Editorial stat rail — each row opens the modal. */}
          <div className="mt-12 md:mt-16">
            <ChapterRail
              rows={RAIL_ROWS}
              onSelect={setActiveId}
              activeId={activeId}
            />
          </div>

          {/* Resolution line — the section's closing thesis. */}
          <div className="mt-14 max-w-xl md:mt-16">
            <span aria-hidden className="block h-px w-12 bg-ink/20" />
            <p className="mt-6 font-serif text-row font-normal leading-[1.15] text-ink md:mt-8">
              AI coaches fill all of these gaps.
            </p>
          </div>
        </div>
      </div>

      {/* Shared modal — content swaps based on activeId. */}
      <DetailModal
        items={PROBLEM_FACTS}
        activeId={activeId}
        onClose={() => setActiveId(null)}
        onSelect={setActiveId}
      />
    </section>
  );
}
