"use client";

import { useReveal } from "@/components/hooks/useReveal";
import {
  AppPartnersRoadmapStack,
  type Ticket,
} from "./AppPartnersRoadmapStack";

export type AppPartnersProblemContent = {
  eyebrow?: string;
  headingLead?: string;
  headingMuted?: string;
  lead?: string;
  closing?: string;
  roadmapYouHeading?: string;
  roadmapCompetitorHeading?: string;
  roadmapYouTickets?: Ticket[];
  roadmapCompetitorTickets?: Ticket[];
};

const DEFAULTS = {
  eyebrow: "Where wellness apps hit the wall",
  headingLead: "Engagement got you here.",
  headingMuted: "Coaching won’t get you further.",
  lead:
    "You have a wellness app with real engagement. Users are showing up. But the coaching experience — the part that should drive lasting behavior change — is still shallow, and your most sophisticated users are starting to notice.",
  closing:
    "Building a genuinely clinical AI coaching engine takes years of behavioral science expertise and millions in development. Your product roadmap cannot wait for that. And your competitors are not standing still.",
  roadmapYouHeading: "You",
  roadmapCompetitorHeading: "Your competitors",
} satisfies Partial<AppPartnersProblemContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function AppPartnersProblem({
  content,
}: {
  content?: AppPartnersProblemContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      aria-labelledby="ap-problem-label"
      className="relative overflow-hidden rounded-[28px] bg-white"
    >
      <div
        ref={ref}
        data-revealed={inView ? "true" : "false"}
        className="container-page relative py-24 md:py-32 lg:py-40"
      >
        {/* Header row — left column carries the eyebrow, headline, and
            a shortened single lead paragraph so the visual on the right
            has room to breathe. */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <p className="reveal-row eyebrow [transition-delay:80ms]">
              {c.eyebrow}
            </p>
            <h2
              id="ap-problem-label"
              className="reveal-row mt-4 max-w-[20ch] font-serif font-normal text-section text-ink [transition-delay:180ms]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.headingLead}
              <br />
              <span className="text-ink-muted italic">{c.headingMuted}</span>
            </h2>
            <p className="reveal-row mt-6 max-w-[46ch] body-prose [transition-delay:320ms]">
              {c.lead}
            </p>
          </div>

          {/* Right column — the tension visual. Two side-by-side
              roadmap ticket stacks. "You" carries AI coaching at the
              bottom, still pending; "Your competitors" carry it at the
              top, shipped. The panels sit inside a soft warm frame so
              they read as one composed moment, not two floating cards. */}
          <div
            className="reveal-row [transition-delay:400ms]"
          >
            <div className="rounded-[20px] border border-ink/10 bg-paper-warm p-4 md:p-5 lg:p-6">
              <AppPartnersRoadmapStack
                content={{
                  youHeading: c.roadmapYouHeading,
                  competitorHeading: c.roadmapCompetitorHeading,
                  youTickets: content?.roadmapYouTickets,
                  competitorTickets: content?.roadmapCompetitorTickets,
                }}
              />
            </div>
          </div>
        </div>

        {/* Closing beat — the "why this is happening" paragraph sits
            below the visual pair, single column, so it lands as the
            resolution of the tension the illustrations set up. */}
        <p className="reveal-row mt-12 max-w-[62ch] body-prose [transition-delay:560ms] md:mt-16">
          {c.closing}
        </p>
      </div>
    </section>
  );
}
