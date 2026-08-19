"use client";

// ProblemV3 — V4's condensed Problem section.
//
// V1 renders six numeric facts inline, five viewports tall. V4 pushes
// the entire deep-dive into a bottom-anchored pop-up: the on-page
// story is headline → curated summary → resolution thesis; the pop-up
// carries the V1 numbered-facts UI (observations + six facts) so the
// visitor can go deeper when they want to.
//
// Layout:
//   - Section is one viewport tall (lg:h-screen), no in-section scroll.
//   - Left column: portrait, full viewport height.
//   - Right column: heading + two paragraphs + resolution line.
//   - Peek card is anchored to the section bottom edge (absolute,
//     bottom-0) so it visibly rises OUT of the section's bottom, not
//     partway up inside the right column.
//
// Motion:
//   - Scroll-linked progress (0..1) drives the peek card up as the
//     section enters the viewport, and eases the tilt from -3° → -1°.
//   - Respects prefers-reduced-motion (rests at final state).

import { useEffect, useRef, useState } from "react";
import { useScrollLock } from "@/components/hooks/useScrollLock";
import { createPortal } from "react-dom";

type Fact = {
  /** Hero numeral — single dominant figure */
  lead?: string;
  /** Optional small unit shown next to the lead (e.g. "wks") */
  unit?: string;
  /** Supporting sentence — may contain <em> for inline emphasis */
  body?: React.ReactNode;
  /** Source attribution */
  source?: string;
  /** Optional downstream cascade */
  waterfall?: string[];
};

// Editable content (ACF-backed). Every field falls back to the original
// hardcoded copy so the section renders identically when WordPress is
// unavailable or a field is empty.
export type ProblemV3Content = {
  imageUrl?: string;
  imageAlt?: string;
  headingLead?: string;
  headingRest?: string;
  para1?: React.ReactNode;
  shortageEyebrow?: string;
  para2?: React.ReactNode;
  resolution?: string;
  buttonEyebrow?: string;
  buttonTitle?: string;
  popupEyebrow?: string;
  popupHeading?: string;
  observations?: string[];
  facts?: Fact[];
};

// Eight facts backing the deep-dive. The two workforce/burden stats the
// client added for the June update (40% HPSA + HRSA projections; 129M
// chronic) lead, followed by the six facts carried over from V1. Each
// carries mechanism detail (11M undiagnosed, 300× suicide-risk
// multiplier, the ambivalence waterfall) beyond the on-page summary, so
// the pop-up stays the complete deep-dive.
const FACTS: Fact[] = [
  {
    lead: "40%",
    body: (
      <>
        of Americans live in a{" "}
        <em className="font-normal not-italic text-ink">
          Mental Health Professional Shortage Area
        </em>
        , and more than 6,000 additional practitioners are needed just to
        close today&rsquo;s federally designated gaps. HRSA projects
        shortfalls of roughly 99,780 counselors, 99,840 psychologists,
        43,810 psychiatrists, 77,050 addiction counselors, and 33,840
        marriage and family therapists over the next decade &mdash; and
        those figures reflect today&rsquo;s utilization, not the full unmet
        need.
      </>
    ),
    source: "HRSA · Health Workforce projections",
  },
  {
    lead: "15M+",
    body: (
      <>
        global shortage of behavioral health and chronic care coaches.{" "}
        <em className="font-normal not-italic text-ink">
          The world cannot hire its way out of the gap.
        </em>
      </>
    ),
    source: "WHO Mental Health Atlas",
  },
  {
    lead: "129M",
    body: (
      <>
        Americans live with at least one chronic condition.{" "}
        <em className="font-normal not-italic text-ink">60%</em> of adults
        have one and <em className="font-normal not-italic text-ink">40%</em>{" "}
        have two or more, and chronic disease drives roughly{" "}
        <em className="font-normal not-italic text-ink">
          90% of U.S. healthcare spending
        </em>{" "}
        &mdash; demand that already outstrips the supply of nurses, diabetes
        educators, care managers, and health coaches. To keep up, health
        systems increasingly lean on care coordinators, community health
        workers, AI-assisted coaching, and remote monitoring.
      </>
    ),
    source: "CDC",
  },
  {
    lead: "40M",
    body: (
      <>
        Americans live with diabetes, including{" "}
        <em className="font-normal not-italic text-ink">
          11M undiagnosed
        </em>
        . Another{" "}
        <em className="font-normal not-italic text-ink">
          115M have prediabetes
        </em>
        , at risk of progressing without intervention.
      </>
    ),
    source: "CDC",
  },
  {
    lead: "61M+",
    body: (
      <>
        American adults live with mental illness,{" "}
        <em className="font-normal not-italic text-ink">1 in 5</em>, every
        year.{" "}
        <em className="font-normal not-italic text-ink">Nearly half</em>{" "}
        will meet diagnostic criteria in their lifetime.
      </>
    ),
    source: "SAMHSA · National Survey on Drug Use and Health",
  },
  {
    lead: "70%",
    body: (
      <>
        of patients discharged from the ER after a suicide attempt{" "}
        <em className="font-normal not-italic text-ink">
          never begin outpatient mental health treatment
        </em>
        . Suicide risk runs{" "}
        <em className="font-normal not-italic text-ink">300× higher</em> in
        the first week and{" "}
        <em className="font-normal not-italic text-ink">200× higher</em>{" "}
        across the first month for those left without follow-up.
      </>
    ),
    source: "JAMA Psychiatry · post-discharge cohort studies",
  },
  {
    lead: "$300B",
    body: (
      <>
        in U.S. prescriptions go unfilled every year, most because of{" "}
        <em className="font-normal not-italic text-ink">ambivalence</em>,
        not forgetting. The intervention that resolves ambivalence is
        conversation, not reminders.
      </>
    ),
    source: "Annals of Internal Medicine · WHO",
    waterfall: [
      "Prescription unfilled. Ambivalence wins quietly",
      "Follow up appointment skipped or rescheduled out",
      "Symptoms drift, the gap widens between visits",
      "Help arrives only after escalation, often in the ER",
    ],
  },
  {
    lead: "2 to 6",
    unit: "wks",
    body: (
      <>
        is the average wait for in person mental health care. Meanwhile,{" "}
        <em className="font-normal not-italic text-ink">
          human coaches stay scarce and expensive
        </em>
        .
      </>
    ),
    source: "WHO",
  },
];

const OBSERVATIONS = [
  "The costliest claims almost always begin as small, unaddressed risks between visits.",
  "The moments that matter most arrive off hours: shift workers and first responders need support at 2 AM, not 2 PM.",
  "Coaching and behavioral support rarely get reimbursed, so people wait until things worsen and the bill arrives as an ER visit, not an appointment.",
  "Diabetes hits Hispanic men 64% harder than average, yet they make up just 2% of the people the CDC's national prevention program reaches.",
  "Human care fluctuates with burnout, caseloads, and turnover.",
];

const DEFAULTS = {
  imageUrl: "/problem-portrait.webp",
  imageAlt:
    "A man sits cross-legged on a bed in afternoon light, alone, mid-thought.",
  headingLead: "The most expensive moments",
  headingRest: "happen between appointments and where there is no care.",
  para1: (
    <>
      America doesn&rsquo;t have a therapy shortage &mdash; it has a{" "}
      <span className="text-ink">continuity-of-care shortage</span>. There
      simply aren&rsquo;t enough clinicians, coaches, care managers, or
      diabetes educators to provide daily support between appointments. AI
      coaching fills those gaps by extending the reach of the existing
      workforce &mdash; and replacing it where AI coaching can provide care
      efficaciously.
    </>
  ),
  shortageEyebrow: "The real shortage",
  para2: (
    <>
      It&rsquo;s not therapists that run short &mdash; it&rsquo;s{" "}
      <span className="text-ink">the hours between them</span>. A therapist
      may see a patient once every two to four weeks, for 45 to 60 minutes,
      while a person with diabetes, anxiety, depression, obesity,
      hypertension, or heart disease makes hundreds of health decisions in
      between. No workforce can be there for all of them.
    </>
  ),
  resolution: "Care has to live in the hours between.",
  buttonEyebrow: "The problem, in detail",
  buttonTitle: "Where care breaks down between visits.",
  popupEyebrow: "The problem, in detail",
  popupHeading: "Where care breaks down between visits.",
  observations: OBSERVATIONS,
  facts: FACTS,
} satisfies Required<ProblemV3Content>;

export function ProblemV3({ content }: { content?: ProblemV3Content }) {
  const c = { ...DEFAULTS, ...clean(content) };
  const observations = content?.observations?.length
    ? content.observations
    : DEFAULTS.observations;
  const facts = content?.facts?.length ? content.facts : DEFAULTS.facts;
  const [open, setOpen] = useState(false);

  return (
    <section
      id="problem"
      className="relative overflow-hidden border-y border-ink/10 bg-paper-warm lg:min-h-screen"
      aria-labelledby="problem-heading-v3"
    >
      <div className="grid h-full lg:grid-cols-2">
        {/* Left — portrait. Frames the human consequence the numbers describe. */}
        <div className="relative p-2 lg:p-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] lg:aspect-auto lg:h-full lg:min-h-[calc(100vh-1rem)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.imageUrl}
              alt={c.imageAlt}
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

        {/* Right — narrative. On desktop the section is viewport-tall and
            the content is bottom-anchored (lg:justify-end): headline →
            two paragraphs → resolution thesis → a big button that opens
            the deep-dive pop-up. */}
        <div className="relative flex h-full flex-col justify-start px-6 py-10 md:px-14 md:py-14 lg:px-16 lg:pt-28 lg:pb-20 lg:justify-end xl:px-20">
          <h2
            id="problem-heading-v3"
            className="max-w-2xl text-hero font-serif font-normal text-ink"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {c.headingLead}{" "}
            <span className="text-ink-muted">{c.headingRest}</span>
          </h2>

          <p className="mt-6 max-w-xl body-prose md:mt-8">{c.para1}</p>

          <div className="mt-6 max-w-xl md:mt-8">
            <p className="eyebrow">{c.shortageEyebrow}</p>
            <p className="mt-3 body-prose">{c.para2}</p>
          </div>

          <div className="mt-10 max-w-xl md:mt-12">
            <span aria-hidden className="block h-px w-12 bg-ink/20" />
            <p className="mt-5 font-serif text-row font-normal leading-[1.15] text-ink md:mt-6">
              {c.resolution}
            </p>
          </div>

          {/* Big button — the entry point into the deep-dive pop-up.
              Full width of the narrative column, clearly clickable, with
              the eyebrow + headline it opens and an arrow affordance. */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-label="See the full picture — where care breaks down between visits"
            className="group mt-10 flex w-full max-w-xl items-center justify-between gap-6 rounded-2xl bg-paper px-7 py-6 text-left shadow-[0_1px_2px_rgba(72,40,20,0.05),0_18px_40px_-28px_rgba(72,40,20,0.35)] ring-1 ring-ink/10 transition-all duration-300 ease-out-quart hover:-translate-y-0.5 hover:shadow-[0_2px_6px_rgba(72,40,20,0.06),0_26px_50px_-28px_rgba(72,40,20,0.42)] hover:ring-brand-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60 motion-reduce:transition-none md:mt-12 md:px-9 md:py-7"
          >
            <span className="flex min-w-0 flex-col gap-1.5">
              <span className="eyebrow">{c.buttonEyebrow}</span>
              <span className="font-serif text-[20px] font-normal leading-[1.15] text-ink md:text-[23px]">
                {c.buttonTitle}
              </span>
            </span>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white shadow-sm transition-all duration-300 ease-out-quart group-hover:translate-x-0.5 group-hover:bg-brand-accent md:h-14 md:w-14">
              <svg
                aria-hidden
                width="20"
                height="20"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <ProblemDetailPopup
        open={open}
        onClose={() => setOpen(false)}
        eyebrow={c.popupEyebrow}
        heading={c.popupHeading}
        observations={observations}
        facts={facts}
      />
    </section>
  );
}

// V1-styled deep-dive rendered inside a portal-mounted pop-up. Carries
// the observations block + six numbered facts; excludes the heading
// and intro paragraph, which already live on the section itself.
function ProblemDetailPopup({
  open,
  onClose,
  eyebrow,
  heading,
  observations,
  facts,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  heading: string;
  observations: string[];
  facts: Fact[];
}) {
  const [mounted, setMounted] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousActive = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* This popup is the Problem section's second overlay, and it carried the
     same ineffective `body` overflow lock as the rest of the site — the
     scroller here is `html`, so the page kept moving behind it. */
  useScrollLock(open);

  useEffect(() => {
    if (open) {
      previousActive.current = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => {
        closeBtnRef.current?.focus();
      });
    } else if (previousActive.current) {
      previousActive.current.focus?.();
      previousActive.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <div
        aria-hidden
        className="fixed inset-0 z-[100] bg-ink/45 backdrop-blur-md"
        style={{ animation: "fadeIn 240ms ease-out both" }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="problem-detail-heading"
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-8"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex w-full max-w-[820px] max-h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-[28px] bg-paper-warm shadow-[0_40px_80px_-24px_rgba(15,20,25,0.35)] md:max-h-[calc(100svh-4rem)]"
          style={{ animation: "modalIn 320ms cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60 md:right-7 md:top-7"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden>
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Scroll area is inset vertically by the panel's 28px corner
              radius (my-7) so the scrollbar runs only along the straight
              part of the edge — flush with the panel, its ends were being
              clipped by the rounded corners. The inset is taken out of the
              content's own vertical padding (py-12 → my-7 + py-5, md:py-16
              → my-7 + md:py-9) so the resting layout is unchanged. */}
          <div className="my-7 overflow-y-auto px-7 py-5 [scrollbar-gutter:stable] md:px-14 md:py-9">
            <p className="eyebrow">{eyebrow}</p>
            <h2
              id="problem-detail-heading"
              className="mt-5 max-w-2xl font-serif text-[22px] font-normal leading-[1.15] text-ink md:mt-6 md:text-[27px] lg:text-[30px]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {heading}
            </h2>

            {/* Observations — qualitative patterns that frame the
                numbered facts below. Same treatment as V1. */}
            <ul className="mt-10 space-y-6 md:mt-12 md:space-y-7">
              {observations.map((line) => (
                <li
                  key={line}
                  className="flex max-w-xl gap-4 text-base leading-relaxed text-ink-soft md:text-lg"
                >
                  <span
                    aria-hidden
                    className="mt-[0.7em] inline-block h-2 w-2 shrink-0 rounded-full bg-brand"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            {/* Numbered facts — V1's vertical stack, verbatim. */}
            <ol className="mt-14 flex flex-col gap-14 md:mt-20 md:gap-20">
              {facts.map((fact, i) => (
                <FactPanel key={fact.lead ?? i} index={i} fact={fact} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

function FactPanel({ index, fact }: { index: number; fact: Fact }) {
  const indexLabel = String(index + 1).padStart(2, "0");

  return (
    <li className="relative">
      {/* Index marker */}
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-medium tabular-nums text-ink-subtle">
          {indexLabel}.
        </span>
        <span aria-hidden className="block h-px w-8 bg-ink/10" />
      </div>

      {/* Hero numeral — sized down from V1's text-stat-lg so the metrics
          sit comfortably within the pop-up's narrower measure. */}
      <div className="mt-5 flex items-baseline gap-3">
        <span className="font-serif text-stat-md font-normal text-ink">
          {fact.lead}
        </span>
        {fact.unit ? (
          <span className="font-serif text-row font-normal leading-none text-ink-muted">
            {fact.unit}
          </span>
        ) : null}
      </div>

      <p className="mt-5 max-w-lg body-prose">{fact.body}</p>

      {fact.waterfall ? (
        <ol className="relative mt-6 max-w-lg space-y-3">
          <span
            aria-hidden
            className="pointer-events-none absolute left-[7px] top-[12px] bottom-[12px] w-px bg-ink/12"
          />
          {fact.waterfall.map((step, i) => (
            <li
              key={step}
              className="relative flex gap-3 text-[15px] leading-snug text-ink-soft md:text-base"
            >
              <span className="relative z-10 w-5 shrink-0 pt-[2px] font-mono text-[11px] font-medium tabular-nums text-ink-subtle">
                <span className="inline-block bg-paper-warm px-px">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="flex-1">{step}</span>
            </li>
          ))}
        </ol>
      ) : null}

      <p className="source-line mt-5">
        <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-brand" />
        Source · {fact.source}
      </p>
    </li>
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
