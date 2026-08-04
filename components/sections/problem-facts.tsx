// Shared source of truth for the six "gaps" facts. V2 (ProblemV2) renders
// them as an inline ChapterRail; V3 (ProblemV3) collapses them behind a
// single peek-card that opens the DetailModal. Both views import from
// here so copy stays synchronised across versions.

import type { DetailModalItem } from "@/components/DetailModal";

export const PROBLEM_FACTS: DetailModalItem[] = [
  {
    id: "shortage",
    railLabel:
      "The world is short more than 15 million behavioral health and chronic care coaches. Hiring will not close the gap.",
    navLabel: "The shortage",
    eyebrow: "The gap · 01",
    statHero: "15M+",
    statCaption:
      "Global shortage of behavioral health and chronic care coaches",
    heading: "The world can't hire its way out of this.",
    body: (
      <>
        <p>
          There aren&rsquo;t enough behavioral health and chronic care coaches
          to meet the need &mdash; a global shortage of more than 15 million.
          And live coaching sits at $60 to $70 per member per month, out of
          reach at population scale.
        </p>
        <p className="mt-4">
          The gap is structural, not seasonal. Even if funding were unlimited,
          the human capacity does not exist. AI is the only intervention that
          can be there for every person who needs care, in the moment they
          need it.
        </p>
        <div className="mt-8 md:mt-9">
          <p className="eyebrow-muted">Where the shortage shows up</p>
          <dl className="mt-4 flex flex-col gap-3.5">
            <div className="flex gap-4">
              <dt className="w-[112px] shrink-0 font-serif italic text-[15px] leading-[1.5] text-brand-700 md:text-[16px]">
                Universities
              </dt>
              <dd className="flex-1 text-[15px] leading-[1.55] text-ink-soft md:text-base">
                One counselor per 200 to 300 students. Wait times measured in weeks.
              </dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-[112px] shrink-0 font-serif italic text-[15px] leading-[1.5] text-brand-700 md:text-[16px]">
                Health plans
              </dt>
              <dd className="flex-1 text-[15px] leading-[1.55] text-ink-soft md:text-base">
                Live coaching at $60 to $70 per member per month &mdash;
                unaffordable at population scale.
              </dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-[112px] shrink-0 font-serif italic text-[15px] leading-[1.5] text-brand-700 md:text-[16px]">
                The uninsured
              </dt>
              <dd className="flex-1 text-[15px] leading-[1.55] text-ink-soft md:text-base">
                27 million Americans with no first line of care at all.
              </dd>
            </div>
          </dl>
        </div>
      </>
    ),
  },
  {
    id: "diabetes",
    railLabel:
      "40 million Americans live with diabetes. 11 million don't yet know.",
    navLabel: "Diabetes",
    eyebrow: "The gap · 02",
    statHero: "40M",
    statCaption: "Americans living with diabetes",
    heading:
      "40 million Americans live with diabetes. 11 million don't know it yet.",
    body: (
      <>
        <p>
          Roughly 40 million Americans live with diabetes. Eleven million of
          them remain undiagnosed. Another 115 million live with prediabetes,
          at risk of progressing without intervention.
        </p>
        <p className="mt-4">
          The disease is manageable &mdash; but management happens in the
          small decisions people make between visits: what they eat, whether
          they move, whether tonight&rsquo;s dose gets taken. Traditional
          care sees them once a quarter. The moments that matter happen a
          hundred times in between.
        </p>
        <p className="mt-4">
          It is also not evenly distributed. Diabetes hits Hispanic men 64
          percent harder than average &mdash; yet they make up just 2 percent
          of the people the CDC&rsquo;s national prevention program reaches.
          Cultural tailoring is not a nice-to-have. It is what makes
          coaching legible to the people who need it most.
        </p>
      </>
    ),
  },
  {
    id: "mental-illness",
    railLabel:
      "1 in 5 U.S. adults live with mental illness in any given year. Nearly half will in a lifetime.",
    navLabel: "Mental illness",
    eyebrow: "The gap · 03",
    statHero: "61M+",
    statCaption:
      "American adults living with mental illness in a given year",
    heading:
      "1 in 5 American adults, every year. Nearly half in a lifetime.",
    body: (
      <>
        <p>
          Sixty-one million American adults live with mental illness in any
          given year &mdash; one in five. Nearly half will meet diagnostic
          criteria at some point in their lifetime.
        </p>
        <p className="mt-4">
          The people around us are carrying more than we see. And for most of
          them, the moment help is needed is not the moment an appointment is
          available.
        </p>
        <p className="mt-4">
          Often the moment help is needed isn&rsquo;t 2 PM &mdash; it&rsquo;s
          2 AM. Shift workers. First responders. A student the night before
          an exam. Add 27 million Americans without health insurance and no
          first line of care to call, and the people who need someone are
          the least likely to find one on the day they need it.
        </p>
      </>
    ),
  },
  {
    id: "post-discharge",
    railLabel:
      "Seven in ten patients never return for care after an ER discharge following a suicide attempt.",
    navLabel: "Post-discharge",
    eyebrow: "The gap · 04",
    statHero: "70%",
    statCaption:
      "Never begin outpatient care after an ER discharge",
    heading: "Seventy percent never come back.",
    body: (
      <>
        <p>
          Of patients discharged from the ER after a suicide attempt, roughly
          70 percent never begin outpatient mental health treatment. Suicide
          risk runs 300 times higher in the first week after discharge, and
          200 times higher across the first month, for those left without
          follow-up.
        </p>
        <p className="mt-4">
          This is the highest-stakes handoff in behavioral health &mdash; and
          the system does not have a reliable mechanism to catch the person
          as they walk out.
        </p>
        <p className="mt-4">
          Chronilogix was designed for the person the system loses. When
          crisis signals appear in a conversation, the platform steps out of
          coaching and into a structured clinical risk assessment &mdash;
          questions built with clinical experts to distinguish ideation from
          intent. When the risk warrants it, the session escalates to the
          988 Suicide &amp; Crisis Lifeline. Not a disclaimer &mdash; part
          of the clinical architecture.
        </p>
      </>
    ),
  },
  {
    id: "unfilled",
    railLabel:
      "$300 billion in U.S. prescriptions go unfilled each year — from ambivalence, not forgetting.",
    navLabel: "Unfilled scripts",
    eyebrow: "The gap · 05",
    statHero: "$300B",
    statCaption: "In U.S. prescriptions unfilled every year",
    heading: "Ambivalence, not forgetting.",
    body: (
      <>
        <p>
          Every year, three hundred billion dollars in U.S. prescriptions go
          unfilled. Most are not skipped because the patient forgot &mdash;
          they&rsquo;re skipped because of ambivalence about the medication
          itself: the side effects, the identity of being a person who needs
          it, the doubt about whether it will work.
        </p>
        <p className="mt-4">
          The intervention that resolves ambivalence is conversation, not
          reminders. When the conversation doesn&rsquo;t happen, the cost
          cascades quietly downstream.
        </p>
        <p className="mt-4">
          Motivational Interviewing &mdash; the methodology at the heart of
          Chronilogix &mdash; treats ambivalence as information, not
          resistance. The coaching move is to explore the doubt, not push
          through it. What feels true about taking the medication. What
          feels wrong. What would need to shift for the answer to change.
        </p>
      </>
    ),
    chain: [
      "Prescription unfilled. Ambivalence wins quietly",
      "Follow-up appointment skipped or rescheduled out",
      "Symptoms drift, the gap widens between visits",
      "Help arrives only after escalation, often in the ER",
    ],
  },
  {
    id: "wait-times",
    railLabel:
      "The average wait for in-person mental health care runs two to six weeks.",
    navLabel: "The wait",
    eyebrow: "The gap · 06",
    statHero: "2–6 wks",
    statCaption:
      "Average wait for in-person mental health care",
    heading: "Two to six weeks for an appointment. And meanwhile.",
    body: (
      <>
        <p>
          The average wait for in-person mental health care runs between two
          and six weeks. Six weeks can be a lot of nights.
        </p>
        <p className="mt-4">
          Human coaches stay scarce and expensive. The people who most need
          someone to talk to are the least likely to find one on the day they
          need it. Chronilogix is available the moment it&rsquo;s needed
          &mdash; 24/7, in any language, without a waitlist.
        </p>
        <p className="mt-4">
          The moments in between are the ones that decide outcomes: the 11
          PM stress-eating, the skipped medication, the quiet slide back
          into old habits when no one is watching. Coaching that arrives at
          the appointment misses all of them. Chronilogix arrives at the
          moment.
        </p>
      </>
    ),
  },
];
