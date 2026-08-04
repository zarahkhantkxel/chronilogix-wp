"use client";

import { HiwRoniGrid } from "./HiwRoniGrid";
import { HiwMillieGrid } from "./HiwMillieGrid";

/**
 * "The coaches" section. Sets up the generalist-vs-specialist argument,
 * then hands off to two purpose-built sub-grids — one per coach — that
 * each present the agent's avatar, voice sample, capabilities, and
 * identity in a diagonal 3×2 layout.
 *
 * Roni's grid puts the avatar (R1C1) and name (R2C3) on opposite corners.
 * Millie's grid mirrors it — avatar (R1C3) and name (R2C1) — so the two
 * sections rhyme across the page rather than repeating the same composition.
 */

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the header renders identically when a field is empty.
export type HiwAgentsContent = {
  eyebrow?: string;
  headingLead?: string;
  headingMuted?: string;
  paragraph1?: string;
  paragraph2?: string;
};

const DEFAULTS = {
  eyebrow: "The coaches",
  headingLead: "Built different.",
  headingMuted: "For different needs.",
  paragraph1:
    "Chronic disease and mental health rarely travel alone, yet most AI health tools are built as if they do. One generalist model trained on everything from step counts to grief, doing nothing particularly well.",
  paragraph2:
    "Chronilogix made a different choice. Two specialized coaches, each purpose built for a distinct clinical domain, with its own voice, depth, and expertise. Both live inside one app, grounded in the same evidence based behavioral science, and members can work with one or both, as life requires.",
} satisfies Required<HiwAgentsContent>;

// Strip null/undefined/empty-string values so partial ACF payloads never blank
// out the section — the DEFAULTS show through instead.
function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function HiwAgents({ content }: { content?: HiwAgentsContent }) {
  const c = { ...DEFAULTS, ...clean(content) };

  return (
    <section
      id="agents"
      aria-labelledby="agents-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      {/* Header — sets up the choice the visitor is about to see. */}
      <div className="container-page pt-24 md:pt-32 lg:pt-40">
        <div className="max-w-5xl">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2
            id="agents-label"
            className="mt-4 text-hero font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {c.headingLead}{" "}
            <span className="text-ink-muted">{c.headingMuted}</span>
          </h2>
          <p className="mt-7 max-w-[68ch] body-prose">
            {c.paragraph1}
          </p>
          <p className="mt-5 max-w-[68ch] body-prose">
            {c.paragraph2}
          </p>
        </div>
      </div>

      {/* Two coach grids — Roni first, then Millie (mirrored layout).
          The grids sit close to one another so they read as one chapter
          of the page, not two separate sections. */}
      <div className="container-page pt-16 md:pt-20 lg:pt-24">
        <div id="roni" className="scroll-mt-24">
          <HiwRoniGrid />
        </div>
      </div>

      <div className="container-page pt-10 pb-24 md:pt-12 md:pb-32 lg:pt-14 lg:pb-40">
        <div id="millie" className="scroll-mt-24">
          <HiwMillieGrid />
        </div>
      </div>
    </section>
  );
}
