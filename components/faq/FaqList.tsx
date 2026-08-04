"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * FAQ accordion — the main content block on /faq.
 *
 * Grouped by category so a prospect can scan to the section that
 * matters to them. Each row is a hairline-separated accordion; the
 * smooth expand uses a CSS grid-template-rows animation from 0fr → 1fr,
 * which handles variable content height without JS measurement. The
 * chevron rotates 90° on open; the number and question stay left-aligned
 * so scanning the closed list feels like reading a table of contents.
 */

type QA = { q: string; a: React.ReactNode };

type FaqGroup = {
  key: string;
  eyebrow: string;
  heading: string;
  items: QA[];
};

// Editable content (ACF-backed). `groups` falls back to the built-in GROUPS
// default (rich ReactNode answers) so the list renders identically when
// WordPress is empty or unreachable. ACF-seeded answers arrive as HTML strings
// and render via dangerouslySetInnerHTML, preserving inline emphasis/links.
export type FaqListContent = {
  groups?: FaqGroup[];
};

const GROUPS: FaqGroup[] = [
  {
    key: "about",
    eyebrow: "01",
    heading: "About Chronilogix",
    items: [
      {
        q: "What is Chronilogix?",
        a: (
          <>
            Chronilogix is an AI-native behavioral health and chronic
            care coaching platform. It provides 24/7 evidence-based
            coaching between clinical visits &mdash; the moments
            traditional care can&rsquo;t reach &mdash; built on{" "}
            <span className="text-ink">
              three decades of Dr. Ken Resnicow&rsquo;s Motivational
              Interviewing research
            </span>
            .
          </>
        ),
      },
      {
        q: "How is Chronilogix different from a chatbot?",
        a: (
          <>
            A chatbot improvises a reply each turn from a generic
            prompt. Chronilogix{" "}
            <span className="text-ink">reasons</span> &mdash; every
            response is interpreted against the member&rsquo;s prior
            sessions, cultural context, and an MI fidelity rubric before
            being sent. A second validation layer monitors every
            conversation in real time and replaces any word or sentence
            it deems wrong or misinterpreted before the member sees it.
          </>
        ),
      },
      {
        q: "Does Chronilogix replace my therapist or health coach?",
        a: (
          <>
            No. Chronilogix isn&rsquo;t here to replace clinicians
            &mdash; it&rsquo;s here to extend their reach. Members can
            choose an AI-only path, or a{" "}
            <span className="text-ink">Hybrid Care Model</span> that
            pairs a live therapist or health coach with 24/7 AI coaching
            between visits. Every AI interaction can be summarized and
            shared with the clinician before the next appointment, so
            sessions begin with insight instead of catch-up.
          </>
        ),
      },
      {
        q: "What is Motivational Interviewing?",
        a: (
          <>
            MI is an evidence-based counseling style developed by
            William R. Miller and Stephen Rollnick in the early 1980s.
            It moves through four processes &mdash;{" "}
            <span className="text-ink">
              Engage, Focus, Evoke, Plan
            </span>{" "}
            &mdash; and four microskills called{" "}
            <span className="text-ink">OARS</span> (Open questions,
            Affirmations, Reflective listening, Summaries). Across{" "}
            <span className="text-ink">
              more than 200 randomized controlled trials
            </span>
            , MI has outperformed direct persuasion in domains as varied
            as smoking cessation, diabetes self-management, and
            treatment adherence.
          </>
        ),
      },
    ],
  },
  {
    key: "coverage",
    eyebrow: "02",
    heading: "Coverage & availability",
    items: [
      {
        q: "What conditions does Chronilogix cover today?",
        a: (
          <>
            Two coaches are live today: <span className="text-ink">Roni</span>{" "}
            for diabetes and chronic care, and{" "}
            <span className="text-ink">Millie</span> for mental health
            and mood. Four additional chronic modules are in development
            &mdash; GLP-1 &amp; weight management, addiction,
            hypertension, and cancer &mdash; and ship into the same
            coaching surface members already use.
          </>
        ),
      },
      {
        q: "How do members access Chronilogix?",
        a: (
          <>
            Chronilogix is available on{" "}
            <span className="text-ink">desktop</span>,{" "}
            <span className="text-ink">mobile</span>, and can be
            embedded inside partner health and wellness apps. Members
            can engage by{" "}
            <span className="text-ink">text, voice, or video</span>{" "}
            &mdash; whichever surface fits the moment.
          </>
        ),
      },
      {
        q: "When is Chronilogix available?",
        a: (
          <>
            24/7. There is no waitlist and no business-hours limit. The
            moments that matter most &mdash; 2 a.m. anxiety, a forgotten
            medication dose, motivation gone quiet, loneliness on a
            long night &mdash; are exactly the moments Chronilogix is
            designed to be present for.
          </>
        ),
      },
      {
        q: "Is Chronilogix a good fit for seniors and Medicare beneficiaries?",
        a: (
          <>
            Yes. For many Medicare beneficiaries and older adults,
            appointments may be separated by weeks while loneliness and
            uncertainty continue every day. Chronilogix provides
            compassionate support between visits, helps people stay on
            track with their care plan, and gives clinicians greater
            visibility into their patient&rsquo;s journey.
          </>
        ),
      },
    ],
  },
  {
    key: "safety",
    eyebrow: "03",
    heading: "Safety & clinical oversight",
    items: [
      {
        q: "Is Chronilogix HIPAA compliant?",
        a: (
          <>
            Yes. Chronilogix was designed for healthcare from the ground
            up &mdash; encryption in transit and at rest, HIPAA
            compliant access controls, and clinical-grade audit logging
            baked in, not bolted on.
          </>
        ),
      },
      {
        q: "Is member data used to train the AI?",
        a: (
          <>
            No. Member conversations are{" "}
            <span className="text-ink">
              never shared, sold, or used to improve our models
            </span>
            . What members tell Chronilogix belongs to them and to the
            deploying organization.
          </>
        ),
      },
      {
        q: "What happens in a crisis?",
        a: (
          <>
            Millie is designed to recognize crisis-level distress
            signals that exceed coaching scope, shift into a structured
            risk assessment, and escalate to the{" "}
            <span className="text-ink">
              988 Suicide &amp; Crisis Lifeline
            </span>{" "}
            when the risk level warrants it. Safety is part of the
            conversation architecture, not a fallback.
          </>
        ),
      },
      {
        q: "How do humans stay in the loop?",
        a: (
          <>
            Chronilogix is designed to handle{" "}
            <span className="text-ink">up to 70% of routine coaching</span>
            ; the remaining ~30% escalates to human clinicians when the
            moment calls for it. The reach and economics of AI, paired
            with clinical oversight.
          </>
        ),
      },
    ],
  },
  {
    key: "buyers",
    eyebrow: "04",
    heading: "For buyers & partners",
    items: [
      {
        q: "How is Chronilogix priced?",
        a: (
          <>
            Custom pricing for every deployment. Health plans typically
            contract on <span className="text-ink">PEPM</span> inside an
            existing plan footprint. Employers bundle Chronilogix into
            benefits alongside EAP and telehealth. Wellness platforms
            embed it as an affiliate coaching layer.
          </>
        ),
      },
      {
        q: "How does deployment work?",
        a: (
          <>
            Four commercial paths: direct PEPM contracts with health
            plans; inclusion inside existing employer wellness benefits;
            affiliate embed inside partner wellness or fitness apps;
            co-deployment with chronic care supply vendors.
            Infrastructure is Stripe-powered for consumer direct billing
            and HIPAA compliant by default.
          </>
        ),
      },
      {
        q: "Can we white-label Chronilogix?",
        a: (
          <>
            Yes. Chronilogix ships as a branded experience inside a
            partner&rsquo;s app, employer benefit, or wellness platform.
            Your chrome on top; the same MI-trained coach underneath.
            We can customize by Universities, Unions, Missions, and
            industry-specific needs &mdash; globally, regionally, and
            locally.
          </>
        ),
      },
    ],
  },
  {
    key: "science",
    eyebrow: "05",
    heading: "Dr. Resnicow & the science",
    items: [
      {
        q: "Who is Dr. Kenneth Resnicow?",
        a: (
          <>
            Dr. Ken Resnicow is Chronilogix&rsquo;s Co-Founder and Chief
            Science Officer, and Professor at the University of
            Minnesota. He is among the most cited researchers in
            Motivational Interviewing, with{" "}
            <span className="text-ink">400+ peer-reviewed publications</span>
            , MI training delivered to{" "}
            <span className="text-ink">10,000+ clinicians</span>{" "}
            worldwide, and research funding spanning three decades.
          </>
        ),
      },
      {
        q: "What is Chronilogix's evidence base?",
        a: (
          <>
            The platform is built on three decades of peer-reviewed
            clinical science in Motivational Interviewing &mdash; the
            most rigorously validated behavioral change methodology in
            the world. When{" "}
            <a
              href="/case-studies/aetna"
              className="underline decoration-brand-500/40 decoration-1 underline-offset-[3px] transition-colors hover:text-brand-700 hover:decoration-brand-600"
            >
              Aetna
            </a>{" "}
            integrated Dr. Resnicow&rsquo;s MI framework into their disease
            management programs,{" "}
            <span className="text-ink">
              member engagement rose by 40%
            </span>{" "}
            and dropout rates fell by more than half.
          </>
        ),
      },
    ],
  },
];

export function FaqList({ content }: { content?: FaqListContent }) {
  const groups = content?.groups?.length ? content.groups : GROUPS;
  return (
    <section
      id="faq-list"
      className="relative overflow-hidden rounded-[20px] bg-white py-10 sm:rounded-[24px] sm:py-14 md:rounded-[28px] md:py-20 lg:py-24"
    >
      <div className="container-page">
        {/* Category jump nav — small horizontal rail above the list so
            visitors can skip to what matters to them. Sticks to the top
            on desktop as the user scrolls the list. On mobile it wraps
            to as many rows as needed; the hairline sits directly under
            the last row. */}
        <nav
          aria-label="FAQ categories"
          className="mb-8 flex flex-wrap gap-x-5 gap-y-2 border-b border-ink/10 pb-5 md:mb-14 md:gap-x-6 md:pb-6"
        >
          {groups.map((g) => (
            <a
              key={g.key}
              href={`#faq-${g.key}`}
              className="text-[13px] font-medium tracking-tight text-ink-muted transition-colors hover:text-brand-700 md:text-[14px]"
            >
              {g.heading}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-10 md:gap-16 lg:gap-20">
          {groups.map((group) => (
            <FaqGroupBlock key={group.key} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqGroupBlock({ group }: { group: FaqGroup }) {
  return (
    <div id={`faq-${group.key}`} className="scroll-mt-24 md:scroll-mt-32">
      <div className="grid grid-cols-1 gap-5 md:gap-8 lg:grid-cols-[220px_1fr] lg:gap-16 xl:grid-cols-[260px_1fr] xl:gap-24">
        {/* Group header — small serial number + name. Sits in a narrow
            left column on desktop so the answers get the full-width
            reading measure; stacks above the list on mobile with tighter
            spacing so it reads as a proper section header, not an
            orphaned label. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-brand-700">
            {group.eyebrow}
          </p>
          <h2 className="mt-1.5 max-w-[16ch] font-serif text-[20px] font-normal leading-[1.18] text-ink md:mt-2 md:text-[26px]">
            {group.heading}
          </h2>
        </div>

        <ul className="flex flex-col divide-y divide-ink/10 border-t border-ink/10">
          {group.items.map((item, i) => (
            <FaqRow key={i} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function FaqRow({ item }: { item: QA }) {
  const [open, setOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  // Measure the content's natural height so the max-height animation
  // targets the real answer height (not a hard-coded ceiling that would
  // over- or under-shoot on unusual content). ResizeObserver keeps the
  // measurement current if the viewport (and therefore the wrapped
  // text) resizes while the row is open.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setContentHeight(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Close on Escape when the row is open — small keyboard courtesy.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <li>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="group/faq flex w-full items-start justify-between gap-4 py-5 text-left md:gap-6 md:py-7"
      >
        <span className="max-w-[52ch] font-serif text-[17px] font-normal leading-[1.28] text-ink md:text-[20px]">
          {item.q}
        </span>
        <span
          aria-hidden
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/10 text-ink-soft transition-all duration-300 ease-out group-hover/faq:border-brand-600/40 group-hover/faq:text-brand-700 md:mt-1 md:h-9 md:w-9"
          style={{
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg
            viewBox="0 0 14 14"
            className="h-[14px] w-[14px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M7 1v12M1 7h12" />
          </svg>
        </span>
      </button>

      {/* Answer — max-height animation driven by a measured content
          height so the row expands to exactly the answer's natural
          size, not to a hard-coded ceiling. */}
      <div
        className="overflow-hidden"
        style={{
          maxHeight: open ? `${contentHeight}px` : "0px",
          transition: "max-height 400ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        <div
          ref={contentRef}
          className="pb-5 md:pb-7"
          style={{
            opacity: open ? 1 : 0,
            transition: "opacity 300ms ease-out",
            transitionDelay: open ? "120ms" : "0ms",
          }}
        >
          {typeof item.a === "string" ? (
            <div
              className="max-w-[64ch] text-[14.5px] leading-relaxed text-ink-soft md:text-[16px]"
              dangerouslySetInnerHTML={{ __html: item.a }}
            />
          ) : (
            <div className="max-w-[64ch] text-[14.5px] leading-relaxed text-ink-soft md:text-[16px]">
              {item.a}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
