"use client";

import { useEffect, useRef, useState } from "react";
import { SessionWalkthrough } from "@/components/sections/SessionWalkthrough";
import { LevelsOfCare } from "@/components/sections/LevelsOfCare";
import { openAiWidget } from "@/lib/ai-widget";

type Agent = {
  name: string;
  condition: string;
  body: string;
  // Small floating tags showing the kinds of moments this coach handles.
  // Rendered as low-contrast chips that orbit the avatar.
  topics: string[];
  // Featured Q&A — the single anchor moment on each card. Q is the kind
  // of thing a member actually says; A is the coach's response, written
  // to demonstrate the agent's voice on a high-stakes statement that
  // shows up in real coaching sessions.
  featuredQ: string;
  featuredA: string;
  featuredContext: string;
  pattern: string;
  image: string;
  // Halo tint behind the avatar, picked to harmonize with each pattern.
  haloColor: string;
};

const AGENTS: Agent[] = [
  {
    name: "Roni AI",
    condition: "Diabetes",
    body: "Adaptive coaching for the food, activity, and medication choices that happen between clinic visits. Built around the member, not a template.",
    // Pills name the MITI fidelity dimensions Roni is scored against on
    // every turn — the same rubric Chronilogix's MI whitepaper describes.
    // Adherence contexts lean on autonomy support (respecting medication
    // decisions) and change-talk elicitation (mobilizing statements about
    // taking care of oneself); the remaining two ride along in the SR
    // overflow so the full rubric is present for assistive tech.
    topics: [
      "Open questions",
      "Autonomy support",
      "Change talk",
      "Complex reflections",
      "MI-adherent",
    ],
    // The single most cited high-value diabetes coaching moment in the MI
    // literature (ADA Clinical Diabetes, NIDDK): medication ambivalence.
    // It's the moment where a generic chatbot would lecture and an
    // MI-trained coach reflects, opens, and reframes adherence as
    // fitment, not willpower.
    featuredQ: "I keep skipping my evening dose.",
    featuredA:
      "Sounds like the evening dose isn't fitting your life right now. Tell me what gets in the way: the timing, the way it sits with you, or something else? We can move it before we fight it.",
    featuredContext: "Roni AI · Reflective adherence coaching · MI fidelity",
    pattern: "/roni-pattern.webp",
    image: "/roni.png",
    haloColor: "#F9904D",
  },
  {
    name: "Millie AI",
    condition: "Mental Health",
    body: "Reflective coaching for the 2 AM spiral and the long stretch between therapy sessions. Therapeutically informed, never prescriptive.",
    // Same MITI rubric as Roni. Mental-health contexts weight complex
    // reflections (emotional deepening), empathy (validating experience),
    // and evocation (drawing forth values) more visibly than adherence
    // work does; open questions and change talk remain in the rubric and
    // carry to the SR overflow.
    topics: [
      "Complex reflections",
      "Empathy",
      "Evocation",
      "Open questions",
      "Change talk",
    ],
    // Late-night racing thoughts is the single most common reason members
    // open a mental-health app outside of scheduled sessions. The
    // response uses 3-3-3 grounding — a validated MI-friendly variant of
    // 5-4-3-2-1 sensory grounding.
    featuredQ: "I can't get my mind to slow down.",
    featuredA:
      "Racing thoughts aren't yours to solve at midnight. Try this with me. Name three things you can see, three you can hear, three you can feel. Your body lands first, the mind follows.",
    featuredContext: "Millie AI · Grounding + reflective listening · MI fidelity",
    pattern: "/millie-pattern.webp",
    image: "/millie.png",
    haloColor: "#B8617C",
  },
];

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold]);

  return { ref, inView };
}

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty.
export type SolutionContent = {
  eyebrow?: string;
  headingLine1?: string;
  headingLine2?: string;
  headingMuted?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  agents?: Agent[];
};

const DEFAULTS = {
  eyebrow: "The agents",
  headingLine1: "Two contextually engineered",
  headingLine2: "AI coaches.",
  headingMuted: "Not just conversational AIs.",
  primaryCtaLabel: "Talk to Coach",
  secondaryCtaLabel: "Learn more about the product",
  secondaryCtaUrl: "/product",
  agents: AGENTS,
} satisfies Required<SolutionContent>;

export function Solution({ content }: { content?: SolutionContent }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const agents = content?.agents?.length ? content.agents : DEFAULTS.agents;
  const handleTalkClick = () => {
    void openAiWidget();
  };

  return (
    <section
      id="solution"
      className="relative rounded-[28px] bg-paper-warm pt-10 pb-12 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24"
    >
      <div className="container-page">
        <p className="eyebrow">{c.eyebrow}</p>
        <h2 className="mt-4 text-hero font-serif font-normal text-ink">
          {c.headingLine1}
          <br />
          {c.headingLine2}
          <br />
          <span className="text-ink-muted">{c.headingMuted}</span>
        </h2>

        {/* Contextually engineered framing — the whitepaper's central
            thesis brought to the homepage. A conversational AI improvises
            a reply each turn from a generic prompt; a contextually
            engineered coach interprets each utterance against the
            member's prior sessions, their cultural context, and the MI
            fidelity rubric, then chooses its next move from that
            interpretation. Personalization is engineered into the stack,
            not added at the language layer. */}
        <p className="mt-6 max-w-2xl body-prose md:mt-7">
          Conversational AI replies. Contextually engineered AI{" "}
          <span className="text-ink">reasons</span>, against the
          member&rsquo;s prior sessions, their cultural context, and an MI
          fidelity rubric. The result is engagement that{" "}
          <span className="text-ink">compounds</span>, instead of
          conversation that decays.
        </p>

        <div className="mt-8 grid gap-4 md:mt-10 md:gap-5 lg:grid-cols-2">
          {agents.map((agent) => (
            <AgentCard key={agent.name} agent={agent} />
          ))}
        </div>

        {/* Section-level CTAs — primary action opens the in-page coach
            chat (singular "coach" so the surface stays agnostic to the
            single live backend); secondary action routes to the deeper
            product page. Sits below the cards so readers weigh both
            coaches before acting. */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3 md:mt-10">
          <button
            type="button"
            onClick={handleTalkClick}
            className="group/talk inline-flex items-center gap-2 rounded-full bg-brand-accent px-6 py-3 text-sm font-medium text-white transition-all duration-300 ease-out motion-reduce:transition-none hover:opacity-95 hover:shadow-[0_8px_28px_-8px_rgba(255,116,52,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
          >
            {c.primaryCtaLabel}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/talk:translate-x-1"
            >
              <path
                d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <a
            href={c.secondaryCtaUrl}
            className="group/cta inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3 text-sm font-medium text-ink transition-all duration-300 ease-out motion-reduce:transition-none hover:border-ink/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2"
          >
            {c.secondaryCtaLabel}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/cta:translate-x-1"
            >
              <path
                d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Three Levels of Care — the IP framing of where Chronilogix
            sits in the care continuum. Sits between the agent cards
            (who the coaches are) and SessionWalkthrough (how a single
            session is run), so the narrative arc reads:
            two coaches → three places they show up → here's a session.

            Extra top margin separates the Levels intro from the agent
            cards above; the intro itself hugs its three rows tightly
            (see mt-6 inside LevelsOfCare). */}
        <div className="mt-24 md:mt-44">
          <LevelsOfCare />
        </div>

        {/* SessionWalkthrough hidden — StatementV2's Engage/Focus/Evoke/
            Plan grid now carries the same "frames-from-a-session" visual
            beat. Re-enable if we need session cadence content separately. */}
        {false && (
          <div className="mt-12 md:mt-28">
            <SessionWalkthrough />
          </div>
        )}
      </div>
    </section>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <article
      ref={ref}
      data-revealed={inView}
      className="relative overflow-hidden rounded-2xl border border-ink/5"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition:
          "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)",
      }}
    >
      {/* Full-bleed pattern, masked from the bottom up so the color rises
          from the bottom edge and dissolves into white near the top. A
          strong blur dissolves the source dither pattern into a smooth
          color wash so the individual pixels never read at card scale. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={agent.pattern}
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover"
        draggable={false}
        style={{
          filter: "blur(32px) saturate(0.4) brightness(1.06)",
          WebkitFilter: "blur(32px) saturate(0.4) brightness(1.06)",
          maskImage:
            "linear-gradient(to top, #000 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, #000 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
          opacity: inView ? 1 : 0,
          transform: inView ? "scale(1.1)" : "scale(1.15)",
          transition:
            "opacity 900ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 1200ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
          loading="lazy"
          decoding="async"
        />
      {/* Soft milky wash over the (already-masked) pattern — keeps the
          bottom-anchored texture quiet enough that the type stays the
          hero. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.75) 55%, #FFFFFF 100%)",
        }}
      />

      <div className="relative flex flex-col p-6 md:p-7 lg:p-8">
        {/* Header — chip + name. Body description moves below the
            orbit so the card has three balanced beats (identity →
            visual centerpiece → one-line context) instead of a
            top-heavy stack. */}
        <div
          className="flex flex-col gap-3"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(12px)",
            transition:
              "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 120ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 120ms",
          }}
        >
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em]"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "rgba(15, 20, 25, 0.10)",
              color: "#B84614",
              boxShadow:
                "0 1px 2px rgba(15, 20, 25, 0.05), 0 4px 12px -4px rgba(15, 20, 25, 0.08)",
            }}
          >
            <span
              aria-hidden
              className="block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: agent.haloColor }}
            />
            {agent.condition} Coach
          </span>
          <h3 className="text-row font-serif font-normal text-ink">
            {agent.name}
          </h3>
        </div>

        {/* Centerpiece — avatar with concentric rings + topic chips.
            flex-1 lets it claim the vertical middle of the card so
            the layout feels intentionally centered rather than
            top-heavy. */}
        <div className="flex flex-1 items-center justify-center py-6 md:py-7">
          <AgentOrbit agent={agent} active={inView} />
        </div>

        {/* Footer — single-line agent description. Sits at the
            bottom edge as a quiet caption that balances the chip +
            name pair at the top. */}
        <p
          className="max-w-[40ch] body-quiet"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(10px)",
            transition:
              "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 360ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 360ms",
          }}
        >
          {agent.body}
        </p>

        {/* Mobile-only topic tags — the orbit chips are hidden below
            md so the avatar can read clean; topics surface here as a
            simple wrap row so members still see what the coach
            handles. */}
        <ul
          className="mt-4 flex flex-wrap gap-1.5 md:hidden"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 460ms",
          }}
        >
          {agent.topics.slice(0, 4).map((topic) => (
            <li
              key={topic}
              className="inline-flex items-center rounded-full border border-ink/8 bg-white/80 px-2.5 py-1 text-[11.5px] text-ink-soft"
            >
              {topic}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

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

function AgentOrbit({ agent, active }: { agent: Agent; active: boolean }) {
  // Five topics: three sit ON the orbit rings (visible, spatially anchored),
  // and the rest live in an SR-only overflow line so the API stays full.
  const visibleTopics = agent.topics.slice(0, 3);
  const overflowTopics = agent.topics.slice(3);

  // Each chip is parked at a polar angle (degrees from 12 o'clock,
  // clockwise) on a given ring radius (percent of the orbit container).
  // The asymmetry is intentional — three angles that don't form a tidy
  // triangle so the orbit reads as motion rather than a fixed pattern.
  const chipPolars: Array<{ angle: number; radius: number }> = [
    { angle: 305, radius: 47 }, // upper-left, outer ring
    { angle: 80, radius: 44 }, // middle-right, middle ring
    { angle: 200, radius: 48 }, // lower-left, outer ring
  ];

  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[220px] items-center justify-center md:max-w-[240px]">
      {/* Three concentric dashed rings, gently more visible as they
          approach the avatar. Provides true orbital depth. */}
      <span
        aria-hidden
        className="pointer-events-none absolute aspect-square w-full rounded-full border border-dashed border-ink/8"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute aspect-square w-[78%] rounded-full border border-dashed border-ink/12"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute aspect-square w-[56%] rounded-full border border-dashed border-ink/16"
      />

      {/* Avatar at center. */}
      <CoachAvatar agent={agent} active={active} />

      {/* Floating topic chips — parked at polar coords so each one sits
          on (or near) one of the orbit rings. Hidden on mobile where
          they'd crowd the avatar; the card body renders the topics as
          a quiet inline tag row instead (see AgentCard). */}
      {visibleTopics.map((topic, i) => {
        const { angle, radius } = chipPolars[i];
        const rad = ((angle - 90) * Math.PI) / 180; // 12 o'clock = -90°
        const x = 50 + radius * Math.cos(rad);
        const y = 50 + radius * Math.sin(rad);
        return (
          <span
            key={topic}
            className="absolute z-20 hidden -translate-x-1/2 -translate-y-1/2 items-center whitespace-nowrap rounded-full border px-3 py-1 text-[12px] font-medium text-ink md:inline-flex"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              borderColor: "rgba(15, 20, 25, 0.08)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              boxShadow: "0 1px 2px rgba(15, 20, 25, 0.04), 0 6px 18px -6px rgba(15, 20, 25, 0.10)",
              opacity: active ? 1 : 0,
              transform: active
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(0.92)",
              transition: `opacity 600ms cubic-bezier(0.22, 0.61, 0.36, 1) ${400 + i * 120}ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${400 + i * 120}ms`,
            }}
          >
            {topic}
          </span>
        );
      })}

      {/* Overflow topics for screen readers. */}
      {overflowTopics.length > 0 && (
        <span className="sr-only">
          Also handles: {overflowTopics.join(", ")}.
        </span>
      )}
    </div>
  );
}

function FeaturedExchange({ agent, active }: { agent: Agent; active: boolean }) {
  return (
    <div
      className="relative flex flex-col gap-3"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(14px)",
        transition:
          "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 360ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 360ms",
      }}
    >
      {/* Member bubble — right-aligned, italic serif quote. Matches the
          conventional "user" position in messenger UIs (right side, tail
          at bottom-right). Uses surface-glass-inner so the bubble reads
          lighter than the coach reply that follows. */}
      <div className="surface-glass-inner relative max-w-[88%] self-end overflow-hidden rounded-[18px] rounded-br-[6px] px-4 py-3 md:px-5">
        <p className="relative font-serif text-[16px] italic leading-[1.34] tracking-[-0.01em] text-ink md:text-[17.5px]">
          {agent.featuredQ}
        </p>
      </div>

      {/* Coach bubble — left-aligned, primary frosted-glass treatment
          with a softened drop shadow so the pair sits as a conversation,
          not as a stacked pair of heavy cards. The top-edge shine keeps
          it in the same family as the session / capability glass cards. */}
      <div
        className="surface-glass relative max-w-[92%] self-start overflow-hidden rounded-[18px] rounded-bl-[6px] px-4 py-3 md:px-5 md:py-4"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.92), inset 0 -1px 0 rgba(15,20,25,0.03), 0 1px 2px rgba(15,20,25,0.03), 0 6px 18px -10px rgba(15,20,25,0.10)",
        }}
      >
        <span
          aria-hidden
          className="surface-glass-shine absolute inset-x-0 top-0 h-1/2 rounded-t-[18px]"
        />
        <p className="relative text-[14.5px] leading-[1.6] text-ink md:text-[15px]">
          {agent.featuredA}
        </p>
      </div>
    </div>
  );
}

function CoachAvatar({ agent, active }: { agent: Agent; active: boolean }) {
  // 8s pulse cycle (matches the original AgentBlob halo).
  const HALO_DURATION = 8;
  // Envelope is bigger now so the avatar reads as the unambiguous focal
  // point of each card. The outer orbit rings live in AgentOrbit; this
  // component is just the photo + halo + agent-tinted hairline.
  return (
    <div
      className="relative z-10 aspect-square shrink-0 w-[120px] md:w-[135px] lg:w-[145px]"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "scale(1)" : "scale(0.9)",
        transition:
          "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) 360ms, transform 800ms cubic-bezier(0.22, 0.61, 0.36, 1) 360ms",
      }}
    >
      {/* Tight hairline ring tinted with the agent color — frames the
          photo without competing with the orbit rings outside. */}
      <span
        aria-hidden
        className="absolute inset-[10%] rounded-full border-2"
        style={{ borderColor: `${agent.haloColor}33` }}
      />

      {/* Pulsing halo behind the avatar. Same 8s cycle as the original
          blob — slow expand + fade, long rest. */}
      <span
        aria-hidden
        className="halo-fill absolute inset-[16%] rounded-full"
        style={{
          backgroundColor: agent.haloColor,
          animation: active ? `haloFill ${HALO_DURATION}s ease-out infinite` : "none",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />

      {/* The photo itself — sits inside the rings, with a soft drop
          shadow tinted toward the agent's color. */}
      <div className="absolute inset-[16%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={agent.image}
          alt={`${agent.name} avatar`}
          draggable={false}
          className="h-full w-full rounded-full object-cover"
          style={{
            boxShadow: `0 2px 4px rgba(15,20,25,0.08), 0 20px 40px -14px ${agent.haloColor}60`,
          }}
          loading="lazy"
          decoding="async"
        />
        {/* Always-on indicator — small green dot signals the coach is
            available 24/7 (mirrors the hero "24/7" narrative). */}
        <span
          aria-hidden
          className="absolute rounded-full"
          style={{
            right: "4%",
            bottom: "4%",
            width: "16%",
            aspectRatio: "1 / 1",
            background: "#34C759",
            border: "3px solid #FFFFFF",
            boxShadow: "0 1px 2px rgba(15,20,25,0.10)",
          }}
        />
      </div>
    </div>
  );
}
