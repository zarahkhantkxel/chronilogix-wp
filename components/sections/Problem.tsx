"use client";

import { useEffect, useRef, useState } from "react";

type Fact = {
  /** Hero numeral — single dominant figure */
  lead: string;
  /** Optional small unit/suffix shown next to the lead (e.g. "wks") */
  unit?: string;
  /** Supporting sentence — may contain <em> for inline emphasis on secondary numbers */
  body: React.ReactNode;
  /** Source attribution */
  source: string;
  /** Optional downstream chain — renders as a small vertical waterfall
   *  below the body. Used to show how a single number (e.g. unfilled
   *  prescriptions) propagates into downstream cost. */
  waterfall?: string[];
};

const FACTS: Fact[] = [
  // Lead with the structural shortage — this is the new framing the client
  // asked for: human care cannot scale, so AI is the only viable answer.
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
  // Diabetes — numbers updated to Steven's latest pull. The 11M
  // undiagnosed line is the wedge: even when care exists, the people who
  // most need it haven't been reached.
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
  // Mental health prevalence — pairs with the diabetes scale stat so the
  // section names both arms of the platform's coverage (chronic +
  // behavioral). 1-in-5 and the lifetime number do the heavy lifting; the
  // hero numeral anchors the magnitude.
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
  // Post-discharge access gap — the highest-stakes handoff in mental
  // health. The 70% never-engaged figure is the engagement collapse; the
  // 300×/200× multipliers are why that collapse is a clinical emergency
  // when no follow-up mechanism exists.
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
  // Unfilled prescriptions — names the dollar cost of the engagement gap
  // and sets up the ambivalence frame the rest of the page resolves.
  // Mechanism line ("not forgetting") is lifted from the whitepaper's
  // medication adherence section. The waterfall list traces what the
  // dollar number actually looks like downstream: medication skipped →
  // appointment missed → quiet escalation → ER visit. Placeholder counts
  // pending Steven's data pull.
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
  // 9-to-5 / 2 AM — names the off-hours window that human care can't
  // reliably cover. Shift workers + first responders make the abstract
  // failure concrete for a healthcare buyer.
  "The moments that matter most arrive off hours: shift workers and first responders need support at 2 AM, not 2 PM.",
  // Cost / reimbursement gap — names the structural reason people delay
  // care. The "bill arrives as an ER visit" close ties the gap back to
  // the section's headline cost framing.
  "Coaching and behavioral support rarely get reimbursed, so people wait until things worsen and the bill arrives as an ER visit, not an appointment.",
  // Equity wedge — the Hispanic-men stat was previously its own fact tile;
  // moved into observations because the shortage framing now leads the
  // numerical section. Same JAMA / CDC source.
  "Diabetes hits Hispanic men 64% harder than average, yet they make up just 2% of the people the CDC's national prevention program reaches.",
  "Human care fluctuates with burnout, caseloads, and turnover.",
];

export function Problem() {
  return (
    <section
      id="problem"
      className="relative border-y border-ink/10 bg-paper-warm"
    >
      <div className="grid lg:grid-cols-2">
        {/* Left — sticky image */}
        <div className="relative p-2 lg:p-2">
          <div className="lg:sticky lg:top-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] lg:aspect-auto lg:h-[calc(100vh-1rem)]">
              <img
                src="/problem-portrait.webp"
                alt="A man sits cross-legged on a bed in afternoon light, alone, mid-thought."
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
        </div>

        {/* Right — scrolling content */}
        <div className="flex flex-col px-6 py-10 md:px-14 md:py-16 lg:px-16 lg:py-20 xl:px-20">
          {/* Intro — leads with the structural shortage (the new "AI is
              the only viable alternative" framing from the June 16 client
              feedback), then folds the original "moments between
              appointments" thread underneath it as the human consequence. */}
          <div>
            <h2
              className="max-w-2xl text-hero font-serif font-normal text-ink"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              The most expensive mental health and chronic care moments{" "}
              <span className="text-ink-muted">
                happen between appointments.
              </span>
            </h2>

            <p className="mt-8 max-w-md body-prose">
              The world is short more than{" "}
              <span className="text-ink">15 million</span> behavioral and
              chronic care coaches. Average wait times are typically measured in weeks and months. Costs put
              live coverage out of reach. And the moments that decide
              outcomes, the 11 PM stress eating, the skipped medication,
              the quiet slide back into old habits when no one is watching,
              don&rsquo;t wait for the next appointment.
            </p>

            <p className="mt-5 max-w-md body-prose">
              At population scale, only one intervention can be there at the
              moment it&rsquo;s needed. Chronilogix is built to fill that
              gap, at clinical fidelity, at a fraction of the cost of live
              care.
            </p>
          </div>

          {/* Observations — qualitative patterns that frame the numbers
              below. Bumped one step above body-prose so they read as the
              section's lead-in argument, not a tail-end aside. */}
          <div className="mt-14 md:mt-20">
            <p className="eyebrow-subtle">Between the numbers</p>
            <ul className="mt-7 space-y-6 md:mt-8 md:space-y-7">
              {OBSERVATIONS.map((line) => (
                <li
                  key={line}
                  className="flex max-w-xl gap-4 text-lg leading-relaxed text-ink-soft md:text-xl"
                >
                  <span
                    aria-hidden
                    className="mt-[0.7em] inline-block h-2 w-2 shrink-0 rounded-full bg-brand"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Facts — numeric evidence following the qualitative pattern
              above. On mobile, the five facts ride a horizontal
              snap-carousel so the section doesn't stretch to five
              vertical viewports. On md+ they stack vertically with
              progressive disclosure as before. */}
          <ol className="-mx-8 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-8 px-8 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:mt-20 md:flex-col md:gap-20 md:overflow-visible md:px-0 md:pb-0 md:scroll-px-0 [&::-webkit-scrollbar]:hidden">
            {FACTS.map((fact, i) => (
              <FactPanel key={fact.lead} index={i} fact={fact} />
            ))}
          </ol>
          {/* Mobile-only swipe hint */}
          <p
            aria-hidden
            className="mt-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-subtle md:hidden"
          >
            <span>Swipe</span>
            <svg
              width="20"
              height="8"
              viewBox="0 0 20 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 4h17M14 1l3 3-3 3" />
            </svg>
          </p>

          {/* Resolution line — closes the catalogue of gaps with the
              one sentence the entire section has been building toward.
              Set apart with a hairline above and the same serif scale
              as the section opener so it reads as a thesis statement,
              not a tagline. */}
          <div className="mt-16 max-w-xl md:mt-20">
            <span aria-hidden className="block h-px w-12 bg-ink/20" />
            <p className="mt-6 font-serif text-row font-normal leading-[1.15] text-ink md:mt-8">
              AI coaches fill all of these gaps.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FactPanel({ index, fact }: { index: number; fact: Fact }) {
  const ref = useRef<HTMLLIElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const indexLabel = String(index + 1).padStart(2, "0");

  return (
    <li
      ref={ref}
      data-revealed={revealed ? "true" : "false"}
      className="group/fact relative shrink-0 basis-[82%] snap-center rounded-2xl bg-white/45 p-5 ring-1 ring-ink/[0.04] md:basis-auto md:shrink md:rounded-none md:bg-transparent md:p-0 md:ring-0"
    >
      {/* Index marker, sits above the fact like a chapter number.
          A short hairline rests beneath the number as a quiet separator. */}
      <div className="reveal-row flex flex-col gap-2 [transition-delay:0ms]">
        <span className="text-[13px] font-medium tabular-nums text-ink-subtle">
          {indexLabel}.
        </span>
        <span aria-hidden className="block h-px w-8 bg-ink/10" />
      </div>

      {/* Hero numeral */}
      <div className="reveal-row reveal-row-blur mt-5 flex items-baseline gap-3 [transition-delay:120ms]">
        <span className="font-serif text-stat-lg font-normal text-ink">
          {fact.lead}
        </span>
        {fact.unit ? (
          <span className="font-serif text-row font-normal leading-none text-ink-muted">
            {fact.unit}
          </span>
        ) : null}
      </div>

      {/* Body */}
      <p className="reveal-row mt-5 max-w-lg body-prose [transition-delay:320ms]">
        {fact.body}
      </p>

      {/* Waterfall — only rendered when a fact carries downstream chain
          data. Each step lifts in a beat later so the cascade reads as
          a sequence, not a static list. A hairline runs through the
          left number column connecting the steps so the cascade reads
          as one chain rather than four discrete bullets. */}
      {fact.waterfall ? (
        <ol className="reveal-row relative mt-6 max-w-lg space-y-3 [transition-delay:420ms]">
          {/* Vertical chain hairline — sits behind the numbers,
              tracing the downstream flow. */}
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

      {/* Source */}
      <p className="reveal-row source-line mt-5 [transition-delay:520ms]">
        <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-brand" />
        Source · {fact.source}
      </p>
    </li>
  );
}
