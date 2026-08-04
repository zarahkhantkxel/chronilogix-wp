"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { HeroPhoneMockup } from "@/components/HeroPhoneMockup";

const SENTENCES = [
  "Chronilogix is the AI-native behavioral health and chronic care coaching platform.",
  "Built on world renowned expert Dr. Ken Resnicow's life work in Motivational Interviewing, the gold standard for lasting behavior change.",
  "Proven across two hundred randomized trials. Engineered into every Chronilogix conversation.",
];

const REVEAL_START = 0.05;
const REVEAL_END = 0.45;
const WINDOW_RATIO = 4;
const MOBILE_TEXT_DRIFT_PX = 220;

// Sequential choreography: text reveal (0.05 → 0.45) finishes first, then
// the phone rises (0.48 → 0.72), then the orbiting cards / pill row fade
// in (0.72 → 1.0). Holding the phone behind the text-reveal window means
// the headline is fully legible before any visual takes its attention.
const PHONE_RISE_START = 0.48;
const PHONE_RISE_END = 0.72;
const SCENE3_START = 0.72;

// Final beat of the headline block — the "Learn more about MI" pill
// appears once the last word has cleared its blur window, sitting under
// the sentences for a moment before the wordsFade carries it out with
// the rest of the headline.
const BUTTON_REVEAL_START = REVEAL_END + 0.01;
const BUTTON_REVEAL_END = REVEAL_END + 0.06;

export function Statement() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [vw, setVw] = useState(0);
  const [miOpen, setMiOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setVw(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(1);
      return;
    }
    let rafId = 0;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const el = runwayRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const runway = el.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), runway);
        setProgress(runway > 0 ? scrolled / runway : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  const { wordsBySentence, stride, wordWindow } = useMemo(() => {
    const wordsBySentence = SENTENCES.map((s) => s.split(" "));
    const totalWords = wordsBySentence.reduce((a, ws) => a + ws.length, 0);
    const stride =
      (REVEAL_END - REVEAL_START) / (totalWords - 1 + WINDOW_RATIO);
    return { wordsBySentence, stride, wordWindow: stride * WINDOW_RATIO };
  }, []);

  let globalIdx = 0;

  const isDesktop = vw === 0 || vw >= 1024;
  const isMobile = vw > 0 && vw < 1024;
  const isNarrow = vw > 0 && vw < 640; // sm breakpoint — use pill row

  // Scene 3 progress: how far we are *into* the third scene (0 → 1).
  const sceneThreeRaw = clamp01((progress - SCENE3_START) / (1 - SCENE3_START));
  const sceneThree = easeInOutCubic(sceneThreeRaw);

  // Phone peeks once text is done, then continues rising into scene 3 so
  // the chat is fully readable by the time the orbiting cards arrive.
  const baseRise = isDesktop ? 52 : vw >= 640 ? 62 : 74;
  const sceneThreeRiseBoost = isDesktop ? 30 : 22;
  const maxRise = baseRise + sceneThree * sceneThreeRiseBoost;

  // Scene-1 words fade out as scene 3 takes over.
  const wordsFade = 1 - clamp01((sceneThreeRaw - 0.05) / 0.28);

  // "Learn more about MI" CTA reveals once the last word has cleared.
  const buttonReveal = clamp01(
    (progress - BUTTON_REVEAL_START) / (BUTTON_REVEAL_END - BUTTON_REVEAL_START),
  );

  // Mobile-only: text drifts upward as scroll progresses so the rising phone
  // takes the visual lead in the lower portion of the section.
  const textShiftPx = isMobile
    ? -clamp01((progress - 0.2) / 0.55) * MOBILE_TEXT_DRIFT_PX
    : 0;

  // Phone stays centered through scene 3 — the rise is its only motion.
  // Cards orbit *around* it; the phone itself is the anchor, not a mover.

  return (
    <div ref={runwayRef} className="relative h-[240vh]">
      <section
        id="statement"
        className="sticky top-2 h-[calc(100svh-1rem)] overflow-hidden rounded-[28px] bg-[#F7F6F5] md:top-3 md:h-[calc(100svh-1.5rem)]"
      >
        <div className="container-page relative flex h-full flex-col justify-center py-14 sm:py-16 md:py-20 lg:py-24">
          <div
            className="mx-auto max-w-3xl space-y-4 text-center sm:space-y-5 md:space-y-7 lg:space-y-8"
            style={{
              transform: `translate3d(0, ${textShiftPx}px, 0)`,
              opacity: wordsFade,
              willChange: "transform, opacity",
            }}
          >
            {wordsBySentence.map((words, si) => (
              <p
                key={si}
                className="text-row font-serif font-normal text-ink"
              >
                {words.map((word, wi) => {
                  const idx = globalIdx++;
                  const start = REVEAL_START + idx * stride;
                  const end = start + wordWindow;
                  const t = clamp01((progress - start) / (end - start));
                  const blur = (1 - t) * 3.5;
                  const opacity = 0.12 + t * 0.88;
                  return (
                    <Fragment key={wi}>
                      <span
                        className="inline-block"
                        style={{
                          filter: `blur(${blur}px)`,
                          opacity,
                          willChange: "filter, opacity",
                        }}
                      >
                        {word}
                      </span>
                      {wi < words.length - 1 && " "}
                    </Fragment>
                  );
                })}
              </p>
            ))}

            {/* "Learn more about MI" CTA — appears as the last beat after
                every word has revealed. Hides itself from screen readers
                until it's visually present so the announcement order
                tracks the visual reveal. */}
            <div
              className="flex justify-center pt-2 sm:pt-3 md:pt-4"
              style={{
                opacity: buttonReveal,
                transform: `translateY(${(1 - buttonReveal) * 6}px)`,
                pointerEvents: buttonReveal > 0.5 ? "auto" : "none",
                willChange: "opacity, transform",
              }}
              aria-hidden={buttonReveal < 0.5}
            >
              <button
                type="button"
                onClick={() => setMiOpen(true)}
                className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/80 px-4 py-2 text-[13px] font-medium text-ink shadow-[0_1px_2px_rgba(15,20,25,0.04)] backdrop-blur transition-all hover:border-brand/50 hover:bg-white hover:shadow-[0_6px_18px_-6px_rgba(249,144,77,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F6F5] sm:px-5 sm:text-[13.5px]"
              >
                <span>Learn more about Motivational Interviewing</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="-mr-0.5 transition-transform group-hover:translate-x-0.5"
                >
                  <line x1="3" y1="8" x2="13" y2="8" />
                  <polyline points="9 4 13 8 9 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <HeroPhoneMockup
          progress={progress}
          maxRisePercent={maxRise}
          chatProgress={sceneThreeRaw}
          riseStart={PHONE_RISE_START}
          riseEnd={PHONE_RISE_END}
        />

        {/* Desktop + tablet: orbit cards (sm and up). On narrower screens
            the orbit positions collapse — use the compact pill stack
            below instead. */}
        <SceneThreeCards sceneThree={sceneThreeRaw} />

        {/* Mobile (<sm): compact 3-pill row anchored to the top of the
            section so it never collides with the rising phone. Reveals
            once the headline has cleared. */}
        <MobilePillStack
          reveal={isNarrow ? clamp01((progress - PHONE_RISE_START) / 0.08) : 0}
        />
      </section>

      <MiModal open={miOpen} onClose={() => setMiOpen(false)} />
    </div>
  );
}

// ─── Scene 3: reasoning cards (orbit) ───────────────────────────────────────
// Three cards in an asymmetric triangle around the phone. Visible from the
// `sm` breakpoint up. Positional offsets use a `clamp` against viewport
// width so the cards stay close to the phone on tablet without falling off
// the edge of the canvas.

function SceneThreeCards({ sceneThree }: { sceneThree: number }) {
  const r1 = clamp01((sceneThree - 0.24) / 0.16);
  const r2 = clamp01((sceneThree - 0.50) / 0.16);
  const r3 = clamp01((sceneThree - 0.76) / 0.16);

  // Horizontal offset of the side cards from the section's centerline.
  // Scales smoothly between 80px (small tablet) and 150px (large desktop)
  // so the cards always overlap the phone the same way regardless of width.
  const sideOffset = "clamp(80px, 12vw, 150px)";
  // Card width tuned so a single card never exceeds 45% of the canvas on
  // tablet — keeps Card 2 / Card 3 from colliding across the centerline.
  const cardWidth = "clamp(200px, 22vw, 280px)";

  return (
    <div className="pointer-events-none absolute inset-0 hidden sm:block">
      {/* Card 1 — crown. Top center, behind phone. Pillar: clinical research. */}
      <FloatingCard
        positionStyle={{
          top: "clamp(8%, 11%, 14%)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 0,
        }}
        widthStyle={cardWidth}
        reveal={r1}
        enter="down"
      >
        <p className="text-[12.5px] font-medium tracking-[-0.005em] text-brand-700 sm:text-[13px]">
          Clinically grounded
        </p>
        <p className="mt-2.5 font-serif text-[18px] leading-[1.18] tracking-[-0.012em] text-ink sm:mt-3 sm:text-[20px]">
          30+ years of Motivational Interviewing.
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-soft sm:text-[12.5px]">
          Every reply is shaped by the method Dr. Ken Resnicow has spent his
          career proving works.
        </p>
      </FloatingCard>

      {/* Card 2 — left wing. Pillar: whole-person context awareness. */}
      <FloatingCard
        positionStyle={{
          top: "clamp(32%, 36%, 40%)",
          right: `calc(50% + ${sideOffset})`,
          zIndex: 0,
        }}
        widthStyle={cardWidth}
        reveal={r2}
        enter="left"
      >
        <p className="text-[12.5px] font-medium tracking-[-0.005em] text-brand-700 sm:text-[13px]">
          Whole-person aware
        </p>
        <p className="mt-2.5 font-serif text-[18px] leading-[1.18] tracking-[-0.012em] text-ink sm:mt-3 sm:text-[20px]">
          Knows what matters outside the chart.
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-soft sm:text-[12.5px]">
          Tracks family, goals, culture, and daily life: the context that
          makes change actually stick.
        </p>
      </FloatingCard>

      {/* Card 3 — right wing, focal. IN FRONT of phone. Pillar: tone. */}
      <FloatingCard
        positionStyle={{
          top: "clamp(56%, 60%, 64%)",
          left: `calc(50% + ${sideOffset})`,
          zIndex: 20,
        }}
        widthStyle={cardWidth}
        reveal={r3}
        enter="right"
        bgClassName="bg-white"
      >
        <p className="text-[12.5px] font-medium tracking-[-0.005em] text-brand-700 sm:text-[13px]">
          Always supportive
        </p>
        <p className="mt-2.5 font-serif text-[18px] leading-[1.18] tracking-[-0.012em] text-ink sm:mt-3 sm:text-[20px]">
          Never judges. Never preaches.
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-soft sm:text-[12.5px]">
          Reads emotion in plain text and meets people where they are —
          especially on the hard days.
        </p>
      </FloatingCard>
    </div>
  );
}

// ─── Mobile fallback ────────────────────────────────────────────────────────
// On phones the orbit doesn't have room to breathe. Instead, the three
// pillars collapse into a compact row of pills pinned to the top of the
// section, with staggered reveal so they still feel like a beat in the
// scroll story.

function MobilePillStack({ reveal }: { reveal: number }) {
  const PILLS = [
    "Clinically grounded",
    "Whole-person aware",
    "Always supportive",
  ];
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-4 flex justify-center px-4 sm:hidden"
      aria-hidden
    >
      <div className="flex flex-wrap justify-center gap-1.5">
        {PILLS.map((label, i) => {
          const local = clamp01(reveal * 1.6 - i * 0.15);
          return (
            <span
              key={label}
              className="inline-flex items-center rounded-full border border-ink/10 bg-white/85 px-3 py-1 text-[11px] font-medium tracking-[-0.005em] text-brand-700 shadow-[0_1px_2px_rgba(15,20,25,0.04)] backdrop-blur"
              style={{
                opacity: local,
                transform: `translateY(${(1 - local) * 6}px)`,
                willChange: "opacity, transform",
              }}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

type Enter = "left" | "right" | "down";

function entryTransform(reveal: number, enter: Enter) {
  const offset = (1 - reveal) * 22;
  if (enter === "left") return `translateX(${offset}px)`;
  if (enter === "right") return `translateX(${-offset}px)`;
  return `translateY(${-offset}px)`;
}

function FloatingCard({
  positionStyle,
  widthStyle,
  reveal,
  enter,
  children,
  bgClassName = "bg-[#FCFBFA]",
}: {
  positionStyle: React.CSSProperties & { transform?: string };
  widthStyle: string;
  reveal: number;
  enter: Enter;
  children: React.ReactNode;
  bgClassName?: string;
}) {
  const { transform: baseTransform, ...position } = positionStyle;
  const composedTransform = baseTransform
    ? `${baseTransform} ${entryTransform(reveal, enter)}`
    : entryTransform(reveal, enter);
  return (
    <div
      className="absolute"
      style={{
        ...position,
        width: widthStyle,
        opacity: reveal,
        transform: composedTransform,
        willChange: "opacity, transform",
      }}
    >
      <div
        className={`rounded-2xl border border-ink/[0.06] ${bgClassName} p-4 sm:p-5`}
        style={{
          boxShadow:
            "0 1px 2px rgba(15,20,25,0.04), 0 22px 48px -14px rgba(15,20,25,0.18)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Motivational Interviewing modal ────────────────────────────────────────
// Substantive briefing on MI, sourced from Chronilogix's MI white paper.
// Scrolls within the dialog on small viewports; backdrop click + Esc close.
// Body copy can be swapped or trimmed once Steven signs off on the public
// version — every paragraph here is paraphrased from the source white paper
// and intentionally avoids quoting passages that may still be in review.

function MiModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mi-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close dialog"
        className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
      />

      {/* Card — max-w widened to comfortably hold the briefing; inner column
          stays narrow for readable prose. Scrolls inside the dialog if the
          viewport is short. All type pulled from the site's typography
          tokens (.eyebrow, .eyebrow-muted, .body-quiet, .btn-primary)
          rather than bespoke class lists — same voice as the rest of the
          page. */}
      <div
        className="relative z-[101] flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_40px_120px_-20px_rgba(15,20,25,0.45)]"
        style={{ animation: "miModalIn 220ms ease-out" }}
      >
        {/* Header — sentence-case .eyebrow above a serif text-section
            heading, mirroring how every section on the page introduces
            itself. The supporting paragraph uses .body-quiet so it sits
            at the same body-text scale as the rest of the site. */}
        <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 sm:px-9 sm:pt-8">
          <div className="min-w-0">
            <p className="eyebrow">Motivational Interviewing</p>
            <h3
              id="mi-modal-title"
              className="mt-3 font-serif text-section font-normal text-ink"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              The gold standard for behavior change.
            </h3>
            <p className="mt-4 body-quiet">
              Developed by Miller &amp; Rollnick in the early 1980s. Proven
              across more than 200 randomized controlled trials. The
              clinical method engineered into every Chronilogix
              conversation.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <line x1="4" y1="4" x2="12" y2="12" />
              <line x1="12" y1="4" x2="4" y2="12" />
            </svg>
          </button>
        </div>

        {/* Body — scrollable column of mini-sections. Each block uses
            .eyebrow-muted as its label (sentence-case, ink-muted) so the
            sub-section rhythm is quieter than the modal's top eyebrow
            but still anchored to the same scale. Paragraphs use
            .body-quiet to stay flush with site body-copy treatment. */}
        <article className="flex-1 space-y-8 overflow-y-auto px-6 py-7 sm:space-y-9 sm:px-9 sm:py-8">
          <section>
            <p className="eyebrow-muted">What it is</p>
            <p className="mt-3 body-quiet">
              MI is a collaborative, goal-oriented style of communication
              that treats people as the experts on their own lives. Its job
              isn&rsquo;t to install motivation — it&rsquo;s to draw it out.
              Instead of advice and pressure (which usually harden
              resistance), MI uses open questions, reflective listening, and
              affirmations to help people articulate their own reasons for
              change.
            </p>
          </section>

          <section>
            <p className="eyebrow-muted">How it works</p>
            <p className="mt-3 body-quiet">
              MI proceeds through four processes —{" "}
              <span className="text-ink">engage, focus, evoke, plan</span> —
              and four day-to-day microskills known as OARS:{" "}
              <span className="text-ink">
                Open questions, Affirmations, Reflective listening, Summaries
              </span>
              . Reflective listening — offering a precise, sometimes deepened
              version of what the person just said — is the workhorse of the
              method.
            </p>
          </section>

          <section>
            <p className="eyebrow-muted">The evidence</p>
            <ul className="mt-3 space-y-3 body-quiet">
              <li className="flex gap-3">
                <span aria-hidden className="mt-[0.7em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>
                  Over <span className="text-ink">200 randomized controlled trials</span> across
                  substance use, smoking cessation, diet, exercise, medication
                  adherence, mental health, and chronic disease.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-[0.7em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>
                  Effect sizes are small to moderate but{" "}
                  <span className="text-ink">remarkably consistent</span> —
                  precisely the profile that compounds when an intervention is
                  delivered millions of times per week.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-[0.7em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>
                  Specifically validated for{" "}
                  <span className="text-ink">medication adherence</span>,{" "}
                  <span className="text-ink">type-2 diabetes self-management</span>,{" "}
                  <span className="text-ink">weight management</span>, and{" "}
                  <span className="text-ink">treatment engagement in mental health</span>.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <p className="eyebrow-muted">Why it fits AI</p>
            <p className="mt-3 body-quiet">
              MI is one of the few clinical methods that maps cleanly to large
              language models. Where human practitioners struggle — they get
              tired, fall back on advice-giving under time pressure, surrender
              to the &ldquo;righting reflex&rdquo; — a well-designed AI coach
              has none of those failure modes. And every conversation can be
              evaluated against the same fidelity rubric used to certify human
              counselors.
            </p>
          </section>

          <section>
            <p className="eyebrow-muted">Dr. Ken Resnicow</p>
            <p className="mt-3 body-quiet">
              Chronilogix&rsquo;s Co-Founder and Chief Science Officer.
              Professor in the Division of Epidemiology &amp; Community Health
              at the{" "}
              <span className="text-ink">University of Minnesota School of Public Health</span>{" "}
              and author of more than 400 peer-reviewed publications on
              motivational interviewing, cultural tailoring, and chronic
              disease behavior change. His randomized trials in nutrition,
              weight management, and pediatric obesity helped establish the
              modern evidence base for MI in medical settings.
            </p>
          </section>

          <section className="rounded-xl border border-ink/[0.06] bg-paper-warm px-5 py-5">
            <p className="eyebrow-muted">Inside Chronilogix</p>
            <p className="mt-3 body-quiet">
              MI isn&rsquo;t a prompt or a tone — it&rsquo;s an architectural
              layer. Every user message is interpreted against the published
              MI rubric (change talk vs. resistance, current process stage,
              what a competent reflection would look like), then the next
              move is selected from that interpretation. It&rsquo;s the
              difference between a chatbot that improvises and a coach that
              listens.
            </p>
          </section>
        </article>

        {/* Footer — single, prominent CTA. "Got it" removed per request;
            "Read the full white paper" promoted to .btn-primary so it
            reads as the action the modal is leading toward. href stays
            a stub until the white-paper destination URL is wired. */}
        <div className="flex shrink-0 items-center justify-center border-t border-ink/[0.06] bg-paper-warm/40 px-6 py-5 sm:px-9 sm:py-6">
          <a
            href="#"
            className="btn-primary group/wp"
            onClick={(e) => e.preventDefault()}
          >
            Read the full white paper
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              className="transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/wp:translate-x-1"
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
      </div>

      <style jsx>{`
        @keyframes miModalIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

function clamp01(n: number) {
  return Math.min(Math.max(n, 0), 1);
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
