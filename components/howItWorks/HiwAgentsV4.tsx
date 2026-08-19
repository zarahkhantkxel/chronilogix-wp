"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "The coaches" — V4 direction.
 *
 * Reconciles a hard docs-vs-site gap that the current HiwAgents.tsx
 * ignores: every source doc names ONE engine, "Roni AI." The site now
 * ships two named coaches, Roni + Millie. V4 keeps the two-coach
 * specialization the buyer sees, but frames it inside a single-engine
 * story so the surface aligns with the docs and the CLAUDE.md brand
 * hierarchy:
 *
 *   Chronilogix (platform) > Roni AI (engine) > Roni / Millie (personas)
 *
 * Layout arc, top to bottom:
 *
 *   1. Header — one engine, two clinical voices.
 *   2. Engine card — Roni AI as the umbrella, with Dr. Resnicow
 *      credit and the MI credibility stats the docs lean on.
 *   3. Two persona columns — Roni + Millie, each with clinical scope,
 *      sample exchange, and a "Powered by Roni AI" footer.
 *   4. Handoff line — one member, both coaches, shared session memory.
 *
 * Design language is native to the site: paper-warm section band,
 * surface-glass cards, brand-orange accents, font-mono ordinals + tags,
 * font-serif for the coach names.
 */

// Editable content (ACF-backed). Scalars fall back to the hardcoded copy;
// the three rich (inline-formatted) fields fall back to their ReactNode
// default JSX and can be overridden by a plain string. Persona colors,
// keys and alt-text stay fixed (index-matched to RONI / MILLIE).
export type HiwAgentsV4Persona = {
  name?: string;
  role?: string;
  scope?: string;
  avatar?: string;
  memberLine?: string;
  coachReply?: string;
  capabilities?: string[];
};

export type HiwAgentsV4Content = {
  eyebrow?: string;
  headingLead?: string;
  headingMuted?: string;
  intro?: React.ReactNode;
  engineLabel?: string;
  engineName?: string;
  engineNameSuffix?: string;
  engineBody?: React.ReactNode;
  engineStats?: { lead: string; label: string }[];
  personaIntro?: string;
  personas?: HiwAgentsV4Persona[];
  handoff?: React.ReactNode;
};

const DEFAULTS = {
  eyebrow: "The coaching layer",
  headingLead: "One engine.",
  headingMuted: "Two clinical voices.",
  engineLabel: "The engine",
  engineName: "Roni",
  engineNameSuffix: "AI",
  engineStats: [
    { lead: "30+", label: "years of MI research" },
    { lead: "400+", label: "peer-reviewed studies" },
    { lead: "70+", label: "global clinical trials" },
  ],
  personaIntro:
    "Chronic disease and mental health rarely travel alone. Roni delivers two coaches, each purpose-built for one clinical domain — same underlying methodology, different vocabulary, different pacing, different range.",
};

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

// Like clean(), but tuned for a persona override: also skips an empty
// capabilities array so the default chip set shows through.
function cleanPersona(p?: HiwAgentsV4Persona): Partial<Persona> {
  if (!p) return {};
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(p)) {
    if (v === null || v === undefined || v === "") continue;
    if (k === "capabilities" && !(Array.isArray(v) && v.length)) continue;
    out[k] = v;
  }
  return out as Partial<Persona>;
}

const useReveal = <T extends HTMLElement>() => {
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
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
};

const reveal = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? "translateY(0)" : "translateY(12px)",
  transition: `opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
});

export function HiwAgentsV4({ content }: { content?: HiwAgentsV4Content }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const engineStats = content?.engineStats?.length
    ? content.engineStats
    : DEFAULTS.engineStats;
  const personas = [RONI, MILLIE].map((p, i) => ({
    ...p,
    ...cleanPersona(content?.personas?.[i]),
  }));
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section
      ref={ref}
      id="agents-v4"
      aria-labelledby="agents-v4-label"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
    >
      <div className="container-page pt-24 md:pt-32 lg:pt-40">
        {/* Header — sets the "one engine, two voices" frame before the
            engine block or the persona columns arrive. */}
        <div className="max-w-4xl">
          <p
            className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-brand-700"
            style={reveal(inView, 0)}
          >
            {c.eyebrow}
          </p>
          <h2
            id="agents-v4-label"
            className="mt-4 text-hero font-serif font-normal text-ink"
            style={
              {
                textWrap: "balance",
                ...reveal(inView, 80),
              } as React.CSSProperties
            }
          >
            {c.headingLead}{" "}
            <span className="text-ink-muted">{c.headingMuted}</span>
          </h2>
          <p
            className="mt-7 max-w-[62ch] body-prose"
            style={reveal(inView, 160)}
          >
            {content?.intro ?? (
              <>
                <span className="text-ink">Roni AI</span> powers every
                conversation on the platform. Dr. Ken Resnicow&rsquo;s
                thirty years of Motivational Interviewing research, encoded
                once and delivered through two purpose-built specialists
                inside a single app.
              </>
            )}
          </p>
        </div>

        {/* Engine card — Roni AI as the umbrella. Reads as the
            infrastructure claim before the persona columns arrive.
            surface-glass keeps it in the site's card family; the
            ordinal + label mirrors the CoreCapabilities eyebrow style. */}
        <div
          className="surface-glass relative mt-14 overflow-hidden rounded-[24px] px-6 py-8 md:mt-16 md:px-10 md:py-10"
          style={reveal(inView, 240)}
        >
          <span
            aria-hidden
            className="surface-glass-shine pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[24px]"
          />
          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-12">
            {/* Left — engine identity */}
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-brand-700">
                {c.engineLabel}
              </p>
              <h3 className="mt-3 font-serif text-[32px] font-normal leading-[1.05] text-ink md:text-[38px]">
                {c.engineName}{" "}
                <span className="text-brand-700">{c.engineNameSuffix}</span>
              </h3>
              <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft md:text-[15.5px]">
                {content?.engineBody ?? (
                  <>
                    Not built on generic AI. Trained on the life&rsquo;s work of{" "}
                    <span className="text-ink">Dr. Ken Resnicow</span> —
                    Professor at the University of Minnesota School of Public
                    Health, author of 400+ peer-reviewed publications on
                    Motivational Interviewing and cultural tailoring. Every
                    reply runs the same MI fidelity checks a licensed
                    clinician would.
                  </>
                )}
              </p>
            </div>

            {/* Right — credibility stats. Small, tabular, aligned with
                the numeric proof language the docs lean on. */}
            <dl className="grid grid-cols-3 gap-x-6 gap-y-4 border-t border-ink/10 pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
              {engineStats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-serif text-[26px] leading-none text-ink md:text-[30px]">
                    {stat.lead}
                  </span>
                  <span className="mt-2 text-[11.5px] leading-snug text-ink-muted">
                    {stat.label}
                  </span>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Divider — hairline seam matching HiwIntegration / AboutScience. */}
        <div
          aria-hidden
          className="relative mx-auto mt-16 h-px w-16 bg-ink/12 md:mt-20"
          style={reveal(inView, 320)}
        />

        {/* Persona intro — one line to set up the two coach columns. */}
        <p
          className="mt-10 max-w-[52ch] text-[14.5px] leading-relaxed text-ink-soft md:mt-12 md:text-[15px]"
          style={reveal(inView, 400)}
        >
          {c.personaIntro}
        </p>

        {/* Two persona columns */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-10 md:grid-cols-2 md:gap-8">
          <PersonaColumn persona={personas[0]} delay={480} inView={inView} />
          <PersonaColumn persona={personas[1]} delay={560} inView={inView} />
        </div>

        {/* Handoff line — answers "how do the two coaches connect" in
            one caption so the buyer doesn't have to guess. */}
        <div
          className="mt-14 flex items-center justify-center gap-3 pb-24 text-center md:mt-16 md:pb-32 lg:pb-40"
          style={reveal(inView, 640)}
        >
          <span aria-hidden className="hidden h-px w-8 bg-ink/15 md:block" />
          <p className="max-w-[46ch] text-[13.5px] italic leading-snug text-ink-soft md:text-[14px]">
            {content?.handoff ?? (
              <>
                One member. Both coaches. Shared session memory —{" "}
                <span className="not-italic text-ink">Roni</span> carries
                the whole story across every conversation.
              </>
            )}
          </p>
          <span aria-hidden className="hidden h-px w-8 bg-ink/15 md:block" />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Persona column                                                         */
/* ────────────────────────────────────────────────────────────────────── */

type Persona = {
  key: "roni" | "millie";
  name: string;
  role: string;
  scope: string;
  avatar: string;
  avatarAlt: string;
  ringColor: string;
  accent: string;
  memberLine: string;
  coachReply: string;
  capabilities: string[];
};

const RONI: Persona = {
  key: "roni",
  name: "Roni",
  role: "Chronic care coach",
  // Scope pulled from `chronilogix-business-context.md`, which names
  // "diabetes, obesity, and hypertension" as the chronic-care domains.
  scope: "Diabetes. Obesity. Hypertension.",
  avatar: "/roni.png",
  avatarAlt: "Roni, chronic care coach",
  ringColor: "rgba(249, 144, 77, 0.28)",
  accent: "#E45A1C",
  memberLine: "I keep forgetting to check my sugar before meals.",
  coachReply:
    "Forgetting isn't failure. Pair the check with your coffee. We're stacking, not adding willpower.",
  capabilities: [
    "A1C and blood-sugar trends",
    "Meal and carb awareness",
    "Medication adherence",
    "Movement and daily habits",
  ],
};

const MILLIE: Persona = {
  key: "millie",
  name: "Millie",
  role: "Mental health coach",
  scope: "Depression. Anxiety. Stress. The heavy days.",
  avatar: "/millie.png",
  avatarAlt: "Millie, mental health coach",
  ringColor: "rgba(63, 92, 124, 0.32)",
  accent: "#3F5C7C",
  memberLine: "I can't get my mind to slow down.",
  coachReply:
    "Racing thoughts aren't yours to solve at midnight. Let's bring your body back into the room first — I'll walk you through it.",
  capabilities: [
    "Grounding techniques (3-3-3)",
    "Sleep and rest patterns",
    "Mood over weeks",
    "Boundaries and coping skills",
  ],
};

function PersonaColumn({
  persona,
  delay,
  inView,
}: {
  persona: Persona;
  delay: number;
  inView: boolean;
}) {
  return (
    <article
      className="relative overflow-hidden rounded-[24px] border border-ink/[0.08] bg-white/70 px-6 py-8 md:px-8 md:py-10"
      style={reveal(inView, delay)}
    >
      {/* Header row — avatar + name/role */}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-3 rounded-full"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${persona.accent}22 0%, transparent 70%)`,
              filter: "blur(6px)",
            }}
          />
          <div
            className="relative h-16 w-16 overflow-hidden rounded-full bg-white md:h-[72px] md:w-[72px]"
            style={{
              boxShadow: `0 0 0 2px #FFFFFF, 0 0 0 3px ${persona.ringColor}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={persona.avatar}
              alt={persona.avatarAlt}
              className="h-full w-full object-cover"
              draggable={false}
          loading="lazy"
          decoding="async"
        />
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="font-serif text-[32px] font-normal leading-[1] tracking-[-0.02em] text-ink md:text-[36px]">
            {persona.name}{" "}
            <span style={{ color: persona.accent }}>AI</span>
          </h3>
          <p className="mt-1.5 text-[13.5px] font-medium text-ink-soft md:text-[14px]">
            {persona.role}
          </p>
        </div>
      </div>

      {/* Clinical scope — pulled from docs so obesity + hypertension
          (Roni docs) or depression + anxiety (mental health) surface
          explicitly, not hidden behind "chronic care" or "mental health"
          alone. */}
      <p className="mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-brand-700">
        Clinical scope
      </p>
      <p className="mt-2 text-[14.5px] leading-relaxed text-ink md:text-[15px]">
        {persona.scope}
      </p>

      {/* Sample exchange — one member line + one coach reply. Reads as
          proof-in-miniature: "here's what a real reply looks like." */}
      <p className="mt-7 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-brand-700">
        In one exchange
      </p>
      <div className="mt-3 flex flex-col gap-2.5">
        <div
          className="ml-auto max-w-[92%] rounded-[14px] rounded-br-[6px] px-3.5 py-2.5 text-[13.5px] leading-snug text-ink-soft"
          style={{
            background: "rgba(252, 230, 205, 0.72)",
            border: "1px solid rgba(232, 188, 142, 0.5)",
          }}
        >
          {persona.memberLine}
        </div>
        <div className="flex items-start gap-2">
          <span
            aria-hidden
            className="mt-2.5 block h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: persona.accent }}
          />
          <div className="max-w-[94%] rounded-[14px] rounded-bl-[6px] border border-white/70 bg-white px-3.5 py-2.5 text-[13.5px] leading-snug text-ink-soft">
            {persona.coachReply}
          </div>
        </div>
      </div>

      {/* Capabilities — compact chip row so the reader sees the range
          without another wall of prose. */}
      <p className="mt-7 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-brand-700">
        Where {persona.name} shows up
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {persona.capabilities.map((cap) => (
          <li
            key={cap}
            className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-ink-soft ring-1 ring-ink/[0.08]"
          >
            {cap}
          </li>
        ))}
      </ul>

      {/* Attribution footer — closes each column with the same line so
          the reader can't miss that both coaches are the same engine. */}
      <p className="mt-8 border-t border-ink/[0.08] pt-4 text-[11.5px] leading-snug text-ink-muted">
        Powered by{" "}
        <span className="font-medium text-ink-soft">Roni AI</span>{" "}
        &middot; MI-trained &middot; Reviewed against MITI fidelity
      </p>
    </article>
  );
}
