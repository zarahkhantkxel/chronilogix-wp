"use client";

import Image from "next/image";

// MIExplainer — Section 3 of the homepage.
//
// Sits directly below StatementV5 ("MI is how people actually change")
// and pays it off in one composed beat.
//
// Layout:
//   Header row — heading left, the plain-language MI summary + white-paper
//     CTA right. Separated from the body by space, not a rule.
//   Body row — two open compositions on the warm ground (no framed cards):
//     Left  (narrower) — "Anatomy of the reply": what the MI reply avoids,
//       what it does instead, and the earned-planning close. Quiet and
//       typographic: flat marks, sentence case, no rules or pills.
//     Right (wider) — "MI in action": one member message, then a branch
//       into two divergent reply panels. A cool, flat, recessive "typical
//       chatbot" reply and a warm, raised "Chronilogix" reply, so it reads
//       as one message answered two ways, not a single chat thread.

import React, { useEffect, useRef, useState } from "react";
import { AIOrb } from "@/components/AIOrb";

// Warm gradient tiles echo the nav's icon system (rounded tile + white
// glyph), scaled down to a list row. Three variants span light → deep so
// the MI moves read as one small set, the way the nav menu does.
type IconVariant = "peach" | "coral" | "ember";
type MoveGlyph = "reflect" | "affirm" | "evoke" | "plan";

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty. Rich fields default to their original
// JSX (spans, entities); an ACF override arrives as a plain string, which
// is a valid ReactNode and drops straight in.
export type MIExplainerContent = {
  // Header
  heading?: string;
  summary?: React.ReactNode;
  ctaLabel?: string;
  ctaUrl?: string;

  // Anatomy column
  anatomyBadge?: string;
  avoidsLabel?: string;
  avoids?: string[];
  doesLabel?: string;
  moves?: {
    verb?: string;
    desc?: React.ReactNode;
    variant?: IconVariant;
    glyph?: MoveGlyph;
  }[];

  // Comparison column
  comparisonBadge?: string;
  coachMessage?: React.ReactNode;
  memberMessage?: React.ReactNode;
  genericLabel?: string;
  genericReply?: React.ReactNode;
  chronoLabel?: string;
  chronoTag?: string;
  chronoReply?: React.ReactNode;

  // Science movement
  scienceEyebrow?: string;
  scienceHeading?: string;
  scienceHeadingMuted?: string;
  scienceBody?: React.ReactNode;
  scienceCtaLabel?: string;
  scienceCtaUrl?: string;
  videoPoster?: string;
  videoSrc?: string;
  videoRole?: string;
  videoName?: string;
};

const DEFAULTS = {
  heading: "Motivational Interviewing explained",
  summary: (
    <>
      Motivational Interviewing (MI) is a collaborative way of
      speaking that moves through four processes,{" "}
      <span className="text-ink">engage, focus, evoke, plan</span>
      , and four micro skills called{" "}
      <span className="text-ink">OARS</span>: open questions,
      affirmations, reflective listening, summaries.{" "}
      <span className="text-ink">
        Reflective listening is the workhorse.
      </span>
    </>
  ),
  ctaLabel: "Read the full white paper",
  ctaUrl: "/chronilogix-mi-whitepaper.pdf",

  anatomyBadge: "How the reply works",
  avoidsLabel: "What it avoids",
  avoids: [
    "Making the setback seem small",
    "Adding blame or pressure",
    "Rushing straight to a plan",
  ],
  doesLabel: "What it does instead",
  moves: [
    {
      verb: "Reflects",
      desc: "Mirrors back what he said, without judging.",
      variant: "peach",
      glyph: "reflect",
    },
    {
      verb: "Affirms",
      desc: "Recognises that he came back, an early sign of change.",
      variant: "coral",
      glyph: "affirm",
    },
    {
      verb: "Evokes",
      desc: "Asks what first motivated him.",
      variant: "ember",
      glyph: "evoke",
    },
    {
      verb: "Plans",
      desc: (
        <>
          Comes next, and it&rsquo;s{" "}
          <span className="font-medium text-brand-800">earned, not forced</span>
          .
        </>
      ),
      variant: "peach",
      glyph: "plan",
    },
  ],

  comparisonBadge: "MI in action",
  coachMessage: (
    <>
      Hi James &mdash; it&rsquo;s been about ten days since we last
      talked. Welcome back. What&rsquo;s been on your mind about the
      eating plan?
    </>
  ),
  memberMessage: "I fell off it for two weeks. Work blew up and I just gave up.",
  genericLabel: "A typical chatbot would say",
  genericReply: (
    <>
      No worries! Let&rsquo;s get you back on track. Try logging three
      meals today.
    </>
  ),
  chronoLabel: "Chronilogix says",
  chronoTag: "MI-backed",
  chronoReply: (
    <>
      Two stressful weeks where the plan got pushed aside &mdash;
      that&rsquo;s pretty common when work goes sideways. You came back
      to this conversation, which suggests it still matters to you.
      When you think about why you started this back in February, what
      comes up?
    </>
  ),

  scienceEyebrow: "30 years of research",
  scienceHeading: "The human intelligence",
  scienceHeadingMuted: "behind our AI.",
  scienceBody: (
    <>
      At the heart of our platform is not just technology. It is 30 years
      of global experience and research from Dr. Ken Resnicow, one of the
      world&rsquo;s foremost experts in Motivational Interviewing and
      Cultural Tailoring. He has spent decades guiding patients across
      diverse backgrounds, conditions, and cultures toward real, lasting
      change.
    </>
  ),
  scienceCtaLabel: "About Dr. Resnicow",
  // Deep-link to his section, not the top of /about — the team grid sits
  // above it and the visitor would have to hunt for him. AboutScience owns
  // the #science anchor and its matching scroll-mt.
  scienceCtaUrl: "/about#science",
  videoPoster: "/ken-thumbnail.webp",
  videoSrc: "/video/ken-resnicow-60s.mp4",
  videoRole: "Chief Science Officer",
  videoName: "Dr. Ken Resnicow",
} satisfies Required<MIExplainerContent>;

function useInView<T extends HTMLElement>(threshold = 0.15) {
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

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

// Staggered rise on the section's ease-out curve. Motion-reduced visitors
// get everything statically; if the observer never fires, JS still resolves
// inView so content is not trapped at opacity 0.
function makeReveal(inView: boolean, reduced: boolean) {
  return (delay: number): React.CSSProperties =>
    reduced
      ? {}
      : {
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(10px)",
          transition: `opacity 620ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, transform 620ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
        };
}

// Matched frame for both blocks — bordered paper on the warm ground with
// a soft elevation. The good "block design"; restored after an over-eager
// flatten. A warm brand light in the upper-left is the shared signature.
const FRAME =
  "relative overflow-hidden rounded-[24px] border border-ink/[0.08] bg-paper";

function FrameWash() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(70% 55% at 0% 0%, rgba(249, 144, 77, 0.09) 0%, rgba(249, 144, 77, 0) 68%)",
      }}
    />
  );
}

// Card eyebrow — names what each block demonstrates. These are the reader's
// signposts into the section, so they read as a confident brand label: warm
// tint, semibold uppercase, and a small brand dot, not a muted chip.
function CardEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex w-fit items-center gap-2 rounded-full border border-brand-600/30 bg-brand-50/90 px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.09em] text-brand-800 backdrop-blur-sm">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-600" />
      {children}
    </span>
  );
}

type ResolvedMove = {
  verb?: string;
  desc?: React.ReactNode;
  variant?: IconVariant;
  glyph?: MoveGlyph;
};

export function MIExplainer({ content }: { content?: MIExplainerContent }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const avoids = content?.avoids?.length ? content.avoids : DEFAULTS.avoids;
  const moves: ResolvedMove[] = content?.moves?.length
    ? content.moves.map((m, i) => ({
        verb: m.verb ?? DEFAULTS.moves[i]?.verb,
        desc: m.desc ?? DEFAULTS.moves[i]?.desc,
        variant: m.variant ?? DEFAULTS.moves[i]?.variant ?? "peach",
        glyph: m.glyph ?? DEFAULTS.moves[i]?.glyph ?? "reflect",
      }))
    : DEFAULTS.moves;

  return (
    <section
      id="motivational-interviewing"
      className="relative overflow-hidden rounded-[28px] bg-paper-warm"
      aria-label="Motivational Interviewing explained"
    >
      <div className="container-page relative z-10 py-20 md:py-28 lg:py-36">
        {/* Header — heading + CTA left, summary right. Uses the SAME 5fr/7fr
            tracks and gaps as the body grid below, so the heading lines up to
            the anatomy card and the summary lines up to the conversation
            card. */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-7 xl:gap-8">
          <div>
            <h2
              className="text-section font-serif font-normal text-ink"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {c.heading}
            </h2>
            <a
              href={c.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary group/mi-cta mt-7 md:mt-8"
            >
              {c.ctaLabel}
              <Arrow />
            </a>
          </div>
          <p className="text-lg leading-relaxed text-ink-soft md:text-xl">
            {c.summary}
          </p>
        </div>

        {/* Body — anatomy (narrow) + the branched comparison (wide). */}
        <div className="mt-8 grid gap-6 md:mt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-stretch lg:gap-7 xl:gap-8">
          <AnatomyColumn
            badge={c.anatomyBadge}
            avoidsLabel={c.avoidsLabel}
            avoids={avoids}
            doesLabel={c.doesLabel}
            moves={moves}
          />
          <ComparisonColumn
            badge={c.comparisonBadge}
            coachMessage={c.coachMessage}
            memberMessage={c.memberMessage}
            genericLabel={c.genericLabel}
            genericReply={c.genericReply}
            chronoLabel={c.chronoLabel}
            chronoTag={c.chronoTag}
            chronoReply={c.chronoReply}
          />
        </div>

        {/* Closing act — the science behind it. Dr. Resnicow grounds the
            whole demonstration: the method just shown is his life's work.
            Kept inside this section so the method and the mind behind it read
            as one continuous idea, not two stacked sections. */}
        <ScienceMovement
          eyebrow={c.scienceEyebrow}
          heading={c.scienceHeading}
          headingMuted={c.scienceHeadingMuted}
          body={c.scienceBody}
          ctaLabel={c.scienceCtaLabel}
          ctaUrl={c.scienceCtaUrl}
          videoPoster={c.videoPoster}
          videoSrc={c.videoSrc}
          videoRole={c.videoRole}
          videoName={c.videoName}
        />
      </div>
    </section>
  );
}

/* ── Closing act — the mind behind the method ────────────────────────────── */

function ScienceMovement({
  eyebrow,
  heading,
  headingMuted,
  body,
  ctaLabel,
  ctaUrl,
  videoPoster,
  videoSrc,
  videoRole,
  videoName,
}: {
  eyebrow: React.ReactNode;
  heading: React.ReactNode;
  headingMuted: React.ReactNode;
  body: React.ReactNode;
  ctaLabel: React.ReactNode;
  ctaUrl: string;
  videoPoster: string;
  videoSrc: string;
  videoRole: React.ReactNode;
  videoName: React.ReactNode;
}) {
  return (
    <div id="science" className="mt-6 scroll-mt-24 lg:mt-7 xl:mt-8">
      {/* Same white frame as the two cards above, so the method, the proof
          and the mind behind it read as one continuous card family. */}
      <div className={`${FRAME} p-6 md:p-8 lg:p-10`}>
        <FrameWash />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-12 xl:gap-14">
          <KenVideo
            poster={videoPoster}
            src={videoSrc}
            role={videoRole}
            name={videoName}
          />

        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3
            className="mt-4 text-row font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {heading}{" "}
            <span className="text-ink-muted">{headingMuted}</span>
          </h3>
          <p className="mt-6 body-prose md:mt-7">{body}</p>
          <div className="mt-8 md:mt-9">
            {/* Deep-links to the about page's science section rather than the
                top of /about (see the ctaUrl default). The promise of this CTA
                is "more about the man," so landing on the team grid and making
                the visitor hunt for him breaks that promise. `#science` is
                owned by AboutScience, which carries the matching `scroll-mt`
                so the card clears the fixed nav. Plain <a> (not next/link) to
                match this file and the rest of components/sections — a full
                load also sidesteps the smooth-scroll animation
                `html { scroll-behavior: smooth }` would otherwise apply to a
                client-side hash landing. */}
            <a href={ctaUrl} className="btn-primary group/mi-cta">
              {ctaLabel}
              <Arrow />
            </a>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

// Dr. Resnicow's 60-second intro. Shows the portrait as a poster with a
// play affordance; on play it swaps to native controls. The clip is pending
// (drop it at /public/video/ken-resnicow-60s.mp4) and it plays with no other
// change. No drop shadow, matching this section's flat frames.
function KenVideo({
  poster,
  src,
  role,
  name,
}: {
  poster: string;
  src: string;
  role: React.ReactNode;
  name: React.ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    const el = videoRef.current;
    if (!el) return;
    el.play()
      .then(() => setPlaying(true))
      .catch(() => {
        // Clip not yet supplied (or blocked) — leave the poster in place.
      });
  };

  return (
    <div
      onClick={!playing ? start : undefined}
      className={`relative aspect-[3/2] overflow-hidden rounded-[16px] bg-ink lg:aspect-auto lg:h-[420px] ${
        !playing ? "cursor-pointer" : ""
      }`}
    >
      <video
        ref={videoRef}
        poster={poster}
        src={src}
        playsInline
        preload="none"
        controls={playing}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover object-[20%_center]"
      />

      {!playing && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/10"
          />
          <div className="pointer-events-none absolute bottom-8 left-8 right-8 text-white md:bottom-10 md:left-10 lg:bottom-12 lg:left-12">
            <p className="text-[11px] font-medium tracking-[0.08em] text-white/75">
              {role}
            </p>
            <p className="mt-2 font-serif text-xl font-normal text-white md:text-2xl">
              {name}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Left — anatomy of the MI-aligned reply ──────────────────────────────── */

const ICON_BG: Record<IconVariant, string> = {
  peach:
    "radial-gradient(ellipse 70% 85% at 50% 105%, rgba(184,70,20,0.45) 0%, rgba(184,70,20,0) 68%), linear-gradient(180deg, #FB9C5E 0%, #FF7434 100%)",
  coral:
    "radial-gradient(ellipse 65% 70% at 50% -8%, rgba(253,179,125,0.55) 0%, rgba(253,179,125,0) 60%), linear-gradient(180deg, #FF7434 0%, #E45A1C 100%)",
  ember:
    "radial-gradient(circle at 28% 32%, rgba(253,179,125,0.5) 0%, rgba(253,179,125,0) 55%), radial-gradient(circle at 74% 74%, rgba(120,40,10,0.42) 0%, rgba(120,40,10,0) 55%), linear-gradient(135deg, #FB9C5E 0%, #B84614 100%)",
};

function AnatomyColumn({
  badge,
  avoidsLabel,
  avoids,
  doesLabel,
  moves,
}: {
  badge: React.ReactNode;
  avoidsLabel: React.ReactNode;
  avoids: string[];
  doesLabel: React.ReactNode;
  moves: ResolvedMove[];
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const reduced = usePrefersReducedMotion();
  const reveal = makeReveal(inView, reduced);

  return (
    <div ref={ref} className="flex flex-col">
      <div className={`${FRAME} flex flex-1 flex-col p-7 md:p-9 lg:p-10`}>
        <FrameWash />
        <div className="relative flex flex-1 flex-col">
          <CardEyebrow>{badge}</CardEyebrow>

          {/* Two contrasting beats distributed to fill the card so the
              anti-patterns → MI-moves contrast reads as structure, not one
              running list. "Avoids" is a tighter, quieter secondary cluster;
              "does instead" is the focal group with the extra description
              tier and warm gradient tiles. */}
          <div className="mt-8 flex flex-1 flex-col justify-center gap-9 md:mt-9 md:gap-10">
            <div style={reveal(0)}>
              <GroupLabel tone="mute">{avoidsLabel}</GroupLabel>
              <ul className="mt-4 space-y-2.5">
                {avoids.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-center gap-3"
                    style={reveal(70 + i * 60)}
                  >
                    <AvoidTile />
                    <span className="text-[14px] leading-snug text-ink-muted">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={reveal(280)}>
              <GroupLabel tone="brand">{doesLabel}</GroupLabel>
              <ul className="mt-5 space-y-5">
                {moves.map((m, i) => (
                  <li
                    key={m.verb ?? i}
                    className="flex items-start gap-3.5"
                    style={reveal(340 + i * 90)}
                  >
                    <MoveTile
                      variant={m.variant ?? "peach"}
                      glyph={m.glyph ?? "reflect"}
                    />
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[15px] font-semibold leading-tight text-ink">
                        {m.verb}
                      </p>
                      <p className="mt-1 text-[14px] leading-snug text-ink-muted">
                        {m.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// One consistent micro-label spec for both groups — same size and weight,
// sentence case, no tracking; only the colour separates the quiet "avoids"
// group from the focal "does" group.
function GroupLabel({
  tone,
  children,
}: {
  tone: "mute" | "brand";
  children: React.ReactNode;
}) {
  return (
    <span
      className={`block text-[13px] font-medium ${
        tone === "brand" ? "text-brand-700" : "text-ink-subtle"
      }`}
    >
      {children}
    </span>
  );
}

/* ── Right — the conversation, animated so the contrast is felt ──────────────
   Plays once in view: greeting, the member's message, then the generic
   assistant reply. A beat later Chronilogix's reply slides up onto the top
   of the stack and the generic reply dulls behind it, so the visitor sees
   Chronilogix decline to answer the way a generic chatbot would. ─────────── */

function ComparisonColumn({
  badge,
  coachMessage,
  memberMessage,
  genericLabel,
  genericReply,
  chronoLabel,
  chronoTag,
  chronoReply,
}: {
  badge: React.ReactNode;
  coachMessage: React.ReactNode;
  memberMessage: React.ReactNode;
  genericLabel: React.ReactNode;
  genericReply: React.ReactNode;
  chronoLabel: React.ReactNode;
  chronoTag: React.ReactNode;
  chronoReply: React.ReactNode;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const reduced = usePrefersReducedMotion();

  // Play steps: 1 greeting · 2 member · 3 generic reply · 4 Chronilogix reply
  // slides in on top + generic reply recedes.
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setStep(5);
      return;
    }
    const timers = [
      setTimeout(() => setStep(1), 250),
      setTimeout(() => setStep(2), 1050),
      setTimeout(() => setStep(3), 1950),
      setTimeout(() => setStep(4), 3100),
      setTimeout(() => setStep(5), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView, reduced]);

  const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

  const rise = (n: number): React.CSSProperties =>
    reduced
      ? {}
      : {
          opacity: step >= n ? 1 : 0,
          transform: step >= n ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 520ms ${EASE}, transform 520ms ${EASE}`,
        };

  // Generic reply: the wrapper only handles its entrance (fade + rise at
  // step 3). The recede at step 4 is applied to the bubble alone, so the
  // avatar and label stay full-strength and the attribution stays clear.
  const genericStyle: React.CSSProperties = reduced
    ? {}
    : {
        opacity: step < 3 ? 0 : 1,
        transform: step < 3 ? "translateY(10px)" : "translateY(0)",
        transition: `opacity 560ms ${EASE}, transform 560ms ${EASE}`,
      };

  // Chronilogix reply: rises in below the generic one at step 4.
  const chronoStyle: React.CSSProperties = reduced
    ? {}
    : {
        opacity: step >= 4 ? 1 : 0,
        transform: step >= 4 ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 620ms ${EASE}, transform 620ms ${EASE}`,
      };

  return (
    <div ref={ref} className="flex flex-col">
      <div
        role="group"
        aria-label="One member message answered two ways: what a typical chatbot would say, and how Chronilogix replies instead"
        className={`${FRAME} flex flex-1 flex-col p-7 md:p-9 lg:min-h-[600px] lg:p-10`}
      >
        {/* Warm background wash, matching the product page's capability cards:
            a soft reddish texture rather than a near-white veil. */}
        <Image
          src="/pattern.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
          fill
          sizes="(max-width: 768px) 100vw, 1280px"
        />
        <div aria-hidden className="absolute inset-0 bg-paper/70" />

        <CardEyebrow>{badge}</CardEyebrow>
        <div className="relative mt-6 flex flex-1 flex-col justify-center">
          {/* Setup exchange. */}
          <div className="space-y-5 md:space-y-6">
            <div style={rise(1)}>
              <ChatBubble side="coach">{coachMessage}</ChatBubble>
            </div>
            <div style={rise(2)}>
              <ChatBubble side="member">{memberMessage}</ChatBubble>
            </div>
          </div>

          {/* The reply — the generic answer lands first and, when
              Chronilogix's considered reply arrives below it, dims to a
              clearly-secondary state. No overlap: both stay readable so the
              curt brush-off vs. reflective coaching contrast lands. */}
          <div className="mt-7 md:mt-9">
            <div style={genericStyle}>
              <GenericReply
                dulled={step >= 4}
                label={genericLabel}
                text={genericReply}
              />
            </div>
            <div className="mt-5 md:mt-6" style={chronoStyle}>
              <ChronilogixReply
                typing={step < 5}
                label={chronoLabel}
                tag={chronoTag}
                text={chronoReply}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Setup bubbles, same chat design as before: the coach sits left behind the
// AI orb, the member sits right in a filled ink bubble. No drop shadow.
function ChatBubble({
  side,
  children,
}: {
  side: "coach" | "member";
  children: React.ReactNode;
}) {
  if (side === "coach") {
    return (
      <div className="flex items-start gap-3">
        <span className="mt-1 shrink-0">
          <AIOrb size={22} />
        </span>
        <p className="max-w-[32rem] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[14.5px] leading-relaxed text-ink ring-1 ring-ink/[0.06]">
          {children}
        </p>
      </div>
    );
  }
  return (
    <div className="flex justify-end">
      <p className="max-w-[30rem] rounded-2xl rounded-tr-md bg-ink px-4 py-3 text-[14.5px] leading-relaxed text-white/95">
        {children}
      </p>
    </div>
  );
}

// The generic reply — a neutral grey mark and a cool slate bubble, so it
// reads clinical against Chronilogix's warmth. The "would say" framing marks
// it as the hypothetical Chronilogix declines, not a real turn in the thread.
function GenericReply({
  dulled,
  label,
  text,
}: {
  dulled: boolean;
  label: React.ReactNode;
  text: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 shrink-0">
        <GenericAvatar />
      </span>
      <div className="min-w-0 max-w-[34rem]">
        <p className="mb-1.5 text-[12px] font-medium text-ink-muted">
          {label}
        </p>
        {/* Only the message bubble recedes; the avatar and label above stay
            full-strength so the attribution reads clearly. */}
        <p
          className="rounded-2xl rounded-tl-md border border-dashed border-ink/[0.18] bg-white/50 px-4 py-3 text-[14px] italic leading-relaxed text-ink-muted"
          style={{
            opacity: dulled ? 0.6 : 1,
            transition: "opacity 560ms cubic-bezier(0.22, 0.61, 0.36, 1)",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

// Chronilogix's reply. Rises onto the top of the stack. It first shows a
// short typing beat — a generic bot fires instantly, Chronilogix takes a
// considered moment — then resolves into the MI-aligned reply. Elevation is
// carried by a firmer ring and a bright inner top edge, never a drop shadow.
function ChronilogixReply({
  typing,
  label,
  tag,
  text,
}: {
  typing: boolean;
  label: React.ReactNode;
  tag: React.ReactNode;
  text: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 shrink-0">
        <AIOrb size={22} />
      </span>
      <div className="min-w-0 max-w-[34rem]">
        <p className="mb-1.5 text-[12px] font-medium text-ink">
          {label}{" "}
          <span className="text-brand-800">&middot; {tag}</span>
        </p>
        <div className="rounded-2xl rounded-tl-md bg-brand-50 px-4 py-3 text-[14.5px] leading-relaxed text-ink ring-1 ring-brand-600/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          {typing ? <TypingDots /> : text}
        </div>
      </div>
    </div>
  );
}

// Three-dot typing indicator — the considered beat before Chronilogix's
// reply. Uses the shared loaderDot keyframe.
function TypingDots() {
  return (
    <span
      role="status"
      aria-label="Chronilogix is typing"
      className="inline-flex items-center gap-1 py-0.5"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-brand-600/70"
          style={{
            animation: `loaderDot 1000ms ease-in-out ${i * 160}ms infinite`,
          }}
        />
      ))}
    </span>
  );
}

// Ghosted sender mark for the generic assistant — a hollow dashed ring
// (deliberately not the orb), matching the dashed placeholder bubble so
// the whole reply reads as the lesser, hypothetical foil.
function GenericAvatar() {
  return (
    <span
      aria-hidden
      className="block h-[22px] w-[22px] rounded-full border border-dashed border-ink/25"
    />
  );
}

/* ── Icon tiles — echo the nav's rounded gradient icon styling ──────────── */

// Focal moves: a small warm-gradient tile with a white glyph, matching the
// nav's icon language at list-row scale.
function MoveTile({
  variant,
  glyph,
}: {
  variant: IconVariant;
  glyph: MoveGlyph;
}) {
  return (
    <span
      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-white shadow-[0_1px_2px_rgba(15,20,25,0.06),0_8px_18px_-10px_rgba(184,70,20,0.5)]"
      style={{ backgroundImage: ICON_BG[variant] }}
    >
      <MoveGlyphSvg glyph={glyph} />
    </span>
  );
}

// Avoided items: same tile silhouette, but flat and muted so the group
// stays recessive against the warm "does instead" tiles.
function AvoidTile() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-ink/[0.05] text-ink-subtle ring-1 ring-ink/[0.06]">
      <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
        <path
          d="M4.75 4.75 11.25 11.25 M11.25 4.75 4.75 11.25"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

// White glyphs for the three MI moves, drawn to read clearly at ~16px.
function MoveGlyphSvg({ glyph }: { glyph: MoveGlyph }) {
  if (glyph === "reflect") {
    // Mirror axis with two chevrons pointing away — "mirrors back".
    return (
      <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none">
        <path
          d="M8 3v10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="1.4 1.7"
        />
        <path
          d="M5.4 5.8 3 8l2.4 2.2M10.6 5.8 13 8l-2.4 2.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (glyph === "affirm") {
    // Checkmark — affirming/recognising an early sign of change.
    return (
      <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none">
        <path
          d="M4 8.3 6.7 11 12 5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (glyph === "evoke") {
    // evoke — a spark/sparkle: drawing motivation out.
    return (
      <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none">
        <path
          d="M8 2.6 9.1 6.9 13.4 8 9.1 9.1 8 13.4 6.9 9.1 2.6 8 6.9 6.9Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // plan — a flag: the goal reached last, once it's earned.
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none">
      <path
        d="M4.6 2.4v11.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4.6 3.2h6.4l-1.7 2.1 1.7 2.1H4.6z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/mi-cta:translate-x-1"
    >
      <path
        d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
