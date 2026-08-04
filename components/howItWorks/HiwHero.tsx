"use client";

import { Fragment, useEffect, useMemo, useState } from "react";

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty.
export type HiwHeroContent = {
  headlineLines?: { text: string; tone: "bright" | "muted" }[];
  subheadline?: string;
  agents?: { name: string; role: string; avatar: string; ctaHref: string }[];
};

// Accent per agent is decorative and matched by index (warm = Roni, cool =
// Millie), so it stays hardcoded rather than coming from content.
const ACCENTS = ["warm", "cool"] as const;

const REVEAL_DURATION_MS = 2400;
const REVEAL_WINDOW_RATIO = 4;

type AgentMeta = {
  name: string;
  role: string;
  accent: "warm" | "cool";
  avatar: string;
  ctaHref: string;
};

// Headline: three short statements — punch / punch / breathe. First two
// land in full ink; the third resolves muted, the way a closing clause
// settles. Subhead lands what the two coaches do for a member; "between
// appointments" is the spine of the value claim. Agents anchor to the
// matching <article id> inside HiwAgents — clicking "Meet Roni AI"
// scrolls the visitor to Roni's deep-dive section below.
const DEFAULTS = {
  headlineLines: [
    { text: "Two coaches.", tone: "bright" as const },
    { text: "Thirty years of science.", tone: "bright" as const },
    { text: "One conversation at a time.", tone: "muted" as const },
  ],
  subheadline:
    "For the moments between appointments, when habits slip, motivation fades, and no one else is around.",
  agents: [
    { name: "Roni", role: "Chronic care coach", avatar: "/roni.png", ctaHref: "#roni" },
    { name: "Millie", role: "Mental health coach", avatar: "/millie.png", ctaHref: "#millie" },
  ],
} satisfies Required<HiwHeroContent>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function HiwHero({ content }: { content?: HiwHeroContent }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const headlineLines = content?.headlineLines?.length
    ? content.headlineLines
    : DEFAULTS.headlineLines;
  const agents: AgentMeta[] = (
    content?.agents?.length ? content.agents : DEFAULTS.agents
  ).map((a, i) => ({ ...a, accent: ACCENTS[i % ACCENTS.length] }));
  const [revealProgress, setRevealProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setRevealProgress(1);
      return;
    }
    let rafId = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / REVEAL_DURATION_MS, 1);
      setRevealProgress(t);
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  // Flatten all headline words into one indexed list so the per-word
  // reveal spans the entire headline as a single timeline.
  const headlineWords = useMemo(
    () =>
      headlineLines.flatMap((line, li) =>
        line.text.split(" ").map((word) => ({ word, line: li, tone: line.tone })),
      ),
    [headlineLines],
  );
  const totalWords = headlineWords.length;
  const stride = 1 / (totalWords - 1 + REVEAL_WINDOW_RATIO);
  const wordWindow = stride * REVEAL_WINDOW_RATIO;
  const easedReveal = easeOutCubic(revealProgress);

  // Subhead joins after most of the headline has resolved.
  const subTailReveal = clamp01((easedReveal - 0.55) / 0.45);
  // Avatars join last so the headline gets a beat to land on its own.
  const avatarsReveal = clamp01((easedReveal - 0.7) / 0.3);

  let wordIdx = 0;
  const renderLine = (lineIndex: number) => {
    const words = headlineWords.filter((w) => w.line === lineIndex);
    return words.map((w, wi) => {
      const idx = wordIdx++;
      const start = idx * stride;
      const end = start + wordWindow;
      const t = clamp01((easedReveal - start) / (end - start));
      const blur = (1 - t) * 3.5;
      const opacity = 0.12 + t * 0.88;
      const color = w.tone === "bright" ? "#0F1419" : "#5B6470";
      return (
        <Fragment key={`l${lineIndex}-${wi}`}>
          <span
            className="inline-block"
            style={{
              filter: `blur(${blur}px)`,
              opacity,
              color,
              willChange: "filter, opacity",
            }}
          >
            {w.word}
          </span>
          {wi < words.length - 1 && " "}
        </Fragment>
      );
    });
  };

  return (
    <section
      className="relative overflow-hidden rounded-[28px]"
      style={{
        background:
          "linear-gradient(120deg, #FFF3E8 0%, #FBF5EE 38%, #EFF1F6 70%, #E8EEF4 100%)",
      }}
    >
      {/* Warm/cool radial accents — one in each upper corner, mirroring the
          two agents who flank the headline. Soft and large so they read as
          atmosphere, not bands. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 8% 8%, rgba(249,144,77,0.22), transparent 70%), radial-gradient(55% 45% at 92% 12%, rgba(80,108,140,0.18), transparent 70%)",
        }}
      />

      <div className="container-page relative pt-32 pb-24 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36">
        {/* Main row — avatars flank the headline on lg+, with deliberate
            vertical asymmetry: Roni sits high (top-aligned, near line 1
            of the headline), Millie sits low (bottom-aligned, near the
            closing line). Each side column also slides inward via a
            translateX so the avatars almost graze the headline's edges
            — they feel like they're keeping company with the type, not
            parked beside it. The columns have no horizontal gap and the
            avatar wrappers carry z-10 so they paint on top of the
            headline if the inward slide brings them into the type's
            bounds. On smaller viewports both avatars stack below the
            headline in a centered 2-column row. */}
        <div
          className="grid grid-cols-1 gap-y-10 lg:grid-cols-[minmax(140px,auto)_minmax(0,1fr)_minmax(140px,auto)] lg:gap-x-0 xl:grid-cols-[minmax(160px,auto)_minmax(0,1fr)_minmax(160px,auto)]"
        >
          {/* Roni — top-aligned and slid right, lining up with the first
              line of the headline. */}
          <div
            className="relative z-10 hidden lg:flex lg:justify-end lg:self-start lg:pt-6 xl:pt-8"
            style={{
              opacity: avatarsReveal,
              transform: `translate(28px, ${(1 - avatarsReveal) * 10}px)`,
              willChange: "opacity, transform",
            }}
          >
            <FloatingAvatar
              agent={agents[0]}
              floatPhase={0}
              reducedMotion={reducedMotion}
            />
          </div>

          {/* Headline — three short lines stacked. Sits at z-0 so the
              avatars can subtly overlap the type edges if needed. */}
          <h1
            className="relative z-0 text-center font-serif font-normal text-display"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {headlineLines.map((_, li) => (
              <span key={li} className="block">
                {renderLine(li)}
              </span>
            ))}
          </h1>

          {/* Millie — bottom-aligned, lining up with the closing line of
              the headline. No inward slide here (only a tiny -4px nudge)
              so the avatar clears the period at the end of "One
              conversation at a time." — the closing line already runs
              nearly to the column boundary, so any meaningful inward
              translate would collide with the punctuation. */}
          <div
            className="relative z-10 hidden lg:flex lg:justify-start lg:self-end lg:pb-2"
            style={{
              opacity: avatarsReveal,
              transform: `translate(-4px, ${(1 - avatarsReveal) * 10}px)`,
              willChange: "opacity, transform",
            }}
          >
            <FloatingAvatar
              agent={agents[1]}
              floatPhase={1}
              reducedMotion={reducedMotion}
            />
          </div>

          {/* Mobile-only avatar row — sits in the second grid row so the
              avatars appear under the headline at small viewports. */}
          <div
            className="grid grid-cols-2 gap-6 lg:hidden"
            style={{
              opacity: avatarsReveal,
              transform: `translateY(${(1 - avatarsReveal) * 10}px)`,
              willChange: "opacity, transform",
            }}
          >
            <div className="flex justify-center">
              <FloatingAvatar
                agent={agents[0]}
                floatPhase={0}
                reducedMotion={reducedMotion}
              />
            </div>
            <div className="flex justify-center">
              <FloatingAvatar
                agent={agents[1]}
                floatPhase={1}
                reducedMotion={reducedMotion}
              />
            </div>
          </div>
        </div>

        <p
          className="mx-auto mt-8 max-w-[52ch] text-center body-prose md:mt-10"
          style={{
            opacity: subTailReveal,
            transform: `translateY(${(1 - subTailReveal) * 8}px)`,
            willChange: "opacity, transform",
          }}
        >
          {c.subheadline}
        </p>
      </div>
    </section>
  );
}

function FloatingAvatar({
  agent,
  floatPhase,
  reducedMotion,
}: {
  agent: AgentMeta;
  floatPhase: 0 | 1;
  reducedMotion: boolean;
}) {
  const isWarm = agent.accent === "warm";
  const tintDeep = isWarm ? "#E45A1C" : "#2E465F";
  const ringTint = isWarm
    ? "rgba(249,144,77,0.30)"
    : "rgba(63,92,124,0.30)";

  // Out-of-phase float — second avatar's animation is offset by half a
  // cycle so the two never lift in unison. Reads as alive rather than
  // synchronized choreography.
  const phaseDelay = floatPhase === 0 ? "0s" : "-3s";

  return (
    <a
      href={agent.ctaHref}
      aria-label={`Meet ${agent.name} AI, ${agent.role}`}
      className="group/agent flex flex-col items-center"
    >
      {/* Identity card — the avatar and its role pill move together as a
          single unit. The pill anchors to the bottom rim of the avatar
          (half above, half below the edge) so the two read as one
          "name-tag" composition. The whole card is wrapped in an
          anchor so clicking anywhere on the floating identity scrolls
          to the agent's deep-dive section below. */}
      <div className="relative pb-2.5 md:pb-3">
        {/* Ground shadow — stays on the imaginary floor while the card
            above lifts, selling the floating physics. */}
        <span
          aria-hidden
          className="agent-shadow pointer-events-none absolute left-1/2 -bottom-1 block h-3 w-[78px] -translate-x-1/2 rounded-[50%] md:-bottom-1.5 md:h-3 md:w-[86px]"
          style={{
            background: "rgba(15,20,25,0.9)",
            filter: "blur(10px)",
            opacity: 0.22,
            animation: reducedMotion
              ? "none"
              : "agentShadow 6s ease-in-out infinite",
            animationDelay: phaseDelay,
          }}
        />

        {/* Floating card — avatar + pill bob in unison. */}
        <div
          className="agent-float relative"
          style={{
            animation: reducedMotion
              ? "none"
              : "agentFloat 6s ease-in-out infinite",
            animationDelay: phaseDelay,
          }}
        >
          <span
            className="relative z-0 block h-[88px] w-[88px] overflow-hidden rounded-full md:h-[100px] md:w-[100px]"
            style={{
              boxShadow: `0 0 0 1px ${ringTint}, 0 20px 36px -16px rgba(15,20,25,0.28)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={agent.avatar}
              alt={`${agent.name}, ${agent.role}`}
              className="h-full w-full object-cover transition-transform duration-500 ease-out motion-reduce:transition-none group-hover/agent:scale-[1.04]"
              draggable={false}
            />
          </span>

          {/* Role pill — anchored to the bottom rim, ~half above and
              half below the avatar's edge. Uses the home page's
              surface-glass-toast treatment so the chip reads as
              frosted glass (same material language as the hero chat
              bubbles + product cards on the home page). Sentence case
              instead of uppercase so it reads as a label, not a tag.
              On hover the text picks up the agent's tint — the click
              affordance without a separate CTA. */}
          <span
            className="surface-glass-toast absolute left-1/2 -bottom-2.5 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-medium text-ink-soft transition-colors duration-300 ease-out motion-reduce:transition-none group-hover/agent:text-[var(--agent-tint)]"
            style={{ ["--agent-tint" as never]: tintDeep }}
          >
            {agent.role}
          </span>
        </div>
      </div>
    </a>
  );
}

function clamp01(n: number) {
  return Math.min(Math.max(n, 0), 1);
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
