"use client";

import { useEffect, useRef, useState } from "react";
import { AIOrb } from "@/components/AIOrb";

type Block = {
  eyebrow: string;
  heading: string;
  body: React.ReactNode;
  Visual: React.ComponentType<{ active: boolean }>;
};

/* Shared puffy-card classes — keeps the language consistent across the
   four visuals. Soft inner highlight comes from the gradient; the
   subtle outer shadow gives the floating "product-element" feel. */
const PUFFY_CARD = "surface-glass rounded-2xl";

/* Render at the top of a glass card to add the secondary "shine" highlight
   (the brighter top half visible in every reference card). Pass the matching
   top-corner radius so the shine inherits the card's curvature. */
function GlassShine({ radius = "rounded-t-2xl" }: { radius?: string }) {
  return (
    <span
      aria-hidden
      className={`surface-glass-shine pointer-events-none absolute inset-x-0 top-0 h-1/2 ${radius}`}
    />
  );
}

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
// unavailable or a field is empty. BLOCKS + TRUST_PILLARS carry non-text
// structure (body ReactNode / Visual / Icon) that stays fixed — only the
// text fields are merged by index over the defaults.
export type CoreCapabilitiesContent = {
  headingLead?: string;
  headingEmph?: string;
  intro?: string;
  blocks?: { eyebrow?: string; heading?: string }[];
  privacyEyebrow?: string;
  privacyHeadingLead?: string;
  privacyHeadingEmph?: string;
  trustPillars?: { title?: string; body?: string }[];
};

const DEFAULTS = {
  headingLead: "Real coaching does a lot at once.",
  headingEmph: "Every Chronilogix reply carries it all.",
  intro:
    "Clinical methodology, cultural and emotional reach, consistent delivery, and crisis safe handoffs. Engineered into every Chronilogix conversation, not added as features on top.",
  privacyEyebrow: "Privacy by design",
  privacyHeadingLead: "Member data is never used to train our models.",
  privacyHeadingEmph: "Not now. Not ever.",
} satisfies Required<
  Omit<CoreCapabilitiesContent, "blocks" | "trustPillars">
>;

function clean<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && v !== false,
    ),
  ) as Partial<T>;
}

export function CoreCapabilities({
  content,
}: {
  content?: CoreCapabilitiesContent;
}) {
  const c = { ...DEFAULTS, ...clean(content) };
  const blocks = BLOCKS.map((b, i) => ({
    ...b,
    ...clean(content?.blocks?.[i]),
  }));
  const trustPillars = TRUST_PILLARS.map((p, i) => ({
    ...p,
    ...clean(content?.trustPillars?.[i]),
  }));

  return (
    <section
      id="capabilities"
      // No `overflow-hidden` here — the sticky rows need to stick to the
      // page's scroll container, not to this section. `overflow-hidden`
      // would create a scrolling box that captures them and kills the
      // stack effect. Rounded corners still clip because nothing inside
      // extends past the section bounds.
      className="relative rounded-[28px] bg-white pt-24 md:pt-32 lg:pt-40"
    >
      <div className="container-page">
        {/* Header */}
        <div className="max-w-5xl">
          <h2
            className="mt-4 text-hero font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {c.headingLead}{" "}
            <span className="text-brand-700">{c.headingEmph}</span>
          </h2>
          <p className="mt-5 max-w-[60ch] body-prose">{c.intro}</p>
        </div>

        {/* Anchor rows — six scroll-stacking capability rows. Each row
            is `sticky top-...` with a matching white background so as the
            user scrolls, the next capability rises from below and lands
            directly on top of the previous one. Same mechanic the home
            page uses for the three Levels of Care. */}
        <div className="mt-12 flex flex-col md:mt-16">
          {blocks.map((block, i) => (
            <CapabilityRow key={block.heading} block={block} index={i} />
          ))}
        </div>
      </div>

      {/* Privacy by design — the closing beat. Full-width cream that
          matches the section's rounded bottom, so the trust posture
          reads as an inverted band, not another rounded card. */}
      <PrivacyByDesign
        eyebrow={c.privacyEyebrow}
        headingLead={c.privacyHeadingLead}
        headingEmph={c.privacyHeadingEmph}
        trustPillars={trustPillars}
      />
    </section>
  );
}

function CapabilityRow({ block, index }: { block: Block; index: number }) {
  const { ref, inView } = useInView<HTMLElement>(0.15);
  const reverse = index % 2 === 1;
  const { Visual } = block;

  const contentSide = reverse ? "lg:col-start-3" : "lg:col-start-1";

  return (
    <article
      ref={ref}
      // Sticky scroll-stacking is a desktop pattern — on mobile it
      // makes scroll feel uncertain in a small viewport. Below md the
      // row flows naturally; at md+ it sticks and stacks via the fog
      // veil. Same approach as LevelsOfCare.
      className="md:sticky md:top-24"
      style={{
        opacity: inView ? 1 : 0,
        // Use `none` rather than `translateY(0)` once revealed so the
        // article doesn't carry a permanent transform that would create
        // a containing block and break sticky positioning.
        transform: inView ? "none" : "translateY(16px)",
        transition:
          "opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)",
      }}
    >
      {/* Fog veil — softens the seam where rows stack on md+. Fades from
          transparent to the section's white ground so the next row lands
          on a clean surface, not a hard edge. Hidden on mobile.

          Same treatment as LevelsOfCare: a taller veil with a symmetric
          smoothstep ramp (eases in AND out) so the previous row dissolves
          evenly across the whole scroll distance instead of rushing to
          solid near the bottom. Full opacity by ~90% leaves a stable solid
          band flowing into the next row.

          No veil above the first row — there is no previous row to blend
          into, and a veil here sweeps up over the section heading during
          scroll (client: "cannot see the scroll"). Only rows that stack
          onto a prior row get the seam-softening veil. */}
      {index > 0 && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 hidden h-40 md:block md:-top-80 md:h-80"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 10%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.26) 30%, rgba(255,255,255,0.42) 40%, rgba(255,255,255,0.58) 50%, rgba(255,255,255,0.74) 60%, rgba(255,255,255,0.87) 70%, rgba(255,255,255,0.96) 80%, rgba(255,255,255,1) 90%, rgba(255,255,255,1) 100%)",
          }}
        />
      )}

      {/* Row body — opaque white background so each row hides the row
          beneath it as it stacks. Internal padding carries the rhythm
          that the old `space-y-*` used to provide. */}
      <div className="relative bg-white pb-16 pt-14 md:pb-24 md:pt-20 lg:pb-28 lg:pt-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-3 lg:gap-12">
          {/* Content */}
          <div
            className={`order-2 lg:order-none lg:row-start-1 ${contentSide} flex flex-col justify-center`}
          >
            <h3 className="max-w-[22ch] text-row font-serif font-normal text-ink">
              {block.heading}
            </h3>
            {/* Ordinal + section label sits below the headline as a mono
                signature — a different typographic family than both the
                serif heading and the sans body, so it reads as an
                anchoring tag, not a lead-in. */}
            <p className="mt-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-brand-700">
              {block.eyebrow}
            </p>
            <p className="mt-5 max-w-[42ch] body-quiet">{block.body}</p>
          </div>

          {/* Illustration — always centered column on desktop */}
          <div className="order-1 lg:order-none lg:col-start-2 lg:row-start-1">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] border border-ink/[0.08] bg-paper shadow-[0_10px_28px_-18px_rgba(20,8,2,0.18)] md:aspect-[5/6]">
              <Visual active={inView} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Privacy by design — the inverted closing block ─────────────────────
   Three deliberate beats:
     1) The absolute claim — "never used to train. Not now. Not ever."
        Centered and dominant. This is the line the messaging plan calls
        out as the single most important sentence in this entire posture.
     2) Three trust pillars — Built for Healthcare / Data Stays Yours /
        Enterprise Controls. Lifted from the source doc's Section 7
        pillar definitions so the trust argument has structural depth.
     3) Compliance footer — HIPAA badge centered at the bottom. Reads as
        the closing affirmation of the architecture above, not an
        orphan element fighting the headline for attention. */

type TrustPillar = {
  title: string;
  body: string;
  Icon: React.ComponentType<{ className?: string }>;
};

/* Line-art icons for the trust pillars. Kept at the same 24x24 viewBox
   and 1.6 stroke weight as the eyebrow-anchor padlock so all four icons
   in this block read as one family. */
function ShieldCrossIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3 L20 6 V12 C20 16.5 16.5 20 12 21 C7.5 20 4 16.5 4 12 V6 Z" />
      <path d="M12 9 V15 M9 12 H15" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8.5 10.5 V7.5 C8.5 5.6 10.1 4 12 4 C13.9 4 15.5 5.6 15.5 7.5 V10.5" />
      <path d="M12 14 V16.5" />
    </svg>
  );
}

function ControlsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 7 H19" />
      <circle cx="9" cy="7" r="2" />
      <path d="M5 17 H19" />
      <circle cx="15" cy="17" r="2" />
    </svg>
  );
}

const TRUST_PILLARS: TrustPillar[] = [
  {
    title: "Built for Healthcare",
    body: "Designed for healthcare from the ground up. Encryption in transit and at rest. HIPAA compliant access controls baked in, not bolted on.",
    Icon: ShieldCrossIcon,
  },
  {
    title: "Data Stays Yours",
    body: "Conversations are never shared, sold, or used to improve our models. What members tell Chronilogix belongs to them and to you.",
    Icon: LockIcon,
  },
  {
    title: "Enterprise Controls",
    body: "Single tenant deployment available. Role based access. Clinical grade audit logging. The controls your IT and legal teams already require.",
    Icon: ControlsIcon,
  },
];

function PrivacyByDesign({
  eyebrow,
  headingLead,
  headingEmph,
  trustPillars,
}: {
  eyebrow: string;
  headingLead: string;
  headingEmph: string;
  trustPillars: TrustPillar[];
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  return (
    <div
      ref={ref}
      className="mt-24 md:mt-32 lg:mt-40"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(18px)",
        transition:
          "opacity 800ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 800ms cubic-bezier(0.22, 0.61, 0.36, 1)",
      }}
    >
      {/* Full-width cream band. `rounded-b-[28px]` matches the parent
          section's rounded corners at the bottom so the band reads as
          the closing lip of the capabilities section, not a stray card
          floating inside it. */}
      <div className="relative overflow-hidden rounded-b-[28px] bg-paper-warm px-6 py-14 md:px-10 md:py-20 lg:px-14 lg:py-24">
        <div className="container-page">
          {/* Beat 1 — the absolute claim. Padlock anchor + eyebrow +
              headline stacked centre-aligned. Compliance chips land as
              the immediate proof beneath the promise. */}
          <div className="relative mx-auto max-w-3xl text-center">
            <span
              aria-hidden
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/10 text-brand-700 ring-1 ring-brand-600/20"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
                <path d="M8.5 10.5 V7.5 C8.5 5.6 10.1 4 12 4 C13.9 4 15.5 5.6 15.5 7.5 V10.5" />
                <path d="M12 14 V16.5" />
              </svg>
            </span>
            <p className="mt-4 text-[13px] font-medium tracking-tight text-brand-700/90">
              {eyebrow}
            </p>
            <h3
              className="mt-3 font-serif text-[28px] font-normal leading-[1.1] text-ink md:text-[36px] lg:text-[42px]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {headingLead}{" "}
              <span className="text-brand-700">{headingEmph}</span>
            </h3>

            {/* Compliance chips — HIPAA + BAA sit directly under the
                headline as the immediate proof. Live pulse dot on HIPAA;
                checkmark glyph on BAA. Both keep the light-block chip
                recipe (white ground, ink-hairline border, ink type). */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-white/80 px-4 py-1.5 backdrop-blur-sm">
                <span aria-hidden className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/60" />
                  <span className="relative inline-block h-2 w-2 rounded-full bg-brand-500" />
                </span>
                <span className="text-[13px] font-medium text-ink">HIPAA</span>
                <span className="text-[12px] text-ink-muted">Compliant</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-ink/8 bg-white/60 px-4 py-1.5">
                <svg
                  className="h-3.5 w-3.5 text-ink-soft"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M3 6.5 L7 10.5 L13 4.5" />
                </svg>
                <span className="text-[12.5px] text-ink-soft">
                  BAA available on request
                </span>
              </div>
            </div>
          </div>

          {/* Hairline divider — same seam pattern the rest of the site
              uses (see HiwIntegration, AboutScience). */}
          <div
            aria-hidden
            className="relative mx-auto mt-10 h-px w-16 bg-ink/12 md:mt-12"
          />

          {/* Beat 2 — three trust pillars. Naked text with just an icon
              anchor (no ordinal) — the icon carries enough identity, and
              the numbers were doing double duty with the row headings.
              Matches the naked-pillar language used across the rest of
              the site (HiwIntegration, HiwMethod, TrustSignals). */}
          <div className="relative mt-10 grid grid-cols-1 gap-8 md:mt-12 md:grid-cols-3 md:gap-8 lg:gap-10">
            {trustPillars.map((pillar) => (
              <div key={pillar.title} className="flex flex-col">
                <span
                  aria-hidden
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/10 text-brand-700 ring-1 ring-brand-600/20"
                >
                  <pillar.Icon className="h-5 w-5" />
                </span>
                <h4 className="mt-4 font-serif text-[19px] font-normal leading-tight text-ink md:text-[21px]">
                  {pillar.title}
                </h4>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft md:text-[14.5px]">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Capability visuals — one clear idea each, no decorative pills or dots.   */
/* Typography + whitespace do the work.                                     */

/* ── 01 — MI Engine ─────────────────────────────────────────────────────
   The big challenge breaks down to a small, concrete step — anchored to an
   internal why. Read top-to-bottom as a single vertical thought. */

function MethodVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-1-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/70" />

      <div className="relative flex h-full flex-col items-stretch justify-center gap-5 p-8 md:p-10">
        {/* The big, abstract challenge */}
        <figure
          className={`${PUFFY_CARD} relative w-full self-start overflow-hidden px-5 py-4`}
          style={{
            animation: "fadeUp 600ms ease-out 100ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <GlassShine />
          <p className="relative text-[13px] font-medium text-ink-soft">
            The challenge
          </p>
          <p className="relative mt-2 font-serif text-[22px] leading-tight tracking-tight text-ink md:text-[26px]">
            &ldquo;Reverse my diabetes.&rdquo;
          </p>
        </figure>

        {/* A single thin connector that "draws down" */}
        <div className="relative mx-auto h-9 w-px">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 origin-top bg-gradient-to-b from-brand-600/60 to-brand-600/10"
            style={{
              bottom: 0,
              animation: "scaleYFromTop 700ms ease-out 800ms forwards",
              animationPlayState: playState,
              transform: "scaleY(0)",
            }}
          />
        </div>

        {/* The small, achievable goal */}
        <figure
          className={`${PUFFY_CARD} relative w-full self-stretch overflow-hidden px-5 py-4`}
          style={{
            animation: "fadeUp 600ms ease-out 1300ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <GlassShine />
          <p className="relative text-[13px] font-medium text-brand-700">
            This week
          </p>
          <p className="relative mt-2 font-serif text-[19px] leading-tight tracking-tight text-ink md:text-[21px]">
            Walk fifteen minutes, after dinner.
          </p>
        </figure>

        {/* The why — a quiet caption with an em dash, no card, no pill */}
        <p
          className="relative mt-2 max-w-[36ch] self-center text-center text-[14.5px] font-medium leading-snug text-ink-soft md:text-[15.5px]"
          style={{
            animation: "fadeUp 600ms ease-out 2000ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          Because she wants to be there for her granddaughter&rsquo;s wedding.
        </p>
      </div>
    </div>
  );
}

/* ── 02 — Access ────────────────────────────────────────────────────────
   Two messages, side-by-side roles, language shift does the work.
   No panel chrome, no "Direct message" header, no confidentiality pill,
   no language pill, no MI tag. The conversation itself is the proof. */

function AccessVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pattern.png"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/70" />

      <div className="relative flex h-full flex-col justify-center gap-3 p-8 md:p-10">
        {/* Member, in English — the honest thing */}
        <div
          className="surface-glass-inner relative max-w-[82%] self-end overflow-hidden rounded-[18px] rounded-br-[6px] px-4 py-3 text-[14px] leading-snug text-ink"
          style={{
            animation: "fadeUp 600ms ease-out 200ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          Honestly… I haven&rsquo;t taken my pills in three weeks. I never
          told my doctor.
        </div>

        {/* Chronilogix, in Spanish — the language shift is the story */}
        <div
          className="surface-glass relative max-w-[86%] self-start overflow-hidden rounded-[18px] rounded-bl-[6px] px-4 py-3 text-[14px] leading-snug text-ink"
          style={{
            animation: "fadeUp 600ms ease-out 1100ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span aria-hidden className="surface-glass-shine absolute inset-x-0 top-0 h-1/2 rounded-t-[18px]" />
          <div className="relative flex items-start gap-2.5">
            <span className="mt-1 shrink-0"><AIOrb size={18} /></span>
            <p>
              Gracias por contarme eso. Eso requirió valor. ¿Qué hacía que
              tomarlas se sintiera difícil?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 03 — Oversight ─────────────────────────────────────────────────────
   Six sessions on a quiet horizon. Five small, one elevated and named.
   A thin diagonal carries the flagged one to a clinician's signature —
   the handoff IS the visual. No chart card, no toast swap, no pulse halo. */

function OversightVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

  // 6 sessions; the 5th is flagged
  const sessions = [
    { ok: true, h: 14 },
    { ok: true, h: 12 },
    { ok: true, h: 16 },
    { ok: true, h: 13 },
    { ok: false, h: 34 }, // flagged — elevated tally
    { ok: true, h: 14 },
  ];

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-1-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/70" />

      <div className="relative flex h-full flex-col items-center justify-center gap-10 p-8 md:p-10">
        <div className={`${PUFFY_CARD} w-full max-w-[300px] p-6 md:p-7`}>
          <p
            className="text-[14px] font-medium leading-snug text-ink-soft"
            style={{
              animation: "fadeUp 500ms ease-out 100ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            Six sessions, one flagged.
          </p>

          {/* Horizon row of tally marks */}
          <div className="relative mt-7">
            {/* Baseline */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-[10px] h-px bg-ink/12"
            />

            <div className="relative flex items-end justify-between px-2">
              {sessions.map((s, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  {!s.ok && (
                    <span
                      aria-hidden
                      className="mb-1 font-mono text-[10px] leading-none text-brand-700"
                      style={{
                        animation: `fadeUp 400ms ease-out ${600 + i * 160}ms forwards`,
                        animationPlayState: playState,
                        opacity: 0,
                      }}
                    >
                      ▾
                    </span>
                  )}
                  <span
                    className={`block w-[3px] origin-bottom rounded-full ${
                      s.ok ? "bg-ink/35" : "bg-brand-700"
                    }`}
                    style={{
                      height: s.h,
                      animation: `tallyRise 420ms cubic-bezier(0.34, 1.4, 0.64, 1) ${400 + i * 160}ms forwards`,
                      animationPlayState: playState,
                      transform: "scaleY(0)",
                      marginBottom: 10,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Session labels */}
            <div className="mt-3 flex justify-between px-2 font-mono text-[11px] font-medium tracking-tight text-ink-muted">
              {["s1", "s2", "s3", "s4", "s5", "s6"].map((s, i) => (
                <span
                  key={s}
                  className={i === 4 ? "text-brand-700" : ""}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* The handoff — a single line, no card, no toast */}
          <div
            className="mt-8 flex items-baseline gap-3"
            style={{
              animation: "fadeUp 600ms ease-out 1700ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            <span className="text-[12.5px] font-medium text-ink-soft">
              Handoff
            </span>
            <span aria-hidden className="h-px flex-1 self-center bg-ink/15" />
            <span className="font-serif text-[16px] leading-none tracking-tight text-ink">
              Dr. Patel
            </span>
          </div>
          <p
            className="mt-2 text-right text-[13px] leading-snug text-ink-soft"
            style={{
              animation: "fadeUp 600ms ease-out 2100ms forwards",
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            Reviewing within two hours.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* 04 — Multilingual                                                        */
/* The same coach question rendered in three languages, stacked. The point  */
/* is the native voice, not a translation toggle.                           */
/* ──────────────────────────────────────────────────────────────────────── */

function MultilingualVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";
  const greetings = [
    { code: "EN", text: "What made today feel that way?" },
    { code: "ES", text: "¿Qué hizo que hoy se sintiera así?" },
    { code: "VI", text: "Điều gì khiến hôm nay cảm thấy như vậy?" },
  ];

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-1-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/70" />

      <div className="relative flex h-full flex-col justify-center gap-3.5 p-8 md:p-10">
        <p
          className="text-[12px] font-medium tracking-tight text-ink-muted"
          style={{
            animation: "fadeUp 500ms ease-out 100ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          The same question, in the member&rsquo;s language
        </p>
        {greetings.map((g, i) => (
          <div
            key={g.code}
            className={`${PUFFY_CARD} relative max-w-[94%] self-start overflow-hidden rounded-[16px] rounded-bl-[6px] px-4 py-3`}
            style={{
              animation: `fadeUp 600ms ease-out ${300 + i * 380}ms forwards`,
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            <GlassShine radius="rounded-t-[16px]" />
            <div className="relative flex items-baseline gap-3">
              <span className="font-mono text-[10.5px] font-medium tracking-[0.08em] text-brand-700/85">
                {g.code}
              </span>
              <span className="text-[14px] leading-snug text-ink md:text-[14.5px]">
                {g.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* 05 — Emotion-aware                                                       */
/* Two member quotes side-by-side. Same coach, different reads, different   */
/* responses. The differential is the proof.                                */
/* ──────────────────────────────────────────────────────────────────────── */

type EmotionExchange = {
  member: string;
  reads: string;
  coach: string;
};

const EMOTION_EXCHANGES: EmotionExchange[] = [
  {
    member: "I just feel off today.",
    reads: "ambivalence",
    coach: "What&rsquo;s been on your mind?",
  },
  {
    member: "I crushed my goal today.",
    reads: "momentum",
    coach: "What helped you stay with it?",
  },
];

function EmotionAwareVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pattern.png"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/70" />

      <div className="relative flex h-full flex-col justify-center gap-6 p-8 md:p-10">
        {EMOTION_EXCHANGES.map((ex, i) => (
          <div
            key={ex.member}
            className={`flex flex-col gap-2 ${i > 0 ? "border-t border-ink/10 pt-6" : ""}`}
            style={{
              animation: `fadeUp 600ms ease-out ${200 + i * 900}ms forwards`,
              animationPlayState: playState,
              opacity: 0,
            }}
          >
            {/* Member quote */}
            <div className="surface-glass-inner self-end max-w-[82%] overflow-hidden rounded-[14px] rounded-br-[6px] px-3.5 py-2.5 text-[13.5px] leading-snug text-ink">
              {ex.member}
            </div>

            {/* Detected state — labelled chip, mid-row, with a hairline
                glyph to imply the read happens between input and reply. */}
            <div className="surface-glass inline-flex items-center gap-2 rounded-full self-center px-3 py-1">
              <span
                aria-hidden
                className="block h-px w-6 bg-ink/20"
              />
              <span className="font-mono text-[11px] tracking-tight text-ink-muted">
                reads
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600/12 px-2.5 py-0.5 text-[11px] font-medium text-brand-700">
                <span aria-hidden className="block h-3 w-[2px] rounded-full bg-brand-700" />
                {ex.reads}
              </span>
              <span
                aria-hidden
                className="block h-px w-6 bg-ink/20"
              />
            </div>

            {/* Coach reply */}
            <div
              className="surface-glass relative max-w-[88%] self-start overflow-hidden rounded-[14px] rounded-bl-[6px] px-3.5 py-2.5 text-[13.5px] leading-snug text-ink"
              dangerouslySetInnerHTML={{ __html: `<span aria-hidden class="surface-glass-shine pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[14px]"></span><span class="relative">${ex.coach}</span>` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* 06 — Crisis-safe                                                         */
/* A short three-beat sequence: concerning member message → distress signal */
/* detected → 988 connect badge. The escalation IS the visual.              */
/* ──────────────────────────────────────────────────────────────────────── */

function CrisisSafeVisual({ active }: { active: boolean }) {
  const playState = active ? "running" : "paused";

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card-3-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-paper/70" />

      <div className="relative flex h-full flex-col justify-center gap-4 p-8 md:p-10">
        {/* Member message — concerning language */}
        <div
          className="surface-glass-inner self-end max-w-[84%] overflow-hidden rounded-[14px] rounded-br-[6px] px-4 py-3 text-[14px] leading-snug text-ink"
          style={{
            animation: "fadeUp 600ms ease-out 200ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          I don&rsquo;t think I can keep doing this.
        </div>

        {/* Detection beat — small flag with pulsing dot */}
        <div
          className="flex items-center gap-2.5 self-center rounded-full border border-brand-700/20 bg-white/85 px-3.5 py-1.5 backdrop-blur-sm"
          style={{
            animation: "fadeUp 500ms ease-out 900ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <span
            aria-hidden
            className="block h-3 w-[2px] rounded-full"
            style={{
              backgroundColor: "#E45A1C",
              animation: "knobPulse 1800ms cubic-bezier(0.22, 0.61, 0.36, 1) infinite",
              animationPlayState: playState,
            }}
          />
          <span className="font-mono text-[11px] font-medium tracking-tight text-brand-700">
            Distress signal, auto escalating
          </span>
        </div>

        {/* 988 connect card */}
        <div
          className={`${PUFFY_CARD} relative self-stretch overflow-hidden px-4 py-3.5`}
          style={{
            animation: "fadeUp 600ms ease-out 1500ms forwards",
            animationPlayState: playState,
            opacity: 0,
          }}
        >
          <GlassShine />
          <div className="relative flex items-center gap-3">
            <span
              aria-hidden
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(228,90,28,0.18) 0%, rgba(228,90,28,0.08) 100%)",
              }}
            >
              <svg
                className="h-5.5 w-5.5 text-brand-700"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                width="22"
                height="22"
              >
                <path d="M10 2.5 4 4.7v4.4c0 3.4 2.4 6.5 6 8.4 3.6-1.9 6-5 6-8.4V4.7L10 2.5Z" />
                <path d="M7.7 10.2 9.3 11.8l3-3.3" />
              </svg>
            </span>
            <div className="flex flex-col">
              <p className="font-serif text-[18px] leading-none tracking-tight text-ink">
                988
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-soft">
                Suicide &amp; Crisis Lifeline
              </p>
            </div>
            <span
              aria-hidden
              className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-white"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Data ──────────────────────────────────────────────────────────────── */

const BLOCKS: Block[] = [
  {
    eyebrow: "01. MI Engine",
    heading: "A coach, not a chatbot.",
    body: (
      <>
        Every Chronilogix conversation runs on the{" "}
        <span className="text-ink">MI Engine</span>, Dr. Ken
        Resnicow&rsquo;s Motivational Interviewing framework, encoded
        into the coaching loop. It doesn&rsquo;t lecture. It listens,
        reflects, and helps members find their own reasons to change.
        A structured intake makes the first session already informed;
        from there, big challenges break into small, achievable steps
        anchored to an internal <em>why</em>.
      </>
    ),
    Visual: MethodVisual,
  },
  {
    eyebrow: "02. Access",
    heading: "The first honest conversation.",
    body: (
      <>
        Stigma, fear of judgment, and confidentiality worries keep many
        people from ever opening up to a live coach. Chronilogix lets
        them speak honestly first, then adapts to each member&rsquo;s
        culture, language, literacy, and readiness, reaching
        populations traditional programs overlook. Hispanic men face a{" "}
        <span className="text-ink">64% higher diabetes rate</span> yet
        make up just{" "}
        <span className="text-ink">2% of national prevention enrollment</span>.
      </>
    ),
    Visual: AccessVisual,
  },
  {
    eyebrow: "03. Oversight",
    heading: "AI at scale. Clinicians in the loop.",
    body: (
      <>
        AI coaching doesn&rsquo;t vary with fatigue, caseload, or
        turnover. It delivers the same evidence based engagement every
        time. Chronilogix is designed to handle{" "}
        <span className="text-ink">up to 70% of routine coaching</span>;
        the remaining <span className="text-ink">~30%</span> escalates
        to human clinicians when the moment calls for it. The reach and
        economics of AI, paired with clinical oversight.
      </>
    ),
    Visual: OversightVisual,
  },
  {
    eyebrow: "04. Multilingual",
    heading: "Native, not translated.",
    body: (
      <>
        Conversations adapt to the language each member chooses,
        reaching populations English only platforms cannot serve. Not
        subtitle translation. The full coaching voice, native in each
        language Chronilogix supports.
      </>
    ),
    Visual: MultilingualVisual,
  },
  {
    eyebrow: "05. Emotion aware",
    heading: "Reads the mood, not just the message.",
    body: (
      <>
        Calibrated to recognize distress, disengagement, frustration,
        and ambivalence as distinct states inside plain text.{" "}
        <span className="text-ink">&ldquo;I just feel off&rdquo;</span>{" "}
        gets a different response pattern than{" "}
        <span className="text-ink">&ldquo;I crushed it today.&rdquo;</span>{" "}
        Tone, pacing, and question type adjust automatically.
      </>
    ),
    Visual: EmotionAwareVisual,
  },
  {
    eyebrow: "06. Crisis safe",
    heading: "988, built into the conversation.",
    body: (
      <>
        Millie is designed to recognize crisis level distress signals
        that exceed coaching scope, shift into a structured risk
        assessment, and escalate to the 988 Suicide &amp; Crisis Lifeline
        when the risk level warrants it. Safety is part of the
        conversation architecture, not a fallback.
      </>
    ),
    Visual: CrisisSafeVisual,
  },
];

