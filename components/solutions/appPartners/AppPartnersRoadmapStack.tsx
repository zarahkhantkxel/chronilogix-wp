"use client";

import { useReveal } from "@/components/hooks/useReveal";

/**
 * AppPartnersRoadmapStack — the tension visual for the Problem section.
 *
 * Two "roadmap ticket stack" panels side by side.
 *
 *   Panel A — "You": a stack of five product-roadmap tickets, with
 *             "AI coaching" pinned at the bottom as still-pending.
 *   Panel B — "Your competitors": the same stack visually, but the
 *             "AI coaching" ticket is at the TOP, highlighted with a
 *             brand-orange check-mark that draws in on reveal.
 *
 * The point isn't which tickets — it's the position of "AI coaching"
 * in the stack. Buried on the left; shipped on the right.
 */

export type Ticket = {
  title: string;
  priority: string;
  variant?: "pending" | "shipped";
};

const DEFAULT_YOU_HEADING = "You";
const DEFAULT_COMPETITOR_HEADING = "Your competitors";

const DEFAULT_YOU_TICKETS: Ticket[] = [
  { title: "Onboarding v2", priority: "P0" },
  { title: "New widget", priority: "P1" },
  { title: "Referrals", priority: "P2" },
  { title: "Notifications", priority: "P2" },
  { title: "AI coaching", priority: "still pending", variant: "pending" },
];

const DEFAULT_COMPETITOR_TICKETS: Ticket[] = [
  { title: "AI coaching", priority: "shipped", variant: "shipped" },
  { title: "Onboarding v2", priority: "P0" },
  { title: "New widget", priority: "P1" },
  { title: "Referrals", priority: "P2" },
  { title: "Notifications", priority: "P2" },
];

export type AppPartnersRoadmapStackContent = {
  youHeading?: string;
  competitorHeading?: string;
  youTickets?: Ticket[];
  competitorTickets?: Ticket[];
};

export function AppPartnersRoadmapStack({
  content,
}: {
  content?: AppPartnersRoadmapStackContent;
}) {
  const youHeading = content?.youHeading || DEFAULT_YOU_HEADING;
  const competitorHeading =
    content?.competitorHeading || DEFAULT_COMPETITOR_HEADING;
  const youTickets = content?.youTickets?.length
    ? content.youTickets
    : DEFAULT_YOU_TICKETS;
  const competitorTickets = content?.competitorTickets?.length
    ? content.competitorTickets
    : DEFAULT_COMPETITOR_TICKETS;

  const { ref, inView } = useReveal<HTMLDivElement>();
  const playState = inView ? "running" : "paused";

  return (
    <div
      ref={ref}
      data-revealed={inView ? "true" : "false"}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6"
    >
      <RoadmapPanel
        heading={youHeading}
        tickets={youTickets}
        panelIndex={0}
        playState={playState}
      />
      <RoadmapPanel
        heading={competitorHeading}
        tickets={competitorTickets}
        panelIndex={1}
        playState={playState}
      />
    </div>
  );
}

function RoadmapPanel({
  heading,
  tickets,
  panelIndex,
  playState,
}: {
  heading: string;
  tickets: Ticket[];
  panelIndex: number;
  playState: "running" | "paused";
}) {
  // Panel A starts revealing immediately; Panel B follows so the eye
  // reads left-to-right and lands on the highlighted "AI coaching" row.
  const panelStart = panelIndex === 0 ? 120 : 720;
  const isCompetitor = panelIndex === 1;

  return (
    <div className="flex flex-col gap-3">
      <p
        className="font-serif text-[13px] italic text-ink-muted"
        style={{
          opacity: 0,
          animation: `fadeUp 500ms cubic-bezier(0.22, 0.61, 0.36, 1) ${panelStart}ms forwards`,
          animationPlayState: playState,
        }}
      >
        {heading}
      </p>
      <ol className="flex flex-col gap-2">
        {tickets.map((ticket, i) => (
          <TicketRow
            key={ticket.title + i}
            ticket={ticket}
            enterDelay={panelStart + 140 + i * 90}
            checkDelay={
              isCompetitor && ticket.variant === "shipped"
                ? panelStart + 140 + tickets.length * 90 + 200
                : 0
            }
            isCompetitor={isCompetitor}
            playState={playState}
          />
        ))}
      </ol>
    </div>
  );
}

function TicketRow({
  ticket,
  enterDelay,
  checkDelay,
  isCompetitor,
  playState,
}: {
  ticket: Ticket;
  enterDelay: number;
  checkDelay: number;
  isCompetitor: boolean;
  playState: "running" | "paused";
}) {
  const isPending = ticket.variant === "pending";
  const isShipped = ticket.variant === "shipped";

  // Ticket surface — Panel A on paper-warm, Panel B on white. Pending
  // ticket in Panel A gets a dashed border to read as "still pending".
  const surfaceClass = isCompetitor ? "bg-white" : "bg-paper-warm";
  const borderClass = isPending
    ? "border border-dashed border-ink/25"
    : "border border-ink/10";

  return (
    <li
      className={`flex items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 ${surfaceClass} ${borderClass}`}
      style={{
        opacity: 0,
        animation: `fadeUp 500ms cubic-bezier(0.22, 0.61, 0.36, 1) ${enterDelay}ms forwards`,
        animationPlayState: playState,
      }}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        {/* On the shipped ticket, a brand-orange checkmark draws in via
            methodLine (stroke-dashoffset). Otherwise the row has no
            leading glyph — the priority indicator on the right does the
            work. */}
        {isShipped ? (
          <span
            aria-hidden
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-600/10"
          >
            <svg
              viewBox="0 0 12 12"
              className="h-2.5 w-2.5"
              fill="none"
              aria-hidden
            >
              <path
                d="M2.5 6.2 L5 8.6 L9.6 3.6"
                stroke="#E45A1C"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="14"
                strokeDashoffset="14"
                style={{
                  animation: `methodLine 520ms cubic-bezier(0.22, 0.61, 0.36, 1) ${checkDelay}ms forwards`,
                  animationPlayState: playState,
                }}
              />
            </svg>
          </span>
        ) : null}

        <span
          className={`truncate font-serif text-[13.5px] italic ${
            isShipped
              ? "font-medium not-italic text-ink"
              : isPending
                ? "text-ink-muted"
                : "text-ink-soft"
          }`}
        >
          {ticket.title}
        </span>
      </div>

      {/* Priority indicator on the right.
          - Panel A (baseline rows): a small ink dash + P-level label.
          - Panel A (pending row): the dashed ticket border does the "not
            yet" work; the right side gets a small serif "—" so all rows
            share a hairline anchor point.
          - Panel B (shipped row): a brand-orange horizontal bar.
          - Panel B (baseline rows): a small ink dash + P-level label. */}
      <span className="flex shrink-0 items-center gap-2">
        {isShipped ? (
          <span
            aria-hidden
            className="block h-[3px] w-9 rounded-full"
            style={{ backgroundColor: "#FF7434" }}
          />
        ) : isPending ? (
          <span aria-hidden className="block h-px w-4 bg-ink/20" />
        ) : (
          <>
            <span aria-hidden className="block h-px w-4 bg-ink/25" />
            <span className="font-serif text-[11px] italic text-ink-muted">
              {ticket.priority}
            </span>
          </>
        )}
      </span>
    </li>
  );
}
